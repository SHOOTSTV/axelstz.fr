import "@testing-library/jest-dom/vitest";

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error test stub
global.IntersectionObserver = IO;
window.matchMedia ||= ((q: string) => ({
  matches: false, media: q, onchange: null,
  addEventListener() {}, removeEventListener() {},
  addListener() {}, removeListener() {}, dispatchEvent() { return false; },
})) as unknown as typeof window.matchMedia;
