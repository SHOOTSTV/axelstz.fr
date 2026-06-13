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
  it("has at least one project", () => {
    expect(portfolio.projects.length).toBeGreaterThan(0);
  });
  it("has no leftover fake Steam contacts", () => {
    const names = portfolio.social.map(s => s.name.toLowerCase());
    expect(names).not.toContain("kormac");
  });
  it("is trimmed to real projects (no prototype fillers)", () => {
    const names = portfolio.projects.map((p) => p.name.toLowerCase());
    expect(names.some((n) => n.includes("tabflow"))).toBe(false);
    expect(names.some((n) => n.includes("forge"))).toBe(false);
  });
  it("project count metric matches the real project list", () => {
    const projectsCount = portfolio.counts.find((c) => c.label === "Projects");
    expect(projectsCount?.n).toBe(portfolio.projects.length);
  });
});
