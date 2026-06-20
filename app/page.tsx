import { portfolio } from "@/data/portfolio";
import { Shell } from "@/components/Profile";
import { fetchGitHubStats, fetchTotalCommits } from "@/lib/github";
import { mergeGitHub } from "@/lib/merge";
import { withCommitBadge } from "@/lib/badges";

export const revalidate = 3600;

export default async function Page() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;
  const [github, totalCommits] = await Promise.all([
    username ? fetchGitHubStats(username, token) : Promise.resolve(null),
    username ? fetchTotalCommits(portfolio.projects, token) : Promise.resolve(0),
  ]);
  const data = withCommitBadge(mergeGitHub(portfolio, github), totalCommits);
  return <Shell data={data} github={github} />;
}
