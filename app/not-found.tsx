import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "24px",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div>
        <p style={{ fontSize: 13, letterSpacing: 2, color: "var(--muted)" }}>ERROR 404</p>
        <h1 style={{ fontSize: 28, margin: "8px 0 4px" }}>Page not found</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          This page is offline or never existed.
        </p>
        <Link href="/" style={{ color: "var(--link)" }}>
          ← Back to profile
        </Link>
      </div>
    </main>
  );
}
