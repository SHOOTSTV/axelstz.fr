"use client";
import { useEffect, useRef } from "react";

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return; // jsdom / unsupported

    let w = 0, h = 0, dpr = 1, raf = 0, run = true;
    const N = 150;
    const stars: { a: number; r: number; sp: number; br: number; ln: number }[] = [];

    function resize() {
      if (!cv || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      stars.length = 0;
      for (let i = 0; i < N; i++) {
        stars.push({
          a: Math.random() * Math.PI * 2,
          r: Math.pow(Math.random(), 0.6) * Math.hypot(w, h) * 0.62,
          sp: 0.00025 + Math.random() * 0.0007,
          br: 0.15 + Math.random() * 0.55,
          ln: 0.04 + Math.random() * 0.12,
        });
      }
    }
    function draw() {
      if (!run || !ctx) return;
      const cx = w * 0.5, cy = h * 0.16;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const s of stars) {
        s.a += s.sp;
        const x1 = cx + Math.cos(s.a) * s.r, y1 = cy + Math.sin(s.a) * s.r;
        const x2 = cx + Math.cos(s.a - s.ln) * s.r, y2 = cy + Math.sin(s.a - s.ln) * s.r;
        ctx.strokeStyle = `rgba(255,255,255,${s.br * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    }

    resize(); seed(); draw();
    const onR = () => { resize(); seed(); };
    window.addEventListener("resize", onR);
    return () => { run = false; cancelAnimationFrame(raf); window.removeEventListener("resize", onR); };
  }, []);

  return <canvas id="stars" ref={ref} />;
}
