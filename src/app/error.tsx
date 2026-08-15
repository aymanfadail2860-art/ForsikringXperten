"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Layout";
import { Button, ButtonLink } from "@/components/ui/Button";
import { phoneIsPublic, siteConfig } from "@/config/site";

/**
 * Global error boundary.
 *
 * Shows a route back rather than a blank screen, and never renders the error
 * message — a stack trace or database error in front of a visitor is both a
 * trust problem and an information leak.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is what correlates this screen with the server log entry.
    // Wire an error monitor in here — see "Server-side observability" in the
    // README. Never send lead data to a third-party monitor.
    console.error("client_error", { digest: error.digest });
  }, [error]);

  return (
    <div className="grid min-h-[70dvh] place-items-center bg-canvas py-16">
      <Container width="content">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-h1">Der gik noget galt</h1>
          <p className="mt-4 text-body-lg text-ink-600">
            Vi kunne ikke vise siden lige nu. Prøv igen — virker det stadig ikke, hører vi
            gerne fra dig.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={reset}>
              Prøv igen
            </Button>
            <ButtonLink href="/" variant="secondary" size="lg">
              Til forsiden
            </ButtonLink>
          </div>

          {phoneIsPublic ? (
            <p className="mt-6 text-small text-ink-500">
              Eller ring til os på{" "}
              <a
                href={`tel:${siteConfig.contact.phoneHref.value}`}
                className="font-semibold text-accent-700"
              >
                {siteConfig.contact.phone.value}
              </a>
            </p>
          ) : null}

          {error.digest ? (
            <p className="mt-6 text-caption text-ink-400">Fejlreference: {error.digest}</p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
