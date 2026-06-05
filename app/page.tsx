import { portfolio } from "@/data/portfolio";
import { Shell } from "@/components/Profile";
import { fetchGitHubStats } from "@/lib/github";
import { mergeGitHub } from "@/lib/merge";

export const revalidate = 3600;

export default async function Page() {
  const username = process.env.GITHUB_USERNAME;
  const github = username ? await fetchGitHubStats(username, process.env.GITHUB_TOKEN) : null;
  const data = mergeGitHub(portfolio, github);
  return <Shell data={data} github={github} />;
}
