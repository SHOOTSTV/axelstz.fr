"use client";
import { useEffect, useState } from "react";
import type { PortfolioData } from "@/lib/types";

export function TopBar({ data }: { data: PortfolioData }) {
  const [active, setActive] = useState(`#${data.nav[0].toLowerCase()}`);

  useEffect(() => {
    const ids = data.nav.map((l) => l.toLowerCase());
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // The #profile wrapper contains the inner sections, so several can be in
        // the band at once — the most specific (highest-index) section wins.
        let best = ids[0];
        for (let i = ids.length - 1; i >= 0; i--) {
          if (visible.has(ids[i])) { best = ids[i]; break; }
        }
        setActive(`#${best}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data.nav]);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="top-main">
          <nav className="nav-main">
            {data.nav.map((l) => {
              const href = `#${l.toLowerCase()}`;
              return (
                <a key={l} href={href} className={href === active ? "active" : ""}>
                  {l}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
