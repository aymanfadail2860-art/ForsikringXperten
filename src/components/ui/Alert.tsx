import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, { wrap: string; title: string }> = {
  info: { wrap: "bg-accent-50 border-accent-200", title: "text-accent-800" },
  success: { wrap: "bg-success-50 border-success-500/30", title: "text-success-700" },
  warning: { wrap: "bg-warning-50 border-warning-500/30", title: "text-warning-700" },
  danger: { wrap: "bg-danger-50 border-danger-500/30", title: "text-danger-700" },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      // Errors must reach screen readers when they appear after a failed submit.
      role={tone === "danger" ? "alert" : "status"}
      className={cn("rounded-lg border p-4 text-small", tones[tone].wrap, className)}
    >
      {title ? (
        <p className={cn("font-semibold", tones[tone].title)}>{title}</p>
      ) : null}
      {children ? <div className={cn("text-ink-700", title && "mt-1")}>{children}</div> : null}
    </div>
  );
}
