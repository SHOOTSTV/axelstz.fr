"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ChangelogEntry, PortfolioData, Project, ProjectDetail } from "@/lib/types";
import { TopBar } from "@/components/steam/TopBar";
import { Icon } from "@/components/primitives/Icon";
import { Frame } from "@/components/primitives/Frame";

type Shot = { src?: string; placeholder: string };

// Steam-style screenshot lightbox: full-bleed overlay, prev/next, counter, fullscreen.
function Lightbox({
  shots, name, index, setIndex, onClose,
}: {
  shots: string[]; name: string; index: number;
  setIndex: (fn: (i: number) => number) => void; onClose: () => void;
}) {
  const total = shots.length;
  const overlayRef = useRef<HTMLDivElement>(null);
  const go = useCallback((d: number) => setIndex((i) => (i + d + total) % total), [setIndex, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("cl-lock");
    return () => { document.removeEventListener("keydown", onKey); document.body.classList.remove("cl-lock"); };
  }, [go, onClose]);

  const fullscreen = () => {
    const el = overlayRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  // Close on any click that isn't the image itself or a control button.
  const onBackdrop = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.tagName === "IMG" || t.closest("button")) return;
    onClose();
  };

  return (
    <div className="lb-overlay" ref={overlayRef} onMouseDown={onBackdrop}>
      <div className="lb-bar">
        <span className="lb-title">{name} — screenshots</span>
        <button className="lb-x" onClick={onClose} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="lb-stage">
        <button className="lb-close" onClick={onClose} aria-label="Close screenshot">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        {total > 1 && <button className="lb-arrow prev" onClick={() => go(-1)} aria-label="Previous screenshot">&#8249;</button>}
        <div className="lb-img" key={index}>
          <Image src={shots[index]} alt={`${name} screenshot ${index + 1}`} fill sizes="100vw" style={{ objectFit: "contain" }} priority />
        </div>
        {total > 1 && <button className="lb-arrow next" onClick={() => go(1)} aria-label="Next screenshot">&#8250;</button>}
        <button className="lb-fs" onClick={fullscreen} aria-label="Toggle fullscreen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H3v5M21 8V3h-5M16 21h5v-5M3 16v5h5" /></svg>
        </button>
      </div>

      <div className="lb-foot">{index + 1} / {total}</div>
    </div>
  );
}

function Media({ detail, name }: { detail: ProjectDetail; name: string }) {
  const real = useMemo(() => detail.screenshots ?? [], [detail.screenshots]);
  // Real screenshots first, padded with empty slots so the strip reads as designed.
  const shots = useMemo<Shot[]>(() => {
    const out: Shot[] = real.map((src) => ({ src, placeholder: "screenshot" }));
    while (out.length < 4) out.push({ placeholder: "screenshot" });
    return out;
  }, [real]);

  const n = shots.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(-1);
  const cur = shots[active];
  const go = (d: number) => setActive((a) => (a + d + n) % n);

  // Auto-advance every 10s; pause on hover / when the lightbox is open; honour reduced-motion.
  useEffect(() => {
    if (n <= 1 || paused || lightbox >= 0) return;
    if (document.body.classList.contains("motion-off")) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 10000);
    return () => clearInterval(id);
  }, [n, paused, active, lightbox]);

  const openLightbox = () => { if (cur.src) setLightbox(Math.min(active, real.length - 1)); };

  return (
    <div className="media-col">
      <div className="media-main" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className={`shot ${cur.src ? "zoomable" : ""}`} key={active} onClick={openLightbox}>
          <Frame src={cur.src} alt={cur.src ? `${name} screenshot` : ""} placeholder={cur.placeholder} />
        </div>
        {n > 1 && (
          <>
            <button className="media-nav prev" onClick={() => go(-1)} aria-label="Previous screenshot">&#8249;</button>
            <button className="media-nav next" onClick={() => go(1)} aria-label="Next screenshot">&#8250;</button>
          </>
        )}
      </div>
      <div className="media-thumbs">
        <div className="track">
          {shots.map((s, i) => (
            <div key={i} className={`thumb ${i === active ? "active" : ""}`} onClick={() => setActive(i)}>
              <Frame src={s.src} alt="" placeholder="" />
            </div>
          ))}
        </div>
      </div>
      {lightbox >= 0 && (
        <Lightbox shots={real} name={name} index={lightbox} setIndex={setLightbox} onClose={() => setLightbox(-1)} />
      )}
    </div>
  );
}

function HeroSide({ p, d }: { p: Project; d: ProjectDetail }) {
  return (
    <div className="hero-side">
      <div className="capsule">
        <Frame src={p.image} alt={p.name} placeholder="capsule art" />
        {p.ribbon && <span className="cap-ribbon">Featured</span>}
      </div>
      <p className="hero-summary">{d.summary}</p>
      <div className="hero-meta">
        <div className="mrow"><span className="mk">Status</span><span className="mv lk">{d.accessLabel}</span></div>
        {d.releaseDate && <div className="mrow"><span className="mk">Released</span><span className="mv">{d.releaseDate}</span></div>}
        <div className="mrow"><span className="mk">Last update</span><span className="mv">{p.lastUpdate ?? p.last}</span></div>
        <div className="mrow"><span className="mk">Role</span><span className="mv lk">{d.role}</span></div>
        <div className="mrow"><span className="mk">Context</span><span className="mv lk">{d.context}</span></div>
      </div>
      <div className="tag-row-wrap">
        <div className="tag-head" style={{ marginTop: 16 }}>Stack &amp; tags:</div>
        <div className="tag-row">
          {d.stack.map((t) => <span className="tag" key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function ChangelogModal({
  projectName, list, startIndex, onClose,
}: {
  projectName: string; list: ChangelogEntry[]; startIndex: number; onClose: () => void;
}) {
  const total = list.length;
  const [focus, setFocus] = useState(startIndex);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const go = (delta: number) => setFocus((f) => Math.min(total - 1, Math.max(0, f + delta)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowUp") { e.preventDefault(); go(-1); }
      else if (e.key === "ArrowDown") { e.preventDefault(); go(1); }
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("cl-lock");
    return () => { document.removeEventListener("keydown", onKey); document.body.classList.remove("cl-lock"); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll the feed to the focused update — on open (startIndex) and on arrow nav.
  useEffect(() => {
    itemRefs.current[focus]?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, [focus]);

  return (
    <div className="cl-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cl-nav">
        <button className="cl-x" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <button className="cl-arrow" onClick={() => go(-1)} disabled={focus === 0} aria-label="Previous update">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 15l6-6 6 6" /></svg>
        </button>
        <button className="cl-arrow" onClick={() => go(1)} disabled={focus === total - 1} aria-label="Next update">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </button>
      </div>

      <div className="cl-feed">
        {list.map((c, i) => {
          const sections = c.sections && c.sections.length ? c.sections : [{ h: undefined, body: c.body }];
          return (
            <article className="cl-item" key={i} ref={(el) => { itemRefs.current[i] = el; }}>
              <div className="cl-banner"><Frame src={c.banner ?? c.image} alt="" placeholder="announcement banner" /></div>
              <div className="cl-item-head">
                <div className="cl-kicker"><span className="k1">UPDATE NOTES</span><span className="k2">{c.date}</span></div>
                <h2 className="cl-title">{c.title}</h2>
                {c.subtitle && <div className="cl-sub">{c.subtitle}</div>}
              </div>
              <div className="cl-body">
                {c.banner && c.image && <div className="cl-figure"><Frame src={c.image} alt="" placeholder="update visual" /></div>}
                {sections.map((s, j) => (
                  <div key={j}>
                    {s.h && <div className="cl-h">{s.h}</div>}
                    <p className="cl-p">{s.body}</p>
                  </div>
                ))}
                <div className="cl-foot">
                  <span className="cl-tag">{projectName}</span>
                  <span className="cl-count">Update {i + 1} / {total}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Changelog({ p, d }: { p: Project; d: ProjectDetail }) {
  const [openAt, setOpenAt] = useState<number | null>(null); // start index, null = closed
  const preview = d.changelog.slice(0, 2); // only the latest two on the page
  return (
    <div>
      <div className="sec-head">Recent announcements &amp; updates
        <span className="all"><span className="b" onClick={() => setOpenAt(0)}>See all</span></span>
      </div>
      <div className="log-grid">
        {preview.map((c, i) => (
          <div className="log-card" key={i} onClick={() => setOpenAt(i)}>
            <div className="log-img"><Frame src={c.image} alt="" placeholder="update visual" /></div>
            <div className="log-body">
              <div className="log-title">{c.title}</div>
              <div className="log-date">{c.date}</div>
              <div className="log-text">{c.body}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="log-allbtn" onClick={() => setOpenAt(0)}>
        <span className="rc"><Icon name="zap" size={14} /></span>
        See all updates (latest: {d.changelog[0].date})
      </button>
      {openAt !== null && (
        <ChangelogModal projectName={p.name} list={d.changelog} startIndex={openAt} onClose={() => setOpenAt(null)} />
      )}
    </div>
  );
}

function Sidebar({ p, d }: { p: Project; d: ProjectDetail }) {
  const live = !!p.live;
  const href = live ? p.live! : p.code ?? "#";
  return (
    <aside className="store-side">
      <div className="sb-panel">
        <div className="sb-title">Tech stack:</div>
        <div className="stack-list">
          {d.tech.map((t) => (
            <div className="stack-row" key={t.area}>
              <div className="sr-area">{t.area}</div>
              <div className="sr-chips">
                {t.items.map((it) => <span className="chip" key={it}>{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sb-panel sb-deck">
        <div className="dh">Deployment &amp; access</div>
        <div className="drow">
          <span className="di"><Icon name="check" size={18} /></span>
          <span className="dt">{live ? "Live & public" : "Code available"}</span>
          <span className="db">
            <a className="btn-blue" style={{ padding: "6px 14px", fontSize: 12 }} href={href} target="_blank" rel="noreferrer">
              {live ? "Open" : "View repo"}
            </a>
          </span>
        </div>
      </div>
    </aside>
  );
}

export function ProjectStorePage({ data, project: p, detail: d }: { data: PortfolioData; project: Project; detail: ProjectDetail }) {
  return (
    <>
      <div className="store-atmo" />
      <div className="shell">
        <TopBar data={data} current="PROJECTS" />
        <div className="store-page">
          <Link className="store-back" href="/projects"><Icon name="code" size={13} /> Back to all projects</Link>

          <div className="store-crumb">
            <Link href="/projects">All projects</Link><span className="sep">&rsaquo;</span>
            <Link href="/projects">{d.category}</Link><span className="sep">&rsaquo;</span>
            <span>{p.name}</span>
          </div>

          <div className="store-titlebar">
            <h1 className="store-title">{p.name}</h1>
            {p.code && (
              <a className="hub-btn" href={p.code} target="_blank" rel="noreferrer">
                <Icon name="github" size={15} /> Project hub
              </a>
            )}
          </div>

          <div className="store-hero">
            <Media detail={d} name={p.name} />
            <HeroSide p={p} d={d} />
          </div>

          <div className="libbar">
            <span className="pill">{d.statusPill}</span>
            <span className="txt"><b>{p.name}</b> {d.statusNote}</span>
          </div>

          <div className="run-block">
            <div className="run-head">
              <div className="rh-title">{d.access.title}</div>
              <div className="rh-actions">
                <span className="kind-pill">{d.accessLabel}</span>
                <a className="btn-green" href={d.access.primary.href} target="_blank" rel="noreferrer">
                  <Icon name={d.access.primary.icon} size={15} /> {d.access.primary.label}
                </a>
              </div>
            </div>
            <div className="run-note">{d.access.note}</div>
          </div>

          <div className="store-lower">
            <div className="store-main">
              <Changelog p={p} d={d} />

              <div className="sec-head mt">About this project</div>
              <div className="about-prose">
                {d.about.map((para, i) => <p key={i}>{para}</p>)}
                {d.aboutBullets && (
                  <>
                    <p style={{ marginBottom: 6 }}>What&apos;s inside:</p>
                    <ul className="about-list">
                      {d.aboutBullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </div>
            <Sidebar p={p} d={d} />
          </div>
        </div>
      </div>
    </>
  );
}
