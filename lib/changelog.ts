// Parses a "Keep a Changelog" CHANGELOG.md (as produced by the dev-to-main skill)
// into the ChangelogEntry[] the project store page renders. Pure + no I/O so it's
// unit-tested; lib/github.ts does the fetch and calls this.
import type { ChangelogEntry, ChangelogSection } from "@/lib/types";

const RELEASE = /^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})$/;
const GROUP = /^### (.+)$/;
const BULLET = /^- (.+)$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

// Drop "(PR [#12](url))" refs (they point at private repos), unwrap any other
// markdown links to their text, and strip inline backticks.
function cleanBullet(text: string): string {
  return text
    .replace(/\s*\(PR \[#\d+\]\([^)]*\)\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`/g, "")
    .trim();
}

// Parsed entries carry no imagery; use the project's first screenshot as the
// visual on every release card/banner. No-op when the project has no screenshot.
export function applyCover(entries: ChangelogEntry[], cover?: string): ChangelogEntry[] {
  if (!cover) return entries;
  return entries.map((e) => ({ ...e, image: cover }));
}

type Group = { name: string; bullets: string[] };

export function parseChangelog(md: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  let version = "";
  let date = "";
  let groups: Group[] = [];

  const flush = () => {
    if (!version) return;
    const sections: ChangelogSection[] = [];
    for (const g of groups) {
      g.bullets.forEach((b, i) => sections.push({ h: i === 0 ? g.name : undefined, body: b }));
    }
    if (sections.length === 0) return;
    entries.push({
      date: fmtDate(date),
      title: `v${version}`,
      subtitle: groups.map((g) => g.name).join(" · "),
      body: sections[0].body,
      sections,
    });
  };

  for (const line of md.split(/\r?\n/)) {
    const release = RELEASE.exec(line);
    if (release) {
      flush();
      [, version, date] = release;
      groups = [];
      continue;
    }
    const group = GROUP.exec(line);
    if (group) {
      groups.push({ name: group[1].trim(), bullets: [] });
      continue;
    }
    const bullet = BULLET.exec(line);
    if (bullet && groups.length) {
      groups[groups.length - 1].bullets.push(cleanBullet(bullet[1]));
    }
  }
  flush();
  return entries;
}
