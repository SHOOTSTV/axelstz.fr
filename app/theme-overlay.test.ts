import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

describe("theme overlay CSS", () => {
  it("themes the project capsule", () => expect(css).toContain(".game-cap::after"));
  it("themes the featured logo", () => expect(css).toContain(".fav-av::after"));
});
