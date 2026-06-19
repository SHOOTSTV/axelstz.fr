import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolio } from "@/data/portfolio";
import { fetchChangelog, fetchProjectStats } from "@/lib/github";
import { applyCover } from "@/lib/changelog";
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
  // Per-project share card: short, truthful tagline from the summary's first sentence.
  const tagline = (d.summary.split(". ")[0] ?? d.summary).slice(0, 120);
  const ogImage = `/og?${new URLSearchParams({
    name: project.name,
    title: d.category,
    tagline,
  }).toString()}`;
  return {
    title: `${project.name} — Axel.S`,
    description: d.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "website",
      url: `/projects/${slug}`,
      title: `${project.name} — Axel.S`,
      description: d.summary,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${project.name} — ${d.category}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Axel.S`,
      description: d.summary,
      images: [ogImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = portfolio.projects.find((p) => slugify(p.name) === slug);
  if (!base) notFound();

  const [[project], changelog] = await Promise.all([
    fetchProjectStats([base], process.env.GITHUB_TOKEN),
    fetchChangelog(base.code, process.env.GITHUB_TOKEN),
  ]);
  const detail = getProjectDetail(project);
  const d = changelog ? { ...detail, changelog: applyCover(changelog, detail.screenshots?.[0]) } : detail;
  return <ProjectStorePage data={portfolio} project={project} detail={d} />;
}
