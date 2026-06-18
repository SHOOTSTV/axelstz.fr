import { describe, it, expect } from "vitest";
import { mergeGitHub } from "@/lib/merge";
import { portfolio } from "@/data/portfolio";
import type { GitHubStats } from "@/lib/types";

const gh: GitHubStats = {
  repos: 28, commits: 1204, stars: 63,
  languages: [{ name: "TypeScript", pct: 60 }, { name: "CSS", pct: 40 }],
  activity: [{ repo: "taskforge", type: "Push", when: "2026-06-01T00:00:00Z" }],
};

describe("mergeGitHub", () => {
  it("fills repos and commits big stats", () => {
    const m = mergeGitHub(portfolio, gh);
    expect(m.bigStats.find(s => s.key === "repos")!.value).toBe(28);
    expect(m.bigStats.find(s => s.key === "commits")!.value).toBe(1204);
  });
  it("leaves data unchanged when github is null", () => {
    expect(mergeGitHub(portfolio, null)).toEqual(portfolio);
  });
  it("does not inject github repos into the curated projects list", () => {
    const m = mergeGitHub(portfolio, gh);
    expect(m.projects).toEqual(portfolio.projects);
    expect(m.projects.some((p) => p.name.toLowerCase().includes("taskforge"))).toBe(false);
  });
  it("leaves the curated featured stack untouched", () => {
    const m = mergeGitHub(portfolio, gh);
    expect(m.featuredStack).toEqual(portfolio.featuredStack);
  });
});
