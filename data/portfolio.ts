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
    xp: { title: "Junior Web Developer", sub: "Level 19 · building on the web" },
  },
  nav: ["PROJECTS", "COMMUNITY", "PROFILE", "ACTIVITY", "SUPPORT"],
  counts: [
    { label: "Projects", n: 1 },        // _TODO_OWNER: keep equal to projects.length
    { label: "Screenshots", n: 3 },     // _TODO_OWNER: real screenshot count
    { label: "Repositories", n: null }, // filled live (Task 29)
    { label: "Reviews", n: 2 },         // _TODO_OWNER: real testimonial count
  ],
  badges: [
    { label: "1", color: "#5a4b8a" },
    { label: "'26", color: "#7a2f5a" },
    { label: "", color: "#6a3a3a", icon: "rocket" },
  ],
  communities: [
    { name: "Indie Hackers", members: "22,475 members", image: "" }, // _TODO_OWNER: drop /public/images/grp1.png then set path
    { name: "React", members: "411,137 members", image: "" },         // _TODO_OWNER: grp2.png
  ],
  social: [
    { name: "GitHub", sub: "@shoots", icon: "github", href: "https://github.com/", level: 19, color: "#3a3a3a", online: true }, // _TODO_OWNER href
    { name: "LinkedIn", sub: "Axel.S", icon: "linkedin", href: "https://linkedin.com/", level: 19, color: "#2a5a8a", online: true },
    { name: "Discord", sub: "shoots", icon: "discord", href: "#", level: 19, color: "#5a3a8a", online: false },
    { name: "Email", sub: "hello@axelstz.fr", icon: "mail", href: "mailto:hello@axelstz.fr", level: 19, color: "#7a5a2a", online: false },
  ],
  featuredStack: [
    { icon: "code" }, { icon: "layers" }, { icon: "cpu", hot: true }, { icon: "database" }, { icon: "server" },
  ],
  bigStats: [
    { key: "projects", value: 1, label: "Projects shipped" }, // _TODO_OWNER: match projects.length
    { key: "repos", value: 0, label: "Repositories" },   // live
    { key: "commits", value: 0, label: "Total commits" }, // live
  ],
  about: {
    star: "Axel.S",
    specHead: "My stack :",
    specs: ["React 19 · Next.js 16", "TypeScript · Tailwind", "Supabase · PostgreSQL", "Vercel · GitHub · Claude"],
  },
  featuredProject: {
    name: "Nebula Analytics", type: "Flagship project", image: "", // _TODO_OWNER: drop favg.png (256×256) then set "/images/favg.png"
    desc: "Real-time product analytics for indie SaaS teams — event pipelines, cohort funnels and AI-assisted insights.",
    stats: [
      { value: "3,412", key: "Users", cls: "members" },
      { value: "128", key: "Live now", cls: "ingame" },
      { value: "99.98%", key: "Uptime", cls: "online" },
      { value: "180ms", key: "p95", cls: "chat" },
    ],
    live: "#", code: "#",
  },
  projects: [
    { name: "Nebula Analytics", image: "", meta: "2,306 hrs total", last: "last updated June 3", // _TODO_OWNER: set "/images/act1.png" (736×276, 8:3)
      milestones: { done: 1, total: 1 }, achievement: { icon: "trophy", name: "First SaaS Launch", xp: "500 XP" } },
  ],
  testimonials: [
    { name: "maya.okafor", date: "Jul 20, 2024", text: "+rep shipped our MVP in 5 weeks, scaled great", image: "" }, // _TODO_OWNER: cm avatar 128×128
    { name: "liam.petrov", date: "Feb 21, 2024", text: "+rep clean comms, zero drama", image: "" },
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
