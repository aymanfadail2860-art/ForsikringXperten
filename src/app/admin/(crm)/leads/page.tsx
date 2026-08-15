import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/adminSession";
import { listLeads } from "@/services/crm/leadRepository";
import { LeadListItem } from "@/components/admin/LeadListItem";
import { Alert } from "@/components/ui/Alert";
import { leadStatuses } from "@/config/pipeline";
import type { LeadStatusDb } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const temperatures = [
  { value: "high", label: "Varme" },
  { value: "medium", label: "Middel" },
  { value: "low", label: "Kolde" },
] as const;

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`rounded-md px-3 py-1.5 text-small font-semibold transition-colors ${
        active
          ? "bg-navy text-white"
          : "border border-ink-200 bg-surface text-ink-600 hover:bg-ink-50"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    temperature?: string;
    type?: string;
    q?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const status = leadStatuses.some((s) => s.value === params.status)
    ? (params.status as LeadStatusDb)
    : undefined;
  const temperature = temperatures.some((t) => t.value === params.temperature)
    ? (params.temperature as "low" | "medium" | "high")
    : undefined;
  const leadType =
    params.type === "privat" || params.type === "erhverv" ? params.type : undefined;
  const search = params.q?.trim() || undefined;

  let leads;
  try {
    leads = await listLeads({ status, temperature, leadType, search, limit: 200 });
  } catch {
    return (
      <Alert tone="danger" title="Kunne ikke hente leads">
        Databasen svarede ikke. Prøv igen om lidt.
      </Alert>
    );
  }

  const buildHref = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { status, temperature, type: leadType, q: search, ...patch };
    for (const [key, value] of Object.entries(merged)) {
      if (value) next.set(key, value);
    }
    const qs = next.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  };

  return (
    <div>
      <h1 className="text-h1">Leads</h1>

      <form action="/admin/leads" className="mt-6 flex flex-wrap gap-2">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        {temperature ? (
          <input type="hidden" name="temperature" value={temperature} />
        ) : null}
        {leadType ? <input type="hidden" name="type" value={leadType} /> : null}
        <input
          type="search"
          name="q"
          defaultValue={search ?? ""}
          placeholder="Søg på navn, e-mail eller telefon"
          aria-label="Søg i leads"
          className="w-full max-w-sm rounded-lg border border-ink-200 bg-surface px-3.5 py-2 text-body"
        />
        <button
          type="submit"
          className="rounded-lg bg-navy px-4 py-2 text-small font-semibold text-white"
        >
          Søg
        </button>
      </form>

      <div className="mt-5 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-caption font-semibold uppercase tracking-[0.1em] text-ink-400">
            Status
          </span>
          <FilterLink href={buildHref({ status: undefined })} active={!status}>
            Alle
          </FilterLink>
          {leadStatuses.map((s) => (
            <FilterLink
              key={s.value}
              href={buildHref({ status: s.value })}
              active={status === s.value}
            >
              {s.label}
            </FilterLink>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-caption font-semibold uppercase tracking-[0.1em] text-ink-400">
            Type
          </span>
          <FilterLink href={buildHref({ type: undefined })} active={!leadType}>
            Alle
          </FilterLink>
          <FilterLink href={buildHref({ type: "privat" })} active={leadType === "privat"}>
            Privat
          </FilterLink>
          <FilterLink
            href={buildHref({ type: "erhverv" })}
            active={leadType === "erhverv"}
          >
            Erhverv
          </FilterLink>
          <span className="ml-3 text-caption font-semibold uppercase tracking-[0.1em] text-ink-400">
            Temperatur
          </span>
          <FilterLink
            href={buildHref({ temperature: undefined })}
            active={!temperature}
          >
            Alle
          </FilterLink>
          {temperatures.map((t) => (
            <FilterLink
              key={t.value}
              href={buildHref({ temperature: t.value })}
              active={temperature === t.value}
            >
              {t.label}
            </FilterLink>
          ))}
        </div>
      </div>

      <p className="mt-6 text-small text-ink-500">
        {leads.length} {leads.length === 1 ? "lead" : "leads"}
        {leads.length === 200 ? " (viser de 200 nyeste)" : ""}
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-ink-100 bg-surface">
        {leads.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-body font-semibold text-ink-800">Ingen leads matcher</p>
            <p className="mt-1 text-small text-ink-500">
              Prøv at fjerne et filter eller søge på noget andet.
            </p>
            <Link
              href="/admin/leads"
              className="mt-4 inline-block text-small font-semibold text-accent-700"
            >
              Nulstil filtre
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {leads.map((lead) => (
              <LeadListItem key={lead.id} lead={lead} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
