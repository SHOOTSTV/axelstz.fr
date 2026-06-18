import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScreenshotsGallery, type GalleryShot, type GalleryProduct } from "@/components/steam/ScreenshotsGallery";
import { portfolio } from "@/data/portfolio";

const products: GalleryProduct[] = [
  { slug: "macrotrackr", name: "MacroTrackr", n: 1 },
  { slug: "floatvision", name: "FloatVision", n: 2 },
];
const shots: GalleryShot[] = [
  { id: "macrotrackr-0", src: "/images/macrotrackr.png", project: "MacroTrackr", slug: "macrotrackr" },
  { id: "floatvision-0", src: "/images/floatvision-1.png", project: "FloatVision", slug: "floatvision" },
  { id: "floatvision-1", src: "/images/floatvision-2.png", project: "FloatVision", slug: "floatvision" },
];

describe("ScreenshotsGallery", () => {
  beforeEach(() => document.body.classList.add("motion-off"));

  it("renders a card for every screenshot, grouped by project", () => {
    const { container } = render(<ScreenshotsGallery data={portfolio} shots={shots} products={products} />);
    expect(container.querySelectorAll(".ss-card")).toHaveLength(shots.length);
    expect(container.querySelectorAll(".ss-group-label")).toHaveLength(products.length);
    expect(screen.getByText(/3 screenshots · 2 projects/)).toBeTruthy();
  });

  it("filters the wall when a product is chosen", () => {
    const { container } = render(<ScreenshotsGallery data={portfolio} shots={shots} products={products} />);
    fireEvent.click(screen.getByText("All projects")); // open dropdown
    const opt = [...container.querySelectorAll(".ss-dd-opt")].find((o) => o.textContent?.includes("FloatVision"))!;
    fireEvent.click(opt); // pick a product
    expect(container.querySelectorAll(".ss-card")).toHaveLength(2);
    expect(container.querySelector(".ss-group-label")).toBeNull(); // no dividers when filtered
  });

  it("opens the lightbox when a card is clicked", () => {
    const { container } = render(<ScreenshotsGallery data={portfolio} shots={shots} products={products} />);
    expect(container.querySelector(".lb-overlay")).toBeNull();
    fireEvent.click(container.querySelectorAll(".ss-card")[0]);
    expect(container.querySelector(".lb-overlay")).toBeTruthy();
  });

  it("shows an empty state when there are no screenshots", () => {
    render(<ScreenshotsGallery data={portfolio} shots={[]} products={[]} />);
    expect(screen.getByText(/No screenshots match this filter/)).toBeTruthy();
  });
});
