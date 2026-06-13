export type IconName = string;

export interface Profile {
  brand: string; name: string; role: string; url: string;
  level: number; online: boolean;
  xp: { title: string; sub: string };
}
export interface CountRow { label: string; n: number | null; }
export interface Badge { label: string; color: string; icon?: IconName; }
export interface Social { name: string; sub: string; icon: IconName; href: string; level: number; color: string; online: boolean; }
export interface StackItem { icon: IconName; hot?: boolean; }
export interface BigStat { key: "projects" | "repos" | "commits" | "stars" | string; value: number; label: string; }
export interface About { star: string; specHead: string; specs: string[]; }
export interface ProjectStat { value: string; key: string; cls: "members" | "ingame" | "online" | "chat"; }
export interface FeaturedProject { name: string; type: string; image: string; desc: string; stats: ProjectStat[]; live: string; code: string; }
export interface Project {
  name: string; image: string; meta: string; last: string;
  milestones?: { done: number; total: number };
  achievement?: { icon: IconName; name: string; xp: string };
}
export interface Testimonial { name: string; date: string; text: string; image: string; special?: boolean; }
export interface FooterLink { label: string; href: string; }
export interface FooterData { cols: { h: string; links: FooterLink[] }[]; social: { icon: IconName; href: string }[]; }

export interface PortfolioData {
  profile: Profile;
  nav: string[];
  counts: CountRow[];
  badges: Badge[];
  social: Social[];
  featuredStack: StackItem[];
  bigStats: BigStat[];
  about: About;
  featuredProject: FeaturedProject;
  projects: Project[];
  testimonials: Testimonial[];
  footer: FooterData;
}

export interface GitHubStats {
  repos: number; commits: number; stars: number;
  languages: { name: string; pct: number }[];
  activity: { repo: string; type: string; when: string }[];
}
