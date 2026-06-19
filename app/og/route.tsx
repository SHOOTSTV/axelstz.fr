// app/og/route.tsx — dynamic Open Graph image via next/og.
// Usage: /og  or  /og?name=MacroTrackr&title=AI%20SaaS&tagline=...
// The homepage uses the static app/opengraph-image.png; this route powers
// per-page cards (e.g. /projects/[slug]) so shared project links get their
// own preview. Fonts are loaded from Google Fonts at request time, with a
// silent fallback to the system font if the fetch ever fails.
import { ImageResponse } from "next/og";

export const runtime = "edge";

const ACCENT = "#6366f1";
const NB = " "; // non-breaking space — Satori trims leading/inter-element spaces

// Glyphs the static card chrome needs, on top of the dynamic text.
const CHROME_GLYPHS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" +
  "  ·.,:;/{}[]()\"'<>=+#@&✓~-";

async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!resource) throw new Error(`font url not found for ${family} ${weight}`);
  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error(`font fetch failed for ${family} ${weight}`);
  return res.arrayBuffer();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") ?? "Axel S.";
  const title = searchParams.get("title") ?? "Full-Stack Developer";
  const tagline =
    searchParams.get("tagline") ??
    "Building modern web applications with React, Next.js, TypeScript, and AI.";

  const text = `${name}${title}${tagline}~/portfolio const developer = stack React Next typescript true ai npm run build ✓ TypeScript AI${NB}${CHROME_GLYPHS}`;

  let fonts: NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"];
  try {
    const [interBold, interReg, mono] = await Promise.all([
      loadGoogleFont("Inter", 700, text),
      loadGoogleFont("Inter", 400, text),
      loadGoogleFont("JetBrains Mono", 400, text),
    ]);
    fonts = [
      { name: "Inter", data: interBold, weight: 700, style: "normal" },
      { name: "Inter", data: interReg, weight: 400, style: "normal" },
      { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
    ];
  } catch {
    fonts = undefined; // degrade to next/og's default font rather than 500
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          background: "#0a0a0b",
          fontFamily: "Inter, sans-serif",
          color: "#f5f5f7",
          overflow: "hidden",
        }}
      >
        {/* radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "-120px",
            width: "900px",
            height: "900px",
            background: `radial-gradient(circle, ${ACCENT}40 0%, transparent 60%)`,
            display: "flex",
          }}
        />
        {/* top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: `linear-gradient(90deg, ${ACCENT}, #22d3ee 55%, transparent)`,
            display: "flex",
          }}
        />

        {/* content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "26px",
            padding: "0 72px",
            width: "720px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              alignSelf: "flex-start",
              padding: "9px 18px",
              border: "1px solid #2a2a31",
              borderRadius: "999px",
              fontSize: "20px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#a1a1aa",
            }}
          >
            <div
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#4ade80",
                display: "flex",
              }}
            />
            {title}
          </div>

          <div
            style={{
              fontSize: "104px",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            {name}
          </div>

          <div style={{ fontSize: "33px", color: "#a1a1aa", lineHeight: 1.35, display: "flex" }}>
            {tagline}
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
              marginTop: "8px",
              fontSize: "21px",
              color: "#6b6b73",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            React · Next.js · TypeScript · AI
          </div>
        </div>

        {/* terminal panel */}
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "145px",
            width: "470px",
            height: "340px",
            borderRadius: "16px 0 0 16px",
            border: "1px solid #26262b",
            background: "#111116",
            display: "flex",
            flexDirection: "column",
            boxShadow: `-30px 0 90px -20px #22d3ee30`,
          }}
        >
          <div
            style={{
              height: "46px",
              display: "flex",
              alignItems: "center",
              gap: "9px",
              padding: "0 20px",
              borderBottom: "1px solid #1d1d22",
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c, display: "flex" }} />
            ))}
            <div style={{ marginLeft: "14px", fontSize: "15px", color: "#52525b", fontFamily: "JetBrains Mono, monospace", display: "flex" }}>
              ~/portfolio
            </div>
          </div>
          <div
            style={{
              padding: "24px",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "18px",
              lineHeight: 1.8,
              color: "#52525b",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span><span style={{ color: "#818cf8" }}>const</span>{`${NB}`}<span style={{ color: "#67e8f9" }}>developer</span>{`${NB}=${NB}{`}</span>
            <span>{`${NB}${NB}stack:${NB}[`}<span style={{ color: "#4ade80" }}>"React"</span>{`,${NB}`}<span style={{ color: "#4ade80" }}>"Next"</span>{"],"}</span>
            <span>{`${NB}${NB}typescript:${NB}`}<span style={{ color: "#818cf8" }}>true</span>{","}</span>
            <span>{`${NB}${NB}ai:${NB}`}<span style={{ color: "#818cf8" }}>true</span>{","}</span>
            <span>{"};"}</span>
            <span style={{ color: "#3f3f46" }}>{`>${NB}npm${NB}run${NB}build${NB}✓`}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  );
}
