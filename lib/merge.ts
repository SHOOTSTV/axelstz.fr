import type { PortfolioData, GitHubStats } from "@/lib/types";

export function mergeGitHub(data: PortfolioData, gh: GitHubStats | null): PortfolioData {
  if (!gh) return data;
  const bigStats = data.bigStats.map((s) =>
    s.key === "repos" ? { ...s, value: gh.repos }
    : s.key === "commits" ? { ...s, value: gh.commits }
    : s.key === "stars" ? { ...s, value: gh.stars }
    : s);

  return { ...data, bigStats };
}
