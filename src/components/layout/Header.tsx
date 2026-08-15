"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { PrimaryCta, PhoneLink } from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Layout";
import { mainNav } from "@/config/navigation";
import { primaryCta, secondaryCta } from "@/config/cta";
import { trackCtaClick } from "@/lib/analytics/track";
import { cn } from "@/lib/utils/cn";

/**
 * Site header.
 *
 * Desktop: shallow dropdowns for the two product trees, one primary CTA.
 * Mobile: a full-height panel — the CTA stays visible in the bar itself so the
 * main action never hides behind a menu toggle.
 */
export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close everything on navigation. Adjusting state during render (rather than
  // in an effect) avoids a frame where the old menu is still open.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Body scroll lock while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
            <Logo />

            <nav aria-label="Hovedmenu" className="hidden lg:block" ref={navRef}>
              <ul className="flex items-center gap-1">
                {mainNav.map((item) => (
                  <li key={item.href} className="relative">
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={openMenu === item.href}
                          aria-controls={`menu-${item.href.replace(/\W/g, "")}`}
                          onClick={() =>
                            setOpenMenu(openMenu === item.href ? null : item.href)
                          }
                          className={cn(
                            "flex items-center gap-1.5 rounded-md px-3 py-2 text-small font-semibold transition-colors",
                            isActive(item.href)
                              ? "text-accent-700"
                              : "text-ink-700 hover:text-ink-900",
                          )}
                        >
                          {item.label}
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            aria-hidden="true"
                            className={cn(
                              "transition-transform duration-150",
                              openMenu === item.href && "rotate-180",
                            )}
                          >
                            <path
                              d="m1 1 4 4 4-4"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        {openMenu === item.href ? (
                          <div
                            id={`menu-${item.href.replace(/\W/g, "")}`}
                            className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-ink-100 bg-surface p-2 shadow-lg"
                          >
                            <Link
                              href={item.href}
                              className="block rounded-lg px-3 py-2 text-small font-semibold text-ink-900 hover:bg-ink-50"
                            >
                              Overblik: {item.label}
                            </Link>
                            <ul className="mt-1 border-t border-ink-100 pt-1">
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className="block rounded-lg px-3 py-2 text-small text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-small font-semibold transition-colors",
                          isActive(item.href)
                            ? "text-accent-700"
                            : "text-ink-700 hover:text-ink-900",
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <PhoneLink
                location="header"
                className="text-small font-semibold text-ink-700 hover:text-ink-900"
              />
              <PrimaryCta location="header" size="sm" label={primaryCta.shortLabel} />
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              {/* Below `xs` the wordmark, this CTA and the menu button cannot
                  share a line. The brand wins: the hero still carries the
                  primary CTA above the fold, and the sticky bar takes over
                  from there. */}
              <PrimaryCta
                location="header"
                size="sm"
                label="Forsikringstjek"
                className="hidden xs:inline-flex"
              />
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="grid size-10 place-items-center rounded-lg border border-ink-200 text-ink-800"
              >
                <span className="sr-only">{mobileOpen ? "Luk menu" : "Åbn menu"}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  {mobileOpen ? (
                    <path
                      d="m5 5 10 10M15 5 5 15"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d="M3 6h14M3 10h14M3 14h14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/*
        Rendered outside <header> on purpose: the header uses backdrop-filter,
        which makes it the containing block for fixed descendants — the panel
        would be trapped inside the 4rem header box instead of covering the
        viewport.
      */}
      {mobileOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain border-t border-ink-100 bg-surface lg:hidden"
        >
          <Container className="py-6">
            <nav aria-label="Mobilmenu">
              <ul className="space-y-1">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-body-lg font-semibold text-ink-900 hover:bg-ink-50"
                    >
                      {item.label}
                    </Link>
                    {item.children ? (
                      <ul className="mb-2 ml-3 border-l border-ink-100 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-small text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 space-y-3 border-t border-ink-100 pt-6">
              <PrimaryCta location="header" fullWidth />
              <Link
                href={secondaryCta.href}
                onClick={() =>
                  trackCtaClick("header", secondaryCta.label, secondaryCta.href)
                }
                className="block rounded-lg border border-ink-200 px-5 py-3.5 text-center text-body font-semibold text-ink-900"
              >
                {secondaryCta.label}
              </Link>
              <PhoneLink
                location="header"
                className="block py-2 text-center text-small font-semibold text-ink-600"
              />
            </div>
          </Container>
        </div>
      ) : null}
    </>
  );
}
