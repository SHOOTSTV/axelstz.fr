"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
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
        <p style={{ fontSize: 13, letterSpacing: 2, color: "var(--muted)" }}>SOMETHING BROKE</p>
        <h1 style={{ fontSize: 28, margin: "8px 0 4px" }}>Unexpected error</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          This section failed to load. Try again, or head back.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={reset} style={{ color: "var(--link)", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>
            ↻ Try again
          </button>
          <Link href="/" style={{ color: "var(--link)" }}>
            ← Back to profile
          </Link>
        </div>
      </div>
    </main>
  );
}
