import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MagneticButton } from "@/components/primitives/MagneticButton";

afterEach(() => {
  document.body.classList.remove("motion-off");
});

describe("MagneticButton", () => {
  it("renders an anchor with the href and external rel", () => {
    render(<MagneticButton href="https://example.com">Live</MagneticButton>);
    const a = screen.getByRole("link", { name: "Live" });
    expect(a).toHaveAttribute("href", "https://example.com");
    expect(a).toHaveAttribute("rel", "noreferrer");
  });

  it("translates toward the cursor on mouse move and resets on leave", () => {
    render(<MagneticButton href="#x">Go</MagneticButton>);
    const a = screen.getByRole("link", { name: "Go" });
    fireEvent.mouseMove(a, { clientX: 100, clientY: 100 });
    expect(a.style.transform).toContain("translate");
    fireEvent.mouseLeave(a);
    expect(a.style.transform).toBe("");
  });

  it("does not move when motion-off is set", () => {
    document.body.classList.add("motion-off");
    render(<MagneticButton href="#x">Go</MagneticButton>);
    const a = screen.getByRole("link", { name: "Go" });
    fireEvent.mouseMove(a, { clientX: 100, clientY: 100 });
    expect(a.style.transform).toBe("");
  });
});
