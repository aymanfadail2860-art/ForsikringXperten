import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-ink-100 bg-surface p-6 shadow-xs",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Card that is entirely a link. The whole surface is clickable, but the
 * accessible name comes from the heading — not from the wrapper.
 */
export function LinkCard({
  href,
  title,
  description,
  meta,
  className,
}: {
  href: string;
  title: string;
  description?: string;
  meta?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-xl border border-ink-100 bg-surface p-6",
        "shadow-xs transition-all duration-150 hover:border-accent-200 hover:shadow-md",
        className,
      )}
    >
      {meta ? (
        <span className="text-caption font-semibold uppercase tracking-[0.1em] text-ink-400">
          {meta}
        </span>
      ) : null}
      <h3 className={cn("text-h3", meta && "mt-2")}>{title}</h3>
      {description ? (
        <p className="mt-2 text-small text-ink-600">{description}</p>
      ) : null}
      <span
        aria-hidden="true"
        className="mt-auto pt-5 text-small font-semibold text-accent-600"
      >
        Læs mere
        <span className="ml-1 inline-block transition-transform duration-150 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
