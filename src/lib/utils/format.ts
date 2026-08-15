/**
 * Danish formatting helpers.
 *
 * Fixed to da-DK and Europe/Copenhagen so a server in another region does not
 * render times that are an hour off for the advisor reading them.
 */

const dateTimeFormatter = new Intl.DateTimeFormat("da-DK", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Copenhagen",
});

const dateFormatter = new Intl.DateTimeFormat("da-DK", {
  dateStyle: "medium",
  timeZone: "Europe/Copenhagen",
});

const timeFormatter = new Intl.DateTimeFormat("da-DK", {
  timeStyle: "short",
  timeZone: "Europe/Copenhagen",
});

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : timeFormatter.format(date);
}

/** "3 timer siden", "i går", "om 2 dage" — how long a lead has been waiting. */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60_000);
  const abs = Math.abs(diffMinutes);

  const rtf = new Intl.RelativeTimeFormat("da-DK", { numeric: "auto" });

  if (abs < 60) return rtf.format(diffMinutes, "minute");
  if (abs < 60 * 24) return rtf.format(Math.round(diffMinutes / 60), "hour");
  if (abs < 60 * 24 * 30) return rtf.format(Math.round(diffMinutes / (60 * 24)), "day");
  return rtf.format(Math.round(diffMinutes / (60 * 24 * 30)), "month");
}

/** Turns a slug like "biler-og-transport" into readable text. */
export function humanizeSlug(slug: string): string {
  const withSpaces = slug.replace(/-/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}
