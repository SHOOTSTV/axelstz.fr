import type { PortfolioData } from "@/lib/types";
import { StackIcon } from "@/components/steam/StackIcon";

export function FeaturedStack({ data }: { data: PortfolioData }) {
  return (
    <div>
      <div className="sec-label">Featured stack</div>
      <div className="trade-items">
        {data.featuredStack.map((it, i) => (
          <div className="trade-item" key={i} title={it.label}>
            <StackIcon name={it.icon} size={44} />
            <span className="trade-label">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
