/**
 * Rate limiting for public endpoints.
 *
 * In-memory fixed window. On a single instance this stops the obvious abuse:
 * a script hammering the lead endpoint. It does NOT survive a restart and is
 * not shared across serverless instances — when the site runs on more than one
 * instance, swap the store for Redis/Upstash behind this same interface.
 * The call sites do not need to change.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 10_000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets — used for the Retry-After header. */
  retryAfter: number;
};

export function rateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    // Cheap guard against unbounded growth from spoofed IPs.
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
      }
      if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.ceil((existing.resetAt - now) / 1000);

  if (existing.count > limit) {
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: limit - existing.count, retryAfter };
}

/**
 * Best-effort client IP. Behind Vercel the first x-forwarded-for entry is the
 * real client; the value is untrusted, so it is only ever used as a rate-limit
 * key and truncated before storage.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() ?? "unknown";
}

/**
 * IPv4 → /24, IPv6 → /48. Enough to demonstrate where a consent came from
 * without keeping a precise identifier.
 */
export function truncateIp(ip: string): string | null {
  if (!ip || ip === "unknown") return null;
  if (ip.includes(":")) {
    return `${ip.split(":").slice(0, 3).join(":")}::/48`;
  }
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
}

/** Test hook — resets the in-memory windows. */
export function __resetRateLimits() {
  buckets.clear();
}
