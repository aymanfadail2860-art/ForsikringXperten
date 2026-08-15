import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/adminSession";
import { getPipelineBreakdown } from "@/services/crm/leadRepository";
import { leadStatuses } from "@/config/pipeline";

export const metadata: Metadata = { title: "Pipeline" };
export const dynamic = "force-dynamic";

/**
 * Pipeline overview. Each status links straight into the filtered lead list,
 * so a number is always one click from the work it represents.
 */
export default async function PipelinePage() {
  await requireAdmin();
  const counts = await getPipelineBreakdown();

  const open = leadStatuses.filter((s) => s.open);
  const closed = leadStatuses.filter((s) => !s.open);
  const openTotal = open.reduce((sum, s) => sum + (counts[s.value] ?? 0), 0);
  const max = Math.max(1, ...leadStatuses.map((s) => counts[s.value] ?? 0));

  return (
    <div>
      <h1 className="text-h1">Pipeline</h1>
      <p className="mt-1.5 text-body text-ink-600">
        {openTotal} {openTotal === 1 ? "lead er" : "leads er"} stadig i spil.
      </p>

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
            Aktive
          </h2>
          <ul className="mt-4 space-y-2">
            {open.map((status) => {
              const count = counts[status.value] ?? 0;
              return (
                <li key={status.value}>
                  <Link
                    href={`/admin/leads?status=${status.value}`}
                    className="flex items-center gap-4 rounded-lg border border-ink-100 bg-surface px-4 py-3 hover:border-accent-200"
                  >
                    <span className="w-40 shrink-0 text-body font-semibold text-ink-900">
                      {status.label}
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <span
                        className="block h-full rounded-full bg-accent-500"
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </span>
                    <span className="w-10 shrink-0 text-right font-display text-body font-bold text-ink-900">
                      {count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
            Afsluttede
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {closed.map((status) => (
              <li key={status.value}>
                <Link
                  href={`/admin/leads?status=${status.value}`}
                  className="flex items-center justify-between rounded-lg border border-ink-100 bg-surface px-4 py-3 hover:border-accent-200"
                >
                  <span className="text-body font-semibold text-ink-900">
                    {status.label}
                  </span>
                  <span className="font-display text-body font-bold text-ink-900">
                    {counts[status.value] ?? 0}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
