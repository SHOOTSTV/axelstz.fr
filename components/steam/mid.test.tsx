import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedStack } from "@/components/steam/FeaturedStack";
import { BigStats } from "@/components/steam/BigStats";
import { AboutMe } from "@/components/steam/AboutMe";
import { portfolio } from "@/data/portfolio";

describe("mid sections", () => {
  it("FeaturedStack renders a tile per stack item", () => {
    const { container } = render(<FeaturedStack data={portfolio} />);
    expect(container.querySelectorAll(".trade-item")).toHaveLength(portfolio.featuredStack.length);
  });
  it("BigStats renders labels for populated stats", () => {
    document.body.classList.add("motion-off");
    const data = { ...portfolio, bigStats: portfolio.bigStats.map((s) => ({ ...s, value: 5 })) };
    render(<BigStats data={data} />);
    expect(screen.getByText("Repositories")).toBeTruthy();
  });
  it("AboutMe renders the stack specs", () => {
    render(<AboutMe data={portfolio} />);
    expect(screen.getByText(portfolio.about.specs[0])).toBeTruthy();
  });
});
