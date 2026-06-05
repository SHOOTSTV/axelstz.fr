import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://axelstz.fr/sitemap.xml",
    host: "https://axelstz.fr",
  };
}
