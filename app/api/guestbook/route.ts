import { z } from "zod";
import { listApproved, insertPending } from "@/lib/guestbook";
import { createRateLimiter } from "@/lib/ratelimit";

// Max 5 guestbook signs per IP per minute (best-effort, per-instance).
const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

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
  if (!limiter.allow(clientIp(request))) {
    return Response.json({ error: "too many requests" }, { status: 429 });
  }

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
