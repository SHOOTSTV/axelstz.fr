import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopBar } from "@/components/steam/TopBar";
import { portfolio } from "@/data/portfolio";

describe("TopBar", () => {
  it("shows the nav, and NO Install-App micro-bar", () => {
    render(<TopBar data={portfolio} />);
    expect(screen.getByText("PROJECTS")).toBeTruthy();
    expect(screen.queryByText(/Install App/i)).toBeNull();
  });

  it("defaults active to the first nav item, not a hardcoded index", () => {
    render(<TopBar data={portfolio} />);
    expect(screen.getByText(portfolio.nav[0]).className).toContain("active");
    // ACTIVITY used to be hardcoded active (i === 2)
    expect(screen.getByText("ACTIVITY").className).not.toContain("active");
  });
});
