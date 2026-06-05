"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface Tweaks { accent: string; starfield: boolean; }
const DEFAULT_TWEAKS: Tweaks = { accent: "#66c0f4", starfield: true };

interface ModeCtx {
  recruiter: boolean; setRecruiter: (v: boolean) => void;
  tweaks: Tweaks; setTweak: <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;
}
const Ctx = createContext<ModeCtx | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [recruiter, setRecruiter] = useState(false);
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS);

  // hydrate from URL + localStorage (client-only; cannot run during SSR)
  useEffect(() => {
    const url = new URL(window.location.href);
    const wantRecruiter =
      url.searchParams.get("recruiter") === "1" || localStorage.getItem("recruiter") === "1";
    const saved = localStorage.getItem("tweaks");
    let savedTweaks: Tweaks | null = null;
    if (saved) {
      try { savedTweaks = { ...DEFAULT_TWEAKS, ...JSON.parse(saved) }; } catch {}
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from client-only URL/localStorage
    if (wantRecruiter) setRecruiter(true);
    if (savedTweaks) setTweaks(savedTweaks);
  }, []);

  useEffect(() => { localStorage.setItem("recruiter", recruiter ? "1" : "0"); }, [recruiter]);
  useEffect(() => {
    localStorage.setItem("tweaks", JSON.stringify(tweaks));
    document.documentElement.style.setProperty("--link", tweaks.accent);
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.body.classList.toggle("motion-off", !tweaks.starfield);
  }, [tweaks]);

  const setTweak: ModeCtx["setTweak"] = (k, v) => setTweaks((t) => ({ ...t, [k]: v }));
  return <Ctx.Provider value={{ recruiter, setRecruiter, tweaks, setTweak }}>{children}</Ctx.Provider>;
}

export function useMode() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMode must be used within ModeProvider");
  return c;
}
