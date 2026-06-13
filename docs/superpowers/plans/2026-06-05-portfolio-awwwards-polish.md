# Portfolio Awwwards Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the gap between the strong Steam-profile *concept* and the half-populated *build* — eliminate the "unfinished template" signals (empty image frames, zeroed stats, fabricated content, dead links) and add the motion/typography craft needed to push the site from an unsubmittable ~5.4 toward Awwwards Honorable-Mention / Site-of-the-Day territory.

**Architecture:** This is a polish pass on an existing Next.js (App Router) Steam-community-profile portfolio. No new subsystems. Changes touch four areas: (1) **content/data** in `data/portfolio.ts`, (2) **wiring fixes** in steam components, (3) **CSS** in `app/globals.css`, (4) **motion primitives** in `components/primitives/`. Work proceeds in three priority phases — Critical (credibility), Important (craft), Premium (delight) — so the site is shippable after Phase 1 alone.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, Tailwind v4 + hand-rolled CSS tokens in `globals.css`, Vitest + Testing Library, `next/font` (Asap + JetBrains Mono), `next/image`, canvas Starfield.

**Source review:** This plan operationalizes the Awwwards-style review delivered in chat on 2026-06-05. Score targets per task reference that review's baseline (Design 6 / Usability 5 / Creativity 8 / Content 3 / Performance 6).

**Conventions:**
- Tests live beside components (`Foo.tsx` → `Foo.test.tsx`) or in `test/`. Run with `npm run test` (vitest).
- Lint with `npm run lint`. Build with `npm run build`.
- Visual/content/CSS tasks that have no meaningful unit assertion use a **manual verification** step (`npm run dev` + described observation) instead of a forced test — follow the existing codebase, which does not snapshot-test visuals.
- Commit after every task. Branch is `feat/portfolio-implementation` (already checked out); do not commit to `main`.
- `_TODO_OWNER` markers in `data/portfolio.ts` flag placeholder values the owner (Axel) must supply real data for. Where this plan cannot invent truthful data, it converts fabricated content into clearly-labeled `_TODO_OWNER` stubs rather than leaving fiction in place.

---

## File Structure

Files this plan creates or modifies, and what each owns:

- `data/portfolio.ts` — **Modify.** Single source of truth for all copy/metrics. De-fabricate content; mark owner-supplied gaps.
- `public/images/` — **Create assets.** Real screenshots/artwork/avatar to fill `Frame` placeholders. (Owner-supplied; plan defines slots + fallback.)
- `components/steam/TopBar.tsx` — **Modify.** Add SHOOTS wordmark; fix nav anchors; scroll-synced active state.
- `components/steam/Footer.tsx` — **Modify.** Real links from data instead of `href="#"`.
- `components/steam/BigStats.tsx` — **Modify.** Hide zero-value tiles so nothing animates to 0.
- `components/steam/FeaturedProject.tsx` — **Modify.** Real URLs; spotlight hover/stagger.
- `components/steam/ArtworkShowcase.tsx` — **Modify.** Parallax/hover depth; honest `+N` count.
- `components/steam/ProfileHeader.tsx` — **Modify.** Animated level-up; tooltip.
- `components/steam/Starfield.tsx` — **Modify.** Pause off-viewport / hidden tab; lower mobile star count.
- `components/Profile.tsx` — **Modify.** View-Transition the recruiter swap; mount achievement-toast host.
- `components/ModeProvider.tsx` — **Modify.** Wrap `setRecruiter` in `document.startViewTransition`.
- `components/primitives/AchievementToast.tsx` — **Create.** Steam-style unlock toast on scroll milestones.
- `components/primitives/MagneticButton.tsx` — **Create.** Reusable magnetic CTA wrapper.
- `data/portfolio.ts` (`nav`) — **Modify.** Align nav labels with real section IDs.
- `app/globals.css` — **Modify.** Display type tier, hierarchy contrast, spotlight/parallax/magnetic styles, toast styles, top-bar brand, fix overlaps.
- `lib/types.ts` — **Modify (small).** Add optional `liveUrl`/`codeUrl` already present as `live`/`code`; add `nav` item shape if needed (see Task 4).
- `app/layout.tsx` — **Modify (optional, Task I1).** Add display font variable if a new family is chosen.

---

# PHASE 1 — 🔥 CRITICAL (credibility; site becomes shippable after this phase)

## Task 1: Define real image slots and a non-empty fallback (C1)

The empty `.art-frames` hero is the first thing a juror sees. Even before real art exists, the `Frame` fallback must not read as "broken black box."

**Files:**
- Modify: `components/primitives/Frame.tsx`
- Modify: `app/globals.css:447-448` (`.frame-empty`, `.frame-ph`)
- Test: `components/primitives/Frame.test.tsx`

- [ ] **Step 1: Write the failing test** — empty Frame renders a labelled, branded placeholder (not just a bare div).

```tsx
// in Frame.test.tsx
import { render, screen } from "@testing-library/react";
import { Frame } from "./Frame";

test("empty frame shows placeholder label and is marked decorative", () => {
  render(<Frame placeholder="Drop artwork" />);
  expect(screen.getByText("Drop artwork")).toBeInTheDocument();
  expect(screen.getByTestId("frame-empty")).toHaveAttribute("data-empty", "true");
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- Frame`
Expected: FAIL (no `data-testid="frame-empty"` yet).

- [ ] **Step 3: Implement** — add the test id / data attr in the empty branch of `Frame.tsx`:

```tsx
if (!src) {
  return (
    <div className={`${cls} frame-empty`} data-testid="frame-empty" data-empty="true" style={style}>
      <span className="frame-ph">{placeholder}</span>
    </div>
  );
}
```

- [ ] **Step 4: Improve the empty visual in CSS** so a missing image reads as an intentional "slot," not a bug. Replace the flat diagonal stripes with a subtle branded panel:

```css
.frame-empty {
  background:
    radial-gradient(120% 120% at 30% 20%, rgba(102,192,244,0.10), transparent 60%),
    repeating-linear-gradient(135deg, #11151b, #11151b 9px, #0e1217 9px, #0e1217 18px);
  display: grid; place-items: center;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
}
.frame-ph { font-family: var(--font-mono); font-size: 10px; letter-spacing: .18em; color: #6b7783; text-transform: uppercase; }
```

- [ ] **Step 5: Run tests + lint**

Run: `npm run test -- Frame && npm run lint`
Expected: PASS, no lint errors.

- [ ] **Step 6: Commit**

```bash
git add components/primitives/Frame.tsx components/primitives/Frame.test.tsx app/globals.css
git commit -m "fix(frame): branded labelled placeholder instead of empty black box"
```

> **Owner action (tracked, not code):** drop real assets into `public/images/` — `avatar.png`, `art-1/2/3.png` (hero artwork, ~16:10), `favg.png` (featured project), `act1/2/3.png` (project capsules ~184×69), community/testimonial avatars. Until then the branded slot above stands in. Add a `_TODO_OWNER` note at top of `data/portfolio.ts`.

---

## Task 2: Never render a "0" stat (C2)

With no `GITHUB_USERNAME` set, `bigStats` repos/commits are `0` and `StatNum` animates 0→0, reading as a bug.

**Files:**
- Modify: `components/steam/BigStats.tsx`
- Test: `components/steam/BigStats.test.tsx` (create if absent)

- [ ] **Step 1: Write the failing test** — zero-valued stat tiles are not rendered.

```tsx
import { render, screen } from "@testing-library/react";
import { BigStats } from "./BigStats";
import type { PortfolioData } from "@/lib/types";

const base = (bigStats: PortfolioData["bigStats"]) =>
  ({ bigStats } as unknown as PortfolioData);

test("hides stat tiles whose value is 0", () => {
  render(<BigStats data={base([
    { key: "projects", value: 12, label: "Projects shipped" },
    { key: "repos", value: 0, label: "Repositories" },
  ])} />);
  expect(screen.getByText("Projects shipped")).toBeInTheDocument();
  expect(screen.queryByText("Repositories")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- BigStats`
Expected: FAIL (both tiles render today).

- [ ] **Step 3: Implement** — filter zero/nullish values before mapping in `BigStats.tsx`:

```tsx
export function BigStats({ data }: { data: PortfolioData }) {
  const stats = data.bigStats.filter((s) => s.value > 0);
  if (stats.length === 0) return null;
  return (
    <div className="stat-row">
      {stats.map((s) => (
        <div className="stat-col" key={s.label}>
          <div className="v"><StatNum value={s.value} /></div>
          <div className="k">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm run test -- BigStats`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/steam/BigStats.tsx components/steam/BigStats.test.tsx
git commit -m "fix(stats): hide zero-value tiles so nothing animates to 0"
```

> **Owner action:** set `GITHUB_USERNAME` (and ideally `GITHUB_TOKEN`) in `.env.local` so repos/commits fill live via `lib/github.ts` + `lib/merge.ts`. If staying static, hardcode truthful numbers in `data/portfolio.ts` `bigStats`/`counts`.

---

## Task 3: De-fabricate content (C3)

Invented metrics and testimonials destroy trust with the exact audience recruiter-mode targets. Replace fiction with truthful values or clearly-labeled owner stubs.

**Files:**
- Modify: `data/portfolio.ts`
- Test: `data/portfolio.test.ts`

- [ ] **Step 1: Write the failing test** — guard against the fabricated sentinel values shipping.

```ts
import { portfolio } from "./portfolio";

test("no fabricated SaaS metrics or +rep testimonials remain", () => {
  const json = JSON.stringify(portfolio);
  expect(json).not.toContain("99.98%");        // invented uptime
  expect(json).not.toContain("+rep");          // fake Steam-comment testimonials
  expect(portfolio.testimonials.every((t) => t.text.length > 0)).toBe(true);
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- portfolio`
Expected: FAIL (`99.98%` and `+rep` present today).

- [ ] **Step 3: Implement** — edit `data/portfolio.ts`:
  - `featuredProject.stats`: replace fabricated `Users / Live now / Uptime / p95` with truthful project facts, e.g. `{ value: "TypeScript", key: "Built with", cls: "chat" }`, `{ value: "2025", key: "Shipped", cls: "online" }`, or real GitHub stars/forks if available. If no real numbers exist, reduce to 1–2 honest facts.
  - `testimonials`: replace `maya.okafor`/`liam.petrov` `+rep` text with real quotes (LinkedIn recommendations, manager/client feedback) or mark the array `[]` with a `_TODO_OWNER` comment and let the section render empty/short. Do not invent names.
  - `communities` members counts (`22,475`, `411,137`): keep only memberships that are real, or relabel as "Following" with honest context.
  - `projects` hour counts / milestones: set to truthful values or remove the `meta` hours line.

```ts
// example shape after de-fabrication
featuredProject: {
  name: "Nebula Analytics", type: "Flagship project", image: "/images/favg.png",
  desc: "Real-time product analytics for indie SaaS teams — event pipelines, cohort funnels and AI-assisted insights.",
  stats: [
    { value: "Next.js", key: "Framework", cls: "chat" },
    { value: "Supabase", key: "Backend", cls: "members" },
    { value: "2025", key: "Shipped", cls: "online" },
  ],
  live: "https://nebula.example.com",   // _TODO_OWNER real URL
  code: "https://github.com/axelstz/nebula", // _TODO_OWNER real URL
},
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm run test -- portfolio`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/portfolio.ts data/portfolio.test.ts
git commit -m "content: remove fabricated metrics/testimonials, mark owner gaps"
```

---

## Task 4: Fix dead links + nav anchors (C4 part 1)

`#projects` and `#support` are dead anchors; footer + social links are placeholders.

**Files:**
- Modify: `data/portfolio.ts` (`nav`, `footer`, `social`)
- Modify: `components/steam/TopBar.tsx`
- Modify: `components/steam/Footer.tsx`
- Modify: `lib/types.ts` (footer link shape)
- Test: `components/steam/TopBar.test.tsx`, `components/steam/Footer.test.tsx`

- [ ] **Step 1: Align nav to real section IDs.** Existing IDs in the DOM: `#top`, `#profile`, `#activity`, `#community`. Update `data/portfolio.ts` `nav` to only reference real targets, e.g.:

```ts
nav: ["PROJECTS", "ACTIVITY", "TESTIMONIALS", "CONTACT"],
```

and add matching IDs where missing: give `FeaturedProject`/`ArtworkShowcase` wrapper `id="projects"`, and the footer/sidebar contact block `id="contact"`. (Map in `TopBar` `href={`#${label.toLowerCase()}`}`.)

- [ ] **Step 2: Write failing test** — every nav href points at an element that exists in the rendered page. Add to `TopBar.test.tsx` a test asserting nav hrefs are within the known set:

```tsx
test("nav only links to real section ids", () => {
  const ids = new Set(["#projects", "#activity", "#testimonials", "#contact"]);
  render(<TopBar data={data} />);
  for (const a of screen.getAllByRole("link")) {
    expect(ids.has(a.getAttribute("href") ?? "")).toBe(true);
  }
});
```

- [ ] **Step 3: Run, verify fail; then implement** the nav/ID alignment across `TopBar.tsx`, `Profile.tsx` (add `id` to section wrappers), and `data/portfolio.ts`.

Run: `npm run test -- TopBar`

- [ ] **Step 4: Footer real links.** Change `lib/types.ts` `FooterData` so links carry an href:

```ts
export interface FooterLink { label: string; href: string; }
export interface FooterData { cols: { h: string; links: FooterLink[] }[]; social: { icon: IconName; href: string }[]; }
```

Update `data/portfolio.ts` footer entries with real URLs (or in-page anchors), and `Footer.tsx` to render `l.href` / `s.href` instead of `"#"`. Add a `Footer.test.tsx` assertion that no rendered anchor has `href="#"`.

- [ ] **Step 5: Real social hrefs.** In `data/portfolio.ts` `social[]`, replace `https://github.com/`, `https://linkedin.com/`, Discord `#` with real profile URLs (or `_TODO_OWNER` with a real-looking shape the owner fills).

- [ ] **Step 6: Run full tests + lint**

Run: `npm run test && npm run lint`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add data/portfolio.ts lib/types.ts components/steam/TopBar.tsx components/steam/Footer.tsx components/Profile.tsx components/steam/*.test.tsx
git commit -m "fix(nav,footer): real anchors + links, remove dead href=#"
```

---

## Task 5: Remove or neutralize decorative non-functional chrome (C4 part 2)

"Edit profile," "Trade Offer," the `+11` artwork control, "Subscribe to thread," and the fake comment box look interactive but do nothing — cognitive noise that crowds out real CTAs.

**Files:**
- Modify: `components/steam/ProfileHeader.tsx` (`.ph-trade`, `.ph-edit`)
- Modify: `components/steam/AboutMe.tsx` (`.about-side .trade`)
- Modify: `components/steam/ArtworkShowcase.tsx` (`.art-more`)
- Modify: `components/steam/Testimonials.tsx` (subscribe affordance)
- Test: affected component tests

- [ ] **Step 1: Decide per element** (keep-as-flavor vs. make-real vs. remove):
  - `.ph-edit` "Edit profile" → **remove** (no edit exists).
  - `.ph-trade` / `.about-side .trade` "Trade Offer" → **repurpose into a real CTA**: make it a link to `#contact` / `mailto:` labelled e.g. "Hire me" / "Get in touch", keeping the Steam visual styling.
  - `.art-more` `+11` → either **wire a lightbox** (defer to Phase 3 P2) or set the count to the real number of artworks and link to a real gallery section; if neither, **remove**.
  - Testimonials "Subscribe to thread" → **remove**; keep the comment box only if you want live demo interactivity, otherwise relabel as "Leave a note" so it's honest about being a playful local-only feature.

- [ ] **Step 2: Write failing test** — e.g. ProfileHeader no longer renders "Edit profile" and renders a real contact CTA.

```tsx
test("header shows a real contact CTA, not fake Edit profile", () => {
  render(<ProfileHeader data={data} />);
  expect(screen.queryByText("Edit profile")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /hire me|get in touch/i })).toHaveAttribute("href");
});
```

- [ ] **Step 3: Run, verify fail; implement** the edits above.

- [ ] **Step 4: Run tests + lint**

Run: `npm run test && npm run lint`

- [ ] **Step 5: Manual verification** — `npm run dev`, confirm no element looks clickable-but-dead.

- [ ] **Step 6: Commit**

```bash
git add components/steam/ProfileHeader.tsx components/steam/AboutMe.tsx components/steam/ArtworkShowcase.tsx components/steam/Testimonials.tsx components/steam/*.test.tsx
git commit -m "ux: remove decorative dead chrome; convert Trade Offer into real contact CTA"
```

**Phase 1 exit check:** `npm run build && npm run test && npm run lint` all green; manual pass shows no empty black hero, no "0" stats, no fabricated proof, no dead links/controls. Site is now shippable.

---

# PHASE 2 — ⭐ IMPORTANT (craft)

## Task 6: Establish one typographic display moment + lift hierarchy (I1)

**Files:**
- Modify: `app/globals.css`
- Optional modify: `app/layout.tsx` (only if adding a new display family)
- Modify: `components/steam/ProfileHeader.tsx` or a new hero line

- [ ] **Step 1:** Add a display tier. Reuse JetBrains Mono (already loaded) or add one display family via `next/font` in `layout.tsx` exposed as `--font-display`. In `globals.css`:

```css
:root { --font-display: var(--font-jetbrains), ui-monospace, monospace; }
.hero-statement {
  font-family: var(--font-display);
  font-size: clamp(40px, 7vw, 92px);
  line-height: 0.98; letter-spacing: -0.02em; font-weight: 700;
  color: var(--bright);
}
```

- [ ] **Step 2:** Add one statement headline near the top (e.g. a single positioning line under/over the profile header — "I build for the web." or your real one-liner). Keep it to one line; this is the page's only display-scale moment.

- [ ] **Step 3:** Raise section-label contrast so hierarchy has peaks. In `globals.css` change `.sec-label` from `color: var(--muted)` to `color: #c7d5e0; font-weight: 600;` and keep the trailing `.n` muted.

- [ ] **Step 4: Manual verification** — `npm run dev`; confirm there's now a clear focal point and section labels read above body text. Check mobile clamp doesn't overflow.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx components/steam/ProfileHeader.tsx
git commit -m "design(type): add display statement headline + lift section hierarchy"
```

---

## Task 7: Spotlight the featured project (I2)

**Files:**
- Modify: `components/steam/FeaturedProject.tsx`
- Modify: `app/globals.css` (`.fav-*`)
- Create: `components/primitives/MagneticButton.tsx`

- [ ] **Step 1: Create `MagneticButton.tsx`** — a client wrapper translating its child toward the cursor, disabled under `motion-off`/reduced-motion:

```tsx
"use client";
import { useRef } from "react";
export function MagneticButton({ href, className, children }:
  { href: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    if (document.body.classList.contains("motion-off")) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.3;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <a ref={ref} href={href} target="_blank" rel="noreferrer"
       className={className} onMouseMove={onMove} onMouseLeave={reset}
       style={{ transition: "transform .2s cubic-bezier(.2,.8,.2,1)" }}>
      {children}
    </a>
  );
}
```

- [ ] **Step 2:** Use `MagneticButton` for `.btn-live` / `.btn-code` in `FeaturedProject.tsx`.

- [ ] **Step 3:** Add hover depth on the capsule + staggered stat reveal in `globals.css`:

```css
.fav-av { transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
.fav-group:hover .fav-av { transform: scale(1.04); box-shadow: 0 12px 40px rgba(0,0,0,.6); }
.fav-stats > * { opacity: 0; transform: translateY(8px); animation: statIn .5s forwards; }
.fav-stats > *:nth-child(1){animation-delay:.05s} .fav-stats > *:nth-child(2){animation-delay:.11s}
.fav-stats > *:nth-child(3){animation-delay:.17s} .fav-stats > *:nth-child(4){animation-delay:.23s}
@keyframes statIn { to { opacity:1; transform:none; } }
body.motion-off .fav-stats > * { opacity:1; transform:none; animation:none; }
```

- [ ] **Step 4: Add a test** for `MagneticButton` (renders an anchor with the href; no throw on mouse events in jsdom).

- [ ] **Step 5: Run tests + lint + manual hover check**

Run: `npm run test && npm run lint`

- [ ] **Step 6: Commit**

```bash
git add components/primitives/MagneticButton.tsx components/primitives/MagneticButton.test.tsx components/steam/FeaturedProject.tsx app/globals.css
git commit -m "design(featured): spotlight capsule hover, staggered stats, magnetic CTAs"
```

---

## Task 8: Animate the recruiter-mode transition (I3)

The smartest feature currently swaps via hard cut. Use the View Transitions API with graceful fallback.

**Files:**
- Modify: `components/ModeProvider.tsx`
- Modify: `app/globals.css` (view-transition keyframes)

- [ ] **Step 1:** Wrap the setter in `startViewTransition` when available and motion is on:

```tsx
const setRecruiterAnimated = (v: boolean) => {
  const reduce = document.body.classList.contains("motion-off")
    || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (reduce || !doc.startViewTransition) { setRecruiter(v); return; }
  doc.startViewTransition(() => { setRecruiter(v); });
};
```

Expose `setRecruiterAnimated` (or replace `setRecruiter` in the context value) so `RecruiterToggle` uses it.

- [ ] **Step 2:** Add transition styling in `globals.css`:

```css
::view-transition-old(root), ::view-transition-new(root) { animation-duration: .42s; }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}
```

- [ ] **Step 3:** Update `ModeProvider.test.tsx` — assert the toggle still flips state (the test runs in jsdom where `startViewTransition` is undefined, exercising the fallback path).

- [ ] **Step 4: Run tests + manual check** in a Chromium browser (View Transitions supported).

Run: `npm run test -- ModeProvider`

- [ ] **Step 5: Commit**

```bash
git add components/ModeProvider.tsx components/ModeProvider.test.tsx app/globals.css
git commit -m "feat(recruiter): animate profile<->resume swap via View Transitions with fallback"
```

---

## Task 9: SHOOTS wordmark + scroll-synced nav (I4)

**Files:**
- Modify: `components/steam/TopBar.tsx`
- Modify: `app/globals.css` (`.topbar`, `.brand`)
- Test: `components/steam/TopBar.test.tsx`

- [ ] **Step 1:** Add a brand to the left of `.nav-main` in `TopBar.tsx`:

```tsx
<div className="top-main">
  <a href="#top" className="brand">{data.profile.brand}</a>
  <nav className="nav-main">{/* ...links... */}</nav>
</div>
```

with `.brand { font-weight: 800; letter-spacing: .04em; color: var(--bright); margin-right: 8px; }` in CSS. This fills the empty left half of the header.

- [ ] **Step 2: Scroll-sync active state.** Convert `TopBar` to a client component using IntersectionObserver over the section IDs; set `active` on the link whose section is in view, replacing the hardcoded `i === 2`.

```tsx
"use client";
// observe ["projects","activity","testimonials","contact"]; track active id in state;
// className={href === `#${activeId}` ? "active" : ""}
```

- [ ] **Step 3: Update test** — assert no permanently-hardcoded active index; with no scroll, a sensible default (first/`top`) is active.

- [ ] **Step 4: Run tests + lint + manual scroll check**

Run: `npm run test -- TopBar && npm run lint`

- [ ] **Step 5: Commit**

```bash
git add components/steam/TopBar.tsx app/globals.css components/steam/TopBar.test.tsx
git commit -m "feat(topbar): SHOOTS wordmark + scroll-synced active nav"
```

---

# PHASE 3 — 💎 PREMIUM POLISH (delight)

## Task 10: Pause the Starfield off-viewport / hidden tab + mobile star count (P4, Performance)

**Files:**
- Modify: `components/steam/Starfield.tsx`
- Test: `components/steam/Starfield.test.tsx`

- [ ] **Step 1:** In the RAF loop, bail when the tab is hidden; resume on `visibilitychange`. Lower `N` on small screens.

```tsx
const N = window.innerWidth < 720 ? 90 : 150;
function draw() {
  if (!run || !ctx) return;
  if (document.hidden) { raf = requestAnimationFrame(draw); return; } // skip paint when hidden
  /* ...existing draw... */
}
```

Add an IntersectionObserver on the canvas (or `.bg-stage`) to set `run = false` when fully scrolled past and `run = true` (and re-kick `draw`) when back.

- [ ] **Step 2: Test** — assert the effect cleans up (`cancelAnimationFrame`) on unmount and does not throw when `document.hidden` is true (mock it). Extend existing `Starfield.test.tsx`.

- [ ] **Step 3: Run tests**

Run: `npm run test -- Starfield`

- [ ] **Step 4: Commit**

```bash
git add components/steam/Starfield.tsx components/steam/Starfield.test.tsx
git commit -m "perf(starfield): pause when hidden/off-viewport, fewer stars on mobile"
```

---

## Task 11: Animated level-up on the profile badge (P3)

**Files:**
- Modify: `components/steam/ProfileHeader.tsx`
- Modify: `app/globals.css` (`.lvl-badge`)

- [ ] **Step 1:** Reuse the `StatNum` count-up for the `.lvl-badge` value so the level animates from 1 → `p.level` on first view, with a brief `box-shadow` pulse on completion. Add a `title`/tooltip explaining the metric (e.g. "Level = years coding" or your real mapping) so it reads as intentional, not a low number.

```tsx
<span className="lvl-badge" title="Level = years building for the web">
  <StatNum value={p.level} />
</span>
```

- [ ] **Step 2:** Add pulse styling in `globals.css`:

```css
.lvl-badge { transition: box-shadow .4s; }
.lvl-badge.pulse { box-shadow: 0 0 0 2px #14171b, 0 0 26px rgba(102,192,244,.55); }
body.motion-off .lvl-badge { /* StatNum already snaps under motion-off */ }
```

(Add the `pulse` class on count-up completion, or a CSS animation that runs once.)

- [ ] **Step 3: Manual verification** — `npm run dev`; level counts up + pulses once; reduced-motion snaps to final value.

- [ ] **Step 4: Commit**

```bash
git add components/steam/ProfileHeader.tsx app/globals.css
git commit -m "feat(level): animated level-up with explanatory tooltip"
```

---

## Task 12: Parallax + hover depth on the artwork showcase (P2)

**Files:**
- Modify: `components/steam/ArtworkShowcase.tsx`
- Modify: `app/globals.css` (`.art-frame`, `.art-frames`)

- [ ] **Step 1:** Make `ArtworkShowcase` a client component; on `mousemove` over `.art-frames`, translate each `.art-frame > .inner` by a per-panel factor (e.g. panels move `±8/±14/±20px`) for depth. Disable under `motion-off`/reduced-motion.

- [ ] **Step 2:** Add hover lift on each frame in CSS:

```css
.art-frame { transition: transform .4s cubic-bezier(.2,.8,.2,1), filter .4s; }
.art-frame:hover { transform: skewX(-6deg) scale(1.03); filter: brightness(1.08); z-index: 2; }
body.motion-off .art-frame { transition: none; }
```

(Keep the base `skewX(-6deg)` from existing CSS; compose, don't overwrite.)

- [ ] **Step 3: Manual verification** — parallax follows cursor; reduced-motion is static; no layout shift / overflow.

- [ ] **Step 4: Commit**

```bash
git add components/steam/ArtworkShowcase.tsx app/globals.css
git commit -m "design(artwork): mouse parallax + hover depth on showcase frames"
```

---

## Task 13: Achievement-unlock toasts on scroll milestones (P5, signature touch)

**Files:**
- Create: `components/primitives/AchievementToast.tsx`
- Modify: `components/Profile.tsx` (mount toast host)
- Modify: `app/globals.css` (toast styles)
- Test: `components/primitives/AchievementToast.test.tsx`

- [ ] **Step 1:** Build a client toast host that fires a Steam-style "Achievement Unlocked" popup when the user first reaches key sections (Featured project, Recent activity, Testimonials). Use IntersectionObserver; each achievement fires once; respect `motion-off` (render nothing or instant, no slide).

```tsx
"use client";
// props: milestones: { id: string; title: string; icon: string }[]
// observe each #id; on first intersect, push a toast that slides in bottom-right,
// auto-dismisses after ~3.5s; queue if multiple.
```

- [ ] **Step 2:** Steam-style CSS — dark panel, blue left accent, mono title, slide-in from bottom-right:

```css
.ach-toast { position: fixed; right: 18px; bottom: 18px; z-index: 60;
  background: var(--header-2); border: 1px solid #000; box-shadow: 0 8px 30px rgba(0,0,0,.6);
  display: flex; gap: 10px; padding: 10px 14px; transform: translateY(140%); transition: transform .4s cubic-bezier(.2,.8,.2,1); }
.ach-toast.in { transform: none; }
.ach-toast .at { font-family: var(--font-mono); color: var(--link); font-size: 12px; letter-spacing: .08em; }
body.motion-off .ach-toast { transition: none; }
```

- [ ] **Step 3:** Mount `<AchievementToast milestones={...} />` in `Profile.tsx` (non-recruiter branch only).

- [ ] **Step 4: Test** — host renders nothing initially; a simulated intersection adds an `.in` toast; reduced-motion path doesn't throw.

- [ ] **Step 5: Run tests + lint + manual scroll check**

Run: `npm run test -- AchievementToast && npm run lint`

- [ ] **Step 6: Commit**

```bash
git add components/primitives/AchievementToast.tsx components/primitives/AchievementToast.test.tsx components/Profile.tsx app/globals.css
git commit -m "feat(toast): Steam-style achievement-unlock toasts on scroll milestones"
```

---

## Task 14: Custom cursor keyed to accent (P1, optional capstone)

**Files:**
- Create: `components/primitives/Cursor.tsx`
- Modify: `app/globals.css`
- Modify: `components/Profile.tsx`

- [ ] **Step 1:** Build a client cursor (a small accent ring following the pointer with lerp/spring), enlarging over interactive elements. Pointer-events none; hidden on touch devices and under `motion-off`/reduced-motion (fall back to native cursor). Keep native cursor visible too for usability — this is an *additive* flourish, not a replacement that hides the system cursor.

- [ ] **Step 2:** Mount in the non-recruiter branch of `Profile.tsx`; add styles in `globals.css`.

- [ ] **Step 3: Test** — mounts without throwing in jsdom; renders null on touch (mock `matchMedia`/`ontouchstart`).

- [ ] **Step 4: Manual verification** — desktop only; confirm it doesn't harm usability and is absent on touch/reduced-motion.

- [ ] **Step 5: Commit**

```bash
git add components/primitives/Cursor.tsx components/primitives/Cursor.test.tsx components/Profile.tsx app/globals.css
git commit -m "feat(cursor): additive accent cursor on desktop, disabled on touch/reduced-motion"
```

---

# Final Verification (after any phase)

- [ ] `npm run build` — clean production build.
- [ ] `npm run test` — all suites green.
- [ ] `npm run lint` — no errors.
- [ ] Manual pass at desktop + mobile widths: no empty hero, no "0" stats, no fabricated proof, no dead links/controls, reduced-motion (`prefers-reduced-motion` + `motion-off` body class) disables all new motion.
- [ ] Recruiter mode (`?recruiter=1`) and print styles still correct.

**Score trajectory (from review baseline):** Phase 1 lifts Content 3→6, Usability 5→7, Design 6→7 (overall ~5.4 → ~7, Honorable-Mention-credible). Phases 2–3 add Design/Creativity/Performance craft to push toward Site-of-the-Day territory while preserving the concept's head start.

---

## Self-Review Notes

- **Spec coverage:** every item from the chat review's prioritized list maps to a task — C1→T1, C2→T2, C3→T3, C4→T4+T5, I1→T6, I2→T7, I3→T8, I4→T9, P4→T10, P3→T11, P2→T12, P5→T13, P1→T14.
- **Owner gaps:** real assets (T1), real GitHub env (T2), and truthful copy/URLs (T3/T4) require owner-supplied data; these are marked `_TODO_OWNER` rather than fabricated, which is the whole point of Phase 1.
- **Motion safety:** every new animation has a `motion-off` / `prefers-reduced-motion` escape, consistent with existing `StatNum`/`Prog`/`Reveal` patterns.
- **Type consistency:** `FooterLink`/`FooterData` reshape in T4 is the only type change; `Footer.tsx` and `data/portfolio.ts` are updated in the same task.
