import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BigStats } from "./BigStats";
import type { PortfolioData } from "@/lib/types";

const base = (bigStats: PortfolioData["bigStats"]) =>
  ({ bigStats } as unknown as PortfolioData);

describe("BigStats", () => {
  it("hides stat tiles whose value is 0", () => {
    render(<BigStats data={base([
      { key: "projects", value: 2, label: "Projects shipped" },
      { key: "repos", value: 0, label: "Repositories" },
    ])} />);
    expect(screen.getByText("Projects shipped")).toBeInTheDocument();
    expect(screen.queryByText("Repositories")).not.toBeInTheDocument();
  });

  it("renders nothing when every tile is 0", () => {
    const { container } = render(<BigStats data={base([
      { key: "repos", value: 0, label: "Repositories" },
      { key: "commits", value: 0, label: "Total commits" },
    ])} />);
    expect(container).toBeEmptyDOMElement();
  });
});
