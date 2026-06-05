import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Shell } from "@/components/Profile";
import { portfolio } from "@/data/portfolio";

describe("Shell", () => {
  it("renders Steam profile by default and switches to resume", () => {
    render(<Shell data={portfolio} github={null} />);
    expect(screen.getByText("Recent activity")).toBeTruthy(); // steam-only section
    act(() => { screen.getByRole("button", { name: /recruiter mode/i }).click(); });
    expect(screen.queryByText("Recent activity")).toBeNull();
    expect(screen.getByRole("link", { name: /download cv/i })).toBeTruthy();
  });
});
