import { describe, expect, it } from "vitest";
import { scoreLead, SCORING_VERSION } from "@/lib/scoring/leadScore";
import type {
  LeadInput,
  PrivateLeadInput,
  BusinessLeadInput,
} from "@/lib/validation/lead";

/**
 * Scoring decides which lead an advisor calls first, so the properties that
 * matter are ordering and explainability — not exact point values.
 */

const privateBase: PrivateLeadInput = {
  leadType: "privat",
  selectedProducts: ["bilforsikring"],
  primaryGoal: "muligheder",
  firstName: "Anna",
  lastName: "Jensen",
  phone: "12345678",
  email: "anna@example.dk",
  preferredContact: "email",
  consent: true,
} as PrivateLeadInput;

const businessBase: BusinessLeadInput = {
  leadType: "erhverv",
  companyName: "Jensen VVS ApS",
  industry: "haandvaerkere",
  employeesRange: "21-50",
  selectedProducts: [
    "arbejdsskadeforsikring",
    "erhvervsansvar",
    "biler-og-transport",
    "driftstab",
  ],
  primaryGoal: "begge",
  firstName: "Peter",
  lastName: "Jensen",
  phone: "87654321",
  email: "peter@example.dk",
  preferredContact: "book",
  consent: true,
} as BusinessLeadInput;

describe("scoreLead", () => {
  it("stays within 0–100", () => {
    for (const lead of [privateBase, businessBase] as LeadInput[]) {
      const result = scoreLead(lead);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });

  it("records the version so old scores stay interpretable", () => {
    expect(scoreLead(privateBase).version).toBe(SCORING_VERSION);
  });

  it("explains itself: the factors sum to the score", () => {
    const result = scoreLead(businessBase);
    const sum = result.factors.reduce((total, f) => total + f.points, 0);
    expect(Math.min(100, sum)).toBe(result.score);
    expect(result.factors.length).toBeGreaterThan(3);
  });

  it("ranks a large business enquiry above a casual private one", () => {
    expect(scoreLead(businessBase).score).toBeGreaterThan(scoreLead(privateBase).score);
  });

  it("treats booking intent as stronger than an email preference", () => {
    const wantsBooking = scoreLead({ ...privateBase, preferredContact: "book" });
    const wantsEmail = scoreLead({ ...privateBase, preferredContact: "email" });
    expect(wantsBooking.score).toBeGreaterThan(wantsEmail.score);
  });

  it("rewards breadth of areas to review", () => {
    const oneArea = scoreLead(privateBase);
    const fourAreas = scoreLead({
      ...privateBase,
      selectedProducts: [
        "bilforsikring",
        "husforsikring",
        "indboforsikring",
        "ulykkesforsikring",
      ],
    });
    expect(fourAreas.score).toBeGreaterThan(oneArea.score);
  });

  it("scores a bigger company above a sole trader, all else equal", () => {
    const soleTrader = scoreLead({ ...businessBase, employeesRange: "selvstaendig" });
    const larger = scoreLead({ ...businessBase, employeesRange: "51+" });
    expect(larger.score).toBeGreaterThan(soleTrader.score);
  });

  it("maps score onto the documented temperature bands", () => {
    const browsing = scoreLead({
      ...privateBase,
      primaryGoal: "muligheder",
      preferredContact: "email",
    });
    expect(browsing.temperature).toBe("low");

    const engaged = scoreLead(businessBase);
    expect(engaged.temperature).toBe("high");
  });

  it("is deterministic", () => {
    expect(scoreLead(businessBase)).toEqual(scoreLead(businessBase));
  });
});
