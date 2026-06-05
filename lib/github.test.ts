import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGitHubStats } from "@/lib/github";

beforeEach(() => vi.restoreAllMocks());

function mockJson(map: Record<string, unknown>) {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    // match the most specific (longest) key to avoid prefix collisions
    const key = Object.keys(map).sort((a, b) => b.length - a.length).find((k) => url.includes(k));
    return { ok: true, status: 200, json: async () => map[key ?? ""] ?? {} } as Response;
  }));
}

describe("fetchGitHubStats", () => {
  it("aggregates repos, stars, languages and activity", async () => {
    mockJson({
      "/users/shoots": { public_repos: 28 },
      "/users/shoots/repos": [
        { name: "a", stargazers_count: 10, language: "TypeScript", fork: false },
        { name: "b", stargazers_count: 5, language: "CSS", fork: false },
      ],
      "/users/shoots/events/public": [
        { type: "PushEvent", repo: { name: "shoots/a" }, created_at: "2026-06-01T00:00:00Z", payload: { commits: [{}, {}] } },
      ],
    });
    const s = await fetchGitHubStats("shoots", undefined);
    expect(s.repos).toBe(28);
    expect(s.stars).toBe(15);
    expect(s.languages[0].name).toBe("TypeScript");
    expect(s.activity.length).toBeGreaterThan(0);
    expect(s.commits).toBeGreaterThan(0);
  });

  it("returns zeros on failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 403 } as Response)));
    const s = await fetchGitHubStats("shoots", undefined);
    expect(s.repos).toBe(0);
    expect(s.activity).toEqual([]);
  });
});
