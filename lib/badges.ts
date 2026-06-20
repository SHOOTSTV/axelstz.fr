import type { Badge, PortfolioData } from "@/lib/types";

// "Committed" badge built from the real total commit count. The xp field doubles
// as the milestone tier (100/500/1000) so higher totals read as a bigger achievement.
export function commitBadge(total: number): Badge {
  const tier = total >= 1000 ? { xp: 1000, color: "#b8862b" }
    : total >= 500 ? { xp: 500, color: "#7a5a2f" }
    : total >= 100 ? { xp: 100, color: "#3a5a3a" }
    : { xp: 100, color: "#3a3f4a" };
  return {
    icon: "code",
    color: tier.color,
    name: "Committed",
    desc: `${total.toLocaleString("en-US")} commits across projects`,
    year: 2026,
    xp: tier.xp,
  };
}

export function withCommitBadge(data: PortfolioData, total: number): PortfolioData {
  if (total <= 0) return data;
  return { ...data, badges: [...data.badges, commitBadge(total)] };
}
