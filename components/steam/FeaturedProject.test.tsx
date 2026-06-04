import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedProject } from "@/components/steam/FeaturedProject";
import { portfolio } from "@/data/portfolio";
describe("FeaturedProject", () => {
  it("renders name, a stat and live/code links", () => {
    render(<FeaturedProject data={portfolio} />);
    expect(screen.getByText(portfolio.featuredProject.name)).toBeTruthy();
    expect(screen.getByText(portfolio.featuredProject.stats[0].key)).toBeTruthy();
    expect(screen.getByRole("link", { name: /live/i })).toBeTruthy();
  });
});
