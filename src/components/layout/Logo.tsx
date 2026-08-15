import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Wordmark. A geometric mark built from two overlapping shields reads as
 * "cover" without resorting to a generic umbrella icon.
 */
export function Logo({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Forsikringxperten — til forsiden"
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-lg",
          onDark ? "bg-white/10" : "bg-navy",
        )}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 1.75 3.5 4.2v5.55c0 3.9 2.62 6.9 6.5 8.5 3.88-1.6 6.5-4.6 6.5-8.5V4.2L10 1.75Z"
            fill={onDark ? "#fff" : "#fff"}
            fillOpacity="0.14"
          />
          <path
            d="M10 1.75 3.5 4.2v5.55c0 3.9 2.62 6.9 6.5 8.5 3.88-1.6 6.5-4.6 6.5-8.5V4.2L10 1.75Z"
            stroke="#fff"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="m7.1 9.9 2.1 2.15 3.9-4.1"
            stroke="var(--color-highlight)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-[0.9375rem] font-extrabold tracking-tight sm:text-[1.0625rem]",
          onDark ? "text-white" : "text-ink-900",
        )}
      >
        Forsikring<span className="text-accent-500">xperten</span>
      </span>
    </Link>
  );
}
