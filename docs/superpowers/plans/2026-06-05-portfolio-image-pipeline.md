# Portfolio Image Pipeline & Project Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trim the portfolio to 1–2 real projects, add an in-code "navy Steam" theme layer over screenshots, and ship a deterministic screenshot pipeline — so every image slot looks intentional and on-theme.

**Architecture:** Raw screenshots live in `/public/images`; the theme treatment (scrim + accent border + vignette) is applied in `app/globals.css` via pseudo-elements, not baked into the images. `data/portfolio.ts` references a real asset path **or** an empty string (which renders the existing `Frame` placeholder). A Playwright script regenerates screenshots at exact slot dimensions.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4 + bespoke CSS, Vitest, Playwright.

---

## File Structure

- `data/portfolio.ts` — trim to real content; unavailable images become `""`. **Modify.**
- `data/portfolio.test.ts` — add trim assertions. **Modify.**
- `data/assets.test.ts` — guard: every non-empty image path exists in `/public`. **Create.**
- `app/globals.css` — theme overlay pseudo-elements on `.game-cap`, `.fav-av`, `.art-frame .inner`. **Modify.**
- `app/theme-overlay.test.ts` — tripwire that the overlay selectors exist. **Create.**
- `scripts/shots.mjs` — Playwright screenshot harness. **Create.**
- `package.json` — add `playwright` dev dep + `shots` script. **Modify.**
- `README.md` — refresh owner checklist with the size table + empty-string convention. **Modify.**

**Image-slot reference (display px → master to export):** avatar 1:1 → 512×512 · art-1/2/3 portrait 3:5 → 900×1500 (subject centered) · favg 1:1 → 256×256 · act1/act2 **8:3** → 736×276 · grp1/grp2 1:1 → 128×128 · cm* 1:1 → 128×128. All slots use `object-fit: cover`; `next/image` handles delivery format/sizing, so PNG masters are fine.

---

## Task 1: Trim project data to real, honest content

**Files:**
- Modify: `data/portfolio.ts`
- Test: `data/portfolio.test.ts`

- [ ] **Step 1: Add the failing trim test**

Append inside the `describe("portfolio data", …)` block in `data/portfolio.test.ts`:

```ts
  it("is trimmed to real projects (no prototype fillers)", () => {
    const names = portfolio.projects.map((p) => p.name.toLowerCase());
    expect(names.some((n) => n.includes("tabflow"))).toBe(false);
    expect(names.some((n) => n.includes("forge"))).toBe(false);
  });
  it("project count metric matches the real project list", () => {
    const projectsCount = portfolio.counts.find((c) => c.label === "Projects");
    expect(projectsCount?.n).toBe(portfolio.projects.length);
  });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run data/portfolio.test.ts`
Expected: FAIL — current data still has `tabflow`/`forge` and `Projects` count `12` ≠ `projects.length` (3).

- [ ] **Step 3: Edit `data/portfolio.ts` — counts (drop Creations, honest numbers)**

Replace the `counts` array with:

```ts
  counts: [
    { label: "Projects", n: 1 },        // _TODO_OWNER: keep equal to projects.length
    { label: "Screenshots", n: 3 },     // _TODO_OWNER: real screenshot count
    { label: "Repositories", n: null }, // filled live (Task 29)
    { label: "Reviews", n: 2 },         // _TODO_OWNER: real testimonial count
  ],
```

- [ ] **Step 4: Edit `data/portfolio.ts` — empty unavailable images + trim projects**

Apply these replacements:

```ts
  communities: [
    { name: "Indie Hackers", members: "22,475 members", image: "" }, // _TODO_OWNER: drop /public/images/grp1.png then set path
    { name: "React", members: "411,137 members", image: "" },         // _TODO_OWNER: grp2.png
  ],
```

```ts
  bigStats: [
    { key: "projects", value: 1, label: "Projects shipped" }, // _TODO_OWNER: match projects.length
    { key: "repos", value: 0, label: "Repositories" },   // live
    { key: "commits", value: 0, label: "Total commits" }, // live
  ],
```

```ts
  featuredProject: {
    name: "Nebula Analytics", type: "Flagship project", image: "", // _TODO_OWNER: drop favg.png (256×256) then set "/images/favg.png"
    desc: "Real-time product analytics for indie SaaS teams — event pipelines, cohort funnels and AI-assisted insights.",
    stats: [
      { value: "3,412", key: "Users", cls: "members" },
      { value: "128", key: "Live now", cls: "ingame" },
      { value: "99.98%", key: "Uptime", cls: "online" },
      { value: "180ms", key: "p95", cls: "chat" },
    ],
    live: "#", code: "#",
  },
  projects: [
    { name: "Nebula Analytics", image: "", meta: "2,306 hrs total", last: "last updated June 3", // _TODO_OWNER: set "/images/act1.png" (736×276, 8:3)
      milestones: { done: 1, total: 1 }, achievement: { icon: "trophy", name: "First SaaS Launch", xp: "500 XP" } },
  ],
  testimonials: [
    { name: "maya.okafor", date: "Jul 20, 2024", text: "+rep shipped our MVP in 5 weeks, scaled great", image: "" }, // _TODO_OWNER: cm avatar 128×128
    { name: "liam.petrov", date: "Feb 21, 2024", text: "+rep clean comms, zero drama", image: "" },
  ],
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run data/portfolio.test.ts`
Expected: PASS (5 original + 2 new assertions).

- [ ] **Step 6: Commit**

```bash
git add data/portfolio.ts data/portfolio.test.ts
git commit -m "content: trim portfolio to real projects, honest counts, empty image slots"
```

---

## Task 2: Asset-existence guard test

Enforces the rule: a `data/portfolio.ts` image is **either** an existing file **or** `""`. Prevents shipping broken `<img>` paths as the owner fills slots.

**Files:**
- Create: `data/assets.test.ts`

- [ ] **Step 1: Write the test**

Create `data/assets.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { portfolio } from "@/data/portfolio";

function referencedImages(): string[] {
  const out: string[] = [];
  const push = (s?: string) => { if (s && s.startsWith("/")) out.push(s); };
  portfolio.communities.forEach((c) => push(c.image));
  push(portfolio.featuredProject.image);
  portfolio.projects.forEach((p) => push(p.image));
  portfolio.testimonials.forEach((t) => push(t.image));
  return out;
}

describe("portfolio image assets", () => {
  it("every non-empty image path resolves to a file in /public", () => {
    for (const rel of referencedImages()) {
      const abs = join(process.cwd(), "public", rel);
      expect(existsSync(abs), `missing asset: ${rel} (set to "" until the file exists)`).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it passes**

Run: `npx vitest run data/assets.test.ts`
Expected: PASS — after Task 1 all data image paths are `""`, so the check is vacuously true. It turns meaningful the moment the owner sets a real path.

- [ ] **Step 3: Commit**

```bash
git add data/assets.test.ts
git commit -m "test: guard that referenced portfolio images exist in /public"
```

---

## Task 3: In-code "navy Steam" theme overlay

Applies scrim + accent border + vignette over the image slots via CSS pseudo-elements. No JSX change — the overlays sit above `next/image` inside the existing containers. Accent is the single `--link` blue (`#66c0f4`).

**Files:**
- Modify: `app/globals.css`
- Test: `app/theme-overlay.test.ts`

- [ ] **Step 1: Write the tripwire test**

Create `app/theme-overlay.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

describe("theme overlay CSS", () => {
  it("themes the project capsule", () => expect(css).toContain(".game-cap::after"));
  it("themes the featured logo", () => expect(css).toContain(".fav-av::after"));
  it("themes the artwork frames", () => expect(css).toContain(".art-frame .inner::after"));
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run app/theme-overlay.test.ts`
Expected: FAIL — selectors do not exist yet.

- [ ] **Step 3: Append the overlay layer to `app/globals.css`**

Add at the end of the file:

```css
/* ---------------- THEME OVERLAY (in-code grade) ---------------- */
.game-cap, .fav-av { position: relative; }

.game-cap::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(8,13,20,.55), rgba(8,13,20,0) 60%);
  box-shadow: inset 0 0 0 1px rgba(102,192,244,.22), inset 0 0 24px rgba(0,0,0,.5);
}

.fav-av::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(102,192,244,.22);
}

.art-frame .inner { position: relative; }
.art-frame .inner::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to top, rgba(8,13,20,.45), rgba(8,13,20,0) 55%),
    radial-gradient(120% 80% at 50% 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%);
}

/* Optional: harmonize a mismatched (light) screenshot. Add class on the slot's container. */
.shot-duo .frame img { filter: saturate(.9) contrast(1.05); }
```

- [ ] **Step 4: Run tests + build to verify**

Run: `npx vitest run app/theme-overlay.test.ts`
Expected: PASS.
Run: `npm run build`
Expected: build succeeds (valid CSS, no type errors).

- [ ] **Step 5: Visual check (manual)**

Run: `npm run dev` → open `http://localhost:3000`. Confirm: capsule + artwork frames carry a subtle bottom-up navy scrim and a thin blue inner border; placeholders (empty slots) still read as intentional. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/theme-overlay.test.ts
git commit -m "style: in-code navy theme overlay on capsules, artwork, featured logo"
```

---

## Task 4: Deterministic screenshot pipeline (Playwright)

A repeatable harness that captures each slot at its exact master size. The owner edits `SHOTS` with their app URLs/screens and runs `npm run shots`.

**Files:**
- Create: `scripts/shots.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add Playwright**

Run:
```bash
npm i -D playwright
npx playwright install chromium
```
Expected: `playwright` appears under `devDependencies`; Chromium downloads.

- [ ] **Step 2: Add the `shots` script to `package.json`**

In the `scripts` block add:

```json
    "shots": "node scripts/shots.mjs"
```

- [ ] **Step 3: Create `scripts/shots.mjs`**

```js
// Deterministic, exact-size screenshots for the portfolio image slots.
// Edit SHOTS with your running app's URLs (and optional CSS selector to clip to),
// then: npm run shots   (override base with SHOTS_BASE=https://your-app node scripts/shots.mjs)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.SHOTS_BASE ?? "http://localhost:3000";
const OUT = "public/images";

// w/h are the exact output master sizes (see plan size table). Keep the ratios.
const SHOTS = [
  { name: "act1.png",   path: "/",        w: 736, h: 276 },  // capsule 8:3
  { name: "favg.png",   path: "/",        w: 256, h: 256 },  // featured logo 1:1
  { name: "art-1.png",  path: "/",        w: 900, h: 1500 }, // portrait 3:5
  { name: "art-2.png",  path: "/",        w: 900, h: 1500 },
  { name: "art-3.png",  path: "/",        w: 900, h: 1500 },
  { name: "avatar.png", path: "/",        w: 512, h: 512 },  // 1:1
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const s of SHOTS) {
    const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
    await page.goto(BASE + s.path, { waitUntil: "networkidle" });
    await page.screenshot({ path: join(OUT, s.name), clip: { x: 0, y: 0, width: s.w, height: s.h } });
    await page.close();
    console.log(`captured ${s.name} (${s.w}x${s.h})`);
  }
} finally {
  await browser.close();
}
```

- [ ] **Step 4: Smoke-verify the harness against a public URL**

Run:
```bash
node -e "import('./scripts/shots.mjs')" || true
SHOTS_BASE=https://example.com npm run shots
```
Expected: console logs `captured act1.png …` etc.; PNG files appear in `public/images`. (These are throwaway example.com captures proving the harness works.)

- [ ] **Step 5: Remove the throwaway smoke captures**

Run:
```bash
git checkout -- public/images 2>/dev/null || true
rm -f public/images/act1.png public/images/favg.png public/images/art-1.png public/images/art-2.png public/images/art-3.png public/images/avatar.png
```
Expected: no smoke PNGs are committed. (Real captures land later when the owner runs `npm run shots` against their own apps and then sets the paths in `data/portfolio.ts`.)

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts/shots.mjs
git commit -m "tooling: Playwright screenshot harness for exact-size slot captures"
```

---

## Task 5: Refresh the owner checklist

Document the size table, the empty-string convention, and the `npm run shots` workflow so the owner can fill slots without re-reading the spec.

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the image paragraph in `README.md`**

Find the block under "Drop real images into **`public/images/`**…" and replace it with:

```markdown
### Images

Each slot uses `object-fit: cover`; export a master ~3–4× the display size and **keep the ratio** (`next/image` handles delivery format/sizing). Until a file exists, leave the data field `""` — the `Frame` shows a themed placeholder, never a broken image.

| Slot | File | Ratio | Master px |
|---|---|---|---|
| Avatar | `avatar.png` | 1:1 | 512×512 |
| Artwork ×3 | `art-1/2/3.png` | portrait 3:5 | 900×1500 (center the subject — frames are skewed & cropped) |
| Featured logo | `favg.png` | 1:1 | 256×256 |
| Project capsule | `act1.png`, `act2.png` | 8:3 | 736×276 |
| Community logo | `grp1/grp2.png` | 1:1 | 128×128 |
| Testimonial avatar | `cm*.png` | 1:1 | 128×128 |

Capture reproducibly with **`npm run shots`** (edit `scripts/shots.mjs` `SHOTS` with your app URLs/screens). Screenshot your apps already in a dark theme near the palette (`#0c0d10` / `#1b2838`, accent `#66c0f4`) so they sit natively in-theme; the in-code overlay adds the scrim + accent border. After dropping a file, set its path in `data/portfolio.ts`.
```

- [ ] **Step 2: Verify the asset test still passes**

Run: `npm test`
Expected: PASS (full suite).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: owner image checklist — size table, empty-slot convention, npm run shots"
```

---

## Self-Review

**Spec coverage:**
- §2 approach (capture → grade in code) → Tasks 3 (CSS grade) + 4 (capture script). ✔
- §3 size sheet → file-structure reference + Task 5 README table + Task 4 `SHOTS` dims. ✔
- §4 capture recipe (DPR 2, deterministic, ratios) → Task 4 script. ✔
- §5 theme treatment (scrim/border/vignette/duotone/single accent) → Task 3 CSS. ✔
- §6 content trim (1–2 projects, honest counts, real-or-empty images) → Tasks 1 + 2. ✔
- §8 acceptance (paths resolve or empty; build+tests pass; script regenerates) → Tasks 2, 3.4, 4. ✔

**Placeholders:** none — every step has concrete code/commands. `_TODO_OWNER` markers are intentional owner hooks, not plan gaps.

**Type consistency:** `referencedImages()` reads `image` fields matching `Community`/`FeaturedProject`/`Project`/`Testimonial` in `lib/types.ts`. `counts` entries keep `CountRow` shape (`n: number | null`). CSS selectors in Task 3 match the tripwire test in the same task. ✔

**Note on the artwork showcase & avatar:** `art-1/2/3` and `avatar` are hardcoded in `ArtworkShowcase.tsx` / `ProfileHeader.tsx` (not data-driven), so they degrade to `Frame` placeholders until the owner drops the files. Left as-is to avoid scope creep; documented in Task 5.
