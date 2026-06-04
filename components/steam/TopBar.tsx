import type { PortfolioData } from "@/lib/types";

export function TopBar({ data }: { data: PortfolioData }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="top-main">
          <a className="brand" href="#top">
            <span className="logo"><b>{data.profile.brand[0]}</b></span>
            <span className="word">{data.profile.brand}</span>
          </a>
          <nav className="nav-main">
            {data.nav.map((l, i) => <a key={l} href={`#${l.toLowerCase()}`} className={i === 2 ? "active" : ""}>{l}</a>)}
          </nav>
        </div>
      </div>
    </header>
  );
}
