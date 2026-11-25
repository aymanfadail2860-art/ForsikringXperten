"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { primaryCta } from "@/config/cta";
import { useConsent } from "@/lib/analytics/useConsent";
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
 *
 * It also steps aside for the page's own buttons. A section that already
 * offers the same action marks its button with `data-cta-primary`, and while
 * one of those is on screen this bar withdraws, so two green buttons never
 * ask for the same tap at once. An IntersectionObserver is used rather than
 * scroll arithmetic: it survives any section being moved, resized or removed,
 * costs nothing per scroll event, and needs no knowledge of the page's
 * layout.
 */
function subscribeToScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

/** Scroll position is external state — read it, do not mirror it into React. */
const isScrolledPastHero = () => window.scrollY > 400;

/**
 * Hand over before the page's own button reaches the edge, not at it. The
 * root is grown 96px past the bottom of the screen, so the bar has finished
 * leaving by the time the button it defers to is actually readable.
 */
const HANDOVER_MARGIN = "0px 0px 96px 0px";

export function StickyMobileCta() {
  const pathname = usePathname();
  const scrolledPastHero = useSyncExternalStore(
    subscribeToScroll,
    isScrolledPastHero,
    () => false,
  );
  const consentDecided = useConsent() !== null;

  /*
    The observation is tagged with the route it was made on, so a navigation
    to a page without marked buttons reads as "not yielding" without the
    effect having to reset anything — no setState in an effect body, and no
    window where a stale observation from the previous page still applies.
  */
  const [observed, setObserved] = useState({ pathname, onScreen: false });
  const yielding = observed.pathname === pathname && observed.onScreen;

  useEffect(() => {
    const targets = document.querySelectorAll("[data-cta-primary]");
    if (targets.length === 0) return;
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        setObserved({ pathname, onScreen: onScreen.size > 0 });
      },
      { rootMargin: HANDOVER_MARGIN },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;
  if (!scrolledPastHero || !consentDecided) return null;

  return (
    <div
      // Kept mounted while yielding so the exit can be animated; the global
      // prefers-reduced-motion rule turns the transition off for visitors who
      // ask for that, and it then simply appears and disappears.
      aria-hidden={yielding}
      // Stable hooks: the bar is otherwise indistinguishable from the
      // header CTA, which carries the same label.
      data-sticky-cta=""
      data-yielding={yielding ? "" : undefined}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-[opacity,transform] duration-200 ease-out lg:hidden ${
        yielding
          ? "pointer-events-none translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <Link
        href={primaryCta.href}
        tabIndex={yielding ? -1 : undefined}
        onClick={() => trackCtaClick("sticky_mobile", primaryCta.shortLabel, primaryCta.href)}
        className="flex w-full items-center justify-center rounded-lg bg-accent-600 px-5 py-3.5 text-body font-semibold text-white shadow-sm"
      >
        {primaryCta.shortLabel}
      </Link>
    </div>
  );
}
