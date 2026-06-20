import type { PortfolioData, Project } from "@/lib/types";

// Single source of truth for the project list; counts below derive from it so
// the "Projects" metrics can never drift out of sync with the real list.
const projects: Project[] = [
  {
    name: "MacroTrackr",
    image: "/images/macrotrackr.png",
    meta: "AI nutrition tracker",
    last: "live · macrotrackr.app",
    code: "https://github.com/SHOOTSTV/macrotrackr",
    live: "https://macrotrackr.app/",
    commits: 497, // private repo: static fallback, overridden live when GITHUB_TOKEN is set
    lastUpdate: "Jun 13", // private repo: static fallback, overridden live
    ribbon: true, // flagship
    milestones: { done: 1, total: 1 },
    achievement: { icon: "trophy", name: "Shipped to production", xp: "Live SaaS" },
  },
  {
    name: "FloatVision",
    image: "/images/floatvision.png",
    meta: "CSFloat market intelligence",
    last: "private beta · Chrome MV3",
    code: "https://github.com/SHOOTSTV/floatvision",
    commits: 96, // private repo: static fallback, overridden live when GITHUB_TOKEN is set
    lastUpdate: "Jun 13", // private repo: static fallback, overridden live
    milestones: { done: 3, total: 4 }, // overlays + scanner + P&L done; Steam automation on roadmap
    achievement: { icon: "zap", name: "Feature-complete beta", xp: "Private beta" },
  },
  {
    name: "axelstz.fr",
    image: "/images/folio.png",
    meta: "This portfolio",
    last: "live · axelstz.fr",
    code: "https://github.com/SHOOTSTV/axelstz.fr",
    live: "https://axelstz.fr/",
    milestones: { done: 1, total: 1 },
    achievement: { icon: "rocket", name: "Self-hosted folio", xp: "Next.js 16" },
  },
];

export const portfolio: PortfolioData = {
  profile: {
    brand: "SHOOTS",
    name: "Axel.S",
    role: "Full-Stack Web Developer",
    url: "axelstz.fr/profile",
    level: 26, // age, used as the Steam-style "level"
    online: true,
    xp: {
      title: "Full-Stack Web Developer",
      sub: "Level 26 · building on the web",
    },
  },
  nav: ["PROFILE", "PROJECTS", "ACTIVITY", "GUESTBOOK", "CONTACT"],
  counts: [
    { label: "Projects", n: projects.length },
    { label: "Screenshots", n: 7 },
  ],
  badges: [
    { icon: "rocket",  color: "#5a4b8a", name: "Shipper",        desc: "Shipped multiple live projects",    year: 2026, xp: 100 },
    { icon: "layers",  color: "#2f5a7a", name: "Full-Stack",     desc: "Front-end to database, end to end",  year: 2026, xp: 80 },
    { icon: "github",  color: "#3a3a3a", name: "Open Source",    desc: "Public work on GitHub",              year: 2026, xp: 60 },
    { icon: "comment", color: "#7a2f5a", name: "Guestbook Host", desc: "Built a live visitor guestbook",     year: 2026, xp: 40 },
  ],
  social: [
    {
      name: "GitHub",
      sub: "@SHOOTSTV",
      icon: "github",
      href: "https://github.com/SHOOTSTV",
      level: 19,
      color: "#3a3a3a",
      online: true,
    },
    {
      name: "LinkedIn",
      sub: "Axel.S",
      icon: "linkedin",
      href: "https://www.linkedin.com/in/axelstankiewicz/",
      level: 19,
      color: "#2a5a8a",
      online: true,
    },
    {
      name: "Email",
      sub: "stankiewiczaxel1@gmail.com",
      icon: "mail",
      href: "mailto:stankiewiczaxel1@gmail.com",
      level: 19,
      color: "#7a5a2a",
      online: false,
    },
  ],
  featuredStack: [
    { icon: "react", label: "React" },
    { icon: "next", label: "Next.js" },
    { icon: "tailwind", label: "Tailwind" },
    { icon: "supabase", label: "Supabase" },
    { icon: "responsive", label: "Responsive" },
  ],
  bigStats: [
    { key: "repos", value: 0, label: "Repositories" }, // live
    { key: "commits", value: 0, label: "Total commits" }, // live
  ],
  about: {
    star: "Axel.S",
    specHead: "My stack :",
    specs: [
      "Next.js 16 · React 19",
      "TypeScript · Tailwind v4",
      "Supabase · Postgres · Auth",
      "Zod · Recharts · Vercel",
    ],
  },
  featuredProject: {
    name: "MacroTrackr",
    type: "AI nutrition tracker",
    image: "/images/macrotrackr.png",
    desc: "A nutrition tracker that logs for you. Point your camera or describe a meal in plain English — the AI handles the rest. Daily dashboards, goal tracking and history analytics. No searching, no friction.",
    // Feature-truthful labels (not metrics) — honest until real numbers exist.
    stats: [
      { value: "AI", key: "Meal logging", cls: "members" },
      { value: "1-tap", key: "Photo log", cls: "ingame" },
      { value: "Live", key: "Dashboards", cls: "online" },
      { value: "0s", key: "Searching", cls: "chat" },
    ],
    live: "https://macrotrackr.app/",
    code: "https://github.com/SHOOTSTV/macrotrackr",
  },
  projects,
  footer: {
    cols: [
      { h: "Sections", links: [
        { label: "Profile", href: "#profile" },
        { label: "Projects", href: "#projects" },
        { label: "Activity", href: "#activity" },
      ] },
      { h: "Connect", links: [
        { label: "Email", href: "mailto:stankiewiczaxel1@gmail.com" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/axelstankiewicz/" },
        { label: "GitHub", href: "https://github.com/SHOOTSTV" },
      ] },
    ],
    social: [
      { icon: "github", href: "https://github.com/SHOOTSTV" },
      { icon: "linkedin", href: "https://www.linkedin.com/in/axelstankiewicz/" },
    ],
  },
};
