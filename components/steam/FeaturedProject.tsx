import type { PortfolioData } from "@/lib/types";
import { Frame } from "@/components/primitives/Frame";

export function FeaturedProject({ data }: { data: PortfolioData }) {
  const g = data.featuredProject;
  return (
    <div>
      <div className="sec-label">Featured project</div>
      <div className="fav-group">
        <span className="fav-av"><Frame src={g.image} alt={g.name} placeholder="" /></span>
        <div className="fav-main">
          <div className="fav-name"><b>{g.name}</b> — {g.type}</div>
          <div className="fav-desc">{g.desc}</div>
          <div className="fav-stats">
            {g.stats.map((s) => (
              <div className={s.cls} key={s.key}>
                <div className="v">{s.value}</div>
                <div className="k">{s.key}</div>
              </div>
            ))}
          </div>
          <div className="fav-actions">
            <a className="btn-live" href={g.live} target="_blank" rel="noreferrer">▶ Live</a>
            <a className="btn-code" href={g.code} target="_blank" rel="noreferrer">&lt;/&gt; Code</a>
          </div>
        </div>
      </div>
    </div>
  );
}
