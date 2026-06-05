// Deterministic, exact-size screenshots for the portfolio image slots.
// Each shot captures the current viewport (after an optional scroll), so output
// is always exactly viewport.w x viewport.h — no clip-outside-page errors.
// Run: npm run shots   (override default base: SHOTS_BASE=http://localhost:3000 npm run shots)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.SHOTS_BASE ?? "https://macrotrackr.app";
const OUT = "public/images";

// w/h = exact output pixels (keep the slot ratio). scrollY scrolls before capture.
// Wide shots (>=1024px) render the desktop layout; narrow shots render mobile.
const SHOTS = [
  { name: "act1.png",  url: "/", w: 1472, h: 552,  scrollY: 0 },     // capsule 8:3 — desktop hero strip
  { name: "art-1.png", url: "/", w: 600,  h: 1000, scrollY: 0 },     // portrait 3:5 — mobile hero
  { name: "art-2.png", url: "/", w: 600,  h: 1000, scrollY: 1000 },  // portrait 3:5 — second screen
  { name: "art-3.png", url: "/", w: 600,  h: 1000, scrollY: 2000 },  // portrait 3:5 — third screen
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const s of SHOTS) {
    const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1, colorScheme: "dark" });
    // Force the site's class-based dark theme (moon toggle) so shots match the navy portfolio.
    await page.addInitScript(() => { try { localStorage.setItem("theme", "dark"); } catch {} });
    await page.goto((s.url.startsWith("http") ? "" : BASE) + s.url, { waitUntil: "networkidle" });
    await page.evaluate(() => { document.documentElement.classList.add("dark"); document.documentElement.setAttribute("data-theme", "dark"); });
    if (s.scrollY) await page.evaluate((y) => window.scrollTo(0, y), s.scrollY);
    await page.waitForTimeout(700); // settle theme swap / lazy images / scroll
    await page.screenshot({ path: join(OUT, s.name) });
    await page.close();
    console.log(`captured ${s.name} (${s.w}x${s.h})`);
  }
} finally {
  await browser.close();
}
