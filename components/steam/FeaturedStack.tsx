import type { PortfolioData } from "@/lib/types";
import { Icon } from "@/components/primitives/Icon";

export function FeaturedStack({ data }: { data: PortfolioData }) {
  return (
    <div>
      <div className="sec-label">Featured stack</div>
      <div className="trade-items">
        {data.featuredStack.map((it, i) => (
          <div className={`trade-item ${it.hot ? "hot" : ""}`} key={i}><Icon name={it.icon} size={42} /></div>
        ))}
      </div>
    </div>
  );
}
