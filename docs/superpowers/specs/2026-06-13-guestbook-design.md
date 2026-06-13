# Guestbook — Design Spec

**Date:** 2026-06-13
**Status:** Approved (brainstorming) → ready for implementation plan
**Replaces:** the fabricated `testimonials` array + local-only `Testimonials.tsx` comment box. Closes the testimonial half of awwwards-plan **T3** and the "Subscribe to thread" item of **T5**.

## Goal

Turn the Steam-style "Testimonials" comment thread into a **real, persistent, moderated guestbook**: visitors leave a note (name + message + optional link); notes are stored `pending` and only appear publicly after the owner approves them via a protected in-app admin page. Styling stays faithful to the existing Steam profile-comment look (avatar · username · timestamp · message; clickable profile pic when a link is given).

## Non-goals (YAGNI for v1)

- No comment pager (the `1·2·3·4·5·6` control) — show newest ~100.
- No per-IP rate-limiting — moderation + honeypot + length caps are sufficient.
- No avatar uploads — avatars are generated deterministically from the name.
- No edit/threading/reactions.

## Architecture (Approach A: static shell + client island + route handlers)

The homepage stays statically prerendered. The guestbook is the only dynamic surface, confined to:

- **One client island** `components/steam/Guestbook.tsx` (replaces `Testimonials.tsx`) — fetches approved notes on mount, renders the Steam comment list + submission form.
- **One public route handler** `app/api/guestbook/route.ts` — `GET` approved notes, `POST` a pending note.
- **One admin route** `app/guestbook/admin/page.tsx` + **one admin route handler** `app/api/guestbook/admin/route.ts` — list pending, approve, delete. Protected by Basic Auth.
- **One DB module** `lib/guestbook.ts` — the *only* file that imports the Postgres driver. Everything else depends on this interface and mocks it in tests.
- **One proxy** `proxy.ts` — Basic Auth gate over `/guestbook/admin` and `/api/guestbook/admin`. (Next 16 renamed `middleware.ts` → `proxy.ts`; same functionality.)

### Data model

Postgres table `guestbook`:

| column | type | constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | NOT NULL, app-enforced ≤ 40 chars |
| `message` | `text` | NOT NULL, app-enforced ≤ 280 chars |
| `link` | `text` | NULL; app-enforced `https?://…`, ≤ 200 chars |
| `status` | `text` | NOT NULL, default `'pending'`, CHECK in (`'pending'`,`'approved'`) |
| `created_at` | `timestamptz` | NOT NULL, default `now()` |

Index: `create index on guestbook (status, created_at desc);`

Migration lives at `db/guestbook.sql` (idempotent: `create table if not exists`, `create index if not exists`).

### DB driver

`@neondatabase/serverless` (the `neon()` HTTP tagged-template function). Vercel Postgres is Neon now and `@vercel/postgres` is deprecated. Connection string from env `DATABASE_URL` (provided by the Vercel↔Neon integration). `lib/guestbook.ts` reads `DATABASE_URL` and exposes:

```ts
listApproved(limit = 100): Promise<Note[]>   // status='approved' order by created_at desc
listPending(): Promise<Note[]>               // status='pending' order by created_at asc
insertPending(input: { name; message; link? }): Promise<void>
approve(id: string): Promise<void>
remove(id: string): Promise<void>
```

`Note = { id, name, message, link, createdAt }` (status omitted from the public shape).

## Data flow

### Public — `app/api/guestbook/route.ts`
- **GET** → `listApproved()` as JSON. Cache header `s-maxage=30, stale-while-revalidate=300`.
- **POST** → parse body, validate with Zod:
  - `name`: trimmed, 1–40 chars.
  - `message`: trimmed, 1–280 chars.
  - `link`: optional; if present, must match `^https?://` and ≤ 200 chars.
  - `hp` (honeypot): if non-empty → return `200 {ok:true}` **without inserting** (silently drop bots).
  - On valid input → `insertPending(...)` → `201 {ok:true}`. On invalid → `400 {error}`.

### Client island — `components/steam/Guestbook.tsx`
- On mount: `GET /api/guestbook` → render list. Loading + error states.
- Form fields: `name`, `message` (textarea), `link` (optional), hidden honeypot input `hp` (visually hidden, `autocomplete="off"`, `tabIndex=-1`).
- On submit → `POST` → on success: clear form, show inline confirmation **"Thanks — your note is awaiting approval."** The note is **not** added to the visible list (it's pending).
- Empty state (no approved notes): **"Be the first to sign the guestbook."**
- Each rendered note: generated avatar tile · `name` · greyed timestamp · `message`. If `link` present, the avatar is wrapped in `<a href={link} target="_blank" rel="noreferrer nofollow">`.

### Avatar generation
Deterministic, no network, no upload: hash `name` → pick a hue/background from a small palette; render a tile showing the first initial in the existing Steam frame styling. Implemented as a tiny pure helper (`avatarFor(name) → { bg, initial }`) so it's unit-testable.

## Admin + auth

- `proxy.ts` (root): `config.matcher` covers `/guestbook/admin` and `/api/guestbook/admin/:path*`. Reads `Authorization: Basic …`; compares against `GUESTBOOK_ADMIN_USER` / `GUESTBOOK_ADMIN_PASS`. On mismatch → `401` with `WWW-Authenticate: Basic`. The compare logic is a pure exported function `checkBasicAuth(header, user, pass)` (in `lib/auth.ts`) so it is unit-testable without the edge runtime.
- `app/guestbook/admin/page.tsx` (server component, `dynamic = 'force-dynamic'`): `listPending()` → table of pending notes with **Approve** and **Delete** buttons (each a form posting to the admin route handler).
- `app/api/guestbook/admin/route.ts`: **POST** `{ id, action: 'approve' | 'delete' }` → `approve(id)` or `remove(id)` → redirect/200. Re-reads behind the same middleware gate (defense in depth: the handler also runs under middleware).

## Validation / spam posture

Moderation is the real gate (nothing public until approved). Layered cheap defenses: Zod length caps, `https?://`-only links, honeypot field, and `rel="nofollow"` on rendered links (SEO/abuse). No rate-limiter in v1.

## UI / integration changes

- Delete `components/steam/Testimonials.tsx` + `Testimonials.test.tsx`; add `Guestbook.tsx` + `Guestbook.test.tsx`. Update the import/usage in `components/Profile.tsx`.
- Section heading **"Testimonials" → "Guestbook"**; **remove** the "Subscribe to thread" element.
- Section wrapper id becomes `#guestbook`; add **"GUESTBOOK"** to `data/portfolio.ts` `nav` (current: `["PROFILE","PROJECTS","ACTIVITY","CONTACT"]` → insert `GUESTBOOK` before `CONTACT`).
- `lib/types.ts`: the `Testimonial`/`testimonials` portfolio field is now unused by the homepage (guestbook notes come from the DB, not `data/portfolio.ts`). Remove `testimonials` from `PortfolioData` + the `Testimonial` interface, and drop the empty `testimonials: []` from `data/portfolio.ts`. Update `data/portfolio.test.ts` (the "guestbook starts empty" assertion) and `data/assets.test.ts` (testimonial image loop) accordingly. The `counts` "Reviews" row stays `n: null` (could later reflect approved count, out of scope).

## Testing

- `lib/guestbook.test.ts`: query builders/shape mapping with the `neon` driver mocked.
- `app/api/guestbook/route.test.ts`: POST rejects empty/oversized name+message, honeypot short-circuits (no insert), valid input inserts pending; GET returns approved JSON. DB module mocked.
- `app/api/guestbook/admin/route.test.ts`: approve/delete dispatch on `action`. DB module mocked.
- `components/steam/Guestbook.test.tsx`: renders fetched notes; empty state; submit shows the pending confirmation and does not add to the list; honeypot input present. `fetch` mocked.
- `middleware.test.ts` (or `lib/auth.test.ts`): `checkBasicAuth` accepts correct creds, rejects wrong/missing.
- `avatarFor` unit test: deterministic output per name.

## Env / provisioning

New env (add to `.env.example`):
```
DATABASE_URL=            # Neon/Vercel Postgres connection string (server-only)
GUESTBOOK_ADMIN_USER=    # Basic-auth user for /guestbook/admin
GUESTBOOK_ADMIN_PASS=    # Basic-auth password
```
Provisioning (owner action): create a Postgres database via the Vercel Storage tab (Neon), which injects `DATABASE_URL`; run `db/guestbook.sql` against it once. Local dev: point `DATABASE_URL` at a Neon dev branch (or local Postgres).

## File map

| File | Action |
|------|--------|
| `db/guestbook.sql` | **create** — schema migration |
| `lib/guestbook.ts` | **create** — DB access module (only driver importer) |
| `lib/auth.ts` | **create** — `checkBasicAuth` pure helper |
| `proxy.ts` | **create** — Basic-auth gate for admin paths (Next 16 middleware) |
| `app/api/guestbook/route.ts` | **create** — public GET/POST |
| `app/api/guestbook/admin/route.ts` | **create** — approve/delete |
| `app/guestbook/admin/page.tsx` | **create** — pending list UI |
| `components/steam/Guestbook.tsx` | **create** — client island (replaces Testimonials) |
| `components/primitives/avatar.ts` | **create** — `avatarFor(name)` helper |
| `components/steam/Testimonials.tsx` / `.test.tsx` | **delete** |
| `components/Profile.tsx` | **modify** — swap Testimonials → Guestbook |
| `data/portfolio.ts` | **modify** — add GUESTBOOK nav, drop `testimonials` |
| `lib/types.ts` | **modify** — drop `Testimonial` + `testimonials` |
| `data/portfolio.test.ts`, `data/assets.test.ts`, `lib/types.test.ts` | **modify** — drop testimonial refs |
| `app/globals.css` | **modify** — guestbook form/confirmation/admin styling (reuse existing `.comment*`) |
| `.env.example` | **modify** — add the three vars |
| `package.json` | **modify** — add `@neondatabase/serverless`, `zod` (if not present) |

## Open items to confirm at plan time
- `zod` is **not** currently a dependency (verified 2026-06-13) despite the stack copy — add it alongside `@neondatabase/serverless`. No `proxy.ts` exists yet. Target Next `16.2.7`, React `19.2.4`.
- **Resolved (2026-06-13, from bundled docs):** Next 16 route handlers use Web `Request`/`Response`, are uncached by default (set `Cache-Control` manually); middleware is now `proxy.ts` at project root — `export function proxy(req: NextRequest)` + `export const config = { matcher: [...] }`.
