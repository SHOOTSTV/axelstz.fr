// Server-only fetcher: called from Server Components / route handlers (see app/page.tsx).
// Reads no secrets itself (token is passed in by the caller from process.env).
import type { GitHubStats, Project } from "@/lib/types";

const API = "https://api.github.com";
const EMPTY: GitHubStats = { repos: 0, commits: 0, stars: 0, languages: [], activity: [] };

function ghHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function gh<T>(path: string, token?: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: ghHeaders(token),
      next: { revalidate: 3600 }, // ISR: refresh hourly
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchGitHubStats(username: string, token?: string): Promise<GitHubStats> {
  const user = await gh<{ public_repos: number }>(`/users/${username}`, token);
  if (!user) return EMPTY;

  const repos = (await gh<Array<{ name: string; stargazers_count: number; language: string | null; fork: boolean }>>(
    `/users/${username}/repos?per_page=100&sort=updated`, token)) ?? [];
  const owned = repos.filter((r) => !r.fork);
  const stars = owned.reduce((a, r) => a + (r.stargazers_count || 0), 0);

  const langCount: Record<string, number> = {};
  for (const r of owned) if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  const total = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }));

  const events = (await gh<Array<{ type: string; repo: { name: string }; created_at: string; payload?: { commits?: unknown[] } }>>(
    `/users/${username}/events/public?per_page=30`, token)) ?? [];
  let commits = 0;
  const activity = events.slice(0, 8).map((e) => {
    if (e.type === "PushEvent") commits += e.payload?.commits?.length ?? 0;
    return { repo: e.repo.name.split("/").pop() || e.repo.name, type: e.type.replace("Event", ""), when: e.created_at };
  });

  return { repos: user.public_repos, commits, stars, languages, activity };
}

// ----- Per-repo project stats (Projects library page) -----

function parseRepo(url?: string): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, "") } : null;
}

// Total commit count on the default branch, via the Link header "last page" trick.
async function repoCommits(owner: string, repo: string, token?: string): Promise<number | null> {
  try {
    const res = await fetch(`${API}/repos/${owner}/${repo}/commits?per_page=1`, {
      headers: ghHeaders(token),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const link = res.headers?.get?.("link");
    if (link) {
      const m = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
      if (m) return Number(m[1]);
    }
    const arr = await res.json();
    return Array.isArray(arr) ? arr.length : null; // single page (0 or 1 commits)
  } catch {
    return null;
  }
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", timeZone: "UTC" };
  if (d.getUTCFullYear() !== new Date().getUTCFullYear()) opts.year = "numeric";
  return new Intl.DateTimeFormat("en-US", opts).format(d);
}

// Enrich projects with live commit counts + last-update dates from their GitHub repos.
// Private/missing repos fall back gracefully (fields stay undefined).
export async function fetchProjectStats(projects: Project[], token?: string): Promise<Project[]> {
  return Promise.all(
    projects.map(async (p) => {
      const r = parseRepo(p.code);
      if (!r) return p;
      const [commits, meta] = await Promise.all([
        repoCommits(r.owner, r.repo, token),
        gh<{ pushed_at: string }>(`/repos/${r.owner}/${r.repo}`, token),
      ]);
      return {
        ...p,
        commits: commits ?? p.commits,
        lastUpdate: meta?.pushed_at ? shortDate(meta.pushed_at) : p.lastUpdate,
      };
    })
  );
}
