import {
  privateLeadSchema,
  businessLeadSchema,
  type LeadType,
  type PrimaryGoal,
  type EmployeeRange,
  type ContactMethod,
  fieldErrors,
} from "@/lib/validation/lead";

/**
 * Funnel state and step definitions.
 *
 * Steps are data, not JSX branches, so the flow can be reordered or extended
 * without touching the component that renders it — and so each step's
 * validation is declared next to the fields it covers.
 */

export type FunnelState = {
  leadType?: LeadType;
  selectedProducts: string[];
  primaryGoal?: PrimaryGoal;
  currentProvider: string;
  companyName: string;
  cvr: string;
  industry: string;
  employeesRange?: EmployeeRange;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredContact?: ContactMethod;
  comment: string;
  consent: boolean;
  /** Honeypot. Hidden from real users; bots fill it in. */
  website: string;
};

export const initialFunnelState: FunnelState = {
  selectedProducts: [],
  currentProvider: "",
  companyName: "",
  cvr: "",
  industry: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  comment: "",
  consent: false,
  website: "",
};

export type StepId =
  | "type"
  | "products"
  | "goal"
  | "company"
  | "profile"
  | "contact"
  | "preference";

export type StepDefinition = {
  id: StepId;
  /** Question shown as the step's heading. */
  title: string;
  description?: string;
  /** Fields this step is responsible for — used to scope error display. */
  fields: (keyof FunnelState)[];
  validate: (state: FunnelState) => Record<string, string>;
};

const required = (value: string | undefined, message: string) =>
  value && value.trim() ? undefined : message;

const typeStep: StepDefinition = {
  id: "type",
  title: "Hvad vil du have gennemgået?",
  fields: ["leadType"],
  validate: (s): Record<string, string> =>
    s.leadType ? {} : { leadType: "Vælg en af mulighederne" },
};

const goalStep: StepDefinition = {
  id: "goal",
  title: "Hvad er vigtigst for dig?",
  description: "Så ved rådgiveren, hvor fokus skal ligge.",
  fields: ["primaryGoal", "currentProvider"],
  validate: (s): Record<string, string> =>
    s.primaryGoal ? {} : { primaryGoal: "Vælg hvad der er vigtigst" },
};

const contactStep: StepDefinition = {
  id: "contact",
  title: "Hvor kan vi få fat i dig?",
  description: "Vi bruger kun dine oplysninger til at kontakte dig om gennemgangen.",
  fields: ["firstName", "lastName", "phone", "email"],
  validate: (s) => {
    const errors: Record<string, string> = {};
    const first = required(s.firstName, "Skriv dit fornavn");
    if (first) errors.firstName = first;
    const last = required(s.lastName, "Skriv dit efternavn");
    if (last) errors.lastName = last;

    // Reuse the real schema for the formats so client and server never drift.
    // Parsing a single field yields issues with an empty path, so the message
    // is read off the first issue rather than looked up by field name.
    const phoneCheck = privateLeadSchema.shape.phone.safeParse(s.phone);
    if (!phoneCheck.success) {
      errors.phone = phoneCheck.error.issues[0]?.message ?? "Tjek telefonnummeret";
    }

    const emailCheck = privateLeadSchema.shape.email.safeParse(s.email);
    if (!emailCheck.success) {
      errors.email = emailCheck.error.issues[0]?.message ?? "Tjek e-mailen";
    }

    return errors;
  },
};

const preferenceStep: StepDefinition = {
  id: "preference",
  title: "Hvordan skal vi kontakte dig?",
  fields: ["preferredContact", "comment", "consent"],
  validate: (s) => {
    const errors: Record<string, string> = {};
    if (!s.preferredContact) errors.preferredContact = "Vælg hvordan vi kontakter dig";
    if (!s.consent) errors.consent = "Vi skal have dit samtykke for at måtte kontakte dig";
    return errors;
  },
};

export const privateSteps: StepDefinition[] = [
  typeStep,
  {
    id: "products",
    title: "Hvilke forsikringer vil du have gennemgået?",
    description: "Vælg gerne flere. Er du i tvivl, så tag dem du har.",
    fields: ["selectedProducts"],
    validate: (s): Record<string, string> =>
      s.selectedProducts.length > 0 ? {} : { selectedProducts: "Vælg mindst ét område" },
  },
  goalStep,
  contactStep,
  preferenceStep,
];

export const businessSteps: StepDefinition[] = [
  typeStep,
  {
    id: "company",
    title: "Hvilken virksomhed drejer det sig om?",
    description: "CVR-nummeret er valgfrit — det gør bare forberedelsen hurtigere.",
    fields: ["companyName", "cvr"],
    validate: (s) => {
      const errors: Record<string, string> = {};
      const name = required(s.companyName, "Skriv virksomhedens navn");
      if (name) errors.companyName = name;
      if (s.cvr.trim() && !/^\d{8}$/.test(s.cvr.replace(/\s/g, ""))) {
        errors.cvr = "Et CVR-nummer er 8 cifre";
      }
      return errors;
    },
  },
  {
    id: "profile",
    title: "Fortæl kort om virksomheden",
    fields: ["industry", "employeesRange"],
    validate: (s) => {
      const errors: Record<string, string> = {};
      if (!s.industry) errors.industry = "Vælg en branche";
      if (!s.employeesRange) errors.employeesRange = "Vælg virksomhedens størrelse";
      return errors;
    },
  },
  {
    id: "products",
    title: "Hvilke områder vil I have gennemgået?",
    description: "Vælg gerne flere. Vi kan sagtens tage resten med undervejs.",
    fields: ["selectedProducts"],
    validate: (s): Record<string, string> =>
      s.selectedProducts.length > 0 ? {} : { selectedProducts: "Vælg mindst ét område" },
  },
  { ...goalStep, title: "Hvad vil I gerne have hjælp til?" },
  { ...contactStep, title: "Hvem skal vi kontakte?" },
  preferenceStep,
];

export function stepsFor(leadType: LeadType | undefined): StepDefinition[] {
  return leadType === "erhverv" ? businessSteps : privateSteps;
}

/** Builds the payload posted to /api/leads. */
export function toLeadPayload(
  state: FunnelState,
  extras: { sessionId?: string; attribution?: Record<string, string | undefined> },
) {
  const base = {
    selectedProducts: state.selectedProducts,
    primaryGoal: state.primaryGoal,
    currentProvider: state.currentProvider || undefined,
    firstName: state.firstName.trim(),
    lastName: state.lastName.trim(),
    phone: state.phone,
    email: state.email,
    preferredContact: state.preferredContact,
    comment: state.comment || undefined,
    consent: state.consent,
    website: state.website,
    sessionId: extras.sessionId,
    attribution: extras.attribution,
  };

  if (state.leadType === "erhverv") {
    return {
      leadType: "erhverv" as const,
      companyName: state.companyName.trim(),
      cvr: state.cvr.trim() || undefined,
      industry: state.industry,
      employeesRange: state.employeesRange,
      ...base,
    };
  }

  return { leadType: "privat" as const, ...base };
}

/** Final client-side gate before the network call. */
export function validateComplete(state: FunnelState): Record<string, string> {
  const payload = toLeadPayload(state, {});
  const schema = state.leadType === "erhverv" ? businessLeadSchema : privateLeadSchema;
  const result = schema.safeParse(payload);
  return result.success ? {} : fieldErrors(result.error);
}
