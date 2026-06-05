import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Axel.S — Junior Web Developer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0c0d10 0%, #1b2838 100%)",
          color: "#c7d5e0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#66c0f4" }}>SHOOTS</div>
        <div style={{ fontSize: 88, fontWeight: 700, color: "#ffffff", marginTop: 12 }}>Axel.S</div>
        <div style={{ fontSize: 40, marginTop: 8 }}>Junior Web Developer</div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 26, color: "#8f98a0" }}>
          React · Next.js · TypeScript · Tailwind
        </div>
      </div>
    ),
    { ...size }
  );
}
