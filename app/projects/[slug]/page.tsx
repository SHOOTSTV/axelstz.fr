import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolio } from "@/data/portfolio";
import { fetchProjectStats } from "@/lib/github";
import { getProjectDetail } from "@/data/projectDetails";
import { slugify } from "@/lib/slug";
import { ProjectStorePage } from "@/components/projects/ProjectStorePage";

export const revalidate = 3600;

export function generateStaticParams() {
  return portfolio.projects.map((p) => ({ slug: slugify(p.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolio.projects.find((p) => slugify(p.name) === slug);
  if (!project) return {};
  const d = getProjectDetail(project);
  return {
    title: `${project.name} — Axel.S`,
    description: d.summary,
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = portfolio.projects.find((p) => slugify(p.name) === slug);
  if (!base) notFound();

  const [project] = await fetchProjectStats([base], process.env.GITHUB_TOKEN);
  const detail = getProjectDetail(project);
  return <ProjectStorePage data={portfolio} project={project} detail={detail} />;
}
