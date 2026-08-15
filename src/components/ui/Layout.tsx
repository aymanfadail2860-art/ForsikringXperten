import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Width = "prose" | "content" | "wide";

const widths: Record<Width, string> = {
  prose: "max-w-prose",
  content: "max-w-content",
  wide: "max-w-wide",
};

export function Container({
  width = "wide",
  className,
  children,
}: {
  width?: Width;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", widths[width], className)}>
      {children}
    </div>
  );
}

type Tone = "canvas" | "surface" | "muted" | "navy";

const tones: Record<Tone, string> = {
  canvas: "bg-canvas",
  surface: "bg-surface",
  muted: "bg-surface-muted",
  navy: "bg-navy on-dark",
};

/** Vertical rhythm is owned by Section so pages never invent their own spacing. */
export function Section({
  tone = "canvas",
  as: Tag = "section",
  size = "md",
  className,
  children,
  id,
}: {
  tone?: Tone;
  as?: ElementType;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  const padding =
    size === "sm"
      ? "py-12 sm:py-14"
      : size === "lg"
        ? "py-20 sm:py-28"
        : "py-16 sm:py-20";

  return (
    <Tag id={id} className={cn(tones[tone], padding, className)}>
      {children}
    </Tag>
  );
}

/**
 * Section heading block. `eyebrow` is a label, not a decorative badge — it
 * tells the reader which part of the page they are in.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  as?: ElementType;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-caption font-semibold uppercase tracking-[0.12em]",
            onDark ? "text-highlight" : "text-accent-600",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag className={cn("text-h2 sm:text-[2.25rem] sm:leading-[2.6rem]", eyebrow && "mt-3")}>
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mt-4 text-body-lg",
            onDark ? "text-ink-200" : "text-ink-600",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
