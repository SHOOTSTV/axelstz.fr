import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { portfolio } from "@/data/portfolio";

function referencedImages(): string[] {
  const out: string[] = [];
  const push = (s?: string) => { if (s && s.startsWith("/")) out.push(s); };
  push(portfolio.featuredProject.image);
  portfolio.projects.forEach((p) => push(p.image));
  return out;
}

describe("portfolio image assets", () => {
  it("every non-empty image path resolves to a file in /public", () => {
    for (const rel of referencedImages()) {
      const abs = join(process.cwd(), "public", rel);
      expect(existsSync(abs), `missing asset: ${rel} (set to "" until the file exists)`).toBe(true);
    }
  });
});
