"use client";

import { ButtonLink } from "./Button";
import { trackCtaClick, trackEvent } from "@/lib/analytics/track";
import type { CtaLocation } from "@/lib/analytics/events";
import { primaryCta, secondaryCta, tertiaryCta } from "@/config/cta";

type Props = {
  location: CtaLocation;
  variant?: "primary" | "secondary" | "ghost" | "onDark";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  /** Overrides the global label — use only when the context demands it. */
  label?: string;
  href?: string;
};

/**
 * The primary CTA. Wording and destination come from config, so the promise
 * stays identical everywhere and every click is attributed to its placement.
 */
export function PrimaryCta({
  location,
  variant = "primary",
  size = "lg",
  fullWidth,
  className,
  label,
  href,
}: Props) {
  const finalLabel = label ?? primaryCta.label;
  const finalHref = href ?? primaryCta.href;
  return (
    <ButtonLink
      href={finalHref}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
      onClick={() => trackCtaClick(location, finalLabel, finalHref)}
    >
      {finalLabel}
    </ButtonLink>
  );
}

export function SecondaryCta({
  location,
  variant = "secondary",
  size = "lg",
  fullWidth,
  className,
  label,
}: Props) {
  const finalLabel = label ?? secondaryCta.label;
  return (
    <ButtonLink
      href={secondaryCta.href}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
      onClick={() => trackCtaClick(location, finalLabel, secondaryCta.href)}
    >
      {finalLabel}
    </ButtonLink>
  );
}

/** Renders nothing until a phone number is verified in the site config. */
export function PhoneLink({
  location,
  className,
  children,
}: {
  location: CtaLocation;
  className?: string;
  children?: React.ReactNode;
}) {
  if (!tertiaryCta) return null;
  return (
    <a
      href={tertiaryCta.href}
      className={className}
      onClick={() => trackEvent("phone_click", { cta_location: location })}
    >
      {children ?? tertiaryCta.label}
    </a>
  );
}
