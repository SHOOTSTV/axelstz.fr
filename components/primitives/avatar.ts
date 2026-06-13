const PALETTE = ["#3a3a3a", "#2a5a8a", "#7a2f5a", "#5a4b8a", "#6a3a3a", "#2a6a5a"];

export function avatarFor(name: string): { bg: string; initial: string } {
  const trimmed = name.trim();
  const initial = (trimmed.match(/[a-z0-9]/i)?.[0] ?? "?").toUpperCase();
  let h = 0;
  for (let i = 0; i < trimmed.length; i++) h = (h * 31 + trimmed.charCodeAt(i)) >>> 0;
  return { bg: PALETTE[h % PALETTE.length], initial };
}
