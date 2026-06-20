# Profile Achievement Badges Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder sidebar badges with real Steam-style achievement badges — four hand-authored truthful ones plus a live commit-count badge — each revealing name/description on hover.

**Architecture:** Reshape the `Badge` type to carry meaning. Four badges are static in `data/portfolio.ts`; a fifth "Committed" badge is built from the real total commit count summed live from GitHub (reusing the existing `repoCommits` helper) and injected into `data.badges` in the home page server component. A new `BadgeTile` client component renders each icon tile with a CSS hover/focus tooltip.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, Tailwind v4 + `globals.css`, Vitest + Testing Library.

## Global Constraints

- **Content honesty:** English copy only; never invent metrics (DAU/uptime/stars). Badge copy must be feature-truthful or computed from real data. (AGENTS.md)
- **Node version / framework:** Next.js 16 conventions — read `node_modules/next/dist/docs/` before non-obvious framework usage.
- **`server-only`:** `lib/github.ts` is server-only; never import it into a client component. The commit total must be fetched in the server component (`app/page.tsx`) and passed down through plain data.
- **Tests colocated:** `Foo.ts` → `Foo.test.ts`. Tests run with `body.classList.add("motion-off")` already set by setup.
- **Real gate:** `npm run build` (TypeScript + static gen). `npm run test` for unit tests.

---

### Task 1: Reshape Badge model + static badges + BadgeTile with tooltip

**Files:**
- Modify: `lib/types.ts:10` (the `Badge` interface)
- Modify: `data/portfolio.ts:61-65` (the `badges` array)
- Modify: `lib/types.test.ts:8` (fixture `badges`)
- Create: `components/steam/BadgeTile.tsx`
- Create: `components/steam/BadgeTile.test.tsx`
- Modify: `components/steam/Sidebar.tsx:15-21` (badge row render)
- Modify: `app/globals.css` (after the `.badge-ic` block at line 256)

**Interfaces:**
- Produces: `interface Badge { icon: IconName; color: string; name: string; desc: string; year: number; xp?: number }`
- Produces: `BadgeTile({ badge }: { badge: Badge })` — default export-free named export, a client component rendering one `.badge-ic` tile + `.badge-tip` tooltip.

- [ ] **Step 1: Update the `Badge` interface**

In `lib/types.ts`, replace line 10:

```ts
export interface Badge { icon: IconName; color: string; name: string; desc: string; year: number; xp?: number; }
```

- [ ] **Step 2: Update the static badges data**

In `data/portfolio.ts`, replace the `badges:` array (lines 61-65) with:

```ts
  badges: [
    { icon: "rocket",  color: "#5a4b8a", name: "Shipper",        desc: "Shipped multiple live projects",    year: 2026, xp: 100 },
    { icon: "layers",  color: "#2f5a7a", name: "Full-Stack",     desc: "Front-end to database, end to end",  year: 2026, xp: 80 },
    { icon: "github",  color: "#3a3a3a", name: "Open Source",    desc: "Public work on GitHub",              year: 2026, xp: 60 },
    { icon: "comment", color: "#7a2f5a", name: "Guestbook Host", desc: "Built a live visitor guestbook",     year: 2026, xp: 40 },
  ],
```

- [ ] **Step 3: Update the type fixture**

In `lib/types.test.ts`, replace line 8's `badges`:

```ts
  badges: [{ icon: "rocket", color: "#5a4b8a", name: "Shipper", desc: "Shipped projects", year: 2026, xp: 50 }],
```

- [ ] **Step 4: Write the failing BadgeTile test**

Create `components/steam/BadgeTile.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BadgeTile } from "@/components/steam/BadgeTile";
import type { Badge } from "@/lib/types";

const badge: Badge = { icon: "rocket", color: "#5a4b8a", name: "Shipper", desc: "Shipped multiple live projects", year: 2026, xp: 100 };

describe("BadgeTile", () => {
  it("renders the badge name, description, unlock year and xp", () => {
    render(<BadgeTile badge={badge} />);
    expect(screen.getByText("Shipper")).toBeTruthy();
    expect(screen.getByText("Shipped multiple live projects")).toBeTruthy();
    expect(screen.getByText(/Unlocked 2026/)).toBeTruthy();
    expect(screen.getByText(/100 XP/)).toBeTruthy();
  });

  it("exposes the name+desc as an accessible label and omits XP when absent", () => {
    const noXp: Badge = { ...badge, xp: undefined };
    render(<BadgeTile badge={noXp} />);
    expect(screen.getByLabelText("Shipper — Shipped multiple live projects")).toBeTruthy();
    expect(screen.queryByText(/XP/)).toBeNull();
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm run test -- BadgeTile`
Expected: FAIL — `Cannot find module '@/components/steam/BadgeTile'`.

- [ ] **Step 6: Implement `BadgeTile`**

Create `components/steam/BadgeTile.tsx`:

```tsx
import type { Badge } from "@/lib/types";
import { Icon } from "@/components/primitives/Icon";

export function BadgeTile({ badge }: { badge: Badge }) {
  const label = `${badge.name} — ${badge.desc}`;
  return (
    <span className="badge-tile" tabIndex={0} aria-label={label} title={label}>
      <span className="badge-ic" style={{ background: `linear-gradient(160deg, ${badge.color}, #14171b)` }}>
        <Icon name={badge.icon} size={20} />
      </span>
      <span className="badge-tip" role="tooltip">
        <span className="bt-name">{badge.name}</span>
        <span className="bt-desc">{badge.desc}</span>
        <span className="bt-meta">Unlocked {badge.year}{badge.xp != null ? ` · ${badge.xp} XP` : ""}</span>
      </span>
    </span>
  );
}
```

- [ ] **Step 7: Run the BadgeTile test to verify it passes**

Run: `npm run test -- BadgeTile`
Expected: PASS (both tests).

- [ ] **Step 8: Wire `BadgeTile` into the Sidebar**

In `components/steam/Sidebar.tsx`, replace the badge row block (lines 15-21):

```tsx
        <div className="badge-row">
          {data.badges.map((b, i) => (
            <BadgeTile badge={b} key={i} />
          ))}
        </div>
```

Add the import near the top (after the `Icon` import on line 3):

```tsx
import { BadgeTile } from "@/components/steam/BadgeTile";
```

Remove the now-unused `Icon` import **only if** no other usage remains in the file — note `Icon` is still used at line 53 (`contact-av`), so KEEP the `Icon` import.

- [ ] **Step 9: Add the tooltip CSS**

In `app/globals.css`, immediately after the `.badge-ic { … }` block (ends line 256), add:

```css
.badge-tile { position: relative; display: inline-flex; outline: none; }
.badge-tile .badge-ic { cursor: default; }
.badge-tip {
  position: absolute; left: 0; top: calc(100% + 8px); z-index: 20;
  width: max-content; max-width: 220px;
  display: flex; flex-direction: column; gap: 3px;
  padding: 8px 10px; border-radius: 5px;
  background: #11151b; border: 1px solid rgba(255,255,255,.14);
  box-shadow: 0 8px 24px rgba(0,0,0,.5);
  opacity: 0; transform: translateY(-3px); pointer-events: none;
  transition: opacity .12s ease, transform .12s ease;
}
.badge-tile:hover .badge-tip,
.badge-tile:focus-within .badge-tip,
.badge-tile:focus .badge-tip { opacity: 1; transform: translateY(0); }
.badge-tip .bt-name { font-size: 13px; font-weight: 700; color: var(--text); }
.badge-tip .bt-desc { font-size: 12px; color: var(--muted); }
.badge-tip .bt-meta { font-size: 11px; color: var(--muted2); }
body.motion-off .badge-tip { transition: none; }
@media (prefers-reduced-motion: reduce) { .badge-tip { transition: none; } }
```

- [ ] **Step 10: Run the full test suite + build**

Run: `npm run test` then `npm run build`
Expected: all tests PASS; build succeeds (TypeScript clean — confirms the `Badge` reshape propagated correctly).

- [ ] **Step 11: Commit**

```bash
git add lib/types.ts data/portfolio.ts lib/types.test.ts components/steam/BadgeTile.tsx components/steam/BadgeTile.test.tsx components/steam/Sidebar.tsx app/globals.css
git commit -m "feat(badges): real achievement badges with hover tooltips"
```

---

### Task 2: Sum live total commits across projects

**Files:**
- Modify: `lib/github.ts` (add `fetchTotalCommits` after `fetchProjectStats`, ~line 124)
- Modify: `lib/github.test.ts` (add a `fetchTotalCommits` describe block)

**Interfaces:**
- Consumes: existing private `repoCommits(owner, repo, token)` and `parseRepo(url)` in `lib/github.ts`.
- Produces: `export async function fetchTotalCommits(projects: Project[], token?: string): Promise<number>` — sums `repoCommits` over each project with a parseable `code` repo; misses and non-repo projects contribute 0.

- [ ] **Step 1: Write the failing test**

In `lib/github.test.ts`, add after the `fetchProjectStats` describe block (after line 76). Also add `fetchTotalCommits` to the import on line 2:

```ts
import { fetchGitHubStats, fetchProjectStats, fetchTotalCommits } from "@/lib/github";
```

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- github`
Expected: FAIL — `fetchTotalCommits is not a function` / no export named `fetchTotalCommits`.

- [ ] **Step 3: Implement `fetchTotalCommits`**

In `lib/github.ts`, add after `fetchProjectStats` (after line 124):

```ts
// Sum of commit counts across the owner's project repos (the Projects library set).
// Reuses repoCommits' Link-header trick; private/missing/non-repo projects contribute 0.
export async function fetchTotalCommits(projects: Project[], token?: string): Promise<number> {
  const counts = await Promise.all(
    projects.map(async (p) => {
      const r = parseRepo(p.code);
      if (!r) return 0;
      return (await repoCommits(r.owner, r.repo, token)) ?? 0;
    })
  );
  return counts.reduce((a, n) => a + n, 0);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- github`
Expected: PASS (existing github tests + the two new ones).

- [ ] **Step 5: Commit**

```bash
git add lib/github.ts lib/github.test.ts
git commit -m "feat(github): fetchTotalCommits sums commits across project repos"
```

---

### Task 3: Commit badge construction + injection helpers

**Files:**
- Create: `lib/badges.ts`
- Create: `lib/badges.test.ts`

**Interfaces:**
- Consumes: `Badge`, `PortfolioData` from `lib/types`.
- Produces: `commitBadge(total: number): Badge` — tiered "Committed" badge; `withCommitBadge(data: PortfolioData, total: number): PortfolioData` — returns `data` unchanged when `total <= 0`, else appends `commitBadge(total)` to `data.badges`.

- [ ] **Step 1: Write the failing test**

Create `lib/badges.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- badges`
Expected: FAIL — `Cannot find module '@/lib/badges'`.

- [ ] **Step 3: Implement the helpers**

Create `lib/badges.ts`:

```ts
import type { Badge, PortfolioData } from "@/lib/types";

// "Committed" badge built from the real total commit count. The xp field doubles
// as the milestone tier (100/500/1000) so higher totals read as a bigger achievement.
export function commitBadge(total: number): Badge {
  const tier = total >= 1000 ? { xp: 1000, color: "#b8862b" }
    : total >= 500 ? { xp: 500, color: "#7a5a2f" }
    : total >= 100 ? { xp: 100, color: "#3a5a3a" }
    : { xp: 100, color: "#3a3f4a" };
  return {
    icon: "code",
    color: tier.color,
    name: "Committed",
    desc: `${total.toLocaleString("en-US")} commits across projects`,
    year: 2026,
    xp: tier.xp,
  };
}

export function withCommitBadge(data: PortfolioData, total: number): PortfolioData {
  if (total <= 0) return data;
  return { ...data, badges: [...data.badges, commitBadge(total)] };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- badges`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/badges.ts lib/badges.test.ts
git commit -m "feat(badges): tiered live commit badge + injection helper"
```

---

### Task 4: Wire the commit badge into the home page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `fetchTotalCommits` (Task 2), `withCommitBadge` (Task 3), existing `mergeGitHub`, `portfolio`.

- [ ] **Step 1: Update the page server component**

Replace the body of `app/page.tsx` with:

```tsx
import { portfolio } from "@/data/portfolio";
import { Shell } from "@/components/Profile";
import { fetchGitHubStats, fetchTotalCommits } from "@/lib/github";
import { mergeGitHub } from "@/lib/merge";
import { withCommitBadge } from "@/lib/badges";

export const revalidate = 3600;

export default async function Page() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;
  const [github, totalCommits] = await Promise.all([
    username ? fetchGitHubStats(username, token) : Promise.resolve(null),
    username ? fetchTotalCommits(portfolio.projects, token) : Promise.resolve(0),
  ]);
  const data = withCommitBadge(mergeGitHub(portfolio, github), totalCommits);
  return <Shell data={data} github={github} />;
}
```

- [ ] **Step 2: Verify build + tests**

Run: `npm run build` then `npm run test`
Expected: build succeeds; all tests pass. (No new unit test here — the page is an integration point exercised by the build's static generation. `withCommitBadge` and `fetchTotalCommits` are unit-tested in Tasks 2-3.)

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open the home page sidebar. With a valid `GITHUB_USERNAME`/`GITHUB_TOKEN` in `.env`, confirm a fifth "Committed" badge appears; hover/tab to it and confirm the tooltip shows `N,NNN commits across projects`. Without GitHub env vars, confirm only the four static badges render (no "0 commits" badge).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(badges): inject live commit badge on the profile page"
```

---

## Self-Review Notes

- **Spec coverage:** Badge model (Task 1), 4 static badges (Task 1), commit badge live total (Tasks 2-4), tooltip render + a11y (Task 1), CSS + motion-off (Task 1), omission on failure (Task 3 `withCommitBadge` / Task 4 `totalCommits=0`), tests for type fixture / pure tiering / DOM render / fetcher (Tasks 1-3). All spec sections mapped.
- **Out of scope (per spec):** the `commits` bigStat still uses the recent-events count — intentionally untouched.
- **Type consistency:** `Badge` fields (`icon, color, name, desc, year, xp?`) are used identically across `data/portfolio.ts`, `BadgeTile`, `commitBadge`, and both test fixtures. `fetchTotalCommits` and `withCommitBadge` signatures match their call sites in `app/page.tsx`.
- **Icon note:** `rocket`, `layers`, `github`, `comment`, `code` all exist in `lib/icons.ts` (verified).
```
