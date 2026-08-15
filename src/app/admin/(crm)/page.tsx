import Link from "next/link";
import { requireAdmin } from "@/lib/auth/adminSession";
import {
  getActionQueues,
  getDashboardCounts,
  getTodaysMeetings,
} from "@/services/crm/leadRepository";
import { LeadQueue } from "@/components/admin/LeadListItem";
import { Alert } from "@/components/ui/Alert";
import { formatTime, relativeTime } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

/**
 * "I dag" — the CRM front page.
 *
 * Built around one question: what needs handling right now. The totals sit at
 * the bottom, deliberately small, because "724 leads i alt" is not a task.
 */
export default async function AdminDashboardPage() {
  await requireAdmin();

  let queues;
  let counts;
  let meetings;
  try {
    [queues, counts, meetings] = await Promise.all([
      getActionQueues(),
      getDashboardCounts(),
      getTodaysMeetings(),
    ]);
  } catch {
    return (
      <Alert tone="danger" title="Kunne ikke hente data">
        Databasen svarede ikke. Tjek Supabase-forbindelsen og prøv igen.
      </Alert>
    );
  }

  // Timestamp comes from the query, not from a clock read during render.
  const asOf = new Date(queues.asOf).getTime();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">I dag</h1>
          <p className="mt-1.5 text-body text-ink-600">
            {counts.uncontacted === 0
              ? "Alle leads er taget hånd om. Godt gået."
              : `${counts.uncontacted} ${
                  counts.uncontacted === 1 ? "lead venter" : "leads venter"
                } på at blive kontaktet.`}
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="rounded-lg bg-accent-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-accent-700"
        >
          Se alle leads
        </Link>
      </div>

      {meetings.length > 0 ? (
        <section className="mt-8 rounded-xl border border-accent-200 bg-accent-50 p-5">
          <h2 className="text-body font-semibold text-accent-800">
            Møder i dag ({meetings.length})
          </h2>
          <ul className="mt-3 divide-y divide-accent-200/60">
            {meetings.map((meeting) => (
              <li key={meeting.id} className="flex items-center gap-4 py-2.5">
                <span className="w-14 shrink-0 text-body font-bold text-ink-900">
                  {formatTime(meeting.starts_at)}
                </span>
                <span className="min-w-0 flex-1">
                  {meeting.lead ? (
                    <Link
                      href={`/admin/leads/${meeting.lead.id}`}
                      className="text-body font-semibold text-ink-900 underline-offset-2 hover:underline"
                    >
                      {meeting.lead.first_name} {meeting.lead.last_name}
                    </Link>
                  ) : (
                    <span className="text-body text-ink-500">Ukendt lead</span>
                  )}
                  <span className="ml-2 text-small text-ink-600">
                    {meeting.type === "phone"
                      ? "Telefonmøde"
                      : meeting.type === "video"
                        ? "Videomøde"
                        : "Fysisk møde"}
                  </span>
                </span>
                {meeting.lead?.phone ? (
                  <a
                    href={`tel:${meeting.lead.phone}`}
                    className="shrink-0 text-small font-semibold text-accent-700"
                  >
                    Ring
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <LeadQueue
          title="Nye leads"
          description="Sorteret efter score — den varmeste først"
          leads={queues.newLeads}
          emptyMessage="Ingen nye leads lige nu."
          viewAllHref="/admin/leads?status=new"
        />

        <LeadQueue
          title="Opfølgninger"
          description="Forfaldne og planlagt til i dag"
          leads={queues.followUpsDue}
          emptyMessage="Ingen opfølgninger i dag."
          highlightFor={(lead) =>
            lead.next_follow_up_at
              ? new Date(lead.next_follow_up_at).getTime() < asOf
                ? "Forfalden"
                : formatTime(lead.next_follow_up_at)
              : undefined
          }
        />

        <LeadQueue
          title="Varme leads"
          description="Høj score og stadig i spil"
          leads={queues.hotOpen}
          emptyMessage="Ingen varme leads i pipelinen."
          viewAllHref="/admin/leads?temperature=high"
        />

        <LeadQueue
          title="Ikke fanget endnu"
          description="Mere end to dage siden, uden kontakt"
          leads={queues.staleUncontacted}
          emptyMessage="Ingen leads er faldet mellem to stole."
          highlightFor={(lead) => relativeTime(lead.created_at)}
        />
      </div>

      <section className="mt-10 border-t border-ink-100 pt-6">
        <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
          Samlet
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Leads i alt", value: counts.total },
            { label: "Nye", value: counts.newLeads },
            { label: "Varme", value: counts.hotLeads },
            { label: "Vundet", value: counts.won },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-surface px-4 py-3">
              <dt className="text-small text-ink-500">{stat.label}</dt>
              <dd className="mt-0.5 font-display text-h3 font-bold text-ink-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
