import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BadgeTile } from "@/components/steam/BadgeTile";
import type { Badge } from "@/lib/types";

const badge: Badge = { icon: "rocket", color: "#5a4b8a", name: "Shipper", desc: "Shipped multiple live projects", year: 2026, xp: 100 };

describe("BadgeTile", () => {
  it("renders the badge name, description, unlock year and xp", () => {
    render(<BadgeTile badge={badge} />);
    expect(screen.getByText("Shipper")).toBeTruthy();
    expect(screen.getByText("Shipped multiple live projects")).toBeTruthy();
    expect(screen.getByText(/Unlocked 2026/)).toBeTruthy();
    expect(screen.getByText(/100 XP/)).toBeTruthy();
  });

  it("exposes the name+desc as an accessible label and omits XP when absent", () => {
    const noXp: Badge = { ...badge, xp: undefined };
    render(<BadgeTile badge={noXp} />);
    expect(screen.getByLabelText("Shipper — Shipped multiple live projects")).toBeTruthy();
    expect(screen.queryByText(/XP/)).toBeNull();
  });
});
