import Link from "next/link";
import type { PortfolioData, Project } from "@/lib/types";
import { Icon } from "@/components/primitives/Icon";
import { Frame } from "@/components/primitives/Frame";
import { Prog } from "@/components/primitives/Prog";
import { Reveal } from "@/components/primitives/Reveal";
import { slugify } from "@/lib/slug";

function GameRow({ g }: { g: Project }) {
  return (
    <div className="game-row">
      <div className="game-top">
        <Link className="game-cap" href={`/projects/${slugify(g.name)}`} aria-label={`${g.name} project page`}>
          <Frame src={g.image} alt={g.name} placeholder="capsule" />
        </Link>
        <Link className="game-name" href={`/projects/${slugify(g.name)}`}>{g.name}</Link>
        <span className="game-meta">
          <div className="ht">{g.meta}</div>
          <div>{g.last}</div>
        </span>
      </div>
      <div className="game-detail">
        {g.achievement && (
          <div className="ach-card">
            <span className="ai"><Icon name={g.achievement.icon} size={20} /></span>
            <span><div className="at">{g.achievement.name}</div><div className="ax">{g.achievement.xp}</div></span>
          </div>
        )}
        {g.milestones && (
          <div className="ach-prog">
            <div className="pl"><span>Milestones</span><span>{g.milestones.done} of {g.milestones.total}</span></div>
            <Prog value={g.milestones.done} max={g.milestones.total} />
          </div>
        )}
      </div>
    </div>
  );
}

export function RecentActivity({ data }: { data: PortfolioData }) {
  return (
    <Reveal>
      <div id="activity">
        <div className="activity-head" style={{ marginTop: 34 }}>
          <span className="h">Recent activity</span>
          <span className="hrs">35.4 hrs past 2 weeks</span>
        </div>
        {data.projects.slice(0, 3).map((g, i) => <GameRow g={g} key={`${i}-${g.name}`} />)}
      </div>
    </Reveal>
  );
}
