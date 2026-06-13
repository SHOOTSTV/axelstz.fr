import type { PortfolioData } from "@/lib/types";

// _TODO_OWNER markers: replace placeholder values with real ones.
export const portfolio: PortfolioData = {
  profile: {
    brand: "SHOOTS",
    name: "Axel.S",
    role: "Junior Web Developer",
    url: "axelstz.fr/profile",
    level: 26, // _TODO_OWNER: your real age
    online: true,
    statement: "I build for the web.", // _TODO_OWNER: your one-line positioning statement
    xp: {
      title: "Junior Web Developer",
      sub: "Level 26 · building on the web",
    },
  },
  nav: ["PROFILE", "PROJECTS", "ACTIVITY", "GUESTBOOK", "CONTACT"],
  counts: [
    { label: "Projects", n: 2 }, // _TODO_OWNER: keep equal to projects.length
    { label: "Screenshots", n: 4 }, // _TODO_OWNER: real screenshot count
    { label: "Repositories", n: null }, // filled live (Task 29)
    { label: "Reviews", n: null }, // filled by guestbook entries
  ],
  badges: [
    { label: "2", color: "#5a4b8a" },
    { label: "'26", color: "#7a2f5a" },
    { label: "", color: "#6a3a3a", icon: "rocket" },
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
      sub: "hello@axelstz.fr",
      icon: "mail",
      href: "mailto:hello@axelstz.fr",
      level: 19,
      color: "#7a5a2a",
      online: false,
    },
  ],
  featuredStack: [
    { icon: "code" },
    { icon: "layers" },
    { icon: "cpu", hot: true },
    { icon: "database" },
    { icon: "server" },
  ],
  bigStats: [
    { key: "projects", value: 2, label: "Projects shipped" }, // _TODO_OWNER: match projects.length
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
    image: "/images/favg.png",
    desc: "A nutrition tracker that logs for you. Point your camera or describe a meal in plain English — the AI handles the rest. Daily dashboards, goal tracking and history analytics. No searching, no friction.",
    // _TODO_OWNER: feature-truthful for now — swap for real metrics (DAU, uptime, p95) once you have them.
    stats: [
      { value: "AI", key: "Meal logging", cls: "members" },
      { value: "1-tap", key: "Photo log", cls: "ingame" },
      { value: "Live", key: "Dashboards", cls: "online" },
      { value: "0s", key: "Searching", cls: "chat" },
    ],
    live: "https://macrotrackr.app/",
    code: "https://github.com/SHOOTSTV/macrotrackr",
  },
  projects: [
    {
      name: "MacroTrackr",
      image: "/images/act1.png",
      meta: "AI nutrition tracker",
      last: "live · macrotrackr.app",
      milestones: { done: 1, total: 1 },
      achievement: { icon: "trophy", name: "Shipped to production", xp: "Live SaaS" },
    },
    {
      name: "FloatVision",
      image: "/images/act2.png",
      meta: "CSFloat market intelligence",
      last: "private beta · Chrome MV3",
      milestones: { done: 3, total: 4 }, // overlays + scanner + P&L done; Steam automation on roadmap
      achievement: { icon: "zap", name: "Feature-complete beta", xp: "Private beta" },
    },
  ],
  footer: {
    cols: [
      { h: "Sections", links: [
        { label: "Profile", href: "#profile" },
        { label: "Projects", href: "#projects" },
        { label: "Activity", href: "#activity" },
      ] },
      { h: "Connect", links: [
        { label: "Email", href: "mailto:hello@axelstz.fr" },
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
