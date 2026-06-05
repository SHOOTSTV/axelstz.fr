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

Drop real images into **`public/images/`** (the `Frame` component shows a labelled placeholder until then):
`avatar.png`, `art-1.png`–`art-3.png`, `favg.png`, `act1.png`–`act3.png`, community/testimonial images referenced in `data/portfolio.ts`.

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
