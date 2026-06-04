"use client";
import { useEffect, useRef, useState } from "react";

export function Prog({ value, max }: { value: number; max: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const off = document.body.classList.contains("motion-off");
    const set = () => (off ? setW(pct) : setTimeout(() => setW(pct), 150));
    if (el.getBoundingClientRect().top < (window.innerHeight || 800)) set();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [pct]);
  return <div className="prog-track" ref={ref}><div className="prog-fill" style={{ width: `${w}%` }} /></div>;
}
