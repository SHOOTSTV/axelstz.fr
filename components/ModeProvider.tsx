"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

interface ModeCtx {
  recruiter: boolean; setRecruiter: (v: boolean) => void;
}
const Ctx = createContext<ModeCtx | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [recruiter, setRecruiterState] = useState(false);

  // hydrate from URL + localStorage (client-only; cannot run during SSR)
  useEffect(() => {
    const url = new URL(window.location.href);
    const wantRecruiter =
      url.searchParams.get("recruiter") === "1" || localStorage.getItem("recruiter") === "1";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from client-only URL/localStorage
    if (wantRecruiter) setRecruiterState(true);
  }, []);

  useEffect(() => { localStorage.setItem("recruiter", recruiter ? "1" : "0"); }, [recruiter]);

  // Animate the Steam<->resume swap via the View Transitions API; fall back to a
  // plain state update when motion is disabled or the API is unavailable (e.g. jsdom).
  const setRecruiter = (v: boolean) => {
    const reduce =
      document.body.classList.contains("motion-off") ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (reduce || !doc.startViewTransition) { setRecruiterState(v); return; }
    doc.startViewTransition(() => flushSync(() => setRecruiterState(v)));
  };

  return <Ctx.Provider value={{ recruiter, setRecruiter }}>{children}</Ctx.Provider>;
}

export function useMode() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMode must be used within ModeProvider");
  return c;
}
