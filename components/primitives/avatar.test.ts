import { describe, it, expect } from "vitest";
import { avatarFor } from "./avatar";

describe("avatarFor", () => {
  it("uses the first alphanumeric character as the initial", () => {
    expect(avatarFor("Ann").initial).toBe("A");
    expect(avatarFor("  zoe").initial).toBe("Z");
  });
  it("falls back to ? for empty names", () => {
    expect(avatarFor("").initial).toBe("?");
  });
  it("is deterministic for the same name", () => {
    expect(avatarFor("Ann")).toEqual(avatarFor("Ann"));
  });
});
