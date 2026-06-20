import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGitHubStats, fetchProjectStats, fetchTotalCommits } from "@/lib/github";
import type { Project } from "@/lib/types";

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

describe("fetchProjectStats", () => {
  const base: Project = { name: "Demo", image: "/d.png", meta: "x", last: "x", code: "https://github.com/u/demo" };

  it("reads the commit count from the Link header and the date from pushed_at", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (url.includes("/commits")) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => '<https://api.github.com/repositories/1/commits?per_page=1&page=428>; rel="last"' },
          json: async () => [{}],
        } as unknown as Response;
      }
      return { ok: true, status: 200, json: async () => ({ pushed_at: "2026-06-03T10:00:00Z" }) } as Response;
    }));
    const [p] = await fetchProjectStats([base], undefined);
    expect(p.commits).toBe(428);
    expect(p.lastUpdate).toBe("Jun 3");
  });

  it("leaves stats undefined when the repo is unavailable (private / 404)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 404 } as Response)));
    const [p] = await fetchProjectStats([base], undefined);
    expect(p.commits).toBeUndefined();
    expect(p.lastUpdate).toBeUndefined();
  });

  it("passes through projects without a GitHub repo untouched", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false } as Response)));
    const noRepo: Project = { name: "X", image: "/x.png", meta: "x", last: "x" };
    const [p] = await fetchProjectStats([noRepo], undefined);
    expect(p).toEqual(noRepo);
  });
});

describe("fetchTotalCommits", () => {
  const a: Project = { name: "A", image: "/a.png", meta: "x", last: "x", code: "https://github.com/u/a" };
  const b: Project = { name: "B", image: "/b.png", meta: "x", last: "x", code: "https://github.com/u/b" };
  const noRepo: Project = { name: "N", image: "/n.png", meta: "x", last: "x" };

  it("sums commit counts across project repos and ignores repo-less projects", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => ({
      ok: true,
      status: 200,
      headers: { get: () => `<https://api.github.com/repositories/1/commits?per_page=1&page=${url.includes("/u/a/") ? 300 : 200}>; rel="last"` },
      json: async () => [{}],
    } as unknown as Response)));
    const total = await fetchTotalCommits([a, b, noRepo], undefined);
    expect(total).toBe(500);
  });

  it("returns 0 when every repo is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 404 } as Response)));
    const total = await fetchTotalCommits([a, b], undefined);
    expect(total).toBe(0);
  });
});
