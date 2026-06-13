import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ModeProvider, useMode } from "@/components/ModeProvider";

function Probe() {
  const { recruiter, setRecruiter } = useMode();
  return (
    <div>
      <span data-testid="mode">{recruiter ? "resume" : "steam"}</span>
      <button onClick={() => setRecruiter(true)}>go</button>
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
});
