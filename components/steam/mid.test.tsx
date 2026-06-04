import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedStack } from "@/components/steam/FeaturedStack";
import { BigStats } from "@/components/steam/BigStats";
import { AboutMe } from "@/components/steam/AboutMe";
import { portfolio } from "@/data/portfolio";

describe("mid sections", () => {
  it("FeaturedStack renders the hot item", () => {
    const { container } = render(<FeaturedStack data={portfolio} />);
    expect(container.querySelector(".trade-item.hot")).toBeTruthy();
  });
  it("BigStats renders labels", () => {
    document.body.classList.add("motion-off");
    render(<BigStats data={portfolio} />);
    expect(screen.getByText("Projects shipped")).toBeTruthy();
  });
  it("AboutMe renders the stack specs", () => {
    render(<AboutMe data={portfolio} />);
    expect(screen.getByText(portfolio.about.specs[0])).toBeTruthy();
  });
});
