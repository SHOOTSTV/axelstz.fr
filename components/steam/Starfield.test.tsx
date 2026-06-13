import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Starfield } from "@/components/steam/Starfield";
describe("Starfield", () => {
  it("renders a canvas element", () => {
    const { container } = render(<Starfield />);
    expect(container.querySelector("canvas#stars")).toBeTruthy();
  });

  it("mounts and unmounts cleanly even when the tab is hidden", () => {
    const spy = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    const { unmount } = render(<Starfield />);
    expect(() => unmount()).not.toThrow();
    spy.mockRestore();
  });
});
