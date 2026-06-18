import type { Project, ProjectDetail } from "@/lib/types";
import { slugify } from "@/lib/slug";

// Rich "store page" content, keyed by project slug. Only fields backed by what's
// actually true about each project — no invented metrics. Screenshots/changelog
// lean on image placeholders where real assets don't exist yet.
const records: Record<string, ProjectDetail> = {
  macrotrackr: {
    category: "AI SaaS",
    summary:
      "MacroTrackr logs your meals for you. Point your camera or describe a meal in plain English and the AI estimates calories and macros — no database searching. Daily dashboards, goal tracking and history analytics keep the friction at zero.",
    role: "Solo · Full-stack",
    context: "Personal SaaS",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase", "Postgres", "Vercel"],
    accessLabel: "Live",
    statusPill: "Online",
    statusNote: "is deployed and publicly accessible at macrotrackr.app.",
    access: {
      title: "Launch MacroTrackr",
      primary: { label: "Live demo", icon: "external", href: "https://macrotrackr.app/" },
      note: "Production build · live at macrotrackr.app · no install required.",
    },
    about: [
      "MacroTrackr replaces manual food logging with a single AI step: snap a photo or type what you ate, and it returns an estimate of calories and macros. The goal is to remove the friction that makes most tracking apps get abandoned in a week.",
      "Behind the screen, meals are parsed by an AI vision + natural-language layer, then persisted to Postgres through Supabase with auth and row-level security. The front end is server-rendered with Next.js for fast first paint and live dashboards.",
    ],
    aboutBullets: [
      "Photo and natural-language meal logging",
      "AI calorie + macro estimation",
      "Daily dashboards and goal tracking",
      "History analytics over time",
    ],
    screenshots: [
      "/images/macrotrackr.png",
      "/images/macrotrackr-2.png",
      "/images/macrotrackr-3.png",
      "/images/macrotrackr-4.png",
    ],
    changelog: [
      {
        date: "v1.21.1 · 13 Jun 2026",
        title: "Security patches & product README",
        subtitle: "Dependabot alerts cleared, docs polished",
        body: "Pinned vulnerable transitive dependencies (esbuild, postcss, brace-expansion) via pnpm overrides, and rewrote the README into a full product overview with real dashboard, insights and AI-capture screenshots.",
        image: "/images/macrotrackr.png",
      },
      {
        date: "v1.21.0 · 7 Jun 2026",
        title: "Durable server-managed auth",
        subtitle: "Sessions that survive past the hour",
        body: "Moved authentication to @supabase/ssr with HttpOnly cookies and server-side routes, so sessions persist across visits and tokens refresh automatically — ending the recurring ~1h forced re-login.",
        image: "/images/macrotrackr.png",
        sections: [
          { h: "Cookie-based sessions", body: "Same-origin HttpOnly cookies replace the client-held Bearer token; the client auth service calls server routes instead of Supabase JS directly." },
          { h: "Honest copy", body: "Marketing copy was trimmed to only real, shipped features — removed fabricated claims (integrations, coach persona, native apps, compliance badges) across English and French." },
        ],
      },
      {
        date: "v1.20.0 · 3 Jun 2026",
        title: "AI credit ledger, GDPR deletion & Spectrum design",
        subtitle: "Metering, privacy and a new look",
        body: "Added a transactional Postgres AI-usage ledger with atomic claim/refund, GDPR account deletion that cancels Stripe and erases all user data, meal-photo persistence to private storage, and the Spectrum design system with a light default theme.",
        image: "/images/macrotrackr.png",
      },
      {
        date: "v1.18.0 · 24 May 2026",
        title: "Pro analytics & monetization",
        subtitle: "Trends suite, paywall and exports",
        body: "Shipped the Pro trends suite (goal-adherence heatmap, day-of-week breakdown, weekly digest, 180/365-day ranges), a rebuilt paywall with conversion surfaces, an AI-credits indicator, and self-serve data export as a ZIP of CSVs.",
        image: "/images/macrotrackr.png",
      },
      {
        date: "v1.1.0 · 3 Mar 2026",
        title: "Streaks & weekly progress",
        subtitle: "First feedback loop after launch",
        body: "Introduced the streak and weekly-goal foundation — progress APIs, Today/History cards and analytics for completed days and weekly goals — with meal idempotency to prevent duplicate inserts.",
        image: "/images/macrotrackr.png",
      },
    ],
    tech: [
      { area: "Frontend", items: ["Next.js", "React", "Tailwind"] },
      { area: "Backend", items: ["Supabase", "Auth", "RLS"] },
      { area: "Data", items: ["PostgreSQL"] },
      { area: "AI", items: ["Vision", "NL parsing"] },
      { area: "Infra", items: ["Vercel"] },
    ],
  },

  floatvision: {
    category: "Browser extension",
    summary:
      "FloatVision brings market intelligence to CSFloat: inline price overlays, a float & pattern scanner, and profit-&-loss tracking — right where you browse listings, without leaving the page.",
    role: "Solo · Extension",
    context: "Private beta",
    stack: ["React", "TypeScript", "Chrome MV3", "Vite"],
    accessLabel: "Private beta",
    statusPill: "Private beta",
    statusNote: "is in invite-only beta; the code is available on request.",
    access: {
      title: "Get FloatVision",
      primary: { label: "View code", icon: "code", href: "https://github.com/SHOOTSTV/floatvision" },
      note: "Chrome MV3 · private beta · invite only.",
    },
    about: [
      "FloatVision is a Manifest V3 Chrome extension that augments CSFloat with the data a buyer actually wants in front of them: price context, float and pattern details, and a record of what each trade did to your bottom line.",
      "Overlays, the scanner and P&L tracking are feature-complete in the beta; Steam-side automation is the remaining milestone on the roadmap. The extension injects into the page and keeps its state client-side under MV3's service-worker constraints.",
    ],
    aboutBullets: [
      "Inline price overlays on CSFloat listings",
      "Float & pattern scanner",
      "Profit & loss tracking",
      "Steam automation (on the roadmap)",
    ],
    screenshots: [
      "/images/floatvision-1.png",
      "/images/floatvision-2.png",
      "/images/floatvision-3.png",
      "/images/floatvision-4.png",
      "/images/floatvision-5.png",
    ],
    changelog: [
      {
        date: "v1.3.0 · 13 Jun 2026",
        title: "Overlay V2 & rate-safe scanner",
        subtitle: "Branded frame, two-pass scanning",
        body: "Redesigned the overlay as a branded inset frame with a fixed stat grid (Reference / Liquidity / 7-Day Trend), and rebuilt the scanner as a two-pass, rate-limit-safe flow. A release-zip packer (npm run pack) was added.",
        image: "/images/floatvision-1.png",
        sections: [
          { h: "Stable overlay", body: "A fixed stat grid keeps the layout consistent listing to listing, with a loader instead of a duplicate brand mark while data loads." },
          { h: "Scanner economics", body: "A cheap pure pre-screen selects confirm candidates so only a few listings are confirmed; overlay warming is suppressed during a scan to stay under CSFloat rate limits." },
        ],
      },
      {
        date: "v1.2.0 · 10 Jun 2026",
        title: "Platform-floor pricing, P&L & rebrand",
        subtitle: "Float-aware comps and a trade dashboard",
        body: "Added a float-band-aware CSFloat floor reference shared by overlay and scanner behind one rate-limited queue, trade P&L tracking with in-page badges and a fingerprint matcher, and a dedicated P&L dashboard (KPI cards, cumulative chart, breakdowns, editable cost history). Shipped the FloatVision rebrand with the V2 blue-teal theme.",
        image: "/images/floatvision-2.png",
      },
      {
        date: "v1.1.0 · 20 Apr 2026",
        title: "Scanner & backend-assisted workflow",
        subtitle: "From passive overlays to active scanning",
        body: "Expanded the extension beyond passive overlays: a market toolbar with auto-refresh and a floating scanner modal, history-backed liquidity scoring with backend reference batching, plus sell/stall assistance, trap filtering, blacklists and live Supabase-backed pricing.",
        image: "/images/floatvision-3.png",
      },
      {
        date: "Initial release · 2026",
        title: "Inline price overlays",
        subtitle: "Market context on CSFloat listings",
        body: "The first build injected price context and float/pattern data directly into CSFloat listings — the inline overlay the rest of FloatVision builds on, with no second tab and no copy-paste.",
        image: "/images/floatvision-4.png",
      },
    ],
    tech: [
      { area: "UI", items: ["React", "Vite"] },
      { area: "Runtime", items: ["Service Worker", "MV3"] },
      { area: "Target", items: ["CSFloat", "Chrome"] },
    ],
  },

  "axelstz-fr": {
    category: "Portfolio",
    summary:
      "This site. A Steam-style developer portfolio built with Next.js 16 and React 19 — server-rendered, with live GitHub stats wired into the profile and project pages.",
    role: "Solo · Full-stack",
    context: "Personal",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Vercel"],
    accessLabel: "Live",
    statusPill: "Online",
    statusNote: "is deployed at axelstz.fr and open source on GitHub.",
    access: {
      title: "Open axelstz.fr",
      primary: { label: "Live demo", icon: "external", href: "https://axelstz.fr/" },
      note: "Live at axelstz.fr · open source on GitHub.",
    },
    about: [
      "axelstz.fr reframes a developer portfolio as a Steam community profile: a profile header, a projects library, recent activity and these store-style project pages — original chrome, familiar information architecture.",
      "It's a Next.js 16 app rendered on the server, with commit counts and last-update dates pulled live from the GitHub API and cached hourly. Motion and starfield effects respect reduced-motion preferences.",
    ],
    aboutBullets: [
      "Steam-profile information architecture, original chrome",
      "Live GitHub stats (commits, last update) with hourly ISR",
      "Projects library + per-project store pages",
      "Reduced-motion-aware animations",
    ],
    screenshots: ["/images/folio.png"],
    changelog: [
      {
        date: "Live · axelstz.fr",
        title: "Project pages shipped",
        subtitle: "Every project opens a store-style detail page",
        body: "The library now links each project to its own store page: media, stack, changelog and live GitHub-backed metadata.",
        image: "/images/folio.png",
        sections: [
          { h: "From list to detail", body: "Clicking a project capsule or name opens a dedicated page modelled on a store listing, with the project's stack, summary and update log." },
          { h: "Live data", body: "Commit counts and last-update dates come straight from the GitHub API, so the pages stay current without manual edits." },
        ],
      },
    ],
    tech: [
      { area: "Frontend", items: ["Next.js", "React", "Tailwind"] },
      { area: "Data", items: ["GitHub API", "ISR"] },
      { area: "Infra", items: ["Vercel"] },
    ],
  },
};

// Graceful fallback so any project (including future ones) opens a complete page.
function buildFallback(p: Project): ProjectDetail {
  const live = !!p.live;
  const stack = p.meta ? p.meta.split(/[·,]/).map((s) => s.trim()).filter(Boolean) : ["TypeScript", "React"];
  const primary = live
    ? { label: "Live demo", icon: "external", href: p.live! }
    : { label: "View code", icon: "code", href: p.code ?? "#" };
  return {
    category: stack[0] || "Project",
    summary: `${p.name} — ${p.meta}. A project by Axel, documented here as a store page: media, stack and an update log.`,
    role: "Solo · Full-stack",
    context: "Personal",
    stack,
    accessLabel: live ? "Live" : "Repo",
    statusPill: live ? "Online" : "Code available",
    statusNote: live ? "is deployed and publicly accessible." : "is documented here; the code is available on GitHub.",
    access: {
      title: `Open ${p.name}`,
      primary,
      note: live ? "Production build, publicly accessible." : "Source available on GitHub.",
    },
    about: [
      `${p.name} is part of Axel's project library. ${p.meta}.`,
      "This page mirrors a store listing: previews, description, tech stack and a changelog. Real screenshots can be dropped into the image slots.",
    ],
    screenshots: p.image ? [p.image] : [],
    changelog: [
      {
        date: p.lastUpdate ?? p.last,
        title: "Latest update",
        subtitle: "Most recent activity on the repo",
        body: `Most recent update to ${p.name}.`,
        image: p.image,
      },
    ],
    tech: [{ area: "Stack", items: stack }],
  };
}

export function getProjectDetail(p: Project): ProjectDetail {
  return records[slugify(p.name)] ?? buildFallback(p);
}
