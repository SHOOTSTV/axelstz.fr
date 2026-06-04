import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Frame } from "@/components/primitives/Frame";

describe("Frame", () => {
  it("renders an image when src is given", () => {
    render(<Frame src="/images/x.png" alt="avatar" />);
    expect(screen.getByAltText("avatar")).toBeTruthy();
  });
  it("renders a labelled placeholder when no src", () => {
    render(<Frame placeholder="Drop avatar" />);
    expect(screen.getByText("Drop avatar")).toBeTruthy();
  });
});
