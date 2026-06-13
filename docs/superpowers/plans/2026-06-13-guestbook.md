# Guestbook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fabricated, local-only "Testimonials" comment box with a real, persistent, **moderated** guestbook: visitors post a note (name + message + optional link); notes are stored `pending` and only appear after the owner approves them via a Basic-Auth-protected in-app admin page.

**Architecture:** Approach A — the static homepage is untouched; the guestbook is one client island that talks to two route handlers. All DB access is isolated in `lib/guestbook.ts` (the only file importing the Postgres driver). A root `proxy.ts` (Next 16's renamed middleware) gates the admin surfaces with Basic Auth.

**Tech Stack:** Next.js 16.2.7 (App Router, RSC), React 19.2.4, TypeScript, `@neondatabase/serverless` (Vercel/Neon Postgres), `zod`, Vitest + Testing Library. Spec: `docs/superpowers/specs/2026-06-13-guestbook-design.md`.

**Conventions (verified against `node_modules/next/dist/docs/` 2026-06-13):**
- Route handlers: `export async function GET/POST(request: Request)`, return `Response.json(...)`. **Uncached by default** — set `Cache-Control` manually.
- Middleware is now **`proxy.ts`** at project root: `export function proxy(req: NextRequest)` + `export const config = { matcher: [...] }`.
- Tests live beside source (`Foo.ts` → `Foo.test.ts`). Run `npm run test -- <pattern>`; lint `npm run lint`; build `npm run build`.
- Commit after every task. Branch `feat/portfolio-implementation` (already checked out); do not commit to `main`.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `db/guestbook.sql` | Idempotent schema migration (table + index). |
| `lib/guestbook.ts` | **Only** Postgres-driver importer; CRUD: `listApproved`, `listPending`, `insertPending`, `approve`, `remove`. |
| `lib/auth.ts` | Pure `checkBasicAuth(header, user, pass)` — no framework deps. |
| `components/primitives/avatar.ts` | Pure `avatarFor(name)` → `{ bg, initial }`. |
| `app/api/guestbook/route.ts` | Public `GET` (approved) + `POST` (insert pending, Zod + honeypot). |
| `app/api/guestbook/admin/route.ts` | `POST` approve/delete (formData). |
| `app/guestbook/admin/page.tsx` | Server page listing pending notes with Approve/Delete forms. |
| `proxy.ts` | Basic-Auth gate over admin paths. |
| `components/steam/Guestbook.tsx` | Client island: fetch approved, render list + form. Replaces `Testimonials.tsx`. |
| `components/Profile.tsx` | Swap `Testimonials` → `Guestbook`. |
| `data/portfolio.ts`, `lib/types.ts` | Add `GUESTBOOK` nav; drop unused `testimonials`/`Testimonial`. |
| `app/globals.css` | Guestbook form/confirmation/admin styling (reuse `.comment*`). |
| `.env.example`, `package.json` | New env vars; new deps. |

---

## Task 1: Add dependencies + DB schema

**Files:**
- Modify: `package.json` (via npm install)
- Create: `db/guestbook.sql`
- Modify: `.env.example`

- [ ] **Step 1: Install deps**

Run: `npm install @neondatabase/serverless zod`
Expected: both added to `dependencies`; lockfile updated.

- [ ] **Step 2: Create the schema migration** — `db/guestbook.sql`:

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

- [ ] **Step 3: Document env** — append to `.env.example`:

```
# Guestbook (server-only). Vercel/Neon Postgres connection string + admin Basic-Auth creds.
DATABASE_URL=
GUESTBOOK_ADMIN_USER=
GUESTBOOK_ADMIN_PASS=
```

- [ ] **Step 4: Verify the app still builds**

Run: `npm run lint && npm run test`
Expected: PASS (no code changes yet).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json db/guestbook.sql .env.example
git commit -m "chore(guestbook): add neon+zod deps, schema migration, env vars"
```

---

## Task 2: DB access module `lib/guestbook.ts`

**Files:**
- Create: `lib/guestbook.ts`
- Test: `lib/guestbook.test.ts`

- [ ] **Step 1: Write the failing test** — `lib/guestbook.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sql = vi.fn();
vi.mock("@neondatabase/serverless", () => ({ neon: vi.fn(() => sql) }));

import { listApproved, insertPending, approve, remove } from "./guestbook";

beforeEach(() => {
  sql.mockReset();
  process.env.DATABASE_URL = "postgres://test";
});

describe("lib/guestbook", () => {
  it("listApproved maps rows to Note shape", async () => {
    sql.mockResolvedValueOnce([
      { id: "1", name: "Ann", message: "hi", link: null, created_at: "2026-01-01T00:00:00Z" },
    ]);
    const notes = await listApproved();
    expect(notes).toEqual([
      { id: "1", name: "Ann", message: "hi", link: null, createdAt: "2026-01-01T00:00:00Z" },
    ]);
  });

  it("insertPending runs a query", async () => {
    sql.mockResolvedValueOnce([]);
    await insertPending({ name: "Ann", message: "hi" });
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it("approve and remove run a query", async () => {
    sql.mockResolvedValue([]);
    await approve("1");
    await remove("2");
    expect(sql).toHaveBeenCalledTimes(2);
  });

  it("throws when DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;
    await expect(listApproved()).rejects.toThrow(/DATABASE_URL/);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- guestbook.test`
Expected: FAIL (module/exports missing).

- [ ] **Step 3: Implement** — `lib/guestbook.ts`:

```ts
import { neon } from "@neondatabase/serverless";

export interface Note {
  id: string;
  name: string;
  message: string;
  link: string | null;
  createdAt: string;
}

interface Row {
  id: string;
  name: string;
  message: string;
  link: string | null;
  created_at: string;
}

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

const toNote = (r: Row): Note => ({
  id: r.id,
  name: r.name,
  message: r.message,
  link: r.link,
  createdAt: r.created_at,
});

export async function listApproved(limit = 100): Promise<Note[]> {
  const sql = db();
  const rows = (await sql`
    select id, name, message, link, created_at from guestbook
    where status = 'approved' order by created_at desc limit ${limit}
  `) as Row[];
  return rows.map(toNote);
}

export async function listPending(): Promise<Note[]> {
  const sql = db();
  const rows = (await sql`
    select id, name, message, link, created_at from guestbook
    where status = 'pending' order by created_at asc
  `) as Row[];
  return rows.map(toNote);
}

export async function insertPending(input: { name: string; message: string; link?: string }): Promise<void> {
  const sql = db();
  await sql`
    insert into guestbook (name, message, link)
    values (${input.name}, ${input.message}, ${input.link ?? null})
  `;
}

export async function approve(id: string): Promise<void> {
  const sql = db();
  await sql`update guestbook set status = 'approved' where id = ${id}`;
}

export async function remove(id: string): Promise<void> {
  const sql = db();
  await sql`delete from guestbook where id = ${id}`;
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm run test -- guestbook.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/guestbook.ts lib/guestbook.test.ts
git commit -m "feat(guestbook): DB access module with neon driver isolated"
```

---

## Task 3: Avatar helper `components/primitives/avatar.ts`

**Files:**
- Create: `components/primitives/avatar.ts`
- Test: `components/primitives/avatar.test.ts`

- [ ] **Step 1: Write the failing test** — `components/primitives/avatar.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { avatarFor } from "./avatar";

describe("avatarFor", () => {
  it("uses the first alphanumeric character as the initial", () => {
    expect(avatarFor("Ann").initial).toBe("A");
    expect(avatarFor("  zoe").initial).toBe("Z");
  });
  it("falls back to ? for empty names", () => {
    expect(avatarFor("").initial).toBe("?");
  });
  it("is deterministic for the same name", () => {
    expect(avatarFor("Ann")).toEqual(avatarFor("Ann"));
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- avatar.test`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement** — `components/primitives/avatar.ts`:

```ts
const PALETTE = ["#3a3a3a", "#2a5a8a", "#7a2f5a", "#5a4b8a", "#6a3a3a", "#2a6a5a"];

export function avatarFor(name: string): { bg: string; initial: string } {
  const trimmed = name.trim();
  const initial = (trimmed.match(/[a-z0-9]/i)?.[0] ?? "?").toUpperCase();
  let h = 0;
  for (let i = 0; i < trimmed.length; i++) h = (h * 31 + trimmed.charCodeAt(i)) >>> 0;
  return { bg: PALETTE[h % PALETTE.length], initial };
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm run test -- avatar.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/primitives/avatar.ts components/primitives/avatar.test.ts
git commit -m "feat(guestbook): deterministic avatar helper"
```

---

## Task 4: Basic-Auth helper `lib/auth.ts`

**Files:**
- Create: `lib/auth.ts`
- Test: `lib/auth.test.ts`

- [ ] **Step 1: Write the failing test** — `lib/auth.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { checkBasicAuth } from "./auth";

const header = (u: string, p: string) => "Basic " + btoa(`${u}:${p}`);

describe("checkBasicAuth", () => {
  it("accepts matching credentials", () => {
    expect(checkBasicAuth(header("admin", "secret"), "admin", "secret")).toBe(true);
  });
  it("rejects wrong password", () => {
    expect(checkBasicAuth(header("admin", "nope"), "admin", "secret")).toBe(false);
  });
  it("rejects missing or malformed header", () => {
    expect(checkBasicAuth(null, "admin", "secret")).toBe(false);
    expect(checkBasicAuth("Bearer xyz", "admin", "secret")).toBe(false);
    expect(checkBasicAuth("Basic !!!notbase64", "admin", "secret")).toBe(false);
  });
  it("rejects when configured creds are blank", () => {
    expect(checkBasicAuth(header("", ""), "", "")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- auth.test`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement** — `lib/auth.ts`:

```ts
export function checkBasicAuth(header: string | null, user: string, pass: string): boolean {
  if (!header || !header.startsWith("Basic ") || !user || !pass) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return false;
  }
  const idx = decoded.indexOf(":");
  if (idx === -1) return false;
  return decoded.slice(0, idx) === user && decoded.slice(idx + 1) === pass;
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm run test -- auth.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts lib/auth.test.ts
git commit -m "feat(guestbook): pure Basic-Auth check helper"
```

---

## Task 5: Public route handler `app/api/guestbook/route.ts`

**Files:**
- Create: `app/api/guestbook/route.ts`
- Test: `app/api/guestbook/route.test.ts`

- [ ] **Step 1: Write the failing test** — `app/api/guestbook/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/guestbook", () => ({
  listApproved: vi.fn(async () => [
    { id: "1", name: "Ann", message: "hi", link: null, createdAt: "2026-01-01T00:00:00Z" },
  ]),
  insertPending: vi.fn(async () => {}),
}));

import { GET, POST } from "./route";
import { insertPending } from "@/lib/guestbook";

const postReq = (body: unknown) =>
  new Request("http://localhost/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

beforeEach(() => vi.clearAllMocks());

describe("GET /api/guestbook", () => {
  it("returns approved notes", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });
});

describe("POST /api/guestbook", () => {
  it("inserts a valid pending note", async () => {
    const res = await POST(postReq({ name: "Bo", message: "nice site" }));
    expect(res.status).toBe(201);
    expect(insertPending).toHaveBeenCalledWith({ name: "Bo", message: "nice site", link: undefined });
  });
  it("rejects empty name/message", async () => {
    const res = await POST(postReq({ name: "", message: "" }));
    expect(res.status).toBe(400);
    expect(insertPending).not.toHaveBeenCalled();
  });
  it("rejects an over-long message", async () => {
    const res = await POST(postReq({ name: "Bo", message: "x".repeat(281) }));
    expect(res.status).toBe(400);
  });
  it("rejects a non-http link", async () => {
    const res = await POST(postReq({ name: "Bo", message: "hi", link: "javascript:alert(1)" }));
    expect(res.status).toBe(400);
  });
  it("silently drops honeypot submissions without inserting", async () => {
    const res = await POST(postReq({ name: "Bo", message: "hi", hp: "i am a bot" }));
    expect(res.status).toBe(200);
    expect(insertPending).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- api/guestbook/route.test`
Expected: FAIL (route missing).

- [ ] **Step 3: Implement** — `app/api/guestbook/route.ts`:

```ts
import { z } from "zod";
import { listApproved, insertPending } from "@/lib/guestbook";

const schema = z.object({
  name: z.string().trim().min(1).max(40),
  message: z.string().trim().min(1).max(280),
  link: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(200).regex(/^https?:\/\//, "must start with http(s)://").optional(),
  ),
  hp: z.string().optional(),
});

export async function GET() {
  const notes = await listApproved();
  return Response.json(notes, {
    headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=300" },
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "invalid input" }, { status: 400 });

  const { name, message, link, hp } = parsed.data;
  if (hp && hp.length > 0) return Response.json({ ok: true }); // honeypot: pretend success

  await insertPending({ name, message, link });
  return Response.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm run test -- api/guestbook/route.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/guestbook/route.ts app/api/guestbook/route.test.ts
git commit -m "feat(guestbook): public GET/POST route with zod validation + honeypot"
```

---

## Task 6: Admin Basic-Auth proxy `proxy.ts`

**Files:**
- Create: `proxy.ts`

> No unit test: `proxy` is thin glue over `checkBasicAuth` (already fully tested in Task 4); constructing a `NextRequest` in the edge runtime under jsdom is unreliable. Verified via build + manual check.

- [ ] **Step 1: Implement** — `proxy.ts` (project root):

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkBasicAuth } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const ok = checkBasicAuth(
    req.headers.get("authorization"),
    process.env.GUESTBOOK_ADMIN_USER ?? "",
    process.env.GUESTBOOK_ADMIN_PASS ?? "",
  );
  if (!ok) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="guestbook admin"' },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/guestbook/admin", "/api/guestbook/admin/:path*"],
};
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run lint && npm run build`
Expected: PASS; build output lists `proxy` compiled.

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "feat(guestbook): Basic-Auth proxy gating admin paths"
```

---

## Task 7: Admin route handler `app/api/guestbook/admin/route.ts`

**Files:**
- Create: `app/api/guestbook/admin/route.ts`
- Test: `app/api/guestbook/admin/route.test.ts`

- [ ] **Step 1: Write the failing test** — `app/api/guestbook/admin/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/guestbook", () => ({
  approve: vi.fn(async () => {}),
  remove: vi.fn(async () => {}),
}));

import { POST } from "./route";
import { approve, remove } from "@/lib/guestbook";

const formReq = (fields: Record<string, string>) =>
  new Request("http://localhost/api/guestbook/admin", {
    method: "POST",
    body: new URLSearchParams(fields),
  });

beforeEach(() => vi.clearAllMocks());

describe("POST /api/guestbook/admin", () => {
  it("approves a note", async () => {
    const res = await POST(formReq({ id: "1", action: "approve" }));
    expect(approve).toHaveBeenCalledWith("1");
    expect(res.status).toBe(303);
  });
  it("deletes a note", async () => {
    await POST(formReq({ id: "2", action: "delete" }));
    expect(remove).toHaveBeenCalledWith("2");
  });
  it("rejects a missing id", async () => {
    const res = await POST(formReq({ action: "approve" }));
    expect(res.status).toBe(400);
    expect(approve).not.toHaveBeenCalled();
  });
  it("rejects an unknown action", async () => {
    const res = await POST(formReq({ id: "1", action: "nuke" }));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- api/guestbook/admin/route.test`
Expected: FAIL (route missing).

- [ ] **Step 3: Implement** — `app/api/guestbook/admin/route.ts`:

```ts
import { approve, remove } from "@/lib/guestbook";

export async function POST(request: Request) {
  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const action = String(form.get("action") ?? "");

  if (!id) return Response.json({ error: "missing id" }, { status: 400 });

  if (action === "approve") await approve(id);
  else if (action === "delete") await remove(id);
  else return Response.json({ error: "bad action" }, { status: 400 });

  return Response.redirect(new URL("/guestbook/admin", request.url), 303);
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm run test -- api/guestbook/admin/route.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/guestbook/admin/route.ts app/api/guestbook/admin/route.test.ts
git commit -m "feat(guestbook): admin approve/delete route handler"
```

---

## Task 8: Admin page `app/guestbook/admin/page.tsx`

**Files:**
- Create: `app/guestbook/admin/page.tsx`

> No unit test: server component reading the DB; verified manually behind the proxy.

- [ ] **Step 1: Implement** — `app/guestbook/admin/page.tsx`:

```tsx
import { listPending } from "@/lib/guestbook";

export const dynamic = "force-dynamic";

export default async function GuestbookAdminPage() {
  const pending = await listPending();
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px", color: "#c7d5e0", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 22 }}>Guestbook — pending ({pending.length})</h1>
      {pending.length === 0 && <p>Nothing to review.</p>}
      {pending.map((n) => (
        <div key={n.id} style={{ border: "1px solid #2a3138", borderRadius: 6, padding: 12, margin: "12px 0" }}>
          <div style={{ fontWeight: 600 }}>
            {n.name}
            {n.link && (
              <a href={n.link} target="_blank" rel="noreferrer nofollow" style={{ marginLeft: 8, fontSize: 12 }}>
                {n.link}
              </a>
            )}
          </div>
          <div style={{ margin: "6px 0", whiteSpace: "pre-wrap" }}>{n.message}</div>
          <div style={{ fontSize: 12, color: "#7a8794" }}>{n.createdAt}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <form action="/api/guestbook/admin" method="post">
              <input type="hidden" name="id" value={n.id} />
              <input type="hidden" name="action" value="approve" />
              <button type="submit">Approve</button>
            </form>
            <form action="/api/guestbook/admin" method="post">
              <input type="hidden" name="id" value={n.id} />
              <input type="hidden" name="action" value="delete" />
              <button type="submit">Delete</button>
            </form>
          </div>
        </div>
      ))}
    </main>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/guestbook/admin/page.tsx
git commit -m "feat(guestbook): admin review page (pending list, approve/delete)"
```

---

## Task 9: Client island `components/steam/Guestbook.tsx`

**Files:**
- Create: `components/steam/Guestbook.tsx`
- Test: `components/steam/Guestbook.test.tsx`

> Built alongside the still-present `Testimonials.tsx`; the swap + cleanup happens in Task 10, keeping the suite green here.

- [ ] **Step 1: Write the failing test** — `components/steam/Guestbook.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Guestbook } from "@/components/steam/Guestbook";

function mockFetch(getNotes: unknown[]) {
  return vi.fn(async (url: string | URL, init?: RequestInit) => {
    if (init?.method === "POST") return new Response(JSON.stringify({ ok: true }), { status: 201 });
    return new Response(JSON.stringify(getNotes), { status: 200 });
  });
}

beforeEach(() => vi.restoreAllMocks());

describe("Guestbook", () => {
  it("renders approved notes from the API", async () => {
    vi.stubGlobal("fetch", mockFetch([
      { id: "1", name: "Ann", message: "love it", link: null, createdAt: "2026-01-01T00:00:00Z" },
    ]));
    render(<Guestbook />);
    expect(await screen.findByText("love it")).toBeTruthy();
    expect(screen.getByText("Ann")).toBeTruthy();
  });

  it("shows an empty state when there are no notes", async () => {
    vi.stubGlobal("fetch", mockFetch([]));
    render(<Guestbook />);
    expect(await screen.findByText(/be the first to sign/i)).toBeTruthy();
  });

  it("confirms after posting and does not add the note to the list", async () => {
    vi.stubGlobal("fetch", mockFetch([]));
    render(<Guestbook />);
    await screen.findByText(/be the first to sign/i);
    await userEvent.type(screen.getByPlaceholderText(/your name/i), "Bo");
    await userEvent.type(screen.getByPlaceholderText(/leave a note/i), "great work");
    await userEvent.click(screen.getByRole("button", { name: /sign/i }));
    await waitFor(() => expect(screen.getByText(/awaiting approval/i)).toBeTruthy());
    expect(screen.queryByText("great work")).toBeNull();
  });

  it("renders a hidden honeypot field", () => {
    vi.stubGlobal("fetch", mockFetch([]));
    const { container } = render(<Guestbook />);
    expect(container.querySelector('input[name="hp"]')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm run test -- Guestbook.test`
Expected: FAIL (component missing).

- [ ] **Step 3: Implement** — `components/steam/Guestbook.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { avatarFor } from "@/components/primitives/avatar";

interface Note {
  id: string;
  name: string;
  message: string;
  link: string | null;
  createdAt: string;
}

function Avatar({ name }: { name: string }) {
  const { bg, initial } = avatarFor(name);
  return (
    <span className="gb-av" style={{ background: bg }} aria-hidden>
      {initial}
    </span>
  );
}

export function Guestbook() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [hp, setHp] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d: Note[]) => { if (active) { setNotes(d); setLoaded(true); } })
      .catch(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  const sign = async () => {
    if (!name.trim() || !message.trim()) return;
    await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, link, hp }),
    });
    setName(""); setMessage(""); setLink(""); setSent(true);
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
  };

  return (
    <div className="comments" id="guestbook">
      <div className="comments-head">
        <span className="h">Guestbook</span>
      </div>

      {sent ? (
        <div className="gb-sent">Thanks — your note is awaiting approval.</div>
      ) : (
        <div className="comment-box gb-form">
          <span className="cb-av"><Avatar name={name || "?"} /></span>
          <span className="cb-field">
            <input className="gb-name" placeholder="Your name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Leave a note" value={message} maxLength={280} onChange={(e) => setMessage(e.target.value)} />
            <input className="gb-link" placeholder="Link (optional, https://…)" value={link} maxLength={200} onChange={(e) => setLink(e.target.value)} />
            <input className="gb-hp" name="hp" tabIndex={-1} autoComplete="off" aria-hidden value={hp} onChange={(e) => setHp(e.target.value)} />
            <button className="post" onClick={sign}>Sign the guestbook</button>
          </span>
        </div>
      )}

      {loaded && notes.length === 0 && !sent && (
        <div className="gb-empty">Be the first to sign the guestbook.</div>
      )}

      {notes.map((c) => (
        <div className="comment" key={c.id}>
          <span className="c-av">
            {c.link ? (
              <a href={c.link} target="_blank" rel="noreferrer nofollow"><Avatar name={c.name} /></a>
            ) : (
              <Avatar name={c.name} />
            )}
          </span>
          <span className="c-main">
            <span className="c-top">
              <span className="c-name">{c.name}</span>
              <span className="c-date">{fmtDate(c.createdAt)}</span>
            </span>
            <div className="c-text">{c.message}</div>
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm run test -- Guestbook.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/steam/Guestbook.tsx components/steam/Guestbook.test.tsx
git commit -m "feat(guestbook): client island (fetch approved, sign form, honeypot)"
```

---

## Task 10: Wire in + remove the old testimonials

**Files:**
- Modify: `components/Profile.tsx`
- Delete: `components/steam/Testimonials.tsx`, `components/steam/Testimonials.test.tsx`
- Modify: `lib/types.ts`, `data/portfolio.ts`
- Modify: `data/portfolio.test.ts`, `data/assets.test.ts`, `lib/types.test.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Swap the component in `components/Profile.tsx`.** Replace the import line:

```tsx
import { Testimonials } from "@/components/steam/Testimonials";
```
with:
```tsx
import { Guestbook } from "@/components/steam/Guestbook";
```
and replace the usage line `<Testimonials data={data} />` with:
```tsx
<Guestbook />
```

- [ ] **Step 2: Add the nav anchor in `data/portfolio.ts`.** Change:

```ts
nav: ["PROFILE", "PROJECTS", "ACTIVITY", "CONTACT"],
```
to:
```ts
nav: ["PROFILE", "PROJECTS", "ACTIVITY", "GUESTBOOK", "CONTACT"],
```

- [ ] **Step 3: Drop the unused `testimonials` data** from `data/portfolio.ts` — remove this line entirely:

```ts
  testimonials: [], // guestbook: real visitor entries replace the old fabricated quotes
```

- [ ] **Step 4: Drop `Testimonial` from `lib/types.ts`.** Remove the interface line:

```ts
export interface Testimonial { name: string; date: string; text: string; image: string; special?: boolean; }
```
and remove the `testimonials: Testimonial[];` field from `PortfolioData`.

- [ ] **Step 5: Delete the old component + its test:**

```bash
git rm components/steam/Testimonials.tsx components/steam/Testimonials.test.tsx
```

- [ ] **Step 6: Fix the three data/type tests.**

In `data/portfolio.test.ts`, remove the block:
```ts
  it("ships no fabricated testimonials (guestbook starts empty)", () => {
    expect(portfolio.testimonials).toEqual([]);
  });
```

In `data/assets.test.ts`, remove the line:
```ts
  portfolio.testimonials.forEach((t) => push(t.image));
```

In `lib/types.test.ts`, remove the `testimonials: [...]` line from the `sample` object.

- [ ] **Step 7: Add guestbook CSS** to `app/globals.css` (reuses existing `.comment*`; append near the comments styles):

```css
/* ---------------- GUESTBOOK ---------------- */
.gb-av { width: 100%; height: 100%; display: grid; place-items: center; color: #fff; font-weight: 700; font-size: 16px; }
.gb-form .cb-field { display: flex; flex-direction: column; gap: 6px; }
.gb-form .gb-name, .gb-form .gb-link { background: #16191d; border: 1px solid #000; color: var(--text); padding: 7px 9px; font-size: 13px; }
.gb-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.gb-sent { color: var(--ingame); padding: 12px 0; font-size: 14px; }
.gb-empty { color: var(--muted2); padding: 12px 0; font-size: 13px; }
```

- [ ] **Step 8: Run the full suite + lint + build**

Run: `npm run test && npm run lint && npm run build`
Expected: PASS — no references to `Testimonial`/`testimonials` remain; homepage still prerenders.

- [ ] **Step 9: Commit**

```bash
git add components/Profile.tsx data/portfolio.ts lib/types.ts data/portfolio.test.ts data/assets.test.ts lib/types.test.ts app/globals.css
git commit -m "feat(guestbook): swap Testimonials -> Guestbook, add nav anchor, drop dead testimonial type"
```

---

## Final Verification

- [ ] `npm run build` — clean; homepage `○ (Static)`, `/guestbook/admin` dynamic, `proxy` compiled.
- [ ] `npm run test` — all suites green.
- [ ] `npm run lint` — no errors.
- [ ] **Manual (owner, needs a real DB):** set `DATABASE_URL` + admin creds; run `db/guestbook.sql`; `npm run dev`. Post a note → "awaiting approval"; it does not appear. Visit `/guestbook/admin` (Basic-Auth prompt) → Approve → note appears on the homepage guestbook. Wrong creds → 401.

---

## Self-Review

- **Spec coverage:** data model → T1; `lib/guestbook` interface → T2; avatar → T3; `checkBasicAuth`/proxy → T4+T6; public GET/POST + Zod + honeypot + cache header → T5; admin route → T7; admin page → T8; client island (fetch/sign/pending/empty/clickable-avatar) → T9; section rename + dead-chrome removal + nav anchor + type/data cleanup + CSS + env → T1/T10. All spec sections map to a task.
- **Placeholders:** none — every code step shows full code; manual-only tasks (T6/T8) are flagged with the reason.
- **Type consistency:** `Note { id, name, message, link, createdAt }` is identical across `lib/guestbook.ts`, the route, and `Guestbook.tsx`. `insertPending({ name, message, link? })` matches the POST call site. `checkBasicAuth(header, user, pass)` signature matches `proxy.ts` usage. Admin action strings (`"approve"`/`"delete"`) match between route handler and admin page forms.
- **Scope:** single feature, single plan; no pager/rate-limit/uploads (deferred per spec).
