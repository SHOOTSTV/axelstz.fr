import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecentActivity } from "@/components/steam/RecentActivity";
import { portfolio } from "@/data/portfolio";
describe("RecentActivity", () => {
  it("renders a game row per project", () => {
    document.body.classList.add("motion-off");
    const { container } = render(<RecentActivity data={portfolio} />);
    expect(container.querySelectorAll(".game-row").length).toBe(portfolio.projects.length);
    expect(screen.getByText(portfolio.projects[0].name)).toBeTruthy();
  });
});
