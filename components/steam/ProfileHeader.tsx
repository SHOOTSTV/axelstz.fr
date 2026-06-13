import type { PortfolioData } from "@/lib/types";
import { Icon } from "@/components/primitives/Icon";
import { Frame } from "@/components/primitives/Frame";
import { StatNum } from "@/components/primitives/StatNum";

export function ProfileHeader({ data }: { data: PortfolioData }) {
  const p = data.profile;
  return (
    <div className="profile-top" id="top">
      <div className="content">
        <div className="profile-head">
          <div className="av-window">
            <div className="av-titlebar">
              <span>c:_&gt;</span>
              <span className="dots">
                <span className="wbtn">_</span>
                <span className="wbtn">▢</span>
                <span className="wbtn">✕</span>
              </span>
            </div>
            <div className="av-photo">
              <Frame src="/images/avatar.png" alt={`${p.name} avatar`} placeholder="Drop avatar" />
              <span className="av-tag">{p.brand}</span>
            </div>
          </div>

          <div className="ph-id">
            <span className="ph-name">{p.name} <span className="caret">▾</span></span>
            <a className="ph-trade" href="#contact">Get in touch</a>
          </div>

          <div className="ph-level">
            <div className="lvl-row">
              <span className="lvl-word">Level</span>
              <span className="lvl-badge" title="Account level"><StatNum value={p.level} /></span>
            </div>
            <div className="lvl-xp-item">
              <span className="xp-ic"><Icon name="zap" size={30} /></span>
              <span className="xp-txt">
                <div className="t">{p.xp.title}</div>
                <div className="s">{p.xp.sub}</div>
              </span>
            </div>
          </div>
        </div>
        <p className="hero-statement">{p.statement}</p>
      </div>
    </div>
  );
}
