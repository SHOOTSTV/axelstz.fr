import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Shell } from "@/components/Profile";
import { portfolio } from "@/data/portfolio";

describe("a11y", () => {
  it("has a banner, main and contentinfo landmark", () => {
    const { container } = render(<Shell data={portfolio} github={null} />);
    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector("main")).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
  });
});
