"use client";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PortfolioData } from "@/lib/types";
import { TopBar } from "@/components/steam/TopBar";
import { Icon } from "@/components/primitives/Icon";
import { Frame } from "@/components/primitives/Frame";

export type GalleryShot = { id: string; src: string; project: string; slug: string };
export type GalleryProduct = { slug: string; name: string; n: number };

function Caret() {
  return <span className="cv">▼</span>;
}

function ProductDropdown({
  products, value, total, onChange,
}: {
  products: GalleryProduct[]; value: string | null; total: number; onChange: (v: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const cur = products.find((p) => p.slug === value);
  return (
    <span className="ss-dd" ref={ref}>
      <button className="ss-dd-btn" onClick={() => setOpen((o) => !o)}>
        <span>{cur ? cur.name : "All projects"}</span>
        <Caret />
      </button>
      {open && (
        <div className="ss-dd-menu">
          <div className={`ss-dd-opt ${!value ? "sel" : ""}`} onClick={() => { onChange(null); setOpen(false); }}>
            <span>All projects</span><span className="c">{total}</span>
          </div>
          {products.map((p) => (
            <div key={p.slug} className={`ss-dd-opt ${value === p.slug ? "sel" : ""}`}
              onClick={() => { onChange(p.slug); setOpen(false); }}>
              <span>{p.name}</span><span className="c">{p.n}</span>
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

// Full-bleed lightbox for the aggregated wall — reuses the project-page .lb-* chrome,
// with the title following whichever project the current shot belongs to.
function Lightbox({
  list, index, setIndex, onClose,
}: {
  list: GalleryShot[]; index: number; setIndex: (fn: (i: number) => number) => void; onClose: () => void;
}) {
  const total = list.length;
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

  const onBackdrop = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.tagName === "IMG" || t.closest("button")) return;
    onClose();
  };

  const cur = list[index];
  return (
    <div className="lb-overlay" ref={overlayRef} onMouseDown={onBackdrop}>
      <div className="lb-bar">
        <span className="lb-title">From {cur.project}</span>
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
          <Image src={cur.src} alt={`${cur.project} screenshot ${index + 1}`} fill sizes="100vw" style={{ objectFit: "contain" }} priority />
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

export function ScreenshotsGallery({
  data, shots, products,
}: {
  data: PortfolioData; shots: GalleryShot[]; products: GalleryProduct[];
}) {
  const name = data.profile.name;
  const [product, setProduct] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [lb, setLb] = useState(-1);

  const list = useMemo(
    () => (product ? shots.filter((s) => s.slug === product) : shots),
    [shots, product]
  );

  // Changing the filter resets the featured selection to the first shot.
  const changeProduct = (v: string | null) => { setProduct(v); setActive(0); };

  const cur = list[active] ?? null;
  const strip = list.slice(0, 6);

  // Group the wall by project when nothing is filtered.
  const groups = useMemo(() => {
    if (product) return [{ name: null as string | null, items: list }];
    const map = new Map<string, { name: string; items: GalleryShot[] }>();
    list.forEach((s) => {
      if (!map.has(s.slug)) map.set(s.slug, { name: s.project, items: [] });
      map.get(s.slug)!.items.push(s);
    });
    return [...map.values()];
  }, [list, product]);

  return (
    <>
      <TopBar data={data} current="SCREENSHOTS" />

      <div className="ss-head">
        <div className="content ss-head-inner">
          <Link className="ss-av" href="/"><Frame src="/images/avatar.png" alt={`${name} avatar`} placeholder="" /></Link>
          <div className="ss-crumb"><b>{name}</b> <span>&raquo;&nbsp; <em>Screenshots</em></span></div>
          <div className="ss-filters">
            <span className="ffl">Filter by product:</span>
            <ProductDropdown products={products} value={product} total={shots.length} onChange={changeProduct} />
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="content ss-page">
          <div className="ss-view">
            <span className="vk">Current view</span>
            <span className="vd">Image wall <Caret /></span>
            <span className="vd">Most recent <Caret /></span>
            <span className="vd">All screenshots <Caret /></span>
          </div>

          {cur ? (
            <>
              <div className="ss-strip">
                {strip.map((s) => {
                  const realIdx = list.indexOf(s);
                  return (
                    <div key={s.id} className={`ss-thumb ${realIdx === active ? "active" : ""}`} onClick={() => setActive(realIdx)}>
                      <Frame src={s.src} alt="" placeholder="" />
                    </div>
                  );
                })}
              </div>

              <div className="ss-featured" onClick={() => setLb(active)}>
                <Frame src={cur.src} alt={`${cur.project} screenshot`} placeholder="" priority />
                <div className="fmeta">
                  <div className="fproj">From <b>{cur.project}</b></div>
                  <span className="fexpand"><Icon name="camera" size={14} /> View full size</span>
                </div>
              </div>

              <div className="ss-wall-head">
                <span className="h">{product ? products.find((p) => p.slug === product)!.name : "All screenshots"}</span>
                <span className="n">
                  {list.length} screenshot{list.length > 1 ? "s" : ""}{!product ? ` · ${groups.length} projects` : ""}
                </span>
              </div>
              <div className="ss-wall">
                {groups.map((g) => (
                  <Fragment key={g.name ?? "all"}>
                    {g.name && (
                      <div className="ss-group-label"><b>{g.name}</b><span className="line" /><span>{g.items.length} shots</span></div>
                    )}
                    {g.items.map((s) => {
                      const realIdx = list.indexOf(s);
                      return (
                        <div key={s.id} className="ss-card" onClick={() => setLb(realIdx)}>
                          <Frame src={s.src} alt={`${s.project} screenshot`} placeholder="" />
                          <div className="ov"><div className="pj">{s.project}</div></div>
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </>
          ) : (
            <div className="ss-wall"><div className="ss-empty">No screenshots match this filter yet.</div></div>
          )}
        </div>
      </div>

      {lb >= 0 && <Lightbox list={list} index={lb} setIndex={setLb} onClose={() => setLb(-1)} />}
    </>
  );
}
