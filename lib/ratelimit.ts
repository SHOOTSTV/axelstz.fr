// Best-effort in-memory fixed-window rate limiter. No external store: on
// serverless this limits per-instance, which is enough to blunt write-spam on a
// low-traffic portfolio without adding infra. Swap for Vercel KV / Upstash if
// traffic grows.
interface Options {
  limit: number;
  windowMs: number;
  now?: () => number;
}

interface Hit {
  count: number;
  resetAt: number;
}

export function createRateLimiter({ limit, windowMs, now = Date.now }: Options) {
  const hits = new Map<string, Hit>();

  return {
    allow(key: string): boolean {
      const t = now();
      const hit = hits.get(key);
      if (!hit || t >= hit.resetAt) {
        hits.set(key, { count: 1, resetAt: t + windowMs });
        return true;
      }
      if (hit.count >= limit) return false;
      hit.count++;
      return true;
    },
  };
}
