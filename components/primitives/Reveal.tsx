"use client";
import { useEffect, useRef } from "react";

export function Reveal({ children, delay = 0, className = "", style }:
  { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800) * 0.98 && r.bottom > 0) el.classList.add("in");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}
