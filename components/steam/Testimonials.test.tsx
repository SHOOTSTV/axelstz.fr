import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Testimonials } from "@/components/steam/Testimonials";
import { portfolio } from "@/data/portfolio";

describe("Testimonials", () => {
  it("renders any seeded testimonials", () => {
    const seeded = {
      ...portfolio,
      testimonials: [{ name: "guest", date: "today", text: "left a note", image: "" }],
    };
    render(<Testimonials data={seeded} />);
    expect(screen.getByText("Testimonials")).toBeTruthy();
    expect(screen.getByText("left a note")).toBeTruthy();
  });
  it("lets a visitor post a comment (client-only)", async () => {
    render(<Testimonials data={portfolio} />);
    await userEvent.type(screen.getByPlaceholderText(/add a comment/i), "great dev");
    await userEvent.click(screen.getByRole("button", { name: /post/i }));
    expect(screen.getByText("great dev")).toBeTruthy();
  });
});
