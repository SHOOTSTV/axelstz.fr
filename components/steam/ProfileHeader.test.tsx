import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHeader } from "@/components/steam/ProfileHeader";
import { portfolio } from "@/data/portfolio";

describe("ProfileHeader", () => {
  it("renders name, level badge = age, and xp title", () => {
    render(<ProfileHeader data={portfolio} />);
    expect(screen.getByText("Axel.S")).toBeTruthy();
    expect(screen.getByText(String(portfolio.profile.level))).toBeTruthy();
    expect(screen.getByText(portfolio.profile.xp.title)).toBeTruthy();
  });
});
