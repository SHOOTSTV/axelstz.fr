"use client";
import { useMode } from "@/components/ModeProvider";

export function RecruiterToggle({ variant = "pill" }: { variant?: "pill" | "chip" }) {
  const { recruiter, setRecruiter } = useMode();
  return (
    <button className={variant === "chip" ? "recruiter-chip" : "recruiter-toggle"} aria-pressed={recruiter}
      onClick={() => setRecruiter(!recruiter)}>
      ⇄ {recruiter ? "Steam view" : "Recruiter mode"}
    </button>
  );
}
