"use client";
import { useMode } from "@/components/ModeProvider";

export function RecruiterToggle() {
  const { recruiter, setRecruiter } = useMode();
  return (
    <button className="recruiter-toggle" aria-pressed={recruiter}
      onClick={() => setRecruiter(!recruiter)}>
      ⇄ {recruiter ? "Steam view" : "Recruiter mode"}
    </button>
  );
}
