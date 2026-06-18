"use client";

// Replaces the root layout when it (or anything above the route boundary) throws.
// Must render its own <html>/<body>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: "24px",
          background: "#0c0d10",
          color: "#c7d5e0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, margin: "0 0 4px" }}>Something went wrong</h1>
          <p style={{ color: "#8f98a0", marginBottom: 20 }}>The page failed to load.</p>
          <button
            onClick={reset}
            style={{ color: "#66c0f4", background: "none", border: "none", cursor: "pointer", font: "inherit" }}
          >
            ↻ Try again
          </button>
        </div>
      </body>
    </html>
  );
}
