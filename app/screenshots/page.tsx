import type { Metadata } from "next";
import { portfolio } from "@/data/portfolio";
import { getProjectDetail } from "@/data/projectDetails";
import { slugify } from "@/lib/slug";
import { ScreenshotsGallery, type GalleryShot, type GalleryProduct } from "@/components/steam/ScreenshotsGallery";

export const metadata: Metadata = {
  title: "Screenshots — Axel.S",
  description: "Every screenshot across every project — a Steam-style capture wall.",
};

// Aggregate each project's real screenshots into one flat, grouped wall.
function buildGallery(): { shots: GalleryShot[]; products: GalleryProduct[] } {
  const shots: GalleryShot[] = [];
  const products: GalleryProduct[] = [];
  for (const p of portfolio.projects) {
    const slug = slugify(p.name);
    const list = getProjectDetail(p).screenshots ?? [];
    if (!list.length) continue;
    products.push({ slug, name: p.name, n: list.length });
    list.forEach((src, i) => shots.push({ id: `${slug}-${i}`, src, project: p.name, slug }));
  }
  return { shots, products };
}

export default function ScreenshotsPage() {
  const { shots, products } = buildGallery();
  return <ScreenshotsGallery data={portfolio} shots={shots} products={products} />;
}
