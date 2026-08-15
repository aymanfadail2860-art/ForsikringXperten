/**
 * Structured logging.
 *
 * Server operations that matter (lead creation, failed submissions, auth
 * errors, integration failures) log one JSON line so they can be queried in
 * whatever log sink is used in production.
 *
 * ⚠️ Never log personal data. There is no field here for name, phone or email,
 * and `redact()` exists so callers cannot add one by accident.
 */

type Level = "info" | "warn" | "error";

const FORBIDDEN_KEYS = new Set([
  "email",
  "phone",
  "first_name",
  "firstName",
  "last_name",
  "lastName",
  "name",
  "comment",
  "password",
  "token",
  "authorization",
  "apikey",
  "api_key",
  "service_role_key",
]);

function redact(context: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    if (FORBIDDEN_KEYS.has(key) || FORBIDDEN_KEYS.has(key.toLowerCase())) {
      out[key] = "[redacted]";
      continue;
    }
    out[key] = value;
  }
  return out;
}

function emit(level: Level, event: string, context: Record<string, unknown> = {}) {
  const line = JSON.stringify({
    level,
    event,
    ts: new Date().toISOString(),
    ...redact(context),
  });

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (event: string, context?: Record<string, unknown>) => emit("info", event, context),
  warn: (event: string, context?: Record<string, unknown>) => emit("warn", event, context),
  error: (event: string, context?: Record<string, unknown>) => emit("error", event, context),
};

/**
 * Turns an unknown thrown value into something safe to log. Stack traces stay
 * server-side and are never returned in an API response.
 */
export function describeError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}
