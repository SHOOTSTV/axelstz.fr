import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/ratelimit";

describe("createRateLimiter", () => {
  it("allows up to the limit within a window, then blocks", () => {
    const now = 1000;
    const rl = createRateLimiter({ limit: 3, windowMs: 60_000, now: () => now });

    expect(rl.allow("1.1.1.1")).toBe(true);
    expect(rl.allow("1.1.1.1")).toBe(true);
    expect(rl.allow("1.1.1.1")).toBe(true);
    expect(rl.allow("1.1.1.1")).toBe(false);
  });

  it("tracks keys independently", () => {
    const now = 1000;
    const rl = createRateLimiter({ limit: 1, windowMs: 60_000, now: () => now });

    expect(rl.allow("1.1.1.1")).toBe(true);
    expect(rl.allow("2.2.2.2")).toBe(true);
    expect(rl.allow("1.1.1.1")).toBe(false);
  });

  it("resets after the window elapses", () => {
    let now = 1000;
    const rl = createRateLimiter({ limit: 1, windowMs: 60_000, now: () => now });

    expect(rl.allow("1.1.1.1")).toBe(true);
    expect(rl.allow("1.1.1.1")).toBe(false);
    now += 60_001;
    expect(rl.allow("1.1.1.1")).toBe(true);
  });
});
