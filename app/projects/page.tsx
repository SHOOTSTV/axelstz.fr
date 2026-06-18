import type { Metadata } from "next";
import { portfolio } from "@/data/portfolio";
import { fetchProjectStats } from "@/lib/github";
import { getProjectDetail } from "@/data/projectDetails";
import { ProjectsLibrary } from "@/components/projects/ProjectsLibrary";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects — Axel.S",
  description: "The full project library — every build, with live commit counts and milestone progress.",
};

export default async function ProjectsPage() {
  const stats = await fetchProjectStats(portfolio.projects, process.env.GITHUB_TOKEN);
  const projects = stats.map((p) => ({ ...p, category: getProjectDetail(p).category }));
  const data = { ...portfolio, projects };
  return <ProjectsLibrary data={data} />;
}
