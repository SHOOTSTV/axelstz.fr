import type { Badge } from "@/lib/types";
import { Icon } from "@/components/primitives/Icon";

export function BadgeTile({ badge }: { badge: Badge }) {
  const label = `${badge.name} — ${badge.desc}`;
  return (
    <span className="badge-tile" tabIndex={0} aria-label={label} title={label}>
      <span className="badge-ic" style={{ background: `linear-gradient(160deg, ${badge.color}, #14171b)` }}>
        <Icon name={badge.icon} size={20} />
      </span>
      <span className="badge-tip" role="tooltip">
        <span className="bt-name">{badge.name}</span>
        <span className="bt-desc">{badge.desc}</span>
        <span className="bt-meta">Unlocked {badge.year}{badge.xp != null ? ` · ${badge.xp} XP` : ""}</span>
      </span>
    </span>
  );
}
