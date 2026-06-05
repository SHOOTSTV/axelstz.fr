import type { PortfolioData } from "@/lib/types";

// _TODO_OWNER markers: replace placeholder values with real ones.
export const portfolio: PortfolioData = {
  profile: {
    brand: "SHOOTS",
    name: "Axel.S",
    role: "Junior Web Developer",
    url: "axelstz.fr/profile",
    level: 19, // _TODO_OWNER: your real age
    online: true,
    xp: {
      title: "Junior Web Developer",
      sub: "Level 19 · building on the web",
    },
  },
  nav: ["PROJECTS", "COMMUNITY", "PROFILE", "ACTIVITY", "SUPPORT"],
  counts: [
    { label: "Projects", n: 1 }, // _TODO_OWNER: keep equal to projects.length
    { label: "Screenshots", n: 3 }, // _TODO_OWNER: real screenshot count
    { label: "Repositories", n: null }, // filled live (Task 29)
    { label: "Reviews", n: 2 }, // _TODO_OWNER: real testimonial count
  ],
  badges: [
    { label: "1", color: "#5a4b8a" },
    { label: "'26", color: "#7a2f5a" },
    { label: "", color: "#6a3a3a", icon: "rocket" },
  ],
  communities: [
    { name: "Indie Hackers", members: "22,475 members", image: "" }, // _TODO_OWNER: drop /public/images/grp1.png then set path
    { name: "React", members: "411,137 members", image: "" }, // _TODO_OWNER: grp2.png
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
      href: "https://linkedin.com/",
      level: 19,
      color: "#2a5a8a",
      online: true,
    },
    {
      name: "Discord",
      sub: "shoots",
      icon: "discord",
      href: "#",
      level: 19,
      color: "#5a3a8a",
      online: false,
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
    { key: "projects", value: 1, label: "Projects shipped" }, // _TODO_OWNER: match projects.length
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
  ],
  testimonials: [
    {
      name: "maya.okafor",
      date: "Jul 20, 2024",
      text: "+rep shipped our MVP in 5 weeks, scaled great",
      image: "",
    }, // _TODO_OWNER: cm avatar 128×128
    {
      name: "liam.petrov",
      date: "Feb 21, 2024",
      text: "+rep clean comms, zero drama",
      image: "",
    },
  ],
  footer: {
    cols: [
      { h: "Portfolio", links: ["About", "Projects", "Activity", "Showcase"] },
      { h: "Work", links: ["Featured", "Open source", "Reviews"] },
      { h: "Connect", links: ["Email", "LinkedIn", "GitHub", "Discord"] },
    ],
    social: ["youtube", "bluesky", "facebook", "xtwitter"],
  },
};
