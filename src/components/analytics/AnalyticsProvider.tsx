"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/attribution/attribution";
import { trackEvent } from "@/lib/analytics/track";

/**
 * Records a page_view on every client navigation and keeps first-touch
 * attribution up to date. Rendered once in the root layout inside <Suspense>,
 * because useSearchParams opts the subtree into client rendering.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    captureAttribution(pathname, search ? `?${search}` : "");
    trackEvent("page_view", { page_path: pathname, page_query: search || undefined });
  }, [pathname, searchParams]);

  return null;
}
