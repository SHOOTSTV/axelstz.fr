# Profile achievement badges — design

**Date:** 2026-06-20
**Status:** Approved, ready for implementation plan

## Problem

The sidebar "Badges" section renders three placeholder gradient tiles
(`{label:"3"}`, `{label:"'26"}`, a bare `rocket` icon) with no name, description,
or meaning. They look like a feature but carry no information. Turn them into real,
Steam-style **earned achievement badges**: icon tiles that reveal a name +
description on hover, including one badge backed by the real total commit count
across the owner's projects.

## Decisions (from brainstorming)

- **Concept:** earned achievements (native to the Steam theme), not skill/tech badges.
- **Interaction:** hover/focus tooltip — no new routes, no modal, keyboard-accessible.
- **Data source:** four badges hand-authored & static; the fifth (commits) is
  **live-derived** from GitHub so the number is always real (honesty rule: never
  fabricate metrics).

## Badge data model

`lib/types.ts` — replace the placeholder `label` field with meaning:

```ts
export interface Badge {
  icon: IconName;
  color: string;
  name: string;   // "Shipper"
  desc: string;   // "Shipped multiple live projects"
  year: number;   // unlock year shown in tooltip, e.g. 2026
  xp?: number;    // optional, thematic (site already uses Level/XP language)
}
```

`label` is removed. Badges are icon-only tiles; all text lives in the tooltip.

## Static badges (`data/portfolio.ts`)

Four hand-authored, **feature-truthful** badges (each describes something the site /
repo actually demonstrates — no invented metrics):

| icon      | name           | desc                              | year |
|-----------|----------------|-----------------------------------|------|
| `rocket`  | Shipper        | Shipped multiple live projects    | 2026 |
| `layers`  | Full-Stack     | Front-end to database, end to end | 2026 |
| `github`  | Open Source    | Public work on GitHub             | 2026 |
| `comment` | Guestbook Host | Built a live visitor guestbook    | 2026 |

`xp` values are optional/thematic and may be added per badge; they are decorative
gamification consistent with the existing "Level 26 / XP" theme, not real-world claims.

## Commit badge (live, fifth)

The home page's existing `gh.commits` is **not** a lifetime total — `fetchGitHubStats`
only counts commits from the last ~30 public events. The real per-project totals come
from `repoCommits` (the `Link`-header "last page" trick), currently used only by
`fetchProjectStats` on the Projects page. So the commit badge needs its own sum.

- **`fetchTotalCommits(projects, token): Promise<number>`** — new exported helper in
  `lib/github.ts`. Reuses the existing `repoCommits(owner, repo, token)` over each
  project's `code` repo URL (skips projects without a parseable repo) and sums the
  results. Misses contribute 0. ISR-cached at the call site like the other fetchers.
- **`commitBadge(total: number): Badge`** — pure helper (testable without network).
  Tiers the badge by milestone:
  - `>= 1000` → "Committed", 1000+ tier (brightest color)
  - `>= 500`  → "Committed", 500+ tier
  - `>= 100`  → "Committed", 100+ tier
  - `< 100`   → "Committed", base tier
  Tooltip `desc` shows the exact count formatted with separators, e.g.
  `"1,247 commits across projects"`. Icon: `code`.
- **Omission on failure:** if the total is `0` (no token, offline, all misses), the
  commit badge is **not** added — no "0 commits" badge ever renders.

### Data flow

`app/page.tsx` (Server Component, `revalidate: 3600`):

```ts
const total = username ? await fetchTotalCommits(portfolio.projects, token) : 0;
const data = mergeGitHub(portfolio, github); // unchanged
// inject commit badge when total > 0
const badges = total > 0 ? [...data.badges, commitBadge(total)] : data.badges;
```

Injection happens at the page level (or a small `withCommitBadge(data, total)` merge
helper) and feeds `Shell` → `Sidebar` via the existing `data.badges` path. No change
to `mergeGitHub`'s current `bigStats` behavior.

## Rendering

New `components/steam/BadgeTile.tsx`:

- Renders the existing `.badge-ic` gradient tile (icon via `<Icon>`).
- Adds a `.badge-tip` tooltip child: icon-less header `{name}`, `{desc}`,
  and a footer line `Unlocked {year}` + `· {xp} XP` when `xp` present.
- Accessibility: tile is focusable (`tabIndex={0}`), has an `aria-label`
  (`"{name} — {desc}"`) and a `title` fallback. Tooltip shown on `:hover` and
  `:focus-within` via CSS.

`Sidebar.tsx`: the badge `.map` renders `<BadgeTile badge={b} />` instead of the
inline span. The `Badges <span class="n">{count}</span>` header count is unchanged
(now naturally reflects 4 or 5).

## Styling (`app/globals.css`)

- Keep `.badge-ic` as-is (already `position: relative; overflow: hidden`). The tooltip
  needs to escape the tile, so the popover is positioned relative to a wrapper or the
  tile's `overflow` is handled (e.g. tooltip rendered as a sibling within a
  `position: relative` wrapper that is **not** `overflow: hidden`).
- New `.badge-tip` block: absolutely positioned below the tile, dark card matching the
  Steam side panels (border, subtle shadow), hidden by default
  (`opacity:0; pointer-events:none`), revealed on `:hover`/`:focus-within`.
- Respects reduced motion: under `body.motion-off` and
  `@media (prefers-reduced-motion: reduce)` the reveal is instant (no transition).

## Testing

- `lib/types.test.ts` — update the `Badge` fixture to the new shape.
- New unit test for `commitBadge()` — asserts tier name/color and formatted `desc`
  for representative totals (e.g. 42, 137, 642, 1247). Pure, no network.
- `BadgeTile` / `Sidebar` test — assert a badge's `name` and `desc` render in the DOM
  (tests already force `motion-off`).
- `npm run build` is the real gate (TypeScript + static generation).

## Out of scope (noted)

- The `commits` **bigStat** on the profile page also uses the recent-events count
  rather than a lifetime total — same root limitation as above. Not changed here;
  flagged for a possible later pass.
- No new routes, no modal, no badge detail page.
```

