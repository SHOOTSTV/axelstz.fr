import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/steam/Footer";
import { portfolio } from "@/data/portfolio";
describe("Footer", () => {
  it("shows brand and the Valve disclaimer", () => {
    render(<Footer data={portfolio} />);
    expect(screen.getByText("SHOOTS")).toBeTruthy();
    expect(screen.getByText(/not affiliated with or endorsed by Valve/i)).toBeTruthy();
  });
});
