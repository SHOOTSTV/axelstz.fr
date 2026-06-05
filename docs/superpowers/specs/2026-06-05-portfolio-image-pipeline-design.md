# Portfolio Image Pipeline & Project Data — Design Spec

**Date:** 2026-06-05
**Owner:** Axel
**Status:** Approved for planning
**Relates to:** `2026-06-04-steam-profile-portfolio-design.md` (parent design)

---

## 1. Goal

Fill the portfolio's project data and image slots with **real, on-theme assets** so the Steam-skinned profile looks intentional and polished. Focus on images: how to capture them, what resolution, and how to make them attractive and consistent with the navy "Steam" theme — without a manual Photoshop step.

Guiding principle (from parent spec §2): **honest, curated, few-but-impeccable** beats filler. Owner has **1–2 genuinely showable projects**; the data and showcase are trimmed to match.

## 2. Approach

**Capture → grade in code.** Produce clean raw screenshots, drop them in `/public/images`, and apply the theme treatment (scrim + accent border + vignette, optional duotone) **in the components via CSS**, not as baked PNGs.

- Crisp at any DPI, version-controlled, editable through `data/portfolio.ts`.
- No per-project Photoshop maintenance.
- Rejected alternatives: Figma-baked PNGs (not DPI-responsive, manual per project); AI-generated art (only needed if screenshots are unavailable — owner's apps have real UIs).

## 3. Image slot spec sheet

All slots render with `object-fit: cover` (see `components/primitives/Frame.tsx`). **Respect the ratio**; export a master ~3–4× the display size. Encode WebP quality ~80, target < 200 KB per file.

| Slot | File(s) | Displayed (px) | Ratio | Export master | Format | Content |
|---|---|---|---|---|---|---|
| Avatar | `avatar.png` | 188×188 | 1:1 | 512×512 | PNG/WebP | Owner avatar / mark |
| Art showcase ×3 | `art-1/2/3` | ~221 / 263 / **116** × 560 | portrait ~3:5 | 900×1500, **subject centered** | WebP | 3 hero views of the **flagship** |
| Featured logo | `favg.png` | 84×84 | 1:1 | 256×256 | PNG (transparent OK) | Flagship logo/icon |
| Project capsule | `act1`, `act2` | 184×69 | **8:3** | 736×276 | WebP | Wide hero strip of each project |
| Community logo | `grp1/grp2` | 46×46 | 1:1 | 128×128 | PNG | Org/community logos |
| Testimonial avatar | `cm*` | 40×40 | 1:1 | 128×128 | PNG/WebP | Recommender photos |

**Art showcase caveat:** the three frames are skewed (`skewX(-6deg)` outer, `skewX(6deg) scale(1.18)` inner) and narrow — frame 3 is ~116px wide. Edges crop aggressively. Keep key content centered; no text near edges.

## 4. Capture recipe

- **Reproducible script:** add `scripts/shots.ts` (Playwright). Fixed viewport, `deviceScaleFactor: 2` (retina), deterministic output sized per slot ratio.
- **Seeded data:** realistic demo content — no Lorem, no personal info, credible numbers.
- **Capsule (8:3):** capture a wide strip of each project's signature view (top of dashboard / key screen); crop to 8:3.
- **Art (portrait 3:5):** capture a mobile/vertical slice of the flagship, content centered.
- Hide cursor, scrollbars, browser chrome. Export PNG → compress to WebP.

## 5. Theme treatment ("dans le thème")

Biggest lever: **screenshot apps already in a dark theme** near the palette (`--bg #0c0d10`, `--header-2 #1b2838`, accent `--link #66c0f4`) so captures are natively on-theme.

In-code grade layer, implemented as **CSS pseudo-elements** on existing image containers (`.art-frame .inner`, `.game-cap`, `.fav-av`) — minimal new code, matches the "thin bespoke CSS" approach of the parent spec:

- **Scrim:** navy gradient, bottom→top, ~30–40% opacity (legibility + cohesion).
- **Accent border:** 1px `rgba(102,192,244,.25)`.
- **Vignette:** subtle inner shadow to match surrounding UI.
- **Optional duotone:** `filter: saturate(.9) contrast(1.05)` + navy veil to harmonize mismatched captures.
- **Single accent** everywhere: `#66c0f4`.
- **Optional title overlay** on capsule: project name, bottom-left, Steam-style (small element, not baked into the image).

## 6. Content trim — `data/portfolio.ts`

Resolve `_TODO_OWNER` markers and trim to honest scope:

- `featuredProject` = the **flagship** (real copy, metrics, `live`/`code` URLs, `favg` logo).
- `projects[]` = **1–2 real rows**; remove fictional entries (TabFlow / Forge UI).
- **Art showcase** = 3 views of the **same flagship** (not 3 separate projects), or flagship + secondary + a code/terminal art.
- `counts` (Projects 12, Screenshots 24, …) → **real numbers**.
- `communities`, `testimonials`, `social[*].href` → real or trimmed.

## 7. Out of scope

- AI-generated art (revisit only if screenshots are insufficient).
- Figma/Photoshop baked compositing.
- Backend, CMS, image upload UI (parent spec §10 still holds).
- GitHub live-data wiring (separate phase).

## 8. Acceptance criteria

- Every image reference in `data/portfolio.ts` and components resolves to a real asset in `/public/images`; no placeholder frames render on the live profile.
- Capsules render at 8:3 with no distortion; art frames keep subject centered after skew/crop.
- Theme layer applied consistently (scrim + accent border + vignette) across capsules and art.
- `data/portfolio.ts` reflects 1–2 real projects with honest counts.
- `npm run build` and `npm test` pass.
- `scripts/shots.ts` regenerates all screenshots deterministically.
