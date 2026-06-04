# Steam-Profile Developer Portfolio — Design Spec

**Date:** 2026-06-04
**Owner:** Axel
**Status:** Approved for planning

---

## 1. Goal

A personal web-developer portfolio that recreates the **Steam community-profile** experience, skinned for dev/folio content. Primary job: **land a dev job**. Audience: recruiters and hiring managers.

The Steam skin is the hook (memorability, personality). A one-click **Recruiter Mode** guarantees the theme never costs an interview by giving a clean, skimmable resume view on demand.

Origin: the visual design already exists as an HTML/CSS/JS prototype exported from Claude Design (`axel-steam-portfolio` bundle), iterated to be **pixel-faithful to the real Steam community-profile layout** (not a reinterpretation). This spec recreates that design in production tech and layers in real content, live data, and Recruiter Mode.

## 2. Owner profile / identity framing

- **Display name:** Axel.S
- **Brand / pseudo:** SHOOTS (used in nav brand, footer, avatar tag).
- **Role title:** Junior Web Developer (junior, 0–2 yrs experience).
- **Level = real age.** (e.g. `Level 19`.) XP item subtitle derives from a real metric (e.g. commits or projects). _Owner to provide actual age._
- Honest, on-brand framing — no inflated "Level 26 / Full Stack" placeholder from the prototype.

## 3. Tech stack & architecture

- **Framework:** Next.js (App Router) + TypeScript.
- **Styling:** Tailwind CSS + a thin layer of bespoke CSS driven by CSS custom properties. The Steam-specific pieces (windowed avatar frame, hex-level badges, angled artwork frames, count-up stats) need real CSS, not forced utilities. CSS variables drive theming → powers both Recruiter Mode and the Tweaks panel.
- **Deploy:** Vercel. **Production URL: `axelstz.fr`** (custom domain).
- **Type pairing (from design):** `Asap` (UI/body) + `JetBrains Mono` (stats/terminal numbers).
- **Palette (from design):** Steam navy/charcoal `--bg:#0c0d10`, `--header:#171a21`, `--header-2:#1b2838`; link blue `--link:#66c0f4`; rarity hex colors (`--r-gray/blue/purple/pink/gold`). Defined as CSS variables (overridable by Tweaks).

### Data flow

- **`data/portfolio.ts`** — typed, hand-authored content. The single file the owner edits to personalize. Holds: profile, projects, featured project, testimonials, social links, communities, badges/certs, about-me stack list.
- **`lib/github.ts`** — server-side GitHub fetcher. Token in env var, cached via ISR (`revalidate`). Fetched server-side so there is no rate-limit exposure or client layout shift. Supplies **live** data:
  - Big stats: repository count, total commits, stars.
  - Recent-activity feed: real pushes / PRs / releases (GitHub events API).
  - Top languages: most-used languages across repos → drives "Featured stack" / skills.
- **Curated, not live:** projects and the featured project are hand-authored in `portfolio.ts` (curated beats auto-pinned). Per-project "hours"/"milestones" flavor numbers are authored.
- **Images:** real assets in `/public` via `next/image`. The prototype's drag-drop `image-slot.js` persistence machinery is **dropped** — production uses static images.

## 4. Sections (final)

Faithful to the prototype, with the changes noted.

### Top
- **Nav bar** — brand `SHOOTS` + nav: PROJECTS / COMMUNITY / PROFILE / ACTIVITY / SUPPORT (used as section anchors).
- **CUT: top micro-bar** — the `Install App / 🔔 / SHOOTS·Available / avatar` row is removed. It reads as logged-in Steam *client* chrome and weakens the first impression.

### Profile header
- Windowed/terminal avatar frame (`c:_>` titlebar), name with caret, **Level badge (= age)** + XP item, "Trade Offer", "Edit profile" affordances (decorative).

### Artwork showcase
- Three angled artwork frames + "+N", `axelstz.fr/profile` URL.

### Body — left column
- **Featured stack** — tech icons (derived from real top languages where possible).
- **Big stats** — Projects / Repositories / Total commits, count-up animated. Repositories + commits **live from GitHub**.
- **About me** — terminal-styled block with ★ stack list, flanked by "Trade Offer" panel.
- **Featured project** — flagship project card with metrics (hand-curated).
- **Recent activity** — projects as "game rows" (hrs total, Milestones progress, achievement cards, screenshot thumbs). Feed **live from GitHub**; per-project flavor authored.

### Body — right sidebar
- **Badges** — real certs / achievements (mapped from abstract icons).
- **Counts list** — Projects / Screenshots / Repositories / Reviews / Creations, etc.
- **Communities** — real orgs / Discords / open-source communities the owner is part of.
- **Contacts → Social/Network** — real links: GitHub, LinkedIn, Discord, peers.

### Lower
- **Comments → Testimonials** — the "+rep" guestbook becomes real testimonials/recommendations from people worked with. Interactive post box may remain for visitors (optional). High recruiter value.
- **Footer** — link columns + legal line: "Steam-profile-inspired layout — not affiliated with or endorsed by Valve." No Steam logos/assets/trademarks (original branding only).
- **CUT: "+ Add a showcase"** — empty Steam-UI filler block with no real content; removed.

### Global features
- **Tweaks panel (slimmed)** — accent color / particles on-off / motion toggle. Kept as a playful visitor touch; low cost since theming is already CSS-variable-driven.
- **Background** — starfield/particle field with vignette (performant, respects `prefers-reduced-motion`).

## 5. Recruiter Mode

- **Toggle** in the nav bar. State persisted in `localStorage` and settable via `?recruiter` URL param (shareable link straight to resume view).
- **Implementation:** a dedicated clean **`ResumeView`** component that reads the *same* `portfolio.ts` data — NOT a CSS-flatten of the Steam layout (more reliable, printable, maintainable). Shows: name, role, skills, projects, experience, contact, and a **Download CV (PDF)** button.
- Steam profile is the default; Recruiter Mode is the escape hatch.

## 6. Responsiveness & accessibility

- Design is **desktop-first** (prototype stacks at 980px). Requires a deliberate mobile/responsive pass — single-column stack, collapsed sidebar, touch-friendly targets.
- Accessibility: semantic landmarks, keyboard navigation, visible focus states, color-contrast check on muted text, `prefers-reduced-motion` honored (disables particles + reveals — already in design), reduced-motion-safe count-ups.

## 7. Build order (one project, two phases)

- **Phase 1** — pixel-faithful static rebuild in Next.js + Tailwind; real content wired from `portfolio.ts`; Recruiter Mode + Download CV; responsive + a11y pass.
- **Phase 2** — wire live GitHub data (`lib/github.ts`) into big stats, recent-activity feed, and top languages, with ISR caching.

## 8. Legal / branding

- Recreate **atmosphere, layout, hierarchy, dark theme** only. No Steam/Valve logos, assets, branded chrome, or copyrighted elements. Original `SHOOTS` / `Axel.S` identity throughout. Footer disclaimer present.

## 9. Owner-provided content checklist

To personalize, the owner supplies: real age + handle/role text, project list + featured project (copy, metrics, links, images), testimonials, social/community links, badges/certs, CV PDF, avatar + artwork + project/screenshot images.

## 10. Out of scope (YAGNI)

- Drag-drop image-slot persistence (prototype-only).
- CMS / backend beyond the GitHub fetch.
- Auth, comments backend (visitor comment box is optional, client-only or omitted).
- The empty "+ Add a showcase" block and the Steam client micro-bar.
