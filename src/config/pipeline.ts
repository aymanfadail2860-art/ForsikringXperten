import type { LeadStatusDb } from "@/lib/supabase/types";

/**
 * Pipeline configuration.
 *
 * Labels, order and colours live here rather than in the components, so the
 * sales process can be renamed or reordered without touching the CRM UI.
 * The underlying enum values are database values — changing those needs a
 * migration, which is exactly the friction they should have.
 */

export type StatusConfig = {
  value: LeadStatusDb;
  label: string;
  /** Short description shown in the status picker. */
  description: string;
  tone: "neutral" | "accent" | "success" | "warning" | "danger";
  /** Counts toward "still in play" in the pipeline view. */
  open: boolean;
};

export const leadStatuses: StatusConfig[] = [
  {
    value: "new",
    label: "Ny",
    description: "Modtaget, ikke behandlet endnu",
    tone: "accent",
    open: true,
  },
  {
    value: "attempted_contact",
    label: "Forsøgt kontaktet",
    description: "Vi har ringet eller skrevet uden svar",
    tone: "warning",
    open: true,
  },
  {
    value: "contacted",
    label: "Kontaktet",
    description: "Vi har haft fat i kunden",
    tone: "neutral",
    open: true,
  },
  {
    value: "qualified",
    label: "Kvalificeret",
    description: "Der er et reelt behov at arbejde med",
    tone: "accent",
    open: true,
  },
  {
    value: "meeting_booked",
    label: "Møde booket",
    description: "Der er aftalt en samtale",
    tone: "accent",
    open: true,
  },
  {
    value: "proposal",
    label: "Tilbud sendt",
    description: "Kunden har fået et oplæg",
    tone: "accent",
    open: true,
  },
  {
    value: "follow_up",
    label: "Følg op",
    description: "Skal kontaktes igen på et aftalt tidspunkt",
    tone: "warning",
    open: true,
  },
  {
    value: "won",
    label: "Vundet",
    description: "Kunden er blevet kunde",
    tone: "success",
    open: false,
  },
  {
    value: "lost",
    label: "Tabt",
    description: "Ingen sag lige nu",
    tone: "danger",
    open: false,
  },
];

export const statusMap = new Map(leadStatuses.map((s) => [s.value, s]));

export function statusLabel(value: string): string {
  return statusMap.get(value as LeadStatusDb)?.label ?? value;
}

export function statusTone(value: string): StatusConfig["tone"] {
  return statusMap.get(value as LeadStatusDb)?.tone ?? "neutral";
}
