"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics/track";

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * FAQ accordion built on <details>/<summary> so it works without JS, stays
 * keyboard operable and exposes correct open/closed state to screen readers.
 */
export function Accordion({
  items,
  /** Analytics label so we can see which objections people actually open. */
  context,
}: {
  items: AccordionItem[];
  context?: string;
}) {
  const [opened, setOpened] = useState<Set<string>>(new Set());

  return (
    <div className="divide-y divide-ink-100 rounded-xl border border-ink-100 bg-surface">
      {items.map((item) => (
        <details
          key={item.question}
          className="group px-5 sm:px-6"
          onToggle={(e) => {
            if (!e.currentTarget.open || opened.has(item.question)) return;
            setOpened((prev) => new Set(prev).add(item.question));
            trackEvent("faq_opened", { question: item.question, context });
          }}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-body-lg font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-accent-600 transition-transform duration-200 group-open:rotate-45"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 3.5v11M3.5 9h11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </summary>
          <div className="pb-5 pr-8 text-body text-ink-600">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
