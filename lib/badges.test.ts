import { describe, it, expect } from "vitest";
import { commitBadge, withCommitBadge } from "@/lib/badges";
import { portfolio } from "@/data/portfolio";

describe("commitBadge", () => {
  it("formats the exact count in the description", () => {
    expect(commitBadge(1247).desc).toBe("1,247 commits across projects");
    expect(commitBadge(1247).icon).toBe("code");
    expect(commitBadge(1247).name).toBe("Committed");
  });

  it("tiers by milestone via the year-independent xp field and color", () => {
    expect(commitBadge(42).xp).toBe(100);
    expect(commitBadge(137).xp).toBe(100);
    expect(commitBadge(642).xp).toBe(500);
    expect(commitBadge(1247).xp).toBe(1000);
    // brighter color at higher tiers (distinct per tier)
    expect(commitBadge(42).color).not.toBe(commitBadge(1247).color);
  });
});

describe("withCommitBadge", () => {
  it("appends the commit badge when total > 0", () => {
    const out = withCommitBadge(portfolio, 642);
    expect(out.badges.length).toBe(portfolio.badges.length + 1);
    expect(out.badges[out.badges.length - 1].name).toBe("Committed");
  });

  it("returns data unchanged when total is 0", () => {
    const out = withCommitBadge(portfolio, 0);
    expect(out.badges.length).toBe(portfolio.badges.length);
  });
});
