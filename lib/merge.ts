import type { PortfolioData, GitHubStats } from "@/lib/types";

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

  return { ...data, bigStats, counts, projects };
}
