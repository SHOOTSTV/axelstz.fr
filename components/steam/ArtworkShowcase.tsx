import type { PortfolioData } from "@/lib/types";
import { Frame } from "@/components/primitives/Frame";

export function ArtworkShowcase({ data }: { data: PortfolioData }) {
  return (
    <div className="art-showcase">
      <div className="art-frames">
        {[1, 2, 3].map((n) => (
          <div className="art-frame" key={n}>
            <div className="inner">
              <Frame src={`/images/art-${n}.png`} alt={`Artwork ${n}`} placeholder={n === 2 ? "Drop artwork / hero shot" : ""} />
            </div>
          </div>
        ))}
      </div>
      <div className="art-url">{data.profile.url}</div>
    </div>
  );
}
