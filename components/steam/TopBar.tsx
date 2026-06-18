"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PortfolioData } from "@/lib/types";

// `current` marks the active standalone page (e.g. "PROJECTS"). When set, the
// scroll-spy is disabled and section links point back to the homepage anchors.
export function TopBar({ data, current }: { data: PortfolioData; current?: string }) {
  const [active, setActive] = useState(`#${data.nav[0].toLowerCase()}`);

  useEffect(() => {
    if (current) return; // standalone page: no on-page sections to spy on
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
  }, [data.nav, current]);

  const hrefFor = (l: string) =>
    l === "PROJECTS" ? "/projects" : l === "CONTACT" ? "mailto:stankiewiczaxel1@gmail.com" : current ? `/#${l.toLowerCase()}` : `#${l.toLowerCase()}`;
  const isActive = (l: string) => (current ? l === current : `#${l.toLowerCase()}` === active);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="top-main">
          <nav className="nav-main">
            {data.nav.map((l) => {
              const cls = isActive(l) ? "active" : "";
              return l === "PROJECTS" ? (
                <Link key={l} href="/projects" className={cls}>{l}</Link>
              ) : (
                <a key={l} href={hrefFor(l)} className={cls}>{l}</a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
