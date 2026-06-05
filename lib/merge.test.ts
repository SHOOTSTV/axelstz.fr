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
    expect(m.counts.find(c => c.label === "Repositories")!.n).toBe(28);
  });
  it("leaves data unchanged when github is null", () => {
    expect(mergeGitHub(portfolio, null)).toEqual(portfolio);
  });
  it("prepends github activity rows when present", () => {
    const m = mergeGitHub(portfolio, gh);
    expect(m.projects[0].name.toLowerCase()).toContain("taskforge");
  });
});
