<div align="center">

# 🎮 SHOOTS — axelstz.fr

**A developer portfolio that looks like a Steam community profile** — complete with badges, achievements, a guestbook, and **live GitHub stats** — plus a one-click **Recruiter Mode** that swaps the whole thing for a clean, printable résumé.

[![Version](https://img.shields.io/badge/version-0.2.0-66c0f4)](./CHANGELOG.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/tests-Vitest-6e9f18?logo=vitest)](https://vitest.dev)
[![Stars](https://img.shields.io/github/stars/SHOOTSTV/axelstz.fr?style=flat&color=f5c518)](https://github.com/SHOOTSTV/axelstz.fr/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/SHOOTSTV/axelstz.fr)](https://github.com/SHOOTSTV/axelstz.fr/commits)
[![License](https://img.shields.io/badge/license-TODO-lightgrey)](#-license)

[**Live → axelstz.fr**](https://axelstz.fr) · [Recruiter view](https://axelstz.fr/?recruiter=1) · [Projects](https://axelstz.fr/projects)

</div>

---

## 30-second overview

> A single-page **Next.js 16** portfolio styled after a Steam profile. The look is playful; the engineering is not. Content lives in **one typed file**, live GitHub data is **ISR-cached** and **fails open**, the moderated **guestbook** is backed by serverless Postgres, and admin surfaces are gated by constant-time Basic Auth at the edge.

- **Who it's for:** developers who want a memorable, fork-able portfolio — and recruiters who just want the résumé.
- **Why it's nice:** content is honest by construction (no fabricated metrics), every image path is test-verified, and the live-stats layer degrades gracefully when GitHub or the DB is unavailable.
- **Not affiliated with Valve.** No Steam/Valve logos or assets are used; all branding is original (SHOOTS / Axel.S).

---

## ✨ Features

| | Feature | What it does |
|---|---|---|
| 🧩 | **Steam-profile UI** | Profile header, sidebar badges, big-stat tiles, featured project "store page", recent activity, animated starfield background. |
| 🔁 | **Recruiter Mode** | One toggle (top-right) swaps the whole page for a clean résumé view. Choice persists in `localStorage`; deep-linkable via `?recruiter=1`. |
| 📊 | **Live GitHub stats** | Repos, stars, total commits, top languages, and recent activity pulled live from the GitHub API, cached hourly via ISR. |
| 🏅 | **Achievement badges** | Hand-authored, feature-truthful badges plus a live **"Committed"** badge that tiers (100 / 500 / 1000) off your real commit count. |
| 📖 | **Moderated guestbook** | Visitors sign; entries land as `pending` and only show after admin approval. Rate-limited, honeypot-protected, Zod-validated. |
| 🗂️ | **Project library + detail pages** | `/projects` lists every build with live commit counts; `/projects/[slug]` renders a rich, store-page-style detail with changelog. |
| 🖼️ | **Dynamic OG images** | `/og` generates per-page Open Graph cards via `next/og` (edge runtime) so shared project links get their own preview. |
| 🔎 | **SEO baked in** | `Person` JSON-LD, sitemap, robots, canonical URLs, and OpenGraph/Twitter metadata. |
| 🌗 | **Motion-aware** | Animations respect reduced-motion; a `motion-off` class resolves them synchronously (also used to keep tests deterministic). |
| 🔐 | **Edge Basic Auth** | Admin routes gated in `proxy.ts` (Next 16's renamed middleware) with a constant-time credential check. |

---

## 📸 Screenshots / Demo

> _Screenshots are captured reproducibly with `npm run shots` (Playwright). Add yours under `public/` and reference them here._

| Steam profile (default) | Recruiter Mode | Project detail |
|---|---|---|
| _TODO: `docs/shot-profile.png`_ | _TODO: `docs/shot-recruiter.png`_ | _TODO: `docs/shot-project.png`_ |

▶️ **Live demo:** [axelstz.fr](https://axelstz.fr)

---

## 🏗️ Architecture

```
                ┌──────────────────────────────────────────────┐
   Visitor ───▶ │  proxy.ts (edge)  — Basic-Auth gate           │
                │  matcher: /admin, /api/guestbook/admin/*       │
                └───────────────┬──────────────────────────────┘
                                │
        ┌───────────────────────┼─────────────────────────────────┐
        ▼                       ▼                                  ▼
  app/page.tsx (RSC)     app/projects/* (RSC)            app/api/guestbook/* (route handlers)
        │                       │                                  │
        │  data/portfolio.ts    │  data/projectDetails.ts          │  lib/guestbook.ts ──▶ Neon Postgres
        │  (typed content)      │  (slug-keyed detail)             │  (ONLY DB importer)
        ▼                       ▼                                  ▼
  lib/github.ts ──▶ GitHub API (ISR revalidate: 3600)       lib/ratelimit.ts + Zod + honeypot
        │
        ▼
  lib/merge.ts + lib/badges.ts  ──▶  merged PortfolioData  ──▶  components/Profile.tsx (client Shell)
                                                                   ├─ components/steam/*
                                                                   └─ components/recruiter/*
```

**Design principles**

- **Single content source.** `data/portfolio.ts` is the only hand-authored content file; everything renders from it. Live data is *merged in*, never required.
- **Fail-open live layer.** Every GitHub fetch returns `null`/`EMPTY` on error, so the site renders fully from static content even if GitHub is down or no username is set.
- **Server-only secrets.** `lib/github.ts` and `lib/guestbook.ts` are server-only; tokens are read from `process.env` by callers and passed in — never bundled to the client.
- **Slug agreement.** `lib/slug.ts` is shared by the project links and the `[slug]` route's `generateStaticParams` so they can't drift.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, React Server Components) |
| **UI** | React 19, Tailwind CSS v4, CSS variables (ported Steam stylesheet) |
| **Language** | TypeScript 5 |
| **Validation** | Zod 4 |
| **Database** | Postgres via `@neondatabase/serverless` (Neon / Vercel Postgres) |
| **Auth** | HTTP Basic Auth, constant-time compare (`lib/auth.ts`), enforced in `proxy.ts` (edge) |
| **External API** | GitHub REST API (`api.github.com`) |
| **Images / OG** | `next/image`, `next/og` (edge runtime), `sharp` (via Next's bundled copy) |
| **Fonts** | Asap + JetBrains Mono (`next/font/google`) |
| **Testing** | Vitest 4, React Testing Library, jsdom, jest-dom |
| **Screenshots** | Playwright (`scripts/shots.mjs`) |
| **Lint** | ESLint 9 (`eslint-config-next`) |
| **Hosting** | Vercel (ISR) |

---

## 🚀 Installation

**Prerequisites:** Node.js ≥ 20, npm.

```bash
git clone https://github.com/SHOOTSTV/axelstz.fr.git
cd axelstz.fr
npm install

cp .env.example .env.local   # then fill in values (all optional for first run)

npm run dev                  # http://localhost:3000
```

The site runs with **zero configuration** — without env vars it renders entirely from `data/portfolio.ts` (no live GitHub data, no guestbook persistence).

---

## 🔑 Environment Variables

All variables are **server-only** and optional; missing values degrade gracefully. See [`.env.example`](./.env.example).

| Variable | Required | Purpose |
|---|---|---|
| `GITHUB_USERNAME` | For live stats | GitHub account to pull repos/stars/commits/activity from. Omit → site renders from static content only. |
| `GITHUB_TOKEN` | Recommended | Personal access token. Raises the API rate limit and unlocks live stats for **private** project repos (Contents:read). |
| `DATABASE_URL` | For guestbook | Postgres connection string (Neon / Vercel Postgres). Without it, guestbook reads/writes throw. |
| `GUESTBOOK_ADMIN_USER` | For `/admin` | Basic-Auth username for the moderation surfaces. |
| `GUESTBOOK_ADMIN_PASS` | For `/admin` | Basic-Auth password for the moderation surfaces. |

---

## ⚙️ Configuration

- **Make it yours:** edit [`data/portfolio.ts`](./data/portfolio.ts) and replace every `_TODO_OWNER` marker (age/level, social links, communities, featured project, projects, testimonials). It's typed by `lib/types.ts`, so the compiler guides you.
- **Project detail pages:** rich `/projects/[slug]` content lives in [`data/projectDetails.ts`](./data/projectDetails.ts), keyed by slug; `getProjectDetail()` falls back when a slug is absent.
- **ISR cache window:** `revalidate = 3600` (1 hour) on pages and GitHub fetches. Lower it for fresher data at the cost of more API calls.
- **Theme:** colors are CSS variables in `app/globals.css` (base `#0c0d10` / `#1b2838`, accent `#66c0f4`). The design prototype lives in `design-reference/` (source of truth for the look).
- **Rate limit:** guestbook writes are capped at 5 / IP / minute in `app/api/guestbook/route.ts` (tune in `createRateLimiter`).

<details>
<summary><strong>🖼️ Image slots & ratios</strong></summary>

Each slot uses `object-fit: cover`. Export a master ~3–4× display size and keep the ratio (`next/image` handles delivery). Until a file exists, leave the field `""` — the `Frame` shows a themed placeholder, never a broken image.

| Slot | File | Ratio | Master px |
|---|---|---|---|
| Avatar | `avatar.png` | 1:1 | 512×512 |
| Artwork ×3 | `art-1/2/3.png` | 3:5 portrait | 900×1500 |
| Featured logo | `favg.png` | 1:1 | 256×256 |
| Project capsule | `act1.png`, `act2.png` | 8:3 | 736×276 |
| Community logo | `grp1/grp2.png` | 1:1 | 128×128 |
| Testimonial avatar | `cm*.png` | 1:1 | 128×128 |

> ⚠️ `data/assets.test.ts` fails the build if any referenced image path doesn't resolve to a file in `/public`. Add the file **before** referencing it.

</details>

---

## 📖 Usage

```bash
npm run dev      # dev server (Turbopack) → http://localhost:3000
npm run build    # production build — the real gate (TypeScript + static gen)
npm start        # serve the production build
npm test         # Vitest once
npm run lint     # ESLint
npm run shots    # Playwright screenshots (configure SHOTS in scripts/shots.mjs)
```

**Common workflows**

| I want to… | Do this |
|---|---|
| See the Steam profile | Open `/` |
| Deep-link the résumé | Open `/?recruiter=1` (or click the **⇄ Recruiter mode** button) |
| Browse all projects | Open `/projects` |
| Read a project's "store page" | Open `/projects/<slug>` (e.g. `/projects/macrotrackr`) |
| Moderate the guestbook | Open `/admin` (Basic Auth) |
| Generate a custom OG card | `GET /og?name=MacroTrackr&title=AI%20SaaS&tagline=...` |

---

## 🗂️ Project Structure

```
axelstz.fr/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Steam profile (RSC; merges live GitHub data)
│   ├── projects/             # /projects library + /projects/[slug] detail
│   ├── admin/                # Guestbook moderation UI (Basic-Auth gated)
│   ├── api/guestbook/        # GET/POST guestbook + /admin mutation route
│   ├── og/route.tsx          # Dynamic Open Graph image (edge)
│   ├── sitemap.ts robots.ts  # SEO
│   └── globals.css           # Ported Steam stylesheet + theming
├── components/
│   ├── steam/                # Profile sections (header, sidebar, stats, guestbook…)
│   ├── recruiter/            # Recruiter toggle + résumé view
│   ├── projects/             # Project library + store-page components
│   ├── primitives/           # Reusable bits (Frame, Icon, Reveal, StatNum…)
│   └── Profile.tsx           # Client Shell that assembles the page
├── data/
│   ├── portfolio.ts          # ⭐ Single hand-authored content source
│   └── projectDetails.ts     # Rich per-project detail, keyed by slug
├── lib/
│   ├── github.ts             # server-only live GitHub fetcher (ISR)
│   ├── guestbook.ts          # ONLY file importing the Postgres driver
│   ├── merge.ts badges.ts    # Merge live data + derive the commit badge
│   ├── auth.ts ratelimit.ts  # Constant-time Basic Auth + in-memory limiter
│   ├── slug.ts types.ts      # Shared slug logic + content types
│   └── changelog.ts url.ts   # Changelog parser + URL guards
├── db/guestbook.sql          # Guestbook table + index schema
├── proxy.ts                  # Next 16's renamed middleware (edge auth gate)
├── scripts/                  # shots / compress-images / gen-brand-assets (.mjs)
├── design-reference/         # Original design prototype (look source of truth)
├── docs/superpowers/         # Plans + design specs
└── public/                   # Images, CV, static assets
```

---

## 🛠️ Development

- **TDD-friendly:** tests are colocated (`Foo.ts` → `Foo.test.ts`). Run a subset with `npm run test -- <pattern>`.
- **The real gate is `npm run build`** — it runs TypeScript checks + static generation. Green tests aren't enough; build must pass.
- Tests force `document.body.classList.add("motion-off")` so animations resolve synchronously.
- jsdom `HTMLCanvasElement.getContext()` warnings during tests are harmless (the Starfield canvas).
- Image scripts load `sharp` from Next's own `node_modules` — it is **not** a declared dependency; don't `import "sharp"` expecting a top-level install.
- **Heads up:** this targets **Next.js 16**, which has breaking changes vs. older docs. Check `node_modules/next/dist/docs/` before writing framework code, and note `middleware.ts` is now `proxy.ts`.

---

## 🔐 Security

| Concern | How it's handled |
|---|---|
| **Admin authentication** | HTTP Basic Auth enforced in `proxy.ts` (edge) for `/admin` and `/api/guestbook/admin/*`. |
| **Credential comparison** | `lib/auth.ts` uses a length-independent **constant-time** compare over the whole `user:pass` string — no timing/short-circuit leak, edge-runtime safe (no `node:crypto`). |
| **CSRF** | The mutating admin route rejects requests whose `Origin`/`Referer` host ≠ target host (Basic creds auto-replay defense). |
| **Input validation** | Guestbook POST is validated with Zod (name ≤ 40, message ≤ 280, link must be `http(s)://`). |
| **Spam** | Per-IP fixed-window rate limit (5/min) + hidden **honeypot** field that fakes success. |
| **Moderation** | New entries are `pending` and never public until an admin approves them. |
| **Secrets** | All secrets are server-only env vars; no token is ever sent to the client. |
| **Output safety** | Guestbook links are rendered with `rel="noreferrer nofollow"` and `target="_blank"`. |

> ⚠️ The rate limiter is **per-instance in-memory** — best-effort on serverless. For high traffic, swap in Vercel KV / Upstash (noted in `lib/ratelimit.ts`).

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/guestbook` | Public | List approved notes (cached `s-maxage=30, swr=300`). |
| `POST` | `/api/guestbook` | Public | Submit a note → stored as `pending`. Rate-limited; honeypot-aware. |
| `POST` | `/api/guestbook/admin` | Basic Auth + same-origin | Form POST with `id` + `action` (`approve` \| `delete`); redirects to `/admin`. |
| `GET` | `/og` | Public (edge) | Dynamic OG image. Query: `name`, `title`, `tagline`. |
| `GET` | `/sitemap.xml`, `/robots.txt` | Public | SEO endpoints. |

<details>
<summary><strong>Example: submit a guestbook note</strong></summary>

```bash
curl -X POST http://localhost:3000/api/guestbook \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","message":"Love the Steam vibe!","link":"https://example.com"}'
# → 201 { "ok": true }   (now pending; appears after admin approval)
```

```bash
# 400 on invalid input, 429 when over 5 requests/min from one IP
```

</details>

<details>
<summary><strong>Database schema (db/guestbook.sql)</strong></summary>

```sql
create table if not exists guestbook (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  message     text not null,
  link        text,
  status      text not null default 'pending' check (status in ('pending','approved')),
  created_at  timestamptz not null default now()
);
create index if not exists guestbook_status_created_idx on guestbook (status, created_at desc);
```

Apply it once against your Neon/Vercel Postgres database before using the guestbook.

</details>

---

## ❓ FAQ

<details>
<summary><strong>Do I need a GitHub token or a database to run it?</strong></summary>

No. With no env vars the site renders entirely from `data/portfolio.ts`. A token unlocks live stats (and private-repo commit counts); a database enables the guestbook.
</details>

<details>
<summary><strong>Why is there a <code>proxy.ts</code> instead of <code>middleware.ts</code>?</strong></summary>

Next.js 16 renamed middleware to `proxy.ts`. It runs at the edge and Basic-Auth-gates the admin surfaces.
</details>

<details>
<summary><strong>How do project commit counts work for private repos?</strong></summary>

`data/portfolio.ts` carries a static fallback (`commits`/`lastUpdate`). When `GITHUB_TOKEN` has access, `fetchProjectStats` overrides them live via the GitHub API's Link-header "last page" trick.
</details>

<details>
<summary><strong>Is this affiliated with Steam or Valve?</strong></summary>

No. It's a Steam-profile-*inspired* layout. No Steam/Valve logos or assets are used; all branding is original.
</details>

<details>
<summary><strong>Why can't I invent metrics like "10k DAU" in the content?</strong></summary>

Content honesty is a project rule: English copy only, no fabricated metrics. Use feature-truthful labels or leave a `_TODO_OWNER` stub.
</details>

---

## 🗺️ Roadmap

- [x] Steam-profile layout + Recruiter Mode
- [x] Live GitHub stats (ISR) with graceful fallback
- [x] Moderated guestbook (Neon Postgres + edge Basic Auth)
- [x] Achievement badges incl. live "Committed" badge
- [x] Dynamic OG images + SEO (JSON-LD, sitemap, robots)
- [ ] **FloatVision:** Steam automation milestone (4/4) — _from project milestones_
- [ ] Durable rate limiting (Vercel KV / Upstash) — _noted in `lib/ratelimit.ts`_
- [ ] Owner content pass: replace all `_TODO_OWNER` markers + real images/CV

> See [`CHANGELOG.md`](./CHANGELOG.md) for shipped history and [`docs/superpowers/plans`](./docs/superpowers/plans) for design specs.

---

## 🩺 Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Build fails on an image path | `data/assets.test.ts` — a `portfolio` image path has no matching file in `/public`. Add the file. |
| Live GitHub stats are empty | `GITHUB_USERNAME` unset, or rate-limited — add a `GITHUB_TOKEN`. The site still renders from static content. |
| Guestbook throws `DATABASE_URL is not set` | Set `DATABASE_URL` and apply `db/guestbook.sql`. |
| `/admin` returns 401 | Set `GUESTBOOK_ADMIN_USER` / `GUESTBOOK_ADMIN_PASS`; send Basic-Auth credentials. |
| Admin action returns 403 | Same-origin check failed — submit the form from the app itself, not cross-site. |
| `import "sharp"` fails in a script | `sharp` isn't a top-level dep; image scripts load it from Next's bundled `node_modules`. |
| Animations don't run in tests | Expected — tests add `motion-off` to resolve them synchronously. |

---

## 🤝 Contributing

This is a personal portfolio, but improvements are welcome.

1. Fork & branch off `dev` (PRs target `dev`, not `main`).
2. Match the existing style; keep changes surgical.
3. Add/adjust colocated tests (`*.test.ts[x]`).
4. **Gate before pushing:** `npm run lint && npm test && npm run build` must all pass.
5. Keep content honest — no fabricated metrics; English copy only.
6. Open a PR with a clear description.

---

## 📜 License

> **TODO** — no `LICENSE` file is present and `package.json` is marked `private`. All rights reserved by default until a license is added. The SHOOTS / Axel.S branding and personal content are not licensed for reuse.

---

<div align="center">

Built with ❤️ and a little nostalgia by **[Axel.S](https://axelstz.fr)** · Next.js 16 · Deployed on Vercel

</div>
