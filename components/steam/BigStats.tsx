import type { PortfolioData } from "@/lib/types";
import { StatNum } from "@/components/primitives/StatNum";

export function BigStats({ data }: { data: PortfolioData }) {
  const stats = data.bigStats.filter((s) => s.value > 0);
  if (stats.length === 0) return null;
  return (
    <div className="stat-row">
      {stats.map((s) => (
        <div className="stat-col" key={s.label}>
          <div className="v"><StatNum value={s.value} /></div>
          <div className="k">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
