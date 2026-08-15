import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { statusLabel, statusTone } from "@/config/pipeline";
import { temperatureLabels } from "@/lib/scoring/leadScore";
import type { LeadRow } from "@/lib/supabase/types";
import { formatDateTime, relativeTime } from "@/lib/utils/format";

/**
 * One row in a work queue. Shows the three things that decide whether an
 * advisor picks this lead up next: who, how warm, and how long it has waited.
 */
export function LeadListItem({
  lead,
  highlight,
}: {
  lead: LeadRow;
  /** Optional right-hand detail, e.g. the follow-up time that made it due. */
  highlight?: string;
}) {
  return (
    <li>
      <Link
        href={`/admin/leads/${lead.id}`}
        className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-ink-50"
      >
        <span
          aria-hidden="true"
          className={`grid size-9 shrink-0 place-items-center rounded-full text-caption font-bold ${
            lead.temperature === "high"
              ? "bg-danger-50 text-danger-700"
              : lead.temperature === "medium"
                ? "bg-warning-50 text-warning-700"
                : "bg-ink-100 text-ink-500"
          }`}
          title={`Score ${lead.score} — ${temperatureLabels[lead.temperature]}`}
        >
          {lead.score}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-body font-semibold text-ink-900">
            {lead.first_name} {lead.last_name}
          </span>
          <span className="mt-0.5 block truncate text-small text-ink-500">
            {lead.lead_type === "erhverv" ? "Erhverv" : "Privat"}
            {lead.selected_products.length
              ? ` · ${lead.selected_products.slice(0, 3).join(", ")}`
              : ""}
            {lead.selected_products.length > 3
              ? ` +${lead.selected_products.length - 3}`
              : ""}
          </span>
        </span>

        <span className="hidden shrink-0 sm:block">
          <Badge tone={statusTone(lead.status)}>{statusLabel(lead.status)}</Badge>
        </span>

        <span
          className="shrink-0 text-small text-ink-400"
          title={formatDateTime(lead.created_at)}
        >
          {highlight ?? relativeTime(lead.created_at)}
        </span>
      </Link>
    </li>
  );
}

export function LeadQueue({
  title,
  description,
  leads,
  emptyMessage,
  highlightFor,
  viewAllHref,
}: {
  title: string;
  description?: string;
  leads: LeadRow[];
  emptyMessage: string;
  highlightFor?: (lead: LeadRow) => string | undefined;
  viewAllHref?: string;
}) {
  return (
    <section className="rounded-xl border border-ink-100 bg-surface">
      <div className="flex items-baseline justify-between gap-4 border-b border-ink-100 px-4 py-3.5">
        <div>
          <h2 className="text-body font-semibold text-ink-900">
            {title}
            <span className="ml-2 rounded-md bg-ink-100 px-1.5 py-0.5 text-caption font-bold text-ink-600">
              {leads.length}
            </span>
          </h2>
          {description ? (
            <p className="mt-0.5 text-small text-ink-500">{description}</p>
          ) : null}
        </div>
        {viewAllHref ? (
          <Link href={viewAllHref} className="text-small font-semibold text-accent-700">
            Se alle
          </Link>
        ) : null}
      </div>

      {leads.length === 0 ? (
        <p className="px-4 py-8 text-center text-small text-ink-500">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-ink-100">
          {leads.map((lead) => (
            <LeadListItem
              key={lead.id}
              lead={lead}
              highlight={highlightFor?.(lead)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
