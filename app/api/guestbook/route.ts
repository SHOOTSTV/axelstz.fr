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
