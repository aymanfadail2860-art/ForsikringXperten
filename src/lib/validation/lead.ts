import { z } from "zod";
import { validFunnelProductValues } from "@/content/products";
import { validIndustryValues } from "@/content/industries";

/**
 * Lead validation.
 *
 * One schema, used by the funnel in the browser AND by the API route on the
 * server. The client copy exists to give fast, friendly feedback; the server
 * copy is the one that decides what enters the database.
 */

export const LEAD_TYPES = ["privat", "erhverv"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const PRIMARY_GOALS = ["pris", "daekning", "begge", "muligheder"] as const;
export type PrimaryGoal = (typeof PRIMARY_GOALS)[number];

export const EMPLOYEE_RANGES = ["selvstaendig", "1-5", "6-20", "21-50", "51+"] as const;
export type EmployeeRange = (typeof EMPLOYEE_RANGES)[number];

export const CONTACT_METHODS = ["ring", "book", "email"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const goalLabels: Record<PrimaryGoal, string> = {
  pris: "Jeg vil gerne se på prisen",
  daekning: "Jeg vil gerne se på dækningen",
  begge: "Begge dele",
  muligheder: "Jeg er bare nysgerrig på mine muligheder",
};

export const employeeRangeLabels: Record<EmployeeRange, string> = {
  selvstaendig: "Selvstændig uden ansatte",
  "1-5": "1–5 ansatte",
  "6-20": "6–20 ansatte",
  "21-50": "21–50 ansatte",
  "51+": "51+ ansatte",
};

export const contactMethodLabels: Record<ContactMethod, string> = {
  ring: "Ring mig op",
  book: "Book en tid i kalenderen",
  email: "Skriv til mig på e-mail",
};

/**
 * Danish mobile/landline numbers are 8 digits, optionally with +45 or 0045.
 * Spaces and dashes are stripped before validation so people can type naturally.
 */
export function normalisePhone(input: string): string {
  const digitsOnly = input.replace(/[\s\-().]/g, "");
  const withoutPrefix = digitsOnly
    .replace(/^\+45/, "")
    .replace(/^0045/, "")
    .replace(/^45(?=\d{8}$)/, "");
  return withoutPrefix;
}

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Skriv dit telefonnummer")
  .transform(normalisePhone)
  .refine((v) => /^\d{8}$/.test(v), "Et dansk telefonnummer er 8 cifre");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Skriv dit navn")
  .max(80, "Navnet er for langt");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Skriv din e-mail")
  .max(160, "E-mailen er for lang")
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Tjek lige e-mailadressen");

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

/** Campaign data captured in the browser and stored with the lead. */
export const attributionSchema = z.object({
  utm_source: optionalText(200),
  utm_medium: optionalText(200),
  utm_campaign: optionalText(200),
  utm_content: optionalText(200),
  utm_term: optionalText(200),
  gclid: optionalText(200),
  fbclid: optionalText(200),
  msclkid: optionalText(200),
  landing_page: optionalText(300),
  referrer: optionalText(300),
});

export type AttributionInput = z.infer<typeof attributionSchema>;

const productsSchema = z
  .array(z.string())
  .min(1, "Vælg mindst ét område")
  .max(12)
  .refine(
    (values) => values.every((v) => validFunnelProductValues.has(v)),
    "Ukendt forsikringsområde",
  );

const baseLeadFields = {
  selectedProducts: productsSchema,
  primaryGoal: z.enum(PRIMARY_GOALS, { message: "Vælg hvad der er vigtigst for dig" }),
  currentProvider: optionalText(120),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  preferredContact: z.enum(CONTACT_METHODS, { message: "Vælg hvordan vi må kontakte dig" }),
  comment: optionalText(1000),
  consent: z.literal(true, {
    message: "Vi skal have dit samtykke for at kunne kontakte dig",
  }),
  /** Anonymous id linking funnel events to the finished lead. */
  sessionId: z.string().uuid().optional(),
  attribution: attributionSchema.optional(),
  /** Bot trap — must stay empty. Never rendered to real users. */
  website: z.string().max(0, "Ugyldig indsendelse").optional(),
};

export const privateLeadSchema = z.object({
  leadType: z.literal("privat"),
  ...baseLeadFields,
});

export const businessLeadSchema = z.object({
  leadType: z.literal("erhverv"),
  companyName: z.string().trim().min(2, "Skriv virksomhedens navn").max(140),
  cvr: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.replace(/\s/g, "") : undefined))
    .refine((v) => !v || /^\d{8}$/.test(v), "Et CVR-nummer er 8 cifre"),
  industry: z
    .string()
    .refine((v) => validIndustryValues.has(v), "Vælg en branche"),
  employeesRange: z.enum(EMPLOYEE_RANGES, { message: "Vælg virksomhedens størrelse" }),
  ...baseLeadFields,
});

export const leadSchema = z.discriminatedUnion("leadType", [
  privateLeadSchema,
  businessLeadSchema,
]);

export type LeadInput = z.infer<typeof leadSchema>;
export type PrivateLeadInput = z.infer<typeof privateLeadSchema>;
export type BusinessLeadInput = z.infer<typeof businessLeadSchema>;

/**
 * Funnel progression event sent as the user moves through the steps.
 * Deliberately carries no personal data — only where the user is.
 */
export const funnelEventSchema = z.object({
  sessionId: z.string().uuid(),
  eventType: z.enum([
    "lead_flow_started",
    "lead_step_viewed",
    "lead_step_completed",
    "lead_abandoned",
  ]),
  stepId: z.string().max(60).optional(),
  stepIndex: z.number().int().min(0).max(20).optional(),
  leadType: z.enum(LEAD_TYPES).optional(),
  landingPage: optionalText(300),
});

export type FunnelEventInput = z.infer<typeof funnelEventSchema>;

/** Flattens zod issues to `{ fieldName: message }` for the form UI. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
