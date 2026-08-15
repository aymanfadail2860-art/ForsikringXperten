import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/adminSession";
import { getLead, getLeadContext } from "@/services/crm/leadRepository";
import { describeLeadForAdvisor } from "@/services/ai";
import {
  ContactAttemptButtons,
  FollowUpForm,
  MeetingForm,
  NoteForm,
  StatusChanger,
} from "@/components/admin/LeadActions";
import { Badge } from "@/components/ui/Badge";
import { statusLabel, statusTone } from "@/config/pipeline";
import { temperatureLabels } from "@/lib/scoring/leadScore";
import { formatDateTime, humanizeSlug, relativeTime } from "@/lib/utils/format";
import { goalLabels, contactMethodLabels } from "@/lib/validation/lead";
import type { PrimaryGoal, ContactMethod } from "@/lib/validation/lead";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Lead" };

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ink-100 bg-surface p-5">
      <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="shrink-0 text-small text-ink-500">{label}</dt>
      <dd className="min-w-0 text-right text-small font-medium text-ink-900">
        {value || "—"}
      </dd>
    </div>
  );
}

/**
 * Lead detail — the whole context in one screen: who they are, what they want,
 * where they came from, what has happened, and what can be done next.
 */
export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const lead = await getLead(id).catch(() => null);
  if (!lead) notFound();

  const { notes, events, appointments, company } = await getLeadContext(id);

  const hasAcquisitionData = Boolean(
    lead.utm_source ||
      lead.utm_medium ||
      lead.utm_campaign ||
      lead.gclid ||
      lead.fbclid ||
      lead.referrer,
  );

  return (
    <div>
      <Link href="/admin/leads" className="text-small font-semibold text-accent-700">
        ← Alle leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1">
            {lead.first_name} {lead.last_name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={statusTone(lead.status)}>{statusLabel(lead.status)}</Badge>
            <Badge tone={lead.lead_type === "erhverv" ? "accent" : "neutral"}>
              {lead.lead_type === "erhverv" ? "Erhverv" : "Privat"}
            </Badge>
            <Badge
              tone={
                lead.temperature === "high"
                  ? "danger"
                  : lead.temperature === "medium"
                    ? "warning"
                    : "neutral"
              }
            >
              {temperatureLabels[lead.temperature]} · {lead.score}
            </Badge>
            <span className="text-small text-ink-500">
              Modtaget {relativeTime(lead.created_at)}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-body text-ink-600">
            {describeLeadForAdvisor(lead)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="rounded-lg bg-accent-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-accent-700"
          >
            Ring {lead.phone}
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="rounded-lg border border-ink-200 bg-surface px-4 py-2.5 text-small font-semibold text-ink-800 hover:bg-ink-50"
          >
            Send e-mail
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Panel title="Kontakt">
            <dl className="divide-y divide-ink-100">
              <DataRow label="Telefon" value={lead.phone} />
              <DataRow label="E-mail" value={lead.email} />
              <DataRow
                label="Foretrukken kontakt"
                value={
                  lead.preferred_contact_method
                    ? contactMethodLabels[lead.preferred_contact_method as ContactMethod]
                    : null
                }
              />
              <DataRow label="Kontaktforsøg" value={lead.contact_attempts} />
              <DataRow
                label="Sidst kontaktet"
                value={
                  lead.last_contacted_at ? formatDateTime(lead.last_contacted_at) : null
                }
              />
            </dl>
          </Panel>

          {lead.lead_type === "erhverv" ? (
            <Panel title="Virksomhed">
              <dl className="divide-y divide-ink-100">
                <DataRow label="Navn" value={company?.name} />
                <DataRow label="CVR" value={company?.cvr} />
                <DataRow
                  label="Branche"
                  value={lead.industry ? humanizeSlug(lead.industry) : null}
                />
                <DataRow label="Størrelse" value={lead.employees_range} />
              </dl>
            </Panel>
          ) : null}

          <Panel title="Behov">
            <dl className="divide-y divide-ink-100">
              <DataRow
                label="Områder"
                value={lead.selected_products.map(humanizeSlug).join(", ")}
              />
              <DataRow
                label="Formål"
                value={
                  lead.primary_goal
                    ? goalLabels[lead.primary_goal as PrimaryGoal]
                    : null
                }
              />
              <DataRow label="Nuværende selskab" value={lead.current_provider} />
            </dl>
            {lead.comment ? (
              <div className="mt-4 rounded-lg bg-ink-50 p-4">
                <p className="text-caption font-semibold uppercase tracking-[0.1em] text-ink-400">
                  Kundens besked
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-small text-ink-700">
                  {lead.comment}
                </p>
              </div>
            ) : null}
          </Panel>

          <Panel title="Hvor kommer leadet fra?">
            {hasAcquisitionData || lead.landing_page ? (
              <dl className="divide-y divide-ink-100">
                <DataRow label="Landingsside" value={lead.landing_page} />
                <DataRow label="Kilde" value={lead.utm_source} />
                <DataRow label="Medie" value={lead.utm_medium} />
                <DataRow label="Kampagne" value={lead.utm_campaign} />
                <DataRow label="Annonce/indhold" value={lead.utm_content} />
                <DataRow label="Søgeord" value={lead.utm_term} />
                <DataRow label="Google click id" value={lead.gclid} />
                <DataRow label="Meta click id" value={lead.fbclid} />
                <DataRow label="Henvisning" value={lead.referrer} />
              </dl>
            ) : (
              <p className="text-small text-ink-500">
                Ingen kampagnedata — leadet kom direkte eller uden sporingsparametre.
              </p>
            )}
          </Panel>

          <Panel title="Scoring">
            <p className="text-small text-ink-600">
              {lead.score} point · {temperatureLabels[lead.temperature]} (model v
              {lead.scoring_version})
            </p>
            <ul className="mt-3 divide-y divide-ink-100">
              {lead.score_factors.map((factor) => (
                <li key={factor.key} className="flex justify-between gap-4 py-2">
                  <span className="text-small text-ink-600">{factor.label}</span>
                  <span className="text-small font-semibold text-ink-900">
                    +{factor.points}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Noter">
            <NoteForm leadId={lead.id} />
            {notes.length > 0 ? (
              <ul className="mt-5 space-y-3 border-t border-ink-100 pt-5">
                {notes.map((note) => (
                  <li key={note.id} className="rounded-lg bg-ink-50 p-3.5">
                    <p className="whitespace-pre-wrap text-small text-ink-800">
                      {note.body}
                    </p>
                    <p className="mt-1.5 text-caption text-ink-400">
                      {formatDateTime(note.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 border-t border-ink-100 pt-4 text-small text-ink-500">
                Ingen noter endnu.
              </p>
            )}
          </Panel>

          <Panel title="Aktivitet">
            {events.length === 0 ? (
              <p className="text-small text-ink-500">Ingen registreret aktivitet.</p>
            ) : (
              <ul className="space-y-2.5">
                {events.map((event) => (
                  <li key={event.id} className="flex justify-between gap-4">
                    <span className="text-small text-ink-700">
                      {humanizeSlug(event.event_type.replace(/_/g, "-"))}
                      {event.step_id ? ` · ${event.step_id}` : ""}
                    </span>
                    <span className="shrink-0 text-small text-ink-400">
                      {formatDateTime(event.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Panel title="Handlinger">
            <div className="space-y-6">
              <StatusChanger lead={lead} />
              <div className="border-t border-ink-100 pt-5">
                <ContactAttemptButtons leadId={lead.id} />
              </div>
              <div className="border-t border-ink-100 pt-5">
                <FollowUpForm lead={lead} />
              </div>
              <div className="border-t border-ink-100 pt-5">
                <MeetingForm leadId={lead.id} />
              </div>
            </div>
          </Panel>

          <Panel title="Møder">
            {appointments.length === 0 ? (
              <p className="text-small text-ink-500">Ingen møder endnu.</p>
            ) : (
              <ul className="space-y-2.5">
                {appointments.map((appointment) => (
                  <li key={appointment.id}>
                    <p className="text-small font-semibold text-ink-900">
                      {formatDateTime(appointment.starts_at)}
                    </p>
                    <p className="text-small text-ink-500">
                      {appointment.type === "phone"
                        ? "Telefonmøde"
                        : appointment.type === "video"
                          ? "Videomøde"
                          : "Fysisk møde"}{" "}
                      · {appointment.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
