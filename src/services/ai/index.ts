import type { LeadRow, LeadNoteRow } from "@/lib/supabase/types";

/**
 * AI service boundary.
 *
 * Kept as a separate layer so AI never becomes a dependency of a UI component.
 * When a provider is wired up, it implements this interface server-side and the
 * admin pages call it the same way they would call any other service.
 *
 * Note for whoever implements this: lead data is personal data. Decide
 * explicitly what may leave the system, and log that decision — do not send a
 * whole lead row to a third party because it was convenient.
 */

export type LeadSummary = {
  /** 2–3 sentences an advisor can read before dialling. */
  summary: string;
  /** Concrete things worth asking about, derived from the selected areas. */
  talkingPoints: string[];
  generatedAt: string;
};

export type AiService = {
  readonly id: string;
  isConfigured(): boolean;
  summariseLead?(input: { lead: LeadRow; notes: LeadNoteRow[] }): Promise<LeadSummary>;
  draftFollowUp?(input: { lead: LeadRow; notes: LeadNoteRow[] }): Promise<string>;
};

const notConfigured: AiService = {
  id: "none",
  isConfigured: () => false,
};

export function getAiService(): AiService {
  return notConfigured;
}

/**
 * Deterministic fallback used by the CRM today: no model call, but the advisor
 * still gets the lead's context in one readable line.
 */
export function describeLeadForAdvisor(lead: LeadRow): string {
  const areas = lead.selected_products.join(", ");
  const who =
    lead.lead_type === "erhverv"
      ? `Erhverv${lead.industry ? ` · ${lead.industry}` : ""}${
          lead.employees_range ? ` · ${lead.employees_range}` : ""
        }`
      : "Privat";
  const provider = lead.current_provider ? ` Nuværende selskab: ${lead.current_provider}.` : "";
  return `${who}. Vil have gennemgået: ${areas || "ikke angivet"}.${provider}`;
}
