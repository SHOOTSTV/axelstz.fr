// Server-only fetcher: called from Server Components / route handlers (see app/page.tsx).
// Reads no secrets itself (token is passed in by the caller from process.env).
import type { GitHubStats } from "@/lib/types";

const API = "https://api.github.com";
const EMPTY: GitHubStats = { repos: 0, commits: 0, stars: 0, languages: [], activity: [] };

async function gh<T>(path: string, token?: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
