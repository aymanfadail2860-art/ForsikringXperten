import { describe, expect, it } from "vitest";
import {
  leadSchema,
  normalisePhone,
  fieldErrors,
} from "@/lib/validation/lead";

/**
 * Lead validation is the gate between the public internet and the database.
 * These tests cover what must never get through, and what must never be
 * rejected by accident.
 */

const validPrivateLead = {
  leadType: "privat",
  selectedProducts: ["bilforsikring", "indboforsikring"],
  primaryGoal: "begge",
  firstName: "Anna",
  lastName: "Jensen",
  phone: "12 34 56 78",
  email: "Anna.Jensen@Example.dk",
  preferredContact: "ring",
  consent: true,
};

const validBusinessLead = {
  leadType: "erhverv",
  companyName: "Jensen VVS ApS",
  cvr: "12345678",
  industry: "haandvaerkere",
  employeesRange: "6-20",
  selectedProducts: ["arbejdsskadeforsikring", "erhvervsansvar"],
  primaryGoal: "daekning",
  firstName: "Peter",
  lastName: "Jensen",
  phone: "+45 87654321",
  email: "peter@jensenvvs.dk",
  preferredContact: "book",
  consent: true,
};

describe("normalisePhone", () => {
  it("strips formatting and country prefixes", () => {
    expect(normalisePhone("12 34 56 78")).toBe("12345678");
    expect(normalisePhone("+45 12345678")).toBe("12345678");
    expect(normalisePhone("0045-12-34-56-78")).toBe("12345678");
    expect(normalisePhone("(12) 34.56.78")).toBe("12345678");
  });

  it("leaves an already-clean number untouched", () => {
    expect(normalisePhone("12345678")).toBe("12345678");
  });
});

describe("leadSchema — private", () => {
  it("accepts a complete private lead", () => {
    const result = leadSchema.safeParse(validPrivateLead);
    expect(result.success).toBe(true);
  });

  it("normalises phone and lowercases email", () => {
    const result = leadSchema.parse(validPrivateLead);
    expect(result.phone).toBe("12345678");
    expect(result.email).toBe("anna.jensen@example.dk");
  });

  it("rejects a missing consent", () => {
    const result = leadSchema.safeParse({ ...validPrivateLead, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error).consent).toBeDefined();
    }
  });

  it("rejects an empty product selection", () => {
    const result = leadSchema.safeParse({ ...validPrivateLead, selectedProducts: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a product value that is not in the taxonomy", () => {
    const result = leadSchema.safeParse({
      ...validPrivateLead,
      selectedProducts: ["livsforsikring-der-ikke-findes"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a phone number that is not 8 digits", () => {
    const result = leadSchema.safeParse({ ...validPrivateLead, phone: "1234567" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed email", () => {
    const result = leadSchema.safeParse({ ...validPrivateLead, email: "anna@example" });
    expect(result.success).toBe(false);
  });

  it("keeps the optional current provider when given, drops it when blank", () => {
    expect(
      leadSchema.parse({ ...validPrivateLead, currentProvider: "Et Selskab" })
        .currentProvider,
    ).toBe("Et Selskab");
    expect(
      leadSchema.parse({ ...validPrivateLead, currentProvider: "   " }).currentProvider,
    ).toBeUndefined();
  });
});

describe("leadSchema — business", () => {
  it("accepts a complete business lead", () => {
    expect(leadSchema.safeParse(validBusinessLead).success).toBe(true);
  });

  it("requires a company name", () => {
    const { companyName: _omitted, ...withoutName } = validBusinessLead;
    expect(leadSchema.safeParse(withoutName).success).toBe(false);
  });

  it("allows an omitted CVR but rejects a malformed one", () => {
    const { cvr: _omitted, ...withoutCvr } = validBusinessLead;
    expect(leadSchema.safeParse(withoutCvr).success).toBe(true);
    expect(leadSchema.safeParse({ ...validBusinessLead, cvr: "1234" }).success).toBe(false);
  });

  it("rejects an unknown industry", () => {
    const result = leadSchema.safeParse({ ...validBusinessLead, industry: "rumfart" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown employee range", () => {
    const result = leadSchema.safeParse({
      ...validBusinessLead,
      employeesRange: "1000+",
    });
    expect(result.success).toBe(false);
  });
});

describe("leadSchema — abuse and hygiene", () => {
  it("rejects a filled honeypot field", () => {
    const result = leadSchema.safeParse({
      ...validPrivateLead,
      website: "http://spam.example",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty honeypot field", () => {
    expect(leadSchema.safeParse({ ...validPrivateLead, website: "" }).success).toBe(true);
  });

  it("does not accept extra fields as lead columns", () => {
    const result = leadSchema.parse({
      ...validPrivateLead,
      score: 100,
      status: "won",
    } as Record<string, unknown>);
    expect(result).not.toHaveProperty("score");
    expect(result).not.toHaveProperty("status");
  });

  it("caps attribution values so they cannot be used to stuff the database", () => {
    const result = leadSchema.safeParse({
      ...validPrivateLead,
      attribution: { utm_source: "x".repeat(500) },
    });
    expect(result.success).toBe(false);
  });

  it("accepts normal attribution data", () => {
    const result = leadSchema.parse({
      ...validPrivateLead,
      attribution: {
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "bil-2026",
        gclid: "abc123",
        landing_page: "/lp/bil",
      },
    });
    expect(result.attribution?.utm_campaign).toBe("bil-2026");
  });
});
