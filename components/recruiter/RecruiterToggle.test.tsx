import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ModeProvider, useMode } from "@/components/ModeProvider";
import { RecruiterToggle } from "@/components/recruiter/RecruiterToggle";

function Mode() { const { recruiter } = useMode(); return <span data-testid="m">{recruiter ? "resume" : "steam"}</span>; }

describe("RecruiterToggle", () => {
  it("flips recruiter mode on click", () => {
    render(<ModeProvider><RecruiterToggle /><Mode /></ModeProvider>);
    act(() => { screen.getByRole("button", { name: /recruiter mode/i }).click(); });
    expect(screen.getByTestId("m").textContent).toBe("resume");
  });
});
