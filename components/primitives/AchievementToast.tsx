"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/primitives/Icon";
import type { IconName } from "@/lib/types";

export interface Milestone {
  id: string;
  title: string;
  icon?: IconName;
}

interface Toast {
  key: number;
  title: string;
  icon?: IconName;
  vis: boolean;
}

export function AchievementToast({ milestones }: { milestones: Milestone[] }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const els = milestones
      .map((m) => document.getElementById(m.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const fired = new Set<string>();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let key = 0;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || fired.has(e.target.id)) continue;
          const m = milestones.find((x) => x.id === e.target.id);
          if (!m) continue;
          fired.add(e.target.id);
          const k = key++;
          setToasts((t) => [...t, { key: k, title: m.title, icon: m.icon, vis: false }]);
          timers.push(
            setTimeout(
              () => setToasts((t) => t.map((x) => (x.key === k ? { ...x, vis: true } : x))),
              20
            )
          );
          timers.push(
            setTimeout(() => setToasts((t) => t.filter((x) => x.key !== k)), 3800)
          );
        }
      },
      { threshold: 0.4 }
    );

    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [milestones]);

  return (
    <div className="ach-host" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.key} className={`ach-toast${t.vis ? " in" : ""}`}>
          {t.icon ? <Icon name={t.icon} size={26} /> : null}
          <span className="ach-txt">
            <span className="at">Achievement Unlocked</span>
            <span className="an">{t.title}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
