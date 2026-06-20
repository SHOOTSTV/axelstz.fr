import { describe, it, expect } from "vitest";
import type { PortfolioData } from "@/lib/types";

const sample: PortfolioData = {
  profile: { brand: "SHOOTS", name: "Axel.S", role: "Junior Web Developer", url: "axelstz.fr/profile", level: 19, online: true, statement: "I build for the web.", xp: { title: "Junior Web Developer", sub: "Level 19" } },
  nav: ["PROJECTS"],
  counts: [{ label: "Projects", n: 12 }],
  badges: [{ icon: "rocket", color: "#5a4b8a", name: "Shipper", desc: "Shipped projects", year: 2026, xp: 50 }],
  social: [{ name: "GitHub", sub: "@shoots", icon: "github", href: "https://github.com/", level: 19, color: "#3a3a3a", online: true }],
  featuredStack: [{ icon: "react", label: "React" }],
  bigStats: [{ key: "projects", value: 12, label: "Projects shipped" }],
  about: { star: "Axel.S", specHead: "My stack :", specs: ["React 18 · Next.js 15"] },
  featuredProject: { name: "Nebula", type: "SaaS", image: "/images/favg.png", desc: "x", stats: [{ value: "1k", key: "Users", cls: "members" }], live: "#", code: "#" },
  projects: [{ name: "TabFlow", image: "/images/act2.png", meta: "40 hrs total", last: "June 1", milestones: { done: 41, total: 57 } }],
  footer: { cols: [{ h: "Work", links: [{ label: "Featured", href: "#projects" }] }], social: [{ icon: "github", href: "https://github.com/" }] },
};

describe("PortfolioData", () => {
  it("accepts a complete sample", () => { expect(sample.profile.name).toBe("Axel.S"); });
});
