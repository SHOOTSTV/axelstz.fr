import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";
import { slugify } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://axelstz.fr",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://axelstz.fr/projects",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...portfolio.projects.map((p) => ({
      url: `https://axelstz.fr/projects/${slugify(p.name)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
