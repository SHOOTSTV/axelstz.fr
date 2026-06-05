import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResumeView } from "@/components/recruiter/ResumeView";
import { portfolio } from "@/data/portfolio";

describe("ResumeView", () => {
  it("renders name, role, a skill, a project and a CV link", () => {
    render(<ResumeView data={portfolio} />);
    expect(screen.getByText("Axel.S")).toBeTruthy();
    expect(screen.getByText(portfolio.profile.role)).toBeTruthy();
    expect(screen.getByText(portfolio.projects[0].name)).toBeTruthy();
    const cv = screen.getByRole("link", { name: /download cv/i });
    expect(cv.getAttribute("href")).toContain(".pdf");
  });
});
