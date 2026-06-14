import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectStorePage } from "@/components/projects/ProjectStorePage";
import { getProjectDetail } from "@/data/projectDetails";
import { portfolio } from "@/data/portfolio";
import type { Project } from "@/lib/types";

const project: Project = {
  name: "MacroTrackr",
  image: "/images/macrotrackr.png",
  meta: "AI nutrition tracker",
  last: "live",
  code: "https://github.com/SHOOTSTV/macrotrackr",
  live: "https://macrotrackr.app/",
  ribbon: true,
  lastUpdate: "Jun 3",
};
const detail = getProjectDetail(project);

describe("ProjectStorePage", () => {
  it("renders the title, summary and stack tags", () => {
    render(<ProjectStorePage data={portfolio} project={project} detail={detail} />);
    expect(screen.getByRole("heading", { name: "MacroTrackr" })).toBeTruthy();
    expect(screen.getByText(/logs your meals for you/i)).toBeTruthy();
    expect(screen.getAllByText("Supabase").length).toBeGreaterThan(0); // stack tag + tech chip
  });

  it("shows the stack tags row", () => {
    render(<ProjectStorePage data={portfolio} project={project} detail={detail} />);
    const tags = document.querySelectorAll(".tag-row .tag");
    expect(Array.from(tags).map((t) => t.textContent)).toContain("Next.js 16");
  });

  it("points the primary CTA at the live URL", () => {
    render(<ProjectStorePage data={portfolio} project={project} detail={detail} />);
    expect(screen.getByText(/Live demo/).getAttribute("href")).toBe("https://macrotrackr.app/");
  });

  it("opens the changelog modal from a card and closes it", () => {
    render(<ProjectStorePage data={portfolio} project={project} detail={detail} />);
    fireEvent.click(screen.getByText("Security patches & product README"));
    expect(screen.getByText(/Update 1 \//)).toBeTruthy(); // modal footer
    fireEvent.click(screen.getByLabelText("Close"));
    expect(screen.queryByText(/Update 1 \//)).toBeNull();
  });

  it("falls back gracefully for a project without a detail record", () => {
    const unknown: Project = { name: "Mystery Tool", image: "", meta: "CLI · Go", last: "x" };
    const d = getProjectDetail(unknown);
    render(<ProjectStorePage data={portfolio} project={unknown} detail={d} />);
    expect(screen.getByRole("heading", { name: "Mystery Tool" })).toBeTruthy();
    expect(screen.getAllByText("CLI").length).toBeGreaterThan(0); // derived from meta
  });
});
