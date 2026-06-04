# Steam-Profile Developer Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `axelstz.fr` — a pixel-faithful Steam community-profile portfolio for "SHOOTS" / Axel.S, with live GitHub data and a one-click Recruiter Mode, in Next.js + TypeScript + Tailwind on Vercel.

**Architecture:** Next.js App Router. A server component (`app/page.tsx`) fetches GitHub data (cached via ISR) and merges it with hand-authored content from `data/portfolio.ts`, then renders either the Steam `<Profile>` or the clean `<ResumeView>` based on Recruiter Mode. The bespoke Steam look is ported verbatim from the approved prototype CSS (`design-reference/styles.css` + `design-reference/components.css`) into a global stylesheet; Tailwind handles incidental layout. CSS custom properties drive theming (accent, motion), powering both the Tweaks panel and Recruiter Mode.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, `next/font`, Vitest + React Testing Library + jsdom (unit/component tests), Vercel.

**Reference material (in repo):** `design-reference/` holds the original prototype — `styles.css`, `components.css`, the `comp-*.jsx` components, `portfolio-data.js`, `portfolio-lib.jsx`, `portfolio-app.jsx`, `Icons` data, and `screenshots/*.png`. Treat these as the source of truth for pixel values, class names, and markup structure. Convert the React-UMD/Babel prototype into idiomatic TSX; **do not** copy its `image-slot.js` drag-drop machinery or the top micro-bar.

**Spec:** `docs/superpowers/specs/2026-06-04-steam-profile-portfolio-design.md`

**Testing philosophy:** TDD with full rigor on pure logic (GitHub fetcher, mode/tweaks state, count-up, data integrity). For presentational components, write a render/smoke test first (renders without crashing, key data/text present, structural assertions like "no Install-App micro-bar", "level shows age"), then implement. Every task ends with a commit.

---

## File Structure

```
package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs,
vitest.config.ts, vitest.setup.ts, .env.example, .eslintrc.json
app/
  layout.tsx              # <html>, fonts, metadata (metadataBase axelstz.fr), imports globals.css
  page.tsx                # server: fetch GitHub + portfolio data, render Profile or ResumeView
  globals.css             # @tailwind directives + ported Steam base (styles.css) + components.css
  not-found.tsx           # simple themed 404
components/
  Profile.tsx             # assembles the Steam profile (client wrapper holding providers)
  ModeProvider.tsx        # context: recruiter mode + tweaks; localStorage + ?recruiter param
  steam/
    TopBar.tsx ProfileHeader.tsx ArtworkShowcase.tsx Sidebar.tsx
    FeaturedStack.tsx BigStats.tsx AboutMe.tsx FeaturedProject.tsx
    RecentActivity.tsx Testimonials.tsx Footer.tsx Starfield.tsx
  primitives/
    Icon.tsx Reveal.tsx StatNum.tsx Prog.tsx Frame.tsx
  recruiter/
    RecruiterToggle.tsx ResumeView.tsx
  tweaks/
    TweaksPanel.tsx
lib/
  types.ts                # PortfolioData + GitHubStats types
  github.ts               # GitHub fetcher (server-only)
  icons.ts                # icon path map (ported from prototype Icons)
data/
  portfolio.ts            # hand-authored content (typed)
public/
  images/...              # avatar, artwork, project shots (placeholders to start)
  cv/Axel-S-CV.pdf        # placeholder CV
test/ (colocated *.test.ts(x) next to sources)
```

Path alias `@/*` → repo root.

---

## Phase 0 — Project setup

### Task 1: Scaffold Next.js app without clobbering existing files

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.eslintrc.json`
- Preserve: `docs/`, `design-reference/`, `.git`, `.gitignore`

The repo root already contains `docs/` and `design-reference/`, so `create-next-app .` would refuse. Scaffold into a temp dir and move the generated files in.

- [ ] **Step 1: Scaffold into a temp directory**

Run:
```bash
cd "F:/Program Files (x86)/WebDevProject/axelstz.fr"
npx create-next-app@latest .next-scaffold --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --no-turbopack --yes
```
Expected: a Next.js app generated under `.next-scaffold/`.

- [ ] **Step 2: Move generated files into the repo root (without overwriting docs/design-reference/.gitignore)**

Run:
```bash
cd "F:/Program Files (x86)/WebDevProject/axelstz.fr"
# merge .gitignore: append Next's entries we don't already have
cat .next-scaffold/.gitignore >> .gitignore
# move app code + configs up, skipping node_modules and .gitignore
for item in app public package.json package-lock.json tsconfig.json next.config.* postcss.config.* tailwind.config.* eslint.config.* .eslintrc.json next-env.d.ts; do
  [ -e ".next-scaffold/$item" ] && cp -r ".next-scaffold/$item" .
done
rm -rf .next-scaffold
npm install
```
Expected: `package.json`, `app/`, configs present at root; `node_modules/` installed.

- [ ] **Step 3: Dedupe and normalize .gitignore**

Edit `.gitignore` so it contains (no duplicates): `.superpowers/`, `node_modules/`, `.next/`, `out/`, `.env*`, `!.env.example`, `next-env.d.ts`, `.vercel`.

- [ ] **Step 4: Verify the app builds and runs**

Run: `npm run build`
Expected: build completes with no errors (default starter page).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind app"
```

---

### Task 2: Testing setup (Vitest + React Testing Library)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `test/smoke.test.ts`
- Modify: `package.json` (scripts, devDeps)

- [ ] **Step 1: Install test deps**

Run:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
  resolve: { alias: { "@": resolve(__dirname, ".") } },
});
```

- [ ] **Step 3: Write `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";

// jsdom lacks these — stub for components that use them
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error test stub
global.IntersectionObserver = IO;
window.matchMedia ||= ((q: string) => ({
  matches: false, media: q, onchange: null,
  addEventListener() {}, removeEventListener() {},
  addListener() {}, removeListener() {}, dispatchEvent() { return false; },
})) as unknown as typeof window.matchMedia;
```

- [ ] **Step 4: Add scripts to `package.json`**

Add under `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write a smoke test `test/smoke.test.ts`**

```ts
import { describe, it, expect } from "vitest";
describe("test harness", () => {
  it("runs", () => { expect(1 + 1).toBe(2); });
});
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: add Vitest + React Testing Library harness"
```

---

### Task 3: Fonts, global CSS port, and base layout

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Reference: `design-reference/styles.css`, `design-reference/components.css`

- [ ] **Step 1: Port the Steam stylesheets into `app/globals.css`**

Replace the contents of `app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== Ported Steam profile styles (see design-reference/) ===== */
/* Paste design-reference/styles.css BELOW this line, then design-reference/components.css. */
```
Then append, verbatim, the full contents of `design-reference/styles.css` followed by the full contents of `design-reference/components.css`. Apply these edits while pasting:
- Change every font-family token `'Asap'`/`'JetBrains Mono'` references to use the CSS variables `var(--font-asap)` / `var(--font-mono)` (set up in Step 2). I.e. `--font: var(--font-asap), Arial, ...;` and `--font-mono: var(--font-mono-stack)` — keep the existing fallbacks.
- Remove any rule that targets the `image-slot` custom element selector; replace with `.frame` (our image component root, Task 9). Specifically rename selectors `image-slot` → `.frame` and `.bg-stage image-slot` → `.bg-stage .frame`.
- Delete the `.top-micro`, `.top-micro *`, `.user-pill`, `.user-av` rule blocks (the cut micro-bar).

- [ ] **Step 2: Wire fonts + metadata in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Asap, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const asap = Asap({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-asap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://axelstz.fr"),
  title: "Axel.S — Junior Web Developer",
  description: "SHOOTS — a Steam-profile-inspired developer portfolio by Axel.S.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${asap.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Add a `--font-mono-stack` helper var**

In `app/globals.css`, in `:root`, ensure these exist (adjust the ported `--font` / `--font-mono` lines accordingly):
```css
--font: var(--font-asap), Arial, Helvetica, sans-serif;
--font-mono: var(--font-mono, ui-monospace, monospace);
```
(If a name clash occurs between the next/font variable and the token, rename the token to `--font-ui` and `--font-code` and update usages in the ported CSS.)

- [ ] **Step 4: Minimal page to verify styling loads**

Replace `app/page.tsx` with:
```tsx
export default function Page() {
  return (
    <main className="content" style={{ paddingTop: 40 }}>
      <h1 className="ph-name">SHOOTS — boot check</h1>
    </main>
  );
}
```

- [ ] **Step 5: Verify build + visual boot**

Run: `npm run build` (Expected: success).
Run: `npm run dev`, open `http://localhost:3000`. Expected: dark Steam background, `Asap` font, no console errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: port Steam stylesheet, wire fonts and base layout"
```

---

## Phase 1 — Types, content data, icons

### Task 4: Domain types

**Files:**
- Create: `lib/types.ts`
- Test: `lib/types.test.ts`

- [ ] **Step 1: Write a failing test that imports the types via a typed fixture**

`lib/types.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import type { PortfolioData } from "@/lib/types";

const sample: PortfolioData = {
  profile: { brand: "SHOOTS", name: "Axel.S", role: "Junior Web Developer", url: "axelstz.fr/profile", level: 19, online: true, xp: { title: "Junior Web Developer", sub: "Level 19" } },
  nav: ["PROJECTS"],
  counts: [{ label: "Projects", n: 12 }],
  badges: [{ label: "7", color: "#5a4b8a" }],
  communities: [{ name: "Indie Hackers", members: "22k", image: "/images/grp1.png" }],
  social: [{ name: "GitHub", sub: "@shoots", icon: "github", href: "https://github.com/", level: 19, color: "#3a3a3a", online: true }],
  featuredStack: [{ icon: "code" }],
  bigStats: [{ key: "projects", value: 12, label: "Projects shipped" }],
  about: { star: "Axel.S", specHead: "My stack :", specs: ["React 18 · Next.js 15"] },
  featuredProject: { name: "Nebula", type: "SaaS", image: "/images/favg.png", desc: "x", stats: [{ value: "1k", key: "Users", cls: "members" }], live: "#", code: "#" },
  projects: [{ name: "TabFlow", image: "/images/act2.png", meta: "40 hrs total", last: "June 1", milestones: { done: 41, total: 57 } }],
  testimonials: [{ name: "maya", date: "2024", text: "+rep", image: "/images/cm1.png" }],
  footer: { cols: [{ h: "Work", links: ["Featured"] }], social: ["github"] },
};

describe("PortfolioData", () => {
  it("accepts a complete sample", () => { expect(sample.profile.name).toBe("Axel.S"); });
});
```

- [ ] **Step 2: Run, verify it fails (type/module missing)**

Run: `npm test -- lib/types.test.ts`
Expected: FAIL (cannot find module `@/lib/types`).

- [ ] **Step 3: Implement `lib/types.ts`**

```ts
export type IconName = string;

export interface Profile {
  brand: string; name: string; role: string; url: string;
  level: number; online: boolean;
  xp: { title: string; sub: string };
}
export interface CountRow { label: string; n: number | null; }
export interface Badge { label: string; color: string; icon?: IconName; }
export interface Community { name: string; members: string; image: string; }
export interface Social { name: string; sub: string; icon: IconName; href: string; level: number; color: string; online: boolean; }
export interface StackItem { icon: IconName; hot?: boolean; }
export interface BigStat { key: "projects" | "repos" | "commits" | "stars" | string; value: number; label: string; }
export interface About { star: string; specHead: string; specs: string[]; }
export interface ProjectStat { value: string; key: string; cls: "members" | "ingame" | "online" | "chat"; }
export interface FeaturedProject { name: string; type: string; image: string; desc: string; stats: ProjectStat[]; live: string; code: string; }
export interface Project {
  name: string; image: string; meta: string; last: string;
  milestones?: { done: number; total: number };
  achievement?: { icon: IconName; name: string; xp: string };
}
export interface Testimonial { name: string; date: string; text: string; image: string; special?: boolean; }
export interface FooterData { cols: { h: string; links: string[] }[]; social: IconName[]; }

export interface PortfolioData {
  profile: Profile;
  nav: string[];
  counts: CountRow[];
  badges: Badge[];
  communities: Community[];
  social: Social[];
  featuredStack: StackItem[];
  bigStats: BigStat[];
  about: About;
  featuredProject: FeaturedProject;
  projects: Project[];
  testimonials: Testimonial[];
  footer: FooterData;
}

export interface GitHubStats {
  repos: number; commits: number; stars: number;
  languages: { name: string; pct: number }[];
  activity: { repo: string; type: string; when: string }[];
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- lib/types.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/types.test.ts
git commit -m "feat: add portfolio + github domain types"
```

---

### Task 5: Hand-authored content (`data/portfolio.ts`)

**Files:**
- Create: `data/portfolio.ts`
- Test: `data/portfolio.test.ts`
- Reference: `design-reference/portfolio-data.js`

Use the reference data as a starting structure, but rebrand to SHOOTS / Axel.S, set `level` to Axel's age (placeholder `19` — owner to confirm), and reshape into the `PortfolioData` types. Replace fake Steam contacts with real-style social links and mark `_TODO_OWNER` comments where Axel must supply real values.

- [ ] **Step 1: Write a failing data-integrity test**

`data/portfolio.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { portfolio } from "@/data/portfolio";

describe("portfolio data", () => {
  it("is branded SHOOTS / Axel.S", () => {
    expect(portfolio.profile.brand).toBe("SHOOTS");
    expect(portfolio.profile.name).toBe("Axel.S");
  });
  it("uses age as level and is a junior", () => {
    expect(portfolio.profile.level).toBeGreaterThan(0);
    expect(portfolio.profile.role.toLowerCase()).toContain("junior");
  });
  it("profile url points at axelstz.fr", () => {
    expect(portfolio.profile.url).toContain("axelstz.fr");
  });
  it("has at least one project and testimonial", () => {
    expect(portfolio.projects.length).toBeGreaterThan(0);
    expect(portfolio.testimonials.length).toBeGreaterThan(0);
  });
  it("has no leftover fake Steam contacts", () => {
    const names = portfolio.social.map(s => s.name.toLowerCase());
    expect(names).not.toContain("kormac");
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npm test -- data/portfolio.test.ts`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement `data/portfolio.ts`**

```ts
import type { PortfolioData } from "@/lib/types";

// _TODO_OWNER markers: replace placeholder values with real ones.
export const portfolio: PortfolioData = {
  profile: {
    brand: "SHOOTS",
    name: "Axel.S",
    role: "Junior Web Developer",
    url: "axelstz.fr/profile",
    level: 19, // _TODO_OWNER: your real age
    online: true,
    xp: { title: "Junior Web Developer", sub: "Level 19 · building on the web" },
  },
  nav: ["PROJECTS", "COMMUNITY", "PROFILE", "ACTIVITY", "SUPPORT"],
  counts: [
    { label: "Projects", n: 12 },
    { label: "Screenshots", n: 24 },
    { label: "Repositories", n: 0 }, // filled live (Task 29)
    { label: "Reviews", n: 5 },
    { label: "Creations", n: 4 },
  ],
  badges: [
    { label: "1", color: "#5a4b8a" },
    { label: "'26", color: "#7a2f5a" },
    { label: "", color: "#6a3a3a", icon: "rocket" },
  ],
  communities: [
    { name: "Indie Hackers", members: "22,475 members", image: "/images/grp1.png" }, // _TODO_OWNER
    { name: "React", members: "411,137 members", image: "/images/grp2.png" },
  ],
  social: [
    { name: "GitHub", sub: "@shoots", icon: "github", href: "https://github.com/", level: 19, color: "#3a3a3a", online: true }, // _TODO_OWNER href
    { name: "LinkedIn", sub: "Axel.S", icon: "linkedin", href: "https://linkedin.com/", level: 19, color: "#2a5a8a", online: true },
    { name: "Discord", sub: "shoots", icon: "discord", href: "#", level: 19, color: "#5a3a8a", online: false },
    { name: "Email", sub: "hello@axelstz.fr", icon: "mail", href: "mailto:hello@axelstz.fr", level: 19, color: "#7a5a2a", online: false },
  ],
  featuredStack: [
    { icon: "code" }, { icon: "layers" }, { icon: "cpu", hot: true }, { icon: "database" }, { icon: "server" },
  ],
  bigStats: [
    { key: "projects", value: 12, label: "Projects shipped" },
    { key: "repos", value: 0, label: "Repositories" },   // live
    { key: "commits", value: 0, label: "Total commits" }, // live
  ],
  about: {
    star: "Axel.S",
    specHead: "My stack :",
    specs: ["React 18 · Next.js 15", "TypeScript · Tailwind", "Supabase · PostgreSQL", "Vercel · GitHub · Claude"],
  },
  featuredProject: {
    name: "Nebula Analytics", type: "Flagship project", image: "/images/favg.png", // _TODO_OWNER
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
    { name: "Nebula Analytics", image: "/images/act1.png", meta: "2,306 hrs total", last: "last updated June 3",
      milestones: { done: 1, total: 1 }, achievement: { icon: "trophy", name: "First SaaS Launch", xp: "500 XP" } },
    { name: "TabFlow — Chrome Extension", image: "/images/act2.png", meta: "40 hrs total", last: "last updated June 1",
      milestones: { done: 41, total: 57 } },
    { name: "Forge UI — Component Kit", image: "/images/act3.png", meta: "66 hrs total", last: "last updated May 31",
      milestones: { done: 3, total: 5 } },
  ],
  testimonials: [
    { name: "maya.okafor", date: "Jul 20, 2024", text: "+rep shipped our MVP in 5 weeks, scaled great", image: "/images/cm2.png" }, // _TODO_OWNER
    { name: "liam.petrov", date: "Feb 21, 2024", text: "+rep clean comms, zero drama", image: "/images/cm4.png" },
  ],
  footer: {
    cols: [
      { h: "Portfolio", links: ["About", "Projects", "Activity", "Showcase"] },
      { h: "Work", links: ["Featured", "Open source", "Reviews"] },
      { h: "Connect", links: ["Email", "LinkedIn", "GitHub", "Discord"] },
    ],
    social: ["youtube", "bluesky", "facebook", "xtwitter"],
  },
};
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- data/portfolio.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/portfolio.ts data/portfolio.test.ts
git commit -m "feat: add hand-authored portfolio content (SHOOTS / Axel.S)"
```

---

### Task 6: Icon path map + `Icon` primitive

**Files:**
- Create: `lib/icons.ts`, `components/primitives/Icon.tsx`
- Test: `components/primitives/Icon.test.tsx`
- Reference: `design-reference/portfolio-data.js` (the `Icons` object), `design-reference/portfolio-lib.jsx` (the `Icon` component)

- [ ] **Step 1: Write the failing test**

`components/primitives/Icon.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "@/components/primitives/Icon";

describe("Icon", () => {
  it("renders an svg for a known name", () => {
    const { container } = render(<Icon name="github" />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
  });
  it("renders nothing for an unknown name", () => {
    const { container } = render(<Icon name="nope" />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npm test -- components/primitives/Icon.test.tsx`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement `lib/icons.ts`**

Port the `Icons` object verbatim from `design-reference/portfolio-data.js` (the path-data map). Export it typed:
```ts
export const ICONS: Record<string, string> = {
  // paste every key/value from design-reference/portfolio-data.js `Icons` here, e.g.:
  github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.8 0-1.5-.5-2.7-1.4-3.6.1-.4.6-1.8-.1-3.7 0 0-1.2-.4-3.9 1.4a13 13 0 0 0-7 0C5.2 1.5 4 1.9 4 1.9c-.7 1.9-.2 3.3-.1 3.7-.9.9-1.4 2.1-1.4 3.6 0 5.3 3.2 6.5 6.2 6.8-.4.4-.7 1-.8 1.7-.7.4-2.6 1-3.7-.9 0 0-.7-1.2-2-1.3",
  // ...all remaining icons...
};
```

- [ ] **Step 4: Implement `components/primitives/Icon.tsx`**

```tsx
import { ICONS } from "@/lib/icons";

export function Icon({ name, size = 18, stroke = 1.8, fill = "none", className, style }:
  { name: string; size?: number; stroke?: number; fill?: string; className?: string; style?: React.CSSProperties }) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round" style={style} aria-hidden="true">
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}
```

- [ ] **Step 5: Run test, verify pass**

Run: `npm test -- components/primitives/Icon.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/icons.ts components/primitives/Icon.tsx components/primitives/Icon.test.tsx
git commit -m "feat: add icon path map and Icon primitive"
```

---

## Phase 2 — Primitives (client)

### Task 7: `Frame` image component (replaces prototype image-slot)

**Files:**
- Create: `components/primitives/Frame.tsx`
- Test: `components/primitives/Frame.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Frame } from "@/components/primitives/Frame";

describe("Frame", () => {
  it("renders an image when src is given", () => {
    render(<Frame src="/images/x.png" alt="avatar" />);
    expect(screen.getByAltText("avatar")).toBeTruthy();
  });
  it("renders a labelled placeholder when no src", () => {
    render(<Frame placeholder="Drop avatar" />);
    expect(screen.getByText("Drop avatar")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run, verify fail.** Run: `npm test -- components/primitives/Frame.test.tsx` → FAIL.

- [ ] **Step 3: Implement `components/primitives/Frame.tsx`**

```tsx
import Image from "next/image";

export function Frame({ src, alt = "", placeholder, fill = true, width, height, className, style }:
  { src?: string; alt?: string; placeholder?: string; fill?: boolean; width?: number; height?: number; className?: string; style?: React.CSSProperties }) {
  const cls = `frame ${className ?? ""}`.trim();
  if (!src) {
    return <div className={`${cls} frame-empty`} style={style}><span className="frame-ph">{placeholder}</span></div>;
  }
  if (fill && !width) {
    return <div className={cls} style={{ position: "relative", ...style }}><Image src={src} alt={alt} fill sizes="100%" style={{ objectFit: "cover" }} /></div>;
  }
  return <div className={cls} style={style}><Image src={src} alt={alt} width={width ?? 100} height={height ?? 100} /></div>;
}
```

- [ ] **Step 4: Add CSS for `.frame-empty` / `.frame-ph` to `app/globals.css`** (subtle striped placeholder)

```css
.frame-empty { background: repeating-linear-gradient(135deg, #12161c, #12161c 8px, #0e1217 8px, #0e1217 16px); display: grid; place-items: center; }
.frame-ph { font-family: var(--font-mono); font-size: 9px; letter-spacing: .15em; color: #5a6570; text-transform: uppercase; }
```

- [ ] **Step 5: Run test, verify pass.** Run: `npm test -- components/primitives/Frame.test.tsx` → PASS.

- [ ] **Step 6: Commit**

```bash
git add components/primitives/Frame.tsx components/primitives/Frame.test.tsx app/globals.css
git commit -m "feat: add Frame image component replacing prototype image-slot"
```

---

### Task 8: `Reveal` scroll-in wrapper

**Files:**
- Create: `components/primitives/Reveal.tsx`
- Test: `components/primitives/Reveal.test.tsx`
- Reference: `design-reference/portfolio-lib.jsx` (`Reveal`)

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/primitives/Reveal";

describe("Reveal", () => {
  it("renders children with the reveal class", () => {
    render(<Reveal><p>hello</p></Reveal>);
    const el = screen.getByText("hello").parentElement!;
    expect(el.className).toContain("reveal");
  });
});
```

- [ ] **Step 2: Run, verify fail** → FAIL.

- [ ] **Step 3: Implement `components/primitives/Reveal.tsx`**

```tsx
"use client";
import { useEffect, useRef } from "react";

export function Reveal({ children, delay = 0, className = "", style }:
  { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800) * 0.98 && r.bottom > 0) el.classList.add("in");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}
```

- [ ] **Step 4: Run test, verify pass** → PASS.

- [ ] **Step 5: Commit**

```bash
git add components/primitives/Reveal.tsx components/primitives/Reveal.test.tsx
git commit -m "feat: add Reveal scroll-in wrapper"
```

---

### Task 9: Count-up `StatNum` and `Prog`

**Files:**
- Create: `components/primitives/StatNum.tsx`, `components/primitives/Prog.tsx`
- Test: `components/primitives/StatNum.test.tsx`
- Reference: `design-reference/portfolio-lib.jsx` (`fmt`, `useCountUp`, `StatNum`, `Prog`)

- [ ] **Step 1: Write the failing test** (motion-off path renders final value synchronously)

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatNum } from "@/components/primitives/StatNum";

describe("StatNum", () => {
  beforeEach(() => document.body.classList.add("motion-off"));
  it("renders the formatted final value when motion is off", () => {
    render(<StatNum value={18400} />);
    expect(screen.getByText("18,400")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run, verify fail** → FAIL.

- [ ] **Step 3: Implement `components/primitives/StatNum.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export function fmt(n: number): string {
  const r = Math.round(n);
  return r >= 1000 ? r.toLocaleString("en-US") : String(r);
}

function useCountUp(target: number, vis: boolean, duration = 1500) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!vis || done.current) return;
    done.current = true;
    if (document.body.classList.contains("motion-off")) { setV(target); return; }
    const t0 = performance.now();
    const fb = setTimeout(() => setV(target), duration + 300);
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick); else { setV(target); clearTimeout(fb); }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [vis, target, duration]);
  return v;
}

export function StatNum({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (el.getBoundingClientRect().top < (window.innerHeight || 800) * 1.1) setVis(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const v = useCountUp(value, vis);
  return <span ref={ref}>{fmt(v)}</span>;
}
```

- [ ] **Step 4: Implement `components/primitives/Prog.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export function Prog({ value, max }: { value: number; max: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const off = document.body.classList.contains("motion-off");
    const set = () => (off ? setW(pct) : setTimeout(() => setW(pct), 150));
    if (el.getBoundingClientRect().top < (window.innerHeight || 800)) set();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [pct]);
  return <div className="prog-track" ref={ref}><div className="prog-fill" style={{ width: `${w}%` }} /></div>;
}
```

- [ ] **Step 5: Run test, verify pass** → PASS.

- [ ] **Step 6: Commit**

```bash
git add components/primitives/StatNum.tsx components/primitives/Prog.tsx components/primitives/StatNum.test.tsx
git commit -m "feat: add StatNum count-up and Prog progress primitives"
```

---

## Phase 3 — Steam profile sections

> For every component in this phase: it is a server component unless it uses hooks/interactivity (then add `"use client"`). Markup mirrors the matching `design-reference/comp-*.jsx` function; swap `<Slot .../>` for `<Frame .../>`, take data from props typed by `lib/types.ts`, and keep all `className`s identical so the ported CSS applies. Each task: write a render/smoke test → implement → run → commit.

### Task 10: `TopBar` (no micro-bar)

**Files:** Create `components/steam/TopBar.tsx`; Test `components/steam/TopBar.test.tsx`. Reference: `design-reference/comp-header.jsx` (`TopBar`).

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopBar } from "@/components/steam/TopBar";
import { portfolio } from "@/data/portfolio";

describe("TopBar", () => {
  it("shows the SHOOTS brand and nav, and NO Install-App micro-bar", () => {
    render(<TopBar data={portfolio} />);
    expect(screen.getByText("SHOOTS")).toBeTruthy();
    expect(screen.getByText("PROJECTS")).toBeTruthy();
    expect(screen.queryByText(/Install App/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `components/steam/TopBar.tsx`**

```tsx
import type { PortfolioData } from "@/lib/types";

export function TopBar({ data }: { data: PortfolioData }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="top-main">
          <a className="brand" href="#top">
            <span className="logo"><b>{data.profile.brand[0]}</b></span>
            <span className="word">{data.profile.brand}</span>
          </a>
          <nav className="nav-main">
            {data.nav.map((l, i) => <a key={l} href={`#${l.toLowerCase()}`} className={i === 2 ? "active" : ""}>{l}</a>)}
          </nav>
        </div>
      </div>
    </header>
  );
}
```
(Note: the ported `.top-main` had a `gap` from the removed micro row; verify spacing in browser and adjust `.profile-top` top padding if needed.)

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add TopBar (micro-bar removed)"`

---

### Task 11: `ProfileHeader` (Level = age)

**Files:** Create `components/steam/ProfileHeader.tsx`; Test alongside. Reference: `design-reference/comp-header.jsx` (`ProfileHeader`), `styles.css` `.profile-head` block.

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHeader } from "@/components/steam/ProfileHeader";
import { portfolio } from "@/data/portfolio";

describe("ProfileHeader", () => {
  it("renders name, level badge = age, and xp title", () => {
    render(<ProfileHeader data={portfolio} />);
    expect(screen.getByText("Axel.S")).toBeTruthy();
    expect(screen.getByText(String(portfolio.profile.level))).toBeTruthy();
    expect(screen.getByText(portfolio.profile.xp.title)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** — port the `ProfileHeader` JSX from `design-reference/comp-header.jsx`, converting `<Slot id="profile-avatar" .../>` to `<Frame src={...} placeholder="Drop avatar" />` (avatar path `"/images/avatar.png"`), `p.name` → `data.profile.name`, level badge → `data.profile.level`, xp from `data.profile.xp`. Keep classes `av-window`, `av-titlebar`, `av-photo`, `ph-id`, `ph-name`, `ph-trade`, `ph-level`, `lvl-row`, `lvl-badge`, `lvl-xp-item`. Use `<Icon name="zap" size={30} />` for the xp icon. Wrap in `<div className="profile-top" id="top"><div className="content">…</div></div>`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add ProfileHeader with level=age"`

---

### Task 12: `ArtworkShowcase`

**Files:** Create `components/steam/ArtworkShowcase.tsx` + test. Reference: `comp-main.jsx` (`ArtShowcase`).

- [ ] **Step 1: Failing test** — renders 3 `.art-frame` elements and the profile URL.

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArtworkShowcase } from "@/components/steam/ArtworkShowcase";
import { portfolio } from "@/data/portfolio";
describe("ArtworkShowcase", () => {
  it("renders frames and the profile url", () => {
    const { container } = render(<ArtworkShowcase data={portfolio} />);
    expect(container.querySelectorAll(".art-frame").length).toBe(3);
    expect(screen.getByText(portfolio.profile.url)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** — port `ArtShowcase`: three `.art-frame` wrapping `<Frame src={`/images/art-${n}.png`} placeholder={n===2?'Drop artwork':''} />`, `.art-more` "+ 11", `.art-url` = `data.profile.url`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add ArtworkShowcase"`

---

### Task 13: `Sidebar` (Badges, Counts, Communities, Social)

**Files:** Create `components/steam/Sidebar.tsx` + test. Reference: `comp-main.jsx` (`Sidebar`). The prototype "Contacts" become real Social; "Communities" stay but real.

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/steam/Sidebar";
import { portfolio } from "@/data/portfolio";
describe("Sidebar", () => {
  it("renders counts, communities and real social links", () => {
    render(<Sidebar data={portfolio} />);
    expect(screen.getByText("Repositories")).toBeTruthy();
    expect(screen.getByText(portfolio.communities[0].name)).toBeTruthy();
    const gh = screen.getByText("GitHub").closest("a");
    expect(gh?.getAttribute("href")).toBe(portfolio.social[0].href);
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** — port `Sidebar` structure (`side-panel`, `side-online`, `side-block`, `side-h`, `badge-row`, `count-list`/`count-row`, `grp-row`, `contact-row`/`hexlvl`). Render `data.social` in the contacts block as anchors: each `contact-row` wrapped in `<a href={s.href} target="_blank" rel="noreferrer">`, `nm`=`s.name`, `sub`=`s.sub`, hex level `s.level`, status color from `s.online`. Badges from `data.badges` (icon or label). Counts from `data.counts` (use `fmt` for numbers; hide `n` when null). Communities from `data.communities` with `<Frame>` avatars. Wrap in `<Reveal className="side-panel">`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add Sidebar with real social links"`

---

### Task 14: `FeaturedStack`, `BigStats`, `AboutMe`

**Files:** Create `components/steam/FeaturedStack.tsx`, `BigStats.tsx`, `AboutMe.tsx` + one test file `components/steam/mid.test.tsx`. Reference: `comp-mid.jsx` (`TradeItems`, `BigStats`, `AboutMe`).

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedStack } from "@/components/steam/FeaturedStack";
import { BigStats } from "@/components/steam/BigStats";
import { AboutMe } from "@/components/steam/AboutMe";
import { portfolio } from "@/data/portfolio";

describe("mid sections", () => {
  it("FeaturedStack renders the hot item", () => {
    const { container } = render(<FeaturedStack data={portfolio} />);
    expect(container.querySelector(".trade-item.hot")).toBeTruthy();
  });
  it("BigStats renders labels", () => {
    document.body.classList.add("motion-off");
    render(<BigStats data={portfolio} />);
    expect(screen.getByText("Projects shipped")).toBeTruthy();
  });
  it("AboutMe renders the stack specs", () => {
    render(<AboutMe data={portfolio} />);
    expect(screen.getByText(portfolio.about.specs[0])).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement the three components** by porting `TradeItems` → `FeaturedStack` (`sec-label` "Featured stack", `.trade-items`/`.trade-item.hot`, `<Icon>`), `BigStats` (`.stat-row`/`.stat-col`, `<StatNum value={s.value} />`, `.k` label), `AboutMe` (`.show-dots`, `.about-wrap`, `.bracket.about-me`, `lead`/`big`/`spec-h`/`spec`, `.bracket.about-side` "Trade Offer"). All take `{ data }`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add FeaturedStack, BigStats, AboutMe"`

---

### Task 15: `FeaturedProject`

**Files:** Create `components/steam/FeaturedProject.tsx` + test. Reference: `comp-mid.jsx` (`FavGroup`). Add Live/Code buttons (not in prototype) using `data.featuredProject.live/code`.

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedProject } from "@/components/steam/FeaturedProject";
import { portfolio } from "@/data/portfolio";
describe("FeaturedProject", () => {
  it("renders name, a stat and live/code links", () => {
    render(<FeaturedProject data={portfolio} />);
    expect(screen.getByText(portfolio.featuredProject.name)).toBeTruthy();
    expect(screen.getByText(portfolio.featuredProject.stats[0].key)).toBeTruthy();
    expect(screen.getByRole("link", { name: /live/i })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** — port `FavGroup`: `sec-label` "Featured project", `.fav-group`, `<Frame>` avatar, `.fav-name` (`<b>{name}</b> — {type}`), `.fav-desc`, `.fav-stats` mapping `stats` with `cls`. Append a `.fav-actions` row with two anchors: `<a className="btn-live" href={fp.live}>▶ Live</a>` and `<a className="btn-code" href={fp.code}>&lt;/&gt; Code</a>`. Add `.fav-actions`, `.btn-live`, `.btn-code` styles to `globals.css` using `--btn-grad` for `.btn-live`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add FeaturedProject with live/code actions"`

---

### Task 16: `RecentActivity`

**Files:** Create `components/steam/RecentActivity.tsx` + test. Reference: `comp-lower.jsx` (`GameRow`, `RecentActivity`).

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecentActivity } from "@/components/steam/RecentActivity";
import { portfolio } from "@/data/portfolio";
describe("RecentActivity", () => {
  it("renders a game row per project", () => {
    document.body.classList.add("motion-off");
    const { container } = render(<RecentActivity data={portfolio} />);
    expect(container.querySelectorAll(".game-row").length).toBe(portfolio.projects.length);
    expect(screen.getByText(portfolio.projects[0].name)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** — port `GameRow` + `RecentActivity`. Map `data.projects` (typed `Project`). Render `.game-row` → `.game-top` (`game-cap` `<Frame>`, `game-name`, `game-meta` with `meta`/`last`), `.game-detail` with optional `achievement` (`.ach-card`), `milestones` (`.ach-prog` + `<Prog value={done} max={total} />`). Header `.activity-head` "Recent activity" + the past-2-weeks line. Wrap in `<Reveal>`. Use a section id `id="activity"`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add RecentActivity game rows"`

---

### Task 17: `Testimonials` (comments → testimonials)

**Files:** Create `components/steam/Testimonials.tsx` + test. Reference: `comp-lower.jsx` (`Comments`). Keep the styling and the optional client-only post box; rename heading to "Testimonials".

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Testimonials } from "@/components/steam/Testimonials";
import { portfolio } from "@/data/portfolio";

describe("Testimonials", () => {
  it("renders existing testimonials", () => {
    render(<Testimonials data={portfolio} />);
    expect(screen.getByText("Testimonials")).toBeTruthy();
    expect(screen.getByText(portfolio.testimonials[0].text)).toBeTruthy();
  });
  it("lets a visitor post a comment (client-only)", async () => {
    render(<Testimonials data={portfolio} />);
    await userEvent.type(screen.getByPlaceholderText(/add a comment/i), "great dev");
    await userEvent.click(screen.getByRole("button", { name: /post/i }));
    expect(screen.getByText("great dev")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** — port `Comments` as a `"use client"` component named `Testimonials`. Heading text "Testimonials". State holds `data.testimonials`. The post handler prepends `{ name: data.profile.name, date: "Just now", text, image: "/images/avatar.png" }`. Keep `.comments`, `.comments-head`, `.comment-box`, `.comment`, `.c-av/.c-main/.c-top/.c-name/.c-date/.c-text` classes. Drop the "blocked player" bar. Use `<Frame>` for avatars. Section id `id="community"`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add Testimonials (interactive)"`

---

### Task 18: `Footer`

**Files:** Create `components/steam/Footer.tsx` + test. Reference: `comp-lower.jsx` (`Footer`).

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/steam/Footer";
import { portfolio } from "@/data/portfolio";
describe("Footer", () => {
  it("shows brand and the Valve disclaimer", () => {
    render(<Footer data={portfolio} />);
    expect(screen.getByText("SHOOTS")).toBeTruthy();
    expect(screen.getByText(/not affiliated with or endorsed by Valve/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** — port `Footer`: `.footer-brand` (logo letter + `data.profile.brand`), `.footer-copy` with `© 2026 Axel.S. All work shown is original.` + `Steam-profile-inspired layout — not affiliated with or endorsed by Valve.`, `.footer-social` (icons from `data.footer.social`), and `data.footer.cols` columns.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add Footer with legal disclaimer"`

---

### Task 19: `Starfield` background

**Files:** Create `components/steam/Starfield.tsx` + test. Reference: `portfolio-app.jsx` (`Starfield`).

- [ ] **Step 1: Failing test** (renders a canvas)

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Starfield } from "@/components/steam/Starfield";
describe("Starfield", () => {
  it("renders a canvas element", () => {
    const { container } = render(<Starfield />);
    expect(container.querySelector("canvas#stars")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** — port the `Starfield` canvas component as `"use client"`. Guard the `getContext("2d")` call (jsdom returns null) by returning early if `!ctx`. Keep id `stars`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add Starfield canvas background"`

---

## Phase 4 — Mode/Tweaks state, assembly, Recruiter Mode

### Task 20: `ModeProvider` (recruiter mode + tweaks state)

**Files:** Create `components/ModeProvider.tsx` + `components/ModeProvider.test.tsx`.

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ModeProvider, useMode } from "@/components/ModeProvider";

function Probe() {
  const { recruiter, setRecruiter, tweaks, setTweak } = useMode();
  return (
    <div>
      <span data-testid="mode">{recruiter ? "resume" : "steam"}</span>
      <span data-testid="accent">{tweaks.accent}</span>
      <button onClick={() => setRecruiter(true)}>go</button>
      <button onClick={() => setTweak("accent", "#1fd6a0")}>accent</button>
    </div>
  );
}

describe("ModeProvider", () => {
  it("defaults to steam mode and toggles to resume", () => {
    render(<ModeProvider><Probe /></ModeProvider>);
    expect(screen.getByTestId("mode").textContent).toBe("steam");
    act(() => { screen.getByText("go").click(); });
    expect(screen.getByTestId("mode").textContent).toBe("resume");
  });
  it("updates a tweak value", () => {
    render(<ModeProvider><Probe /></ModeProvider>);
    act(() => { screen.getByText("accent").click(); });
    expect(screen.getByTestId("accent").textContent).toBe("#1fd6a0");
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `components/ModeProvider.tsx`**

```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface Tweaks { accent: string; starfield: boolean; }
const DEFAULT_TWEAKS: Tweaks = { accent: "#66c0f4", starfield: true };

interface ModeCtx {
  recruiter: boolean; setRecruiter: (v: boolean) => void;
  tweaks: Tweaks; setTweak: <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;
}
const Ctx = createContext<ModeCtx | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [recruiter, setRecruiter] = useState(false);
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS);

  // hydrate from URL + localStorage
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("recruiter") === "1") setRecruiter(true);
    else if (localStorage.getItem("recruiter") === "1") setRecruiter(true);
    const saved = localStorage.getItem("tweaks");
    if (saved) try { setTweaks({ ...DEFAULT_TWEAKS, ...JSON.parse(saved) }); } catch {}
  }, []);

  useEffect(() => { localStorage.setItem("recruiter", recruiter ? "1" : "0"); }, [recruiter]);
  useEffect(() => {
    localStorage.setItem("tweaks", JSON.stringify(tweaks));
    document.documentElement.style.setProperty("--link", tweaks.accent);
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.body.classList.toggle("motion-off", !tweaks.starfield);
  }, [tweaks]);

  const setTweak: ModeCtx["setTweak"] = (k, v) => setTweaks((t) => ({ ...t, [k]: v }));
  return <Ctx.Provider value={{ recruiter, setRecruiter, tweaks, setTweak }}>{children}</Ctx.Provider>;
}

export function useMode() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMode must be used within ModeProvider");
  return c;
}
```

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: add ModeProvider for recruiter mode + tweaks"`

---

### Task 21: `RecruiterToggle` and `TweaksPanel`

**Files:** Create `components/recruiter/RecruiterToggle.tsx`, `components/tweaks/TweaksPanel.tsx` + `components/recruiter/RecruiterToggle.test.tsx`. Reference: `design-reference/tweaks-panel.jsx` for the panel look (slim it to accent + starfield only).

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ModeProvider, useMode } from "@/components/ModeProvider";
import { RecruiterToggle } from "@/components/recruiter/RecruiterToggle";

function Mode() { const { recruiter } = useMode(); return <span data-testid="m">{recruiter ? "resume" : "steam"}</span>; }

describe("RecruiterToggle", () => {
  it("flips recruiter mode on click", () => {
    render(<ModeProvider><RecruiterToggle /><Mode /></ModeProvider>);
    act(() => { screen.getByRole("button", { name: /recruiter mode/i }).click(); });
    expect(screen.getByTestId("m").textContent).toBe("resume");
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `RecruiterToggle.tsx`**

```tsx
"use client";
import { useMode } from "@/components/ModeProvider";

export function RecruiterToggle() {
  const { recruiter, setRecruiter } = useMode();
  return (
    <button className="recruiter-toggle" aria-pressed={recruiter}
      onClick={() => setRecruiter(!recruiter)}>
      ⇄ {recruiter ? "Steam view" : "Recruiter mode"}
    </button>
  );
}
```

- [ ] **Step 4: Implement `TweaksPanel.tsx`** (slim: accent swatches + starfield toggle), `"use client"`, reading `useMode()`. Five accent options `["#66c0f4","#1fd6a0","#91c257","#a06bff","#e0894a"]` as clickable swatches calling `setTweak("accent", v)`; one checkbox toggling `starfield`. Use a fixed-position panel; port visual style/classes from `design-reference/tweaks-panel.jsx`. Add `.recruiter-toggle` + tweaks panel CSS to `globals.css`.

- [ ] **Step 5: Run → PASS.**

- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: add RecruiterToggle and slim TweaksPanel"`

---

### Task 22: `ResumeView` (clean recruiter resume)

**Files:** Create `components/recruiter/ResumeView.tsx` + test.

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResumeView } from "@/components/recruiter/ResumeView";
import { portfolio } from "@/data/portfolio";

describe("ResumeView", () => {
  it("renders name, role, a skill, a project and a CV link", () => {
    render(<ResumeView data={portfolio} />);
    expect(screen.getByText("Axel.S")).toBeTruthy();
    expect(screen.getByText(portfolio.profile.role)).toBeTruthy();
    expect(screen.getByText(portfolio.projects[0].name)).toBeTruthy();
    const cv = screen.getByRole("link", { name: /download cv/i });
    expect(cv.getAttribute("href")).toContain(".pdf");
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `ResumeView.tsx`** — a clean, print-friendly resume reading the same `portfolio` data: header (name, role, contact links from `data.social`), Skills (`data.about.specs`), Projects (`data.projects` name + meta + optional achievement; plus `data.featuredProject`), and a `Download CV` anchor to `/cv/Axel-S-CV.pdf`. Use a dedicated `.resume` class namespace (NOT Steam classes) so it reads as a plain document. Add `.resume` styles (light-on-dark or white print styles with `@media print`) to `globals.css`.

- [ ] **Step 4: Add a placeholder CV** — create `public/cv/Axel-S-CV.pdf` (empty placeholder file; `_TODO_OWNER` replace with the real CV).

- [ ] **Step 5: Run → PASS.**

- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: add ResumeView recruiter resume + CV link"`

---

### Task 23: Assemble `Profile` and wire `app/page.tsx`

**Files:** Create `components/Profile.tsx`; Modify `app/page.tsx`; Test `components/Profile.test.tsx`. Reference: `portfolio-app.jsx` (assembly order).

- [ ] **Step 1: Failing test** (mode switches the rendered view)

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Shell } from "@/components/Profile";
import { portfolio } from "@/data/portfolio";

describe("Shell", () => {
  it("renders Steam profile by default and switches to resume", () => {
    render(<Shell data={portfolio} github={null} />);
    expect(screen.getByText("Recent activity")).toBeTruthy(); // steam-only section
    act(() => { screen.getByRole("button", { name: /recruiter mode/i }).click(); });
    expect(screen.queryByText("Recent activity")).toBeNull();
    expect(screen.getByRole("link", { name: /download cv/i })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `components/Profile.tsx`**

```tsx
"use client";
import type { PortfolioData, GitHubStats } from "@/lib/types";
import { ModeProvider, useMode } from "@/components/ModeProvider";
import { TopBar } from "@/components/steam/TopBar";
import { ProfileHeader } from "@/components/steam/ProfileHeader";
import { ArtworkShowcase } from "@/components/steam/ArtworkShowcase";
import { Sidebar } from "@/components/steam/Sidebar";
import { FeaturedStack } from "@/components/steam/FeaturedStack";
import { BigStats } from "@/components/steam/BigStats";
import { AboutMe } from "@/components/steam/AboutMe";
import { FeaturedProject } from "@/components/steam/FeaturedProject";
import { RecentActivity } from "@/components/steam/RecentActivity";
import { Testimonials } from "@/components/steam/Testimonials";
import { Footer } from "@/components/steam/Footer";
import { Starfield } from "@/components/steam/Starfield";
import { RecruiterToggle } from "@/components/recruiter/RecruiterToggle";
import { ResumeView } from "@/components/recruiter/ResumeView";
import { TweaksPanel } from "@/components/tweaks/TweaksPanel";

function Inner({ data }: { data: PortfolioData }) {
  const { recruiter } = useMode();
  if (recruiter) {
    return (
      <div className="shell">
        <div className="content" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 0" }}><RecruiterToggle /></div>
          <ResumeView data={data} />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="bg-stage"><div className="bg-fallback" /><Starfield /><div className="bg-vignette" /></div>
      <div className="shell">
        <TopBar data={data} />
        <div className="content" style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}><RecruiterToggle /></div>
        <ProfileHeader data={data} />
        <div className="content">
          <div className="profile-body">
            <div className="col-main">
              <ArtworkShowcase data={data} />
              <FeaturedStack data={data} />
              <BigStats data={data} />
              <AboutMe data={data} />
              <FeaturedProject data={data} />
              <RecentActivity data={data} />
              <Testimonials data={data} />
            </div>
            <div className="col-side"><Sidebar data={data} /></div>
          </div>
        </div>
        <Footer data={data} />
      </div>
      <TweaksPanel />
    </>
  );
}

export function Shell({ data, github }: { data: PortfolioData; github: GitHubStats | null }) {
  // github merge happens in page.tsx before passing data; github kept for future use
  void github;
  return <ModeProvider><Inner data={data} /></ModeProvider>;
}
```

- [ ] **Step 4: Implement `app/page.tsx`**

```tsx
import { portfolio } from "@/data/portfolio";
import { Shell } from "@/components/Profile";

export default function Page() {
  return <Shell data={portfolio} github={null} />;
}
```

- [ ] **Step 5: Run test, then full build**

Run: `npm test -- components/Profile.test.tsx` → PASS.
Run: `npm run build` → success.
Run: `npm run dev`, open `/` (Steam profile) and `/?recruiter=1` (resume). Verify both, and the toggle persists across reload.

- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: assemble profile shell with recruiter switching"`

---

## Phase 5 — Live GitHub data

### Task 24: GitHub fetcher (`lib/github.ts`)

**Files:** Create `lib/github.ts` + `lib/github.test.ts`. Create `.env.example`.

- [ ] **Step 1: Failing test (mock fetch)**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGitHubStats } from "@/lib/github";

beforeEach(() => vi.restoreAllMocks());

function mockJson(map: Record<string, unknown>) {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    const key = Object.keys(map).find((k) => url.includes(k));
    return { ok: true, status: 200, json: async () => map[key ?? ""] ?? {} } as Response;
  }));
}

describe("fetchGitHubStats", () => {
  it("aggregates repos, stars, languages and activity", async () => {
    mockJson({
      "/users/shoots": { public_repos: 28 },
      "/users/shoots/repos": [
        { name: "a", stargazers_count: 10, language: "TypeScript", fork: false },
        { name: "b", stargazers_count: 5, language: "CSS", fork: false },
      ],
      "/users/shoots/events/public": [
        { type: "PushEvent", repo: { name: "shoots/a" }, created_at: "2026-06-01T00:00:00Z", payload: { commits: [{}, {}] } },
      ],
    });
    const s = await fetchGitHubStats("shoots", undefined);
    expect(s.repos).toBe(28);
    expect(s.stars).toBe(15);
    expect(s.languages[0].name).toBe("TypeScript");
    expect(s.activity.length).toBeGreaterThan(0);
    expect(s.commits).toBeGreaterThan(0);
  });

  it("returns zeros on failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 403 } as Response)));
    const s = await fetchGitHubStats("shoots", undefined);
    expect(s.repos).toBe(0);
    expect(s.activity).toEqual([]);
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `lib/github.ts`**

```ts
import "server-only";
import type { GitHubStats } from "@/lib/types";

const API = "https://api.github.com";
const EMPTY: GitHubStats = { repos: 0, commits: 0, stars: 0, languages: [], activity: [] };

async function gh<T>(path: string, token?: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 3600 }, // ISR: refresh hourly
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchGitHubStats(username: string, token?: string): Promise<GitHubStats> {
  const user = await gh<{ public_repos: number }>(`/users/${username}`, token);
  if (!user) return EMPTY;

  const repos = (await gh<Array<{ name: string; stargazers_count: number; language: string | null; fork: boolean }>>(
    `/users/${username}/repos?per_page=100&sort=updated`, token)) ?? [];
  const owned = repos.filter((r) => !r.fork);
  const stars = owned.reduce((a, r) => a + (r.stargazers_count || 0), 0);

  const langCount: Record<string, number> = {};
  for (const r of owned) if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  const total = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }));

  const events = (await gh<Array<{ type: string; repo: { name: string }; created_at: string; payload?: { commits?: unknown[] } }>>(
    `/users/${username}/events/public?per_page=30`, token)) ?? [];
  let commits = 0;
  const activity = events.slice(0, 8).map((e) => {
    if (e.type === "PushEvent") commits += e.payload?.commits?.length ?? 0;
    return { repo: e.repo.name.split("/").pop() || e.repo.name, type: e.type.replace("Event", ""), when: e.created_at };
  });

  return { repos: user.public_repos, commits, stars, languages, activity };
}
```

- [ ] **Step 4: Write `.env.example`**

```
# GitHub data source for live stats (server-only). Token optional but recommended (higher rate limit).
GITHUB_USERNAME=shoots
GITHUB_TOKEN=
```

- [ ] **Step 5: Run test, verify pass** → PASS.

- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: add GitHub stats fetcher with ISR caching"`

---

### Task 25: Merge live data into the page

**Files:** Modify `app/page.tsx`; Create `lib/merge.ts` + `lib/merge.test.ts`.

- [ ] **Step 1: Failing test for the merge function**

```ts
import { describe, it, expect } from "vitest";
import { mergeGitHub } from "@/lib/merge";
import { portfolio } from "@/data/portfolio";
import type { GitHubStats } from "@/lib/types";

const gh: GitHubStats = {
  repos: 28, commits: 1204, stars: 63,
  languages: [{ name: "TypeScript", pct: 60 }, { name: "CSS", pct: 40 }],
  activity: [{ repo: "taskforge", type: "Push", when: "2026-06-01T00:00:00Z" }],
};

describe("mergeGitHub", () => {
  it("fills repos and commits big stats", () => {
    const m = mergeGitHub(portfolio, gh);
    expect(m.bigStats.find(s => s.key === "repos")!.value).toBe(28);
    expect(m.bigStats.find(s => s.key === "commits")!.value).toBe(1204);
    expect(m.counts.find(c => c.label === "Repositories")!.n).toBe(28);
  });
  it("leaves data unchanged when github is null", () => {
    expect(mergeGitHub(portfolio, null)).toEqual(portfolio);
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `lib/merge.ts`**

```ts
import type { PortfolioData, GitHubStats } from "@/lib/types";

export function mergeGitHub(data: PortfolioData, gh: GitHubStats | null): PortfolioData {
  if (!gh) return data;
  const bigStats = data.bigStats.map((s) =>
    s.key === "repos" ? { ...s, value: gh.repos }
    : s.key === "commits" ? { ...s, value: gh.commits }
    : s.key === "stars" ? { ...s, value: gh.stars }
    : s);
  const counts = data.counts.map((c) =>
    c.label === "Repositories" ? { ...c, n: gh.repos } : c);
  return { ...data, bigStats, counts };
}
```

- [ ] **Step 4: Wire `app/page.tsx` to fetch + merge**

```tsx
import { portfolio } from "@/data/portfolio";
import { Shell } from "@/components/Profile";
import { fetchGitHubStats } from "@/lib/github";
import { mergeGitHub } from "@/lib/merge";

export const revalidate = 3600;

export default async function Page() {
  const username = process.env.GITHUB_USERNAME;
  const github = username ? await fetchGitHubStats(username, process.env.GITHUB_TOKEN) : null;
  const data = mergeGitHub(portfolio, github);
  return <Shell data={data} github={github} />;
}
```

- [ ] **Step 5: Run tests + build**

Run: `npm test -- lib/merge.test.ts` → PASS.
Run: `npm run build` → success (page builds without a token, github=null path).

- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: merge live GitHub stats into the page"`

---

### Task 26: Live recent-activity + top-language stack (optional enrichment)

**Files:** Modify `lib/merge.ts`, `components/steam/RecentActivity.tsx`, `components/steam/FeaturedStack.tsx`; extend `lib/merge.test.ts`.

- [ ] **Step 1: Extend the merge test**

Add to `lib/merge.test.ts`:
```ts
it("prepends github activity rows when present", () => {
  const m = mergeGitHub(portfolio, gh);
  expect(m.projects[0].name.toLowerCase()).toContain("taskforge");
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Update `mergeGitHub`** to map `gh.activity` into synthetic `Project` rows prepended to `data.projects` (cap total list, e.g. first 2 live + existing curated). Each live row: `{ name: a.repo, image: "/images/act-gh.png", meta: `${a.type} activity`, last: new Date(a.when).toLocaleDateString() }`. Keep curated projects after.

- [ ] **Step 4: Run → PASS.** Run: `npm test -- lib/merge.test.ts`.

- [ ] **Step 5: (Optional) derive FeaturedStack icons from `gh.languages`** — if you want the featured stack to reflect real languages, map language names → icon names with a small lookup in `mergeGitHub`; otherwise leave curated. Keep this minimal (YAGNI) — only do it if it reads well.

- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: surface live GitHub activity in recent activity"`

---

## Phase 6 — Responsive, accessibility, SEO, deploy

### Task 27: Responsive pass

**Files:** Modify `app/globals.css`.

- [ ] **Step 1: Audit at 375px / 768px / 1024px** in dev tools. The ported CSS already stacks at `980px` (`.profile-body` → column). Verify and fix: nav wrap, artwork frames scale, sidebar full-width, big-stats wrap, comment box usable on mobile, Recruiter toggle reachable.

- [ ] **Step 2: Add/adjust media queries** in `globals.css` for `max-width: 640px` — reduce `--content` padding, shrink `.ph-name` font, make `.nav-main` horizontally scrollable, stack `.fav-group`.

- [ ] **Step 3: Verify** no horizontal scroll at 375px; both modes usable.

- [ ] **Step 4: Commit** `git add -A && git commit -m "style: responsive pass for mobile/tablet"`

---

### Task 28: Accessibility pass

**Files:** Modify components + `app/globals.css`; Create `test/a11y.test.tsx`.

- [ ] **Step 1: Failing test** — landmarks + reduced motion respected

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Shell } from "@/components/Profile";
import { portfolio } from "@/data/portfolio";
describe("a11y", () => {
  it("has a banner, main and contentinfo landmark", () => {
    const { container } = render(<Shell data={portfolio} github={null} />);
    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector("main")).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL** (no `<main>` yet).

- [ ] **Step 3: Implement** — wrap the profile/resume body in `<main id="profile">`; ensure `TopBar` is `<header>` and `Footer` is `<footer>`. Add visible `:focus-visible` outlines to links/buttons in `globals.css`. Add `@media (prefers-reduced-motion: reduce)` to disable starfield + reveal transitions (the ported CSS already has `.reveal` reduced-motion; extend to hide `#stars`). Verify color contrast of `--muted` text on `--bg` ≥ 4.5:1; bump `--muted` if needed.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** `git add -A && git commit -m "a11y: landmarks, focus states, reduced motion"`

---

### Task 29: SEO, OG image, metadata polish

**Files:** Modify `app/layout.tsx`; Create `app/opengraph-image.tsx` (or static `public/og.png`), `app/robots.ts`, `app/sitemap.ts`.

- [ ] **Step 1:** Add full metadata in `layout.tsx` (`openGraph`, `twitter`, `keywords`, canonical). `metadataBase` already `https://axelstz.fr`.

- [ ] **Step 2:** Add `app/robots.ts` (allow all, point sitemap to `https://axelstz.fr/sitemap.xml`) and `app/sitemap.ts` (single route `/`).

- [ ] **Step 3:** Add an OG image — either `public/og.png` (1200×630) or a generated `app/opengraph-image.tsx` using `next/og`.

- [ ] **Step 4:** Run `npm run build` → success; check `/robots.txt` and `/sitemap.xml` in dev.

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: SEO metadata, robots, sitemap, OG image"`

---

### Task 30: Deploy config + README + final verification

**Files:** Create `README.md`; verify env on Vercel.

- [ ] **Step 1:** Write `README.md` — project overview, "edit `data/portfolio.ts` to personalize" + `_TODO_OWNER` checklist (age, avatar/artwork/project images in `public/images/`, real CV at `public/cv/Axel-S-CV.pdf`, real social hrefs, `GITHUB_USERNAME`/`GITHUB_TOKEN`), local dev commands, and a note that live stats need env vars.

- [ ] **Step 2:** Final full check:

Run: `npm test` → all PASS.
Run: `npm run build` → success.
Run: `npm run dev` → manually verify: Steam profile renders, Recruiter Mode toggles + persists, `?recruiter=1` deep link, Tweaks accent changes color, CV downloads, mobile layout, GitHub stats populate when `GITHUB_USERNAME` set in `.env.local`.

- [ ] **Step 3:** Deploy to Vercel — push to GitHub, import in Vercel, set `GITHUB_USERNAME` + `GITHUB_TOKEN` env vars, add custom domain `axelstz.fr`. (Manual; document in README.)

- [ ] **Step 4: Commit** `git add -A && git commit -m "docs: add README and owner personalization checklist"`

---

## Self-Review Notes (coverage check)

- Spec §3 stack/architecture → Tasks 1–3, 23, 24, 25. ✅
- Spec §2 identity (SHOOTS / Axel.S, Level=age) → Tasks 5, 11. ✅
- Spec §4 sections incl. **cut micro-bar** + **cut Add-a-showcase** → Tasks 10 (micro-bar absent + tested), 23 (Add-a-showcase omitted from assembly). ✅
- Spec §4 real content (testimonials, social, communities, badges) → Tasks 5, 13, 17. ✅
- Spec §5 Recruiter Mode (separate ResumeView, localStorage + `?recruiter`, Download CV) → Tasks 20, 21, 22, 23. ✅
- Spec §3 live GitHub (repos/commits/stars, activity, languages) → Tasks 24, 25, 26. ✅
- Spec §6 responsive + a11y → Tasks 27, 28. ✅
- Spec Tweaks panel (slim) → Task 21. ✅
- Spec §8 legal/branding → Task 18 (disclaimer tested). ✅
- Spec §9 owner content checklist → Task 30 README. ✅
