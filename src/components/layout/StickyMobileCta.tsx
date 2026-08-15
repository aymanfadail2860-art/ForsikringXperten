"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryCta } from "@/config/cta";
import { readConsent } from "@/lib/analytics/consent";
import { trackCtaClick } from "@/lib/analytics/track";

/** Routes where a sticky CTA would compete with the page's own primary action. */
const HIDDEN_ON = ["/forsikringstjek", "/book", "/admin"];

/**
 * Mobile sticky CTA.
 *
 * Appears only after the visitor has scrolled past the hero — showing it
 * immediately just covers content the user has not read yet. It also stays
 * hidden until a cookie choice has been made, so it never sits on top of the
 * consent dialog.
 */
export function StickyMobileCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [consentDecided, setConsentDecided] = useState(false);

  useEffect(() => {
    setConsentDecided(Boolean(readConsent()));
    const onConsent = () => setConsentDecided(true);
    window.addEventListener("fx:consent", onConsent);
    return () => window.removeEventListener("fx:consent", onConsent);
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;
  if (!visible || !consentDecided) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <Link
        href={primaryCta.href}
        onClick={() => trackCtaClick("sticky_mobile", primaryCta.shortLabel, primaryCta.href)}
        className="flex w-full items-center justify-center rounded-lg bg-accent-600 px-5 py-3.5 text-body font-semibold text-white shadow-sm"
      >
        {primaryCta.shortLabel}
      </Link>
    </div>
  );
}
