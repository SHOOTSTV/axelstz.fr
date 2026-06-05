// Deterministic, exact-size screenshots for the portfolio image slots.
// Edit SHOTS with your running app's URLs (and screens), then: npm run shots
// Override the base URL: SHOTS_BASE=https://your-app npm run shots
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.SHOTS_BASE ?? "http://localhost:3000";
const OUT = "public/images";

// w/h are the exact output master sizes (see the plan's size table). Keep the ratios.
const SHOTS = [
  { name: "act1.png",   path: "/", w: 736, h: 276 },  // capsule 8:3
  { name: "favg.png",   path: "/", w: 256, h: 256 },  // featured logo 1:1
  { name: "art-1.png",  path: "/", w: 900, h: 1500 }, // portrait 3:5
  { name: "art-2.png",  path: "/", w: 900, h: 1500 },
  { name: "art-3.png",  path: "/", w: 900, h: 1500 },
  { name: "avatar.png", path: "/", w: 512, h: 512 },  // 1:1
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const s of SHOTS) {
    const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 });
    await page.goto(BASE + s.path, { waitUntil: "networkidle" });
    await page.screenshot({ path: join(OUT, s.name), clip: { x: 0, y: 0, width: s.w, height: s.h } });
    await page.close();
    console.log(`captured ${s.name} (${s.w}x${s.h})`);
  }
} finally {
  await browser.close();
}
