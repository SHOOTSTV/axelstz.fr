export type IconName = string;

export interface Profile {
  brand: string; name: string; role: string; url: string;
  level: number; online: boolean;
  statement?: string;
  xp: { title: string; sub: string };
}
export interface CountRow { label: string; n: number | null; }
export interface Badge { label: string; color: string; icon?: IconName; }
export interface Social { name: string; sub: string; icon: IconName; href: string; level: number; color: string; online: boolean; }
export interface StackItem { icon: IconName; label: string; }
export interface BigStat { key: "projects" | "repos" | "commits" | "stars" | string; value: number; label: string; }
export interface About { star: string; specHead: string; specs: string[]; }
export interface ProjectStat { value: string; key: string; cls: "members" | "ingame" | "online" | "chat"; }
export interface FeaturedProject { name: string; type: string; image: string; desc: string; stats: ProjectStat[]; live: string; code: string; }
export interface Project {
  name: string; image: string; meta: string; last: string;
  code?: string; // repo URL — capsule links here
  live?: string; // live/demo URL — primary CTA on the Projects library page
  ribbon?: boolean; // featured star on the library capsule
  commits?: number; // filled live from GitHub (see fetchProjectStats)
  lastUpdate?: string; // filled live from GitHub repo pushed_at (preformatted)
  milestones?: { done: number; total: number };
  achievement?: { icon: IconName; name: string; xp: string };
  category?: string; // derived from projectDetails for the library category filter
}
// ----- Project detail ("store page") -----
export interface ChangelogSection { h?: string; body: string; }
export interface ChangelogEntry {
  date: string; title: string; subtitle?: string; body: string;
  image?: string;  // in-card thumbnail + in-article figure
  banner?: string; // wide hero banner in the modal
  sections?: ChangelogSection[];
}
export interface TechGroup { area: string; items: string[]; }
export interface ProjectAccess {
  title: string; // run-block heading, e.g. "Launch MacroTrackr"
  primary: { label: string; icon: IconName; href: string };
  note: string;
}
export interface ProjectDetail {
  category: string;       // breadcrumb + capsule kicker
  summary: string;        // short blurb beside the capsule
  releaseDate?: string;   // omitted row if absent
  role: string;
  context: string;        // "Contexte" — solo/personal/etc.
  stack: string[];        // tag row
  accessLabel: string;    // status meta + run-block kind pill
  statusPill: string;     // libbar left pill ("Online" / "Private beta" …)
  statusNote: string;     // libbar sentence after the bolded project name
  access: ProjectAccess;
  about: string[];        // prose paragraphs
  aboutBullets?: string[];
  screenshots?: string[]; // real shots; gallery pads the rest with placeholders
  changelog: ChangelogEntry[];
  tech: TechGroup[];
}

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
  footer: FooterData;
}

export interface GitHubStats {
  repos: number; commits: number; stars: number;
  languages: { name: string; pct: number }[];
  activity: { repo: string; type: string; when: string }[];
}
