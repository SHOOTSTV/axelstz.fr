import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Cursor } from "@/components/primitives/Cursor";

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.classList.remove("motion-off");
});

describe("Cursor", () => {
  it("mounts without throwing on desktop", () => {
    expect(() => render(<Cursor />)).not.toThrow();
  });

  it("renders nothing on a coarse (touch) pointer", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: q.includes("coarse"),
      media: q,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() { return false; },
    }));
    const { container } = render(<Cursor />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing under motion-off", () => {
    document.body.classList.add("motion-off");
    const { container } = render(<Cursor />);
    expect(container.firstChild).toBeNull();
  });
});
