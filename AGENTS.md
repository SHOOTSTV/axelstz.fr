<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# axelstz.fr — Steam-profile developer portfolio

Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · Vitest. Deploys to Vercel.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build (the real gate; runs TypeScript + static gen)
- `npm run test` — Vitest once; `npm run test -- <pattern>` to filter
- `npm run lint` — ESLint (no path arg)
- `npm run shots` — Playwright screenshots (`scripts/shots.mjs`)
- Tests are colocated (`Foo.ts` → `Foo.test.ts`). Commit after each unit of work.

## Architecture
- `data/portfolio.ts` — single hand-authored content source (`_TODO_OWNER` = owner must supply real value).
- `data/projectDetails.ts` — rich `/projects/[slug]` content keyed by slug; `getProjectDetail()` falls back when a slug is absent.
- `lib/github.ts` — `server-only` live GitHub stats, ISR `revalidate: 3600`.
- Guestbook: `lib/guestbook.ts` is the **only** file importing the Postgres driver (`@neondatabase/serverless`); schema in `db/guestbook.sql`. `proxy.ts` at root is **Next 16's renamed middleware** (was `middleware.ts`) — it Basic-Auth-gates the admin surfaces.
- Env (see `.env.example`): `GITHUB_USERNAME/TOKEN`, `DATABASE_URL`, `GUESTBOOK_ADMIN_USER/PASS`.

## Gotchas
- **Content honesty:** English copy only; never invent metrics (DAU/uptime/stars). Use feature-truthful labels or leave a `_TODO_OWNER` stub.
- **Slug agreement:** `lib/slug.ts` is shared by the projects library links and the `[slug]` route's `generateStaticParams` — both must agree; don't fork the logic.
- **Asset paths:** `data/assets.test.ts` fails if any `portfolio` image path doesn't resolve to a file in `/public`. Add the file before referencing it.
- Tests force `document.body.classList.add("motion-off")` to make animations resolve synchronously.
- jsdom "HTMLCanvasElement.getContext()" warnings during tests are harmless (Starfield canvas).
- Image scripts (`scripts/compress-images.mjs`, `gen-brand-assets.mjs`) load `sharp` from Next's own `node_modules` — it's not a declared dep; don't `import "sharp"` expecting a top-level install.
