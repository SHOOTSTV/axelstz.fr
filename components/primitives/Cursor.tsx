"use client";
import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Decide eligibility once: desktop, motion allowed, not touch.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const touch =
      window.matchMedia?.("(pointer: coarse)").matches || "ontouchstart" in window;
    if (reduce || touch || document.body.classList.contains("motion-off")) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gate render on client-only capabilities
    setEnabled(true);
  }, []);

  // Run the lerp loop only once the ring is actually rendered.
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = !!t.closest?.("a, button, input, textarea, [role='button']");
      ref.current?.classList.toggle("big", interactive);
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (ref.current) ref.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ref} className="cursor-ring" aria-hidden="true" />;
}
