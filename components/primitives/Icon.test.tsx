import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "@/components/primitives/Icon";

describe("Icon", () => {
  it("renders an svg for a known name", () => {
    const { container } = render(<Icon name="github" />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
  });
  it("renders nothing for an unknown name", () => {
    const { container } = render(<Icon name="nope" />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
