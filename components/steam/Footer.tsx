import type { PortfolioData } from "@/lib/types";
import { Icon } from "@/components/primitives/Icon";

export function Footer({ data }: { data: PortfolioData }) {
  const brand = data.profile.brand;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo">{brand[0]}</span>
          <span className="word">{brand}</span>
        </div>
        <div className="footer-cols">
          <div>
            <div className="footer-copy">
              © 2026 Axel.S. All work shown is original.<br />
              Steam-profile-inspired layout — not affiliated with or endorsed by Valve.
            </div>
            <div className="footer-social">
              {data.footer.social.map((s) => (
                <a href="#" key={s} aria-label={s}><Icon name={s} size={20} /></a>
              ))}
            </div>
          </div>
          {data.footer.cols.map((col) => (
            <div className="footer-col" key={col.h}>
              <h4>{col.h}</h4>
              {col.links.map((l) => <a href="#" key={l}>{l}</a>)}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
