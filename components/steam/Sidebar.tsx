import Link from "next/link";
import type { PortfolioData } from "@/lib/types";
import { Icon } from "@/components/primitives/Icon";
import { BadgeTile } from "@/components/steam/BadgeTile";
import { Reveal } from "@/components/primitives/Reveal";
import { fmt } from "@/components/primitives/StatNum";

export function Sidebar({ data }: { data: PortfolioData }) {
  const p = data.profile;
  return (
    <Reveal className="side-panel">
      <div className={`side-online ${p.online ? "" : "offline"}`}>{p.online ? "Online" : "Offline"}</div>

      <div className="side-block">
        <div className="side-h">Badges <span className="n">{data.badges.length}</span></div>
        <div className="badge-row">
          {data.badges.map((b, i) => (
            <BadgeTile badge={b} key={i} />
          ))}
        </div>
      </div>

      <div className="side-block">
        <div className="count-list">
          {data.counts.map((c) =>
            c.label === "Projects" || c.label === "Screenshots" ? (
              <Link className="count-row" href={c.label === "Projects" ? "/projects" : "/screenshots"} key={c.label}>
                <span className="lbl">{c.label}</span>
                {c.n != null && <span className="n">{fmt(c.n)}</span>}
              </Link>
            ) : (
              <div className="count-row" key={c.label}>
                <span className="lbl">{c.label}</span>
                {c.n != null && <span className="n">{fmt(c.n)}</span>}
              </div>
            )
          )}
        </div>
      </div>

      <div className="side-block">
        <div className="side-h">Social <span className="n">{data.social.length}</span></div>
        {data.social.map((s) => (
          <a
            className="contact-row"
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            style={{ ["--st" as string]: s.online ? "var(--ingame)" : "var(--offline)" } as React.CSSProperties}
          >
            <span className="contact-av"><Icon name={s.icon} size={18} /></span>
            <span className="contact-info">
              <div className="nm">{s.name}</div>
              <div className="sub">{s.sub}</div>
            </span>
            <span className="hexlvl" style={{ ["--hx" as string]: s.color } as React.CSSProperties}><span>{s.level}</span></span>
          </a>
        ))}
      </div>
    </Reveal>
  );
}
