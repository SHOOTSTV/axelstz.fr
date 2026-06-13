import type { PortfolioData } from "@/lib/types";

export function AboutMe({ data }: { data: PortfolioData }) {
  const a = data.about;
  return (
    <div>
      <div className="show-dots">· · ·</div>
      <div className="about-wrap">
        <div className="bracket about-me">
          <div className="lead">About me :</div>
          <div className="big">★ {a.star}</div>
          <div className="spec-h">{a.specHead}</div>
          {a.specs.map((text, i) => (
            <div className="spec" key={i}>★ <b>{text}</b></div>
          ))}
        </div>
        <div className="bracket about-side">
          <a className="trade" href="#contact">Get in touch</a>
        </div>
      </div>
      <div className="show-dots">· · ·</div>
    </div>
  );
}
