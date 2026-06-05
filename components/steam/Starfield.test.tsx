import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Starfield } from "@/components/steam/Starfield";
describe("Starfield", () => {
  it("renders a canvas element", () => {
    const { container } = render(<Starfield />);
    expect(container.querySelector("canvas#stars")).toBeTruthy();
  });
});
