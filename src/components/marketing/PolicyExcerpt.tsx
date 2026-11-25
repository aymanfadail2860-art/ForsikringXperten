import { Fragment } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * "Markeringen" — the site's signature device.
 *
 * A fragment of an insurance policy with one line marked in the brand green,
 * and a plain-Danish note explaining why that line matters.
 *
 * Why this and not a photograph or a dashboard: a policy page is the one
 * object every customer owns and nobody reads, and it is the thing our
 * product actually acts on. You cannot put a bank's or a telco's logo above
 * it without the page falling apart — which is the test this front page was
 * failing before.
 *
 * The green marker means one thing on this site and nothing else: an advisor
 * found something here. It is never used to decorate.
 *
 * ⚠️ Every excerpt renders a visible "Eksempel" badge. The clause numbers and
 * amounts are illustrative, not a real customer's policy, and the badge is not
 * optional — see docs/COMPLIANCE.md.
 */

export type PolicyLine = {
  /** Clause number as it would appear in a policy, e.g. "4.4". */
  ref: string;
  text: string;
  /** Marked lines carry the green highlight and are set in full colour. */
  marked?: boolean;
  /**
   * Context lines that only exist to make the fragment read as a document.
   * Held back on phones, where the vertical budget is needed for the choice
   * underneath — two surrounding lines are enough to say "this is a policy".
   */
  contextOnly?: boolean;
};

export function PolicyExcerpt({
  title,
  lines,
  note,
  tone = "light",
  bare = false,
  className,
}: {
  /** e.g. "Police · side 7" */
  title: string;
  lines: PolicyLine[];
  /** The advisor's remark on the marked line. */
  note?: { heading: string; body: string };
  tone?: "light" | "dark";
  /** Drops the card chrome so the excerpt can sit inside another card. */
  bare?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <figure
      className={cn(
        !bare && "rounded-xl border p-4 sm:p-5",
        !bare &&
          (dark
            ? "border-white/12 bg-white/[0.04]"
            : "border-ink-100 bg-surface shadow-sm"),
        className,
      )}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b pb-2.5 text-caption font-semibold uppercase tracking-[0.1em]"
        style={{ borderColor: dark ? "rgba(255,255,255,.12)" : "var(--color-ink-100)" }}
      >
        <span className={dark ? "text-ink-300" : "text-ink-400"}>{title}</span>
        {/* Not decoration: this badge is what keeps an illustrative policy
            from reading as a real customer document. */}
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em]",
            dark ? "bg-white/10 text-ink-200" : "bg-ink-100 text-ink-600",
          )}
        >
          EKSEMPEL
        </span>
      </figcaption>

      <div className="mt-3 space-y-1">
        {lines.map((line) => (
          <Fragment key={line.ref}>
          <p
            className={cn(
              "flex gap-2.5 font-mono text-[0.78125rem] leading-[1.75]",
              line.contextOnly && "hidden sm:flex",
              line.marked
                ? "font-semibold"
                : dark
                  ? "text-ink-400"
                  : "text-ink-300",
            )}
          >
            <span className={cn("shrink-0", line.marked && !dark && "text-ink-500")}>
              {line.ref}
            </span>
            <span
              className={cn(
                line.marked &&
                  (dark
                    ? "-mx-1.5 rounded-sm bg-[var(--color-marker-dark)] px-1.5 text-highlight"
                    : "-mx-1.5 rounded-sm bg-[var(--color-marker)] px-1.5 text-ink-900"),
              )}
            >
              {line.text}
            </span>
          </p>
          {/*
            The note is rendered immediately after the line it is about, not
            at the end of the fragment. Two lines of unrelated policy text in
            between were enough to break the link between the amount and what
            it means.
          */}
          {note && line.marked ? <ExcerptNote note={note} dark={dark} /> : null}
          </Fragment>
        ))}
      </div>

      {note && !lines.some((l) => l.marked) ? (
        <div
          className={cn(
            "mt-4 border-l-[3px] py-2 pl-3.5 pr-1",
            dark ? "border-highlight" : "border-accent-600",
          )}
        >
          <p
            className={cn(
              "text-small font-semibold",
              dark ? "text-white" : "text-ink-900",
            )}
          >
            {note.heading}
          </p>
          <p className={cn("mt-0.5 text-small", dark ? "text-ink-300" : "text-ink-600")}>
            {note.body}
          </p>
        </div>
      ) : null}
    </figure>
  );
}

/** The advisor's remark, tied visually to the marked line above it. */
function ExcerptNote({
  note,
  dark,
}: {
  note: { heading: string; body: string };
  dark: boolean;
}) {
  return (
    <div
      className={cn(
        "mt-2 border-l-[3px] py-1.5 pl-3 pr-1",
        dark ? "border-highlight" : "border-accent-600",
      )}
    >
      <p className={cn("text-small font-semibold", dark ? "text-white" : "text-ink-900")}>
        {note.heading}
      </p>
      <p className={cn("mt-0.5 text-small", dark ? "text-ink-300" : "text-ink-600")}>
        {note.body}
      </p>
    </div>
  );
}

/**
 * The same marker, inline in running text. Used sparingly — it should keep
 * meaning "an advisor would stop here", not become a general emphasis style.
 */
export function Marked({ children }: { children: React.ReactNode }) {
  return (
    <mark className="-mx-1 rounded-sm bg-[var(--color-marker)] px-1 text-ink-900">
      {children}
    </mark>
  );
}
