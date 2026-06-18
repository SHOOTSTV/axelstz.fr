import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ProjectsLibrary } from "@/components/projects/ProjectsLibrary";
import type { PortfolioData, Project } from "@/lib/types";
import { portfolio } from "@/data/portfolio";

const projects: Project[] = [
  { name: "Alpha", image: "/a.png", meta: "demo", last: "x", code: "https://github.com/u/alpha", live: "https://alpha.dev", commits: 50, lastUpdate: "Jun 3", milestones: { done: 2, total: 4 } },
  { name: "Bravo", image: "/b.png", meta: "demo", last: "x", code: "https://github.com/u/bravo", commits: 900, lastUpdate: "May 1", milestones: { done: 3, total: 3 } },
  { name: "Charlie", image: "/c.png", meta: "demo", last: "x", code: "https://github.com/u/charlie", commits: 10, milestones: { done: 1, total: 1 } },
];
const data: PortfolioData = { ...portfolio, projects };

describe("ProjectsLibrary", () => {
  it("renders a row per project with its commit count and last-update date", () => {
    render(<ProjectsLibrary data={data} />);
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("900")).toBeTruthy(); // formatted commits
    expect(screen.getByText("Jun 3")).toBeTruthy();
  });

  it("sorts by commits (desc) by default", () => {
    render(<ProjectsLibrary data={data} />);
    const names = screen.getAllByText(/Alpha|Bravo|Charlie/).map((n) => n.textContent);
    expect(names).toEqual(["Bravo", "Alpha", "Charlie"]);
  });

  it("filters by search query", () => {
    render(<ProjectsLibrary data={data} />);
    fireEvent.change(screen.getByPlaceholderText("Find a project"), { target: { value: "brav" } });
    expect(screen.getByText("Bravo")).toBeTruthy();
    expect(screen.queryByText("Alpha")).toBeNull();
  });

  it("the Live tab shows only projects with a live URL", () => {
    render(<ProjectsLibrary data={data} />);
    fireEvent.click(screen.getByText("Live"));
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.queryByText("Bravo")).toBeNull();
  });

  it("filters by category chips, sorted with All categories first", () => {
    const cats = ["AI SaaS", "Browser extension", "Portfolio"];
    const withCats: Project[] = projects.map((p, i) => ({ ...p, category: cats[i] }));
    render(<ProjectsLibrary data={{ ...data, projects: withCats }} />);

    // chips render with per-category counts
    expect(screen.getByText("All categories")).toBeTruthy();
    fireEvent.click(screen.getByText("AI SaaS"));

    expect(screen.getByText("Alpha")).toBeTruthy(); // AI SaaS
    expect(screen.queryByText("Bravo")).toBeNull(); // Browser extension
    expect(screen.queryByText("Charlie")).toBeNull(); // Portfolio
  });

  it("derives the primary CTA from the live URL (else falls back to code)", () => {
    render(<ProjectsLibrary data={data} />);
    const alpha = screen.getByText("Alpha").closest(".lib-row") as HTMLElement;
    expect(within(alpha).getByText(/Live demo/).getAttribute("href")).toBe("https://alpha.dev");
    const charlie = screen.getByText("Charlie").closest(".lib-row") as HTMLElement;
    expect(within(charlie).getByText(/View code/).getAttribute("href")).toBe("https://github.com/u/charlie");
  });
});
