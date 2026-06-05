import type { PortfolioData, GitHubStats } from "@/lib/types";

const LANG_ICON: Record<string, string> = {
  TypeScript: "code", JavaScript: "code", TSX: "code", JSX: "code",
  CSS: "layers", SCSS: "layers", HTML: "layers", Vue: "layers", Svelte: "layers",
  Python: "cpu", Go: "cpu", Rust: "cpu", Java: "cpu", "C++": "cpu", C: "cpu", Ruby: "cpu", PHP: "cpu",
  SQL: "database", PLpgSQL: "database",
  Shell: "server", Dockerfile: "server", Makefile: "server",
};

// Derive the "Featured stack" icon row from the developer's real top languages.
function stackFromLanguages(langs: GitHubStats["languages"]): PortfolioData["featuredStack"] | null {
  if (!langs.length) return null;
  const icons: string[] = [];
  for (const l of langs) {
    const ic = LANG_ICON[l.name] ?? "box";
    if (!icons.includes(ic)) icons.push(ic);
  }
  const top = icons.slice(0, 5);
  const mid = Math.floor((top.length - 1) / 2);
  return top.map((icon, i) => ({ icon, hot: i === mid }));
}

export function mergeGitHub(data: PortfolioData, gh: GitHubStats | null): PortfolioData {
  if (!gh) return data;
  const bigStats = data.bigStats.map((s) =>
    s.key === "repos" ? { ...s, value: gh.repos }
    : s.key === "commits" ? { ...s, value: gh.commits }
    : s.key === "stars" ? { ...s, value: gh.stars }
    : s);
  const counts = data.counts.map((c) =>
    c.label === "Repositories" ? { ...c, n: gh.repos } : c);

  // Prepend up to 2 live GitHub activity rows ahead of the curated projects.
  const liveProjects = gh.activity.slice(0, 2).map((a) => ({
    name: a.repo,
    image: "/images/act-gh.png",
    meta: `${a.type} activity`,
    last: new Date(a.when).toLocaleDateString(),
  }));
  const projects = [...liveProjects, ...data.projects];

  const featuredStack = stackFromLanguages(gh.languages) ?? data.featuredStack;

  return { ...data, bigStats, counts, projects, featuredStack };
}
