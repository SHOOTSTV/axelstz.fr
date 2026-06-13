import type { PortfolioData } from "@/lib/types";
import { Frame } from "@/components/primitives/Frame";
import { MagneticButton } from "@/components/primitives/MagneticButton";

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
            <MagneticButton className="btn-live" href={g.live}>▶ Live</MagneticButton>
            <MagneticButton className="btn-code" href={g.code}>&lt;/&gt; Code</MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
