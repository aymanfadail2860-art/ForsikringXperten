import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "onDark" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-150 " +
  "disabled:opacity-55 disabled:pointer-events-none select-none text-center";

const variants: Record<Variant, string> = {
  /** The one and only primary action colour. */
  primary: "bg-accent-600 text-white hover:bg-accent-700 shadow-sm",
  secondary:
    "bg-surface text-ink-900 border border-ink-200 hover:border-ink-300 hover:bg-ink-50",
  ghost: "text-accent-700 hover:bg-accent-50",
  /** Secondary action placed on a navy background. */
  onDark: "bg-white/10 text-white border border-white/25 hover:bg-white/18",
  danger: "bg-danger-500 text-white hover:bg-danger-700",
};

const sizes: Record<Size, string> = {
  sm: "text-small px-3.5 py-2",
  md: "text-body px-5 py-2.5",
  lg: "text-body-lg px-6 py-3.5",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

/** Use for navigation. A link that looks like a button must still be a link. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
