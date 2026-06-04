import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/primitives/Reveal";

describe("Reveal", () => {
  it("renders children with the reveal class", () => {
    render(<Reveal><p>hello</p></Reveal>);
    const el = screen.getByText("hello").parentElement!;
    expect(el.className).toContain("reveal");
  });
});
