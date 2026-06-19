import { describe, expect, it } from "vitest";
import { applyCover, parseChangelog } from "./changelog";

const SAMPLE = `## [Unreleased]

## [1.2.0] - 2026-06-07

### Added

- Adds \`@supabase/ssr\` sessions (PR [#164](https://github.com/x/y/pull/164)).

### Fixed

- Fixes the \`429\` handling (PR [#171](https://github.com/x/y/pull/171)).
- Second fix.

## [1.1.0] - 2026-06-03

### Changed

- Earlier change.
`;

describe("parseChangelog", () => {
  it("skips [Unreleased] (it has no date)", () => {
    const entries = parseChangelog(SAMPLE);
    expect(entries.map((e) => e.title)).toEqual(["v1.2.0", "v1.1.0"]);
  });

  it("maps version to title and formats the date with year", () => {
    const [first] = parseChangelog(SAMPLE);
    expect(first.title).toBe("v1.2.0");
    expect(first.date).toBe("7 Jun 2026");
  });

  it("lists the section names in the subtitle", () => {
    const [first] = parseChangelog(SAMPLE);
    expect(first.subtitle).toBe("Added · Fixed");
  });

  it("uses the first cleaned bullet as the card body, stripping PR refs and backticks", () => {
    const [first] = parseChangelog(SAMPLE);
    expect(first.body).toBe("Adds @supabase/ssr sessions.");
  });

  it("emits the group heading once, then one paragraph per bullet", () => {
    const [first] = parseChangelog(SAMPLE);
    expect(first.sections).toEqual([
      { h: "Added", body: "Adds @supabase/ssr sessions." },
      { h: "Fixed", body: "Fixes the 429 handling." },
      { h: undefined, body: "Second fix." },
    ]);
  });

  it("returns [] for content with no dated releases", () => {
    expect(parseChangelog("## [Unreleased]\n\n### Added\n\n- WIP\n")).toEqual([]);
  });
});

describe("applyCover", () => {
  it("uses the cover as the image on every entry", () => {
    const out = applyCover(parseChangelog(SAMPLE), "/images/floatvision.png");
    expect(out.map((e) => e.image)).toEqual(["/images/floatvision.png", "/images/floatvision.png"]);
  });

  it("leaves entries unchanged when there is no cover", () => {
    const entries = parseChangelog(SAMPLE);
    expect(applyCover(entries, undefined)).toEqual(entries);
  });
});
