import type { PortfolioData } from "@/lib/types";
import { StatNum } from "@/components/primitives/StatNum";

export function BigStats({ data }: { data: PortfolioData }) {
  return (
    <div className="stat-row">
      {data.bigStats.map((s) => (
        <div className="stat-col" key={s.label}>
          <div className="v"><StatNum value={s.value} /></div>
          <div className="k">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
