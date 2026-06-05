# SHOOTS — axelstz.fr

A personal developer portfolio for **Axel.S** styled as a **Steam community profile**, with a one-click **Recruiter Mode** (clean resume view) and **live GitHub stats**.

Built with Next.js (App Router) + TypeScript + Tailwind v4, deployed on Vercel.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest + React Testing Library
npm run build    # production build
```

- `/` — Steam profile (default)
- `/?recruiter=1` — deep link straight to the clean resume view
- The **⇄ Recruiter mode** button (top-right) toggles between the two; the choice persists in `localStorage`.

## Make it yours (owner checklist)

Edit **`data/portfolio.ts`** — it's the single content file. Replace every `_TODO_OWNER` marker:

- [ ] `profile.level` — your real **age** (the level badge).
- [ ] `social[*].href` — real GitHub / LinkedIn / Discord / email links.
- [ ] `communities` — real orgs/communities (or trim the list).
- [ ] `featuredProject` — your flagship project (copy, metrics, `live`/`code` URLs, image).
- [ ] `projects` — your real projects.
- [ ] `testimonials` — real recommendations.

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

Replace the placeholder CV at **`public/cv/Axel-S-CV.pdf`** with your real CV.

## Live GitHub stats

Repositories, total commits, stars, recent activity and top languages are pulled live from GitHub (cached hourly via ISR). Configure env vars (see `.env.example`):

```bash
cp .env.example .env.local
# GITHUB_USERNAME=your-github-username
# GITHUB_TOKEN=optional-personal-access-token   # higher rate limit
```

Without `GITHUB_USERNAME`, the site renders fully from the static content in `data/portfolio.ts` (no live data, never breaks).

## Architecture

- `data/portfolio.ts` — hand-authored content (typed by `lib/types.ts`).
- `lib/github.ts` — server-side GitHub fetcher (ISR-cached).
- `lib/merge.ts` — merges live GitHub data into the content.
- `components/steam/*` — the Steam profile sections.
- `components/recruiter/*` — Recruiter Mode toggle + resume view.
- `components/ModeProvider.tsx` — recruiter-mode + theme (Tweaks) state.
- `app/globals.css` — the ported Steam stylesheet + theming via CSS variables.
- `design-reference/` — the original design prototype (source of truth for the look).

## Deploy (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel.
3. Set env vars `GITHUB_USERNAME` (and optional `GITHUB_TOKEN`).
4. Add the custom domain **axelstz.fr**.

## Notes

Steam-profile-inspired layout — **not affiliated with or endorsed by Valve**. No Steam/Valve logos or assets are used; all branding is original (SHOOTS / Axel.S).
