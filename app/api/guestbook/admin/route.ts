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
