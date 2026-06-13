"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface ModeCtx {
  recruiter: boolean; setRecruiter: (v: boolean) => void;
}
const Ctx = createContext<ModeCtx | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [recruiter, setRecruiter] = useState(false);

  // hydrate from URL + localStorage (client-only; cannot run during SSR)
  useEffect(() => {
    const url = new URL(window.location.href);
    const wantRecruiter =
      url.searchParams.get("recruiter") === "1" || localStorage.getItem("recruiter") === "1";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from client-only URL/localStorage
    if (wantRecruiter) setRecruiter(true);
  }, []);

  useEffect(() => { localStorage.setItem("recruiter", recruiter ? "1" : "0"); }, [recruiter]);

  return <Ctx.Provider value={{ recruiter, setRecruiter }}>{children}</Ctx.Provider>;
}

export function useMode() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMode must be used within ModeProvider");
  return c;
}
