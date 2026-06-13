import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/steam/Sidebar";
import { portfolio } from "@/data/portfolio";
describe("Sidebar", () => {
  it("renders counts and real social links", () => {
    render(<Sidebar data={portfolio} />);
    expect(screen.getByText("Repositories")).toBeTruthy();
    const gh = screen.getByText("GitHub").closest("a");
    expect(gh?.getAttribute("href")).toBe(portfolio.social[0].href);
  });
});
