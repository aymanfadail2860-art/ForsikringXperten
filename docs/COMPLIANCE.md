# Compliance and claims policy

Insurance distribution is a regulated activity. This document records the rules
the codebase enforces, why they exist, and what has to be filled in before the
site can go live.

It is not legal advice. It is a description of how the platform is built so a
lawyer can review it quickly.

---

## 1. The placeholder rule

`src/config/site.ts` wraps every business fact in a `VerifiableValue`:

```ts
cvr: unverified("00000000", "CVR-nummer mangler.")
```

Nothing with `verified: false` renders on the public site. The phone number,
email, address, CVR, legal name and LinkedIn profile all follow this pattern,
and the components check before rendering:

- `Footer` and `/kontakt` omit whole blocks rather than print a placeholder
- `PhoneLink` returns `null`, so "Ring til os" CTAs disappear entirely
- `organizationJsonLd()` omits unverified fields, so structured data never
  makes a claim we cannot document

**To publish a fact:** put in the real value and set `verified: true`. That is
the only step.

Two unit tests in `tests/unit/content.test.ts` assert that CVR and phone are
still unverified, so a placeholder cannot reach production by accident. When the
real values are filled in, update those tests deliberately.

---

## 2. Claims that must never appear undocumented

`tests/unit/content.test.ts` fails the build if any of these appear in product,
industry, guide or landing page copy:

| Phrase | Why it is blocked |
| --- | --- |
| "uvildig" | Independence is a regulated status, not a marketing word |
| "billigste" / "spar op til" | A price promise we cannot substantiate |
| "vi sammenligner alle" / "alle forsikringsselskaber" | Claims market-wide coverage |
| "Danmarks bedste" | Unsubstantiable superlative |
| "garanteret besparelse" | A guarantee we cannot give |

If a claim genuinely becomes true and documentable, remove it from the list in
the test — that removal is the audit trail.

---

## 3. Business model drives the copy

`siteConfig.businessModel.providerRelationship` is `"unknown"` until documented.
While it is unknown, the site says **nothing** about which insurers we work with:

- `WhyUs` renders no coverage sentence
- `/om` shows an explicit internal warning instead of inventing one

Set it to `"single-provider"`, `"multi-provider"` or `"independent"` and list
`namedProviders`, and the correct sentence appears automatically. This matters:
if Forsikringxperten is tied to one insurer, the site must not leave the
impression that the whole market is being compared.

### The word "gratis"

`businessModel.reviewIsFree` gates it. While unverified, the primary CTA reads
"Få et forsikringstjek" rather than "Få et gratis forsikringstjek", and the FAQ
answer about cost is phrased without a price promise. One config change flips
both.

---

## 4. No fabricated social proof

`src/content/cases.ts` ships with an **empty** array and a comment explaining
why. The case components render nothing when there is no content, `/cases` shows
an honest empty state and is `noindex` until real cases exist.

`siteConfig.socialProof` holds review score, review count and customer count —
all unverified, all unrendered. There are no testimonials, partner logos, star
ratings or "X kunder" counters anywhere in the codebase.

**Before publishing a case:** the engagement must be real and the customer must
have accepted the wording.

---

## 5. Personal data

Designed to collect the minimum needed to advise and call back.

**Deliberately absent from the schema and the forms:** CPR-nummer, health
information, detailed claims history, payment card details, bank details.
There is no column for any of them — adding one is a schema change that needs
its own review.

What is collected: name, phone, email, which areas to review, the goal,
optionally the current provider and a free-text message; for businesses also
company name, optional CVR, industry and size band.

Funnel progression (`lead_events`) carries only an anonymous session id and a
step name, so drop-off is measurable without storing half-finished people as
leads.

### Consent

- The checkbox is never pre-checked and never bundled with anything else
- The exact text shown is stored per lead in `consent_records`, with a
  timestamp, a truncated IP (/24 or /48) and the user agent
- The wording lives in one place (`src/components/funnel/consentText.ts`) and is
  imported by the repository, so what we store is provably what the user saw
- Changing the wording means bumping `consent_version`

### Logging

`src/lib/observability/logger.ts` refuses to log personal fields — name, phone,
email, free text, tokens — replacing them with `[redacted]`, with a unit test
covering it. Error responses never include stack traces or database messages.

---

## 6. Cookies and tracking

Three categories: necessary, statistik, markedsføring.

- No analytics or marketing script loads before an explicit choice
- Accept and reject have equal visual weight
- The choice can be changed at any time from the footer
- Events fired before consent are queued in memory, not sent; they are released
  only if analytics is later granted
- An E2E test asserts that no third-party request occurs before a choice

---

## 7. Outstanding before launch

| Item | Where | Status |
| --- | --- | --- |
| Legal name, CVR, address, phone, email | `src/config/site.ts` | **Missing** |
| Provider relationship and named providers | `src/config/site.ts` | **Missing** |
| Whether the review is free | `src/config/site.ts` | **Missing** |
| Any registration (fx Finanstilsynet) | `src/config/site.ts` | **Missing** |
| Privacy policy — controller, retention, processors | `/privatlivspolitik` | Draft, marked in-page |
| Cookie policy — concrete cookie list | `/cookiepolitik` | Draft, marked in-page |
| Terms — liability, complaints, governing law | `/vilkaar` | Draft, marked in-page |
| Advisor profiles and qualifications | `/om` | Not added — no invented credentials |

The three legal pages render a visible "Udkast — skal godkendes juridisk"
banner. That banner is the reminder; remove it only when a lawyer has approved
the text.
