/**
 * Best-effort in-memory rate limiting for Route Handlers.
 * On serverless, each instance has its own map — sufficient for casual abuse;
 * at scale, use Redis / Upstash or an edge rate limiter.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 8000;

function pruneExpired(now: number): void {
  if (buckets.size < MAX_KEYS) return;
  for (const [k, v] of buckets) {
    if (now > v.resetAt) buckets.delete(k);
  }
}

export function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

/**
 * Fixed window: at most `limit` requests per `windowMs` per `key`.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  let b = buckets.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }

  if (b.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  }
  b.count += 1;
  return { ok: true };
}
