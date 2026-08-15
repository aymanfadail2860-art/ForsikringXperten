import { beforeEach, describe, expect, it } from "vitest";
import {
  rateLimit,
  getClientIp,
  truncateIp,
  __resetRateLimits,
} from "@/lib/security/rateLimit";
import { logger } from "@/lib/observability/logger";

describe("rateLimit", () => {
  beforeEach(() => __resetRateLimits());

  it("allows requests up to the limit and blocks the next one", () => {
    const options = { key: "test:1", limit: 3, windowMs: 60_000 };
    expect(rateLimit(options).allowed).toBe(true);
    expect(rateLimit(options).allowed).toBe(true);
    expect(rateLimit(options).allowed).toBe(true);

    const blocked = rateLimit(options);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("counts each key separately", () => {
    const shared = { limit: 1, windowMs: 60_000 };
    expect(rateLimit({ key: "a", ...shared }).allowed).toBe(true);
    expect(rateLimit({ key: "b", ...shared }).allowed).toBe(true);
    expect(rateLimit({ key: "a", ...shared }).allowed).toBe(false);
  });

  it("starts a fresh window once the old one expires", async () => {
    const options = { key: "test:expiry", limit: 1, windowMs: 10 };
    expect(rateLimit(options).allowed).toBe(true);
    expect(rateLimit(options).allowed).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(rateLimit(options).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("takes the first entry of x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" });
    expect(getClientIp(headers)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip, then to unknown", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "198.51.100.4" }))).toBe("198.51.100.4");
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});

describe("truncateIp", () => {
  it("reduces IPv4 to a /24", () => {
    expect(truncateIp("203.0.113.42")).toBe("203.0.113.0/24");
  });

  it("reduces IPv6 to a /48", () => {
    expect(truncateIp("2001:db8:1234:5678::1")).toBe("2001:db8:1234::/48");
  });

  it("returns null when there is nothing meaningful to store", () => {
    expect(truncateIp("unknown")).toBeNull();
    expect(truncateIp("")).toBeNull();
    expect(truncateIp("not-an-ip")).toBeNull();
  });
});

describe("logger", () => {
  it("redacts personal data even when a caller passes it", () => {
    const lines: string[] = [];
    const original = console.log;
    console.log = (line: string) => lines.push(line);

    try {
      logger.info("lead_created", {
        lead_id: "abc",
        email: "anna@example.dk",
        phone: "12345678",
        firstName: "Anna",
        score: 72,
      });
    } finally {
      console.log = original;
    }

    const payload = JSON.parse(lines[0] ?? "{}");
    expect(payload.email).toBe("[redacted]");
    expect(payload.phone).toBe("[redacted]");
    expect(payload.firstName).toBe("[redacted]");
    // Non-personal operational data survives.
    expect(payload.lead_id).toBe("abc");
    expect(payload.score).toBe(72);
    expect(payload.event).toBe("lead_created");
  });
});
