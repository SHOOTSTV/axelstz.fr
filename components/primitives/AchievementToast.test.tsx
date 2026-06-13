import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AchievementToast } from "@/components/primitives/AchievementToast";

let triggerIntersect: (id: string) => void;

beforeEach(() => {
  vi.useFakeTimers();
  class CapturingIO {
    cb: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb;
      triggerIntersect = (id: string) =>
        this.cb(
          [{ isIntersecting: true, target: { id } } as unknown as IntersectionObserverEntry],
          this as unknown as IntersectionObserver
        );
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", CapturingIO);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.classList.remove("motion-off");
});

const milestones = [{ id: "projects", title: "Featured Project" }];

describe("AchievementToast", () => {
  it("renders no toast initially", () => {
    const { container } = render(
      <>
        <div id="projects" />
        <AchievementToast milestones={milestones} />
      </>
    );
    expect(container.querySelector(".ach-toast")).toBeNull();
  });

  it("shows a sliding toast on milestone intersect, then auto-dismisses", () => {
    const { container } = render(
      <>
        <div id="projects" />
        <AchievementToast milestones={milestones} />
      </>
    );
    act(() => triggerIntersect("projects"));
    expect(screen.getByText("Featured Project")).toBeTruthy();
    act(() => vi.advanceTimersByTime(20));
    expect(container.querySelector(".ach-toast.in")).toBeTruthy();
    act(() => vi.advanceTimersByTime(4000));
    expect(container.querySelector(".ach-toast")).toBeNull();
  });

  it("fires each milestone only once", () => {
    const { container } = render(
      <>
        <div id="projects" />
        <AchievementToast milestones={milestones} />
      </>
    );
    act(() => triggerIntersect("projects"));
    act(() => triggerIntersect("projects"));
    expect(container.querySelectorAll(".ach-toast")).toHaveLength(1);
  });

  it("does not throw under motion-off", () => {
    document.body.classList.add("motion-off");
    render(
      <>
        <div id="projects" />
        <AchievementToast milestones={milestones} />
      </>
    );
    expect(() => act(() => triggerIntersect("projects"))).not.toThrow();
  });
});
