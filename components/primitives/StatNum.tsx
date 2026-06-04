"use client";
import { useEffect, useRef, useState } from "react";

export function fmt(n: number): string {
  const r = Math.round(n);
  return r >= 1000 ? r.toLocaleString("en-US") : String(r);
}

function useCountUp(target: number, vis: boolean, duration = 1500) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!vis || done.current) return;
    done.current = true;
    if (document.body.classList.contains("motion-off")) { setV(target); return; }
    const t0 = performance.now();
    const fb = setTimeout(() => setV(target), duration + 300);
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick); else { setV(target); clearTimeout(fb); }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [vis, target, duration]);
  return v;
}

export function StatNum({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (el.getBoundingClientRect().top < (window.innerHeight || 800) * 1.1) setVis(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const v = useCountUp(value, vis);
  return <span ref={ref}>{fmt(v)}</span>;
}
