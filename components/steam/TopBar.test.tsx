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
});
