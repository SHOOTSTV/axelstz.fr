import { approve, remove } from "@/lib/guestbook";

// CSRF guard: this mutating endpoint is Basic-Auth protected, but browsers
// auto-send cached Basic credentials, so a cross-site form POST could ride along.
// Require the request to originate from our own host (modern browsers always send
// Origin on cross-origin POSTs; we fall back to Referer, and reject if neither).
function sameOrigin(request: Request): boolean {
  const target = new URL(request.url).host;
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return false;
  try {
    return new URL(source).host === target;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "forbidden" }, { status: 403 });

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const action = String(form.get("action") ?? "");

  if (!id) return Response.json({ error: "missing id" }, { status: 400 });

  if (action === "approve") await approve(id);
  else if (action === "delete") await remove(id);
  else return Response.json({ error: "bad action" }, { status: 400 });

  return Response.redirect(new URL("/guestbook/admin", request.url), 303);
}
