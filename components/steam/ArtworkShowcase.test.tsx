import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArtworkShowcase } from "@/components/steam/ArtworkShowcase";
import { portfolio } from "@/data/portfolio";
describe("ArtworkShowcase", () => {
  it("renders frames and the profile url", () => {
    const { container } = render(<ArtworkShowcase data={portfolio} />);
    expect(container.querySelectorAll(".art-frame").length).toBe(3);
    expect(screen.getByText(portfolio.profile.url)).toBeTruthy();
  });
});
