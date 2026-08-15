import type { LeadInput } from "@/lib/validation/lead";

/**
 * Lead scoring.
 *
 * Transparent and rule-based on purpose. Every point is traceable to a named
 * factor, and the factors are stored with the lead — so when the model changes
 * later, historical scores can still be explained (and recomputed).
 *
 * No black-box scoring in v1. The point is to help an advisor decide who to
 * call first, not to look clever.
 */

export type ScoreFactor = {
  key: string;
  label: string;
  points: number;
};

export type Temperature = "low" | "medium" | "high";

export type ScoreResult = {
  score: number;
  temperature: Temperature;
  factors: ScoreFactor[];
  /** Model version — stored so old scores stay interpretable. */
  version: number;
};

export const SCORING_VERSION = 1;

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function scoreLead(lead: LeadInput): ScoreResult {
  const factors: ScoreFactor[] = [];
  const add = (key: string, label: string, points: number) => {
    if (points !== 0) factors.push({ key, label, points });
  };

  // --- Base: a completed submission is worth something on its own ---------
  add("base", "Gennemført forsikringstjek", 20);

  // --- Segment: business engagements are larger and involve more areas ----
  if (lead.leadType === "erhverv") {
    add("segment_business", "Erhvervskunde", 12);

    const sizePoints: Record<string, number> = {
      selvstaendig: 2,
      "1-5": 8,
      "6-20": 14,
      "21-50": 18,
      "51+": 20,
    };
    add(
      "company_size",
      `Virksomhedsstørrelse: ${lead.employeesRange}`,
      sizePoints[lead.employeesRange] ?? 0,
    );

    // Industries where several distinct cover areas are usually in play.
    const complexIndustries = new Set([
      "haandvaerkere",
      "transport",
      "produktion",
      "landbrug",
      "restauranter",
    ]);
    if (complexIndustries.has(lead.industry)) {
      add("industry_complexity", "Branche med flere forsikringsområder", 6);
    }
  } else {
    add("segment_private", "Privatkunde", 4);
  }

  // --- Breadth: more areas to review means a more substantial engagement --
  const productCount = lead.selectedProducts.length;
  if (productCount >= 4) add("products_many", `${productCount} områder valgt`, 14);
  else if (productCount === 3) add("products_three", "3 områder valgt", 9);
  else if (productCount === 2) add("products_two", "2 områder valgt", 5);
  else add("products_one", "1 område valgt", 2);

  // --- Intent: what the person actually wants ----------------------------
  const goalPoints: Record<string, number> = {
    begge: 14,
    daekning: 12,
    pris: 10,
    muligheder: 3,
  };
  add("goal", `Formål: ${lead.primaryGoal}`, goalPoints[lead.primaryGoal] ?? 0);

  // --- Booking intent is the strongest single signal we have --------------
  if (lead.preferredContact === "book") {
    add("wants_booking", "Vil booke en tid", 16);
  } else if (lead.preferredContact === "ring") {
    add("wants_call", "Vil ringes op", 10);
  } else {
    add("wants_email", "Foretrækker e-mail", 3);
  }

  // --- Context quality: named provider makes the review concrete ----------
  if (lead.currentProvider) {
    add("known_provider", "Har oplyst nuværende selskab", 5);
  }
  if (lead.comment) {
    add("wrote_comment", "Har skrevet en uddybende besked", 4);
  }

  const score = clamp(factors.reduce((sum, f) => sum + f.points, 0));

  const temperature: Temperature = score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  return { score, temperature, factors, version: SCORING_VERSION };
}

export const temperatureLabels: Record<Temperature, string> = {
  high: "Varm",
  medium: "Middel",
  low: "Kold",
};
