export function checkBasicAuth(header: string | null, user: string, pass: string): boolean {
  if (!header || !header.startsWith("Basic ") || !user || !pass) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return false;
  }
  const idx = decoded.indexOf(":");
  if (idx === -1) return false;
  return decoded.slice(0, idx) === user && decoded.slice(idx + 1) === pass;
}
