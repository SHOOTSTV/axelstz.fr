import { listPending } from "@/lib/guestbook";
import { isHttpUrl } from "@/lib/url";

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
            {n.link && isHttpUrl(n.link) && (
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
