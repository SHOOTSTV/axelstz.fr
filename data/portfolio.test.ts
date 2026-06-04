import { describe, it, expect } from "vitest";
import { portfolio } from "@/data/portfolio";

describe("portfolio data", () => {
  it("is branded SHOOTS / Axel.S", () => {
    expect(portfolio.profile.brand).toBe("SHOOTS");
    expect(portfolio.profile.name).toBe("Axel.S");
  });
  it("uses age as level and is a junior", () => {
    expect(portfolio.profile.level).toBeGreaterThan(0);
    expect(portfolio.profile.role.toLowerCase()).toContain("junior");
  });
  it("profile url points at axelstz.fr", () => {
    expect(portfolio.profile.url).toContain("axelstz.fr");
  });
  it("has at least one project and testimonial", () => {
    expect(portfolio.projects.length).toBeGreaterThan(0);
    expect(portfolio.testimonials.length).toBeGreaterThan(0);
  });
  it("has no leftover fake Steam contacts", () => {
    const names = portfolio.social.map(s => s.name.toLowerCase());
    expect(names).not.toContain("kormac");
  });
});
