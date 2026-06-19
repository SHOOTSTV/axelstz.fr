// Defense-in-depth for user-submitted links: only http(s) URLs are safe to put
// in an href. Submission already enforces this at insert time, but the render
// sites must not trust that single check (e.g. a relaxed schema would otherwise
// allow a javascript:/data: href to reach a viewer).
export function isHttpUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}
