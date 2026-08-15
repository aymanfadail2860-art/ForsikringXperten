"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PhoneLink } from "@/components/ui/CtaLink";
import { getBookingProvider } from "@/services/calendar";
import { trackEvent } from "@/lib/analytics/track";
import type { ContactMethod } from "@/lib/validation/lead";

/**
 * Confirmation screen.
 *
 * Says what actually happens next, in the order it happens. A generic "thanks,
 * we'll be in touch" is where trust leaks out of an otherwise good funnel.
 */
export function FunnelSuccess({
  preferredContact,
  firstName,
}: {
  preferredContact?: ContactMethod;
  firstName?: string;
}) {
  const booking = getBookingProvider();
  const bookingUrl = booking.getExternalUrl();

  useEffect(() => {
    trackEvent("booking_started", { context: "funnel_success" });
  }, []);

  const nextStep =
    preferredContact === "book"
      ? "Vi sender dig et forslag til et tidspunkt, der passer."
      : preferredContact === "email"
        ? "Vi skriver til dig på den e-mail, du har oplyst."
        : "Vi ringer dig op på det nummer, du har oplyst.";

  return (
    <div className="rounded-xl border border-ink-100 bg-surface p-7 sm:p-9">
      <span className="grid size-12 place-items-center rounded-full bg-success-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m6 12.5 4 4 8-9"
            stroke="var(--color-success-700)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h2 className="mt-5 text-h2" tabIndex={-1}>
        Tak{firstName ? `, ${firstName}` : ""} — vi har modtaget dit forsikringstjek
      </h2>
      <p className="mt-3 text-body-lg text-ink-600">{nextStep}</p>

      <ol className="mt-7 space-y-4 border-t border-ink-100 pt-6">
        {[
          {
            title: "En rådgiver kigger på det, du har sendt",
            body: "Vi forbereder os på de områder, du har valgt, inden vi kontakter dig.",
          },
          {
            title: "Vi tager fat i dig",
            body: "Normalt inden for én til to hverdage.",
          },
          {
            title: "Du får en gennemgang",
            body: "Og bestemmer helt selv, hvad der skal ske bagefter.",
          },
        ].map((item, i) => (
          <li key={item.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-ink-100 text-caption font-bold text-ink-700"
            >
              {i + 1}
            </span>
            <div>
              <p className="text-body font-semibold text-ink-900">{item.title}</p>
              <p className="mt-0.5 text-small text-ink-600">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {bookingUrl ? (
        <div className="mt-7 rounded-lg bg-accent-50 p-5">
          <p className="text-body font-semibold text-ink-900">
            Vil du hellere vælge tidspunktet selv?
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("booking_completed", { provider: booking.id })}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-accent-600 px-5 py-2.5 text-body font-semibold text-white hover:bg-accent-700"
          >
            Book min samtale
          </a>
        </div>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-ink-600">
          Kom du i tanke om noget?{" "}
          <Link href="/kontakt" className="font-semibold text-accent-700 underline">
            Skriv til os
          </Link>
        </p>
        <PhoneLink
          location="contact"
          className="text-small font-semibold text-accent-700 underline underline-offset-4"
        />
      </div>
    </div>
  );
}
