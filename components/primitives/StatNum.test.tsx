import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatNum } from "@/components/primitives/StatNum";

describe("StatNum", () => {
  beforeEach(() => document.body.classList.add("motion-off"));
  it("renders the formatted final value when motion is off", () => {
    render(<StatNum value={18400} />);
    expect(screen.getByText("18,400")).toBeTruthy();
  });
});
