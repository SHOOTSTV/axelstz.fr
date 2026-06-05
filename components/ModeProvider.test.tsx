import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ModeProvider, useMode } from "@/components/ModeProvider";

function Probe() {
  const { recruiter, setRecruiter, tweaks, setTweak } = useMode();
  return (
    <div>
      <span data-testid="mode">{recruiter ? "resume" : "steam"}</span>
      <span data-testid="accent">{tweaks.accent}</span>
      <button onClick={() => setRecruiter(true)}>go</button>
      <button onClick={() => setTweak("accent", "#1fd6a0")}>accent</button>
    </div>
  );
}

describe("ModeProvider", () => {
  it("defaults to steam mode and toggles to resume", () => {
    render(<ModeProvider><Probe /></ModeProvider>);
    expect(screen.getByTestId("mode").textContent).toBe("steam");
    act(() => { screen.getByText("go").click(); });
    expect(screen.getByTestId("mode").textContent).toBe("resume");
  });
  it("updates a tweak value", () => {
    render(<ModeProvider><Probe /></ModeProvider>);
    act(() => { screen.getByText("accent").click(); });
    expect(screen.getByTestId("accent").textContent).toBe("#1fd6a0");
  });
});
