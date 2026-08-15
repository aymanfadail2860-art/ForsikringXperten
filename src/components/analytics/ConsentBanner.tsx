"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { readConsent, writeConsent, type ConsentState } from "@/lib/analytics/consent";
import { trackEvent } from "@/lib/analytics/track";

/**
 * Cookie consent.
 *
 * Accept and reject are given equal visual weight — nudging the reject button
 * into invisibility is a dark pattern, and it also produces consent that does
 * not hold up. The choice can be reopened from the footer at any time.
 */
export function ConsentBanner() {
  const [state, setState] = useState<ConsentState | null | undefined>(undefined);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    setState(readConsent());
    const reopen = () => setState(null);
    window.addEventListener("fx:consent-reopen", reopen);
    return () => window.removeEventListener("fx:consent-reopen", reopen);
  }, []);

  // undefined = not yet read on the client; a stored decision hides the banner.
  if (state === undefined || state) return null;

  const decide = (next: { analytics: boolean; marketing: boolean }) => {
    const saved = writeConsent(next);
    setState(saved);
    trackEvent("consent_updated", {
      analytics: next.analytics,
      marketing: next.marketing,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="mx-auto max-w-content rounded-xl border border-ink-200 bg-surface p-5 shadow-lg sm:p-6">
        <h2 id="consent-title" className="text-h3">
          Vi bruger cookies
        </h2>
        <p className="mt-2 text-small text-ink-600">
          Nødvendige cookies får siden til at fungere. Statistik og markedsføring bruger vi
          kun, hvis du siger ja — og du kan altid ændre dit valg igen.{" "}
          <Link href="/cookiepolitik" className="font-medium text-accent-700 underline">
            Læs om cookies
          </Link>
        </p>

        {showDetails ? (
          <fieldset className="mt-4 space-y-3 rounded-lg bg-ink-50 p-4">
            <legend className="sr-only">Vælg kategorier</legend>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-0.5 size-4 rounded accent-accent-600"
              />
              <span className="text-small">
                <span className="font-semibold text-ink-800">Nødvendige</span>
                <span className="block text-ink-500">
                  Kræves for at siden og formularerne virker. Kan ikke fravælges.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-0.5 size-4 rounded accent-accent-600"
              />
              <span className="text-small">
                <span className="font-semibold text-ink-800">Statistik</span>
                <span className="block text-ink-500">
                  Hjælper os med at se, hvilke sider der er brugbare.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-0.5 size-4 rounded accent-accent-600"
              />
              <span className="text-small">
                <span className="font-semibold text-ink-800">Markedsføring</span>
                <span className="block text-ink-500">
                  Bruges til at måle og målrette annoncer.
                </span>
              </span>
            </label>
          </fieldset>
        ) : null}

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {showDetails ? (
            <Button onClick={() => decide({ analytics, marketing })} className="sm:min-w-44">
              Gem mit valg
            </Button>
          ) : (
            <Button
              onClick={() => decide({ analytics: true, marketing: true })}
              className="sm:min-w-44"
            >
              Accepter alle
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => decide({ analytics: false, marketing: false })}
            className="sm:min-w-44"
          >
            Kun nødvendige
          </Button>
          {!showDetails ? (
            <Button variant="ghost" onClick={() => setShowDetails(true)}>
              Tilpas
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Footer entry point for changing an existing choice. */
export function ReopenConsentButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("fx:consent-reopen"))}
      className="text-small text-ink-300 underline underline-offset-4 hover:text-white"
    >
      Cookieindstillinger
    </button>
  );
}
