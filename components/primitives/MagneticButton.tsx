"use client";
import { useRef } from "react";

export function MagneticButton({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (document.body.classList.contains("motion-off")) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.3;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transition: "transform .2s cubic-bezier(.2,.8,.2,1)" }}
    >
      {children}
    </a>
  );
}
