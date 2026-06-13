// Length-independent constant-time string comparison. Edge-runtime safe (no
// node:crypto, which proxy.ts's edge runtime lacks): folds length difference and
// every char-code XOR into one accumulator so timing doesn't reveal the match
// position, and the whole "user:pass" string is compared in one pass so a wrong
// username can't short-circuit before the password is examined.
function constantTimeEqual(a: string, b: string): boolean {
  let mismatch = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

export function checkBasicAuth(header: string | null, user: string, pass: string): boolean {
  if (!header || !header.startsWith("Basic ") || !user || !pass) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return false;
  }
  if (!decoded.includes(":")) return false;
  return constantTimeEqual(decoded, `${user}:${pass}`);
}
