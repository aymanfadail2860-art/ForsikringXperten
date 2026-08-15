# Forsikringxperten

Digital acquisition and advisory platform for insurance. A visitor completes a
short *forsikringstjek*, the lead is scored and stored with its full campaign
attribution, and an advisor works it through a pipeline in the built-in CRM.

```
Ads → landing page → forsikringstjek → lead → scoring → CRM → contact → meeting → follow-up
```

The front end is deliberately simple. The complexity lives in the system behind
it, not with the customer.

---

## Table of contents

1. [Stack](#stack)
2. [Quick start](#quick-start)
3. [Environment variables](#environment-variables)
4. [Database and migrations](#database-and-migrations)
5. [Admin access](#admin-access)
6. [Architecture](#architecture)
7. [Content model](#content-model)
8. [Analytics, consent and attribution](#analytics-consent-and-attribution)
9. [Integrations](#integrations)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Before going live](#before-going-live)

---

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Server components by default; client only where interaction requires it |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`) | |
| UI | React 19 + Tailwind CSS v4 | Design tokens in `src/app/globals.css` via `@theme` |
| Database | Supabase (Postgres + Auth + RLS) | |
| Validation | Zod | One schema shared by browser and server |
| Testing | Vitest + Playwright | |
| Hosting | Vercel | |

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in what you have
npm run dev                    # http://localhost:3000
```

**The marketing site runs without Supabase.** Every public page renders, the
funnel validates, and only the final submit returns a clear "we could not save
this" error. That is intentional — a missing credential must not block work on
everything else.

Useful commands:

```bash
npm run dev         # dev server
npm run build       # production build (also type-checks)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # unit tests
npm run test:e2e    # Playwright (needs a build first)
npm run verify      # typecheck + lint + unit + build
```

---

## Environment variables

See `.env.example` for the full annotated list. The rule that matters:

> Only browser-safe values may use `NEXT_PUBLIC_`. Anything with that prefix is
> compiled into the client bundle.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonicals, sitemap, OG tags |
| `NEXT_PUBLIC_SUPABASE_URL` | for leads | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for leads | Public key; RLS denies it everything |
| `SUPABASE_SERVICE_ROLE_KEY` | for leads | **Server only.** Bypasses RLS |
| `NEXT_PUBLIC_GTM_ID` etc. | no | Empty = that tool is not loaded |
| `NEXT_PUBLIC_BOOKING_URL` | no | External scheduling link |

---

## Database and migrations

SQL lives in `supabase/migrations`, applied in order:

| File | Contents |
| --- | --- |
| `0001_init.sql` | Enums, tables, indexes, triggers |
| `0002_rls.sql` | Row Level Security policies and grants |

Apply with the Supabase CLI:

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

…or paste both files into the SQL editor, in order.

### Tables

| Table | Purpose |
| --- | --- |
| `leads` | The lead: person, needs, score, pipeline state, first-touch attribution |
| `companies` | Business leads; deduplicated on CVR when known |
| `lead_events` | Funnel progression (anonymous) and lead history (attributed) |
| `lead_notes` | Advisor notes |
| `appointments` | Meetings; provider-agnostic via `provider` + `external_id` |
| `consent_records` | The exact consent text, timestamp, truncated IP |
| `admin_users` | Who may use the CRM; mirrors `auth.users` |
| `notifications` | Outbox for future email/SMS — queued, not sent |
| `content_entries` | Reserved for editor-managed content |

### The security model

1. **`anon` has no access to anything.** Grants are revoked and RLS denies by
   default. The anon key ships in the browser bundle, so it is assumed
   compromised.
2. **Public writes go through the server.** `/api/leads` validates, rate-limits
   and scores, then writes with the service role. There is no insert policy for
   anon or authenticated.
3. **CRM reads run as the signed-in user**, so RLS applies — a policy mistake
   shows up as "no rows", not as a data leak.
4. **Staff status is a row in `admin_users`.** A Supabase auth user without one
   has no access. Checked in the proxy, in every page, in every server action,
   and again in every policy.

### Regenerating types

`src/lib/supabase/types.ts` is hand-maintained to match the migrations. Once the
project is linked:

```bash
npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
```

---

## Admin access

The CRM lives at `/admin` and needs a Supabase auth user **plus** an active
`admin_users` row.

Create the first one — in the Supabase SQL editor, after creating the auth user
through the dashboard (Authentication → Users → Add user):

```sql
insert into admin_users (id, email, full_name, role, is_active)
values (
  '<auth-user-uuid>',
  'advisor@forsikringxperten.dk',
  'Fornavn Efternavn',
  'admin',      -- 'admin' | 'advisor' | 'viewer'
  true
);
```

Roles: `admin` and `advisor` can edit; `viewer` is read-only.

There are no hardcoded passwords anywhere, and no admin API is reachable
without a session.

### What the CRM does

| Route | Purpose |
| --- | --- |
| `/admin` | "I dag" — new leads, follow-ups due, hot leads, leads nobody has reached, today's meetings |
| `/admin/leads` | Filterable list (status, type, temperature, free-text search) |
| `/admin/leads/[id]` | Full context: contact, company, needs, acquisition, score breakdown, activity — plus every action |
| `/admin/pipeline` | Status breakdown, each linking into the filtered list |

The dashboard is built around "what do I do now", not vanity totals.

---

## Architecture

```
src/
  app/
    (site)/          Public site — header, footer, sticky mobile CTA
    admin/(crm)/     CRM behind requireAdmin()
    admin/login/     Sign-in (outside the protected group)
    lp/[slug]/       Campaign landing pages, reduced navigation
    api/             Lead intake and funnel events
  components/
    ui/              Design system primitives
    layout/          Header, footer, breadcrumbs, logo
    marketing/       Page sections and shared page templates
    funnel/          The forsikringstjek
    admin/           CRM components
    analytics/       Consent banner, tag loading, page views
  config/            site, navigation, cta, pipeline
  content/           Products, industries, guides, cases, landing pages
  lib/               validation, scoring, seo, analytics, attribution, auth,
                     security, observability, supabase, utils
  services/          Integration boundaries — see src/services/README.md
supabase/migrations/ SQL
tests/unit, tests/e2e
```

### Principles worth knowing before changing things

- **Configuration is centralised.** Brand facts in `src/config/site.ts`, CTA
  wording in `src/config/cta.ts`, navigation in `src/config/navigation.ts`,
  pipeline labels in `src/config/pipeline.ts`. None of these are duplicated in
  components.
- **Content drives routes.** Adding a product to `src/content/products.ts`
  creates its page, its navigation entry, its funnel option and its sitemap
  entry. Same for industries, guides and landing pages.
- **One validation schema.** `src/lib/validation/lead.ts` is used by the funnel
  for instant feedback and by the API route as the actual gate. They cannot
  drift.
- **Vendors live behind interfaces.** UI never imports an SDK; it calls a
  service in `src/services`.
- **Scoring is transparent.** Rule-based, and the factors that produced a score
  are stored with the lead so it stays explainable after the model changes.

---

## Content model

Content is typed TypeScript in `src/content`, not a CMS. That keeps it in code
review and version control, which is the right trade-off at this size. The
`content_entries` table exists for when it stops being.

| File | Drives |
| --- | --- |
| `products.ts` | `/privat/*`, `/erhverv/*`, nav, funnel options |
| `industries.ts` | `/brancher/*`, funnel industry select |
| `guides.ts` | `/guides/*` |
| `landingPages.ts` | `/lp/*` |
| `cases.ts` | `/cases` — **empty by design** |
| `faq.ts` | FAQ blocks and FAQ structured data |

`tests/unit/content.test.ts` fails the build on a broken internal link, a
duplicate slug, a stub guide, or an undocumented marketing claim.

### SEO

Content clusters: pillar (product) ←→ supporting (guide) ←→ industry, linked in
both directions. Every page has a unique title, description and canonical via
`buildMetadata()`. Structured data covers Organization, WebSite, BreadcrumbList,
FAQPage and Article.

Excluded from the index: `/admin`, `/api`, `/lp/*` (paid variants that would
compete with the real pages) and `/forsikringstjek` (a form, not a document).

Programmatic SEO is *possible* with this architecture but not used — thin
location pages would be doorway pages. Only add generated pages when each one
has genuine unique value.

---

## Analytics, consent and attribution

### One entry point

Components call `trackEvent()` from `src/lib/analytics/track.ts`. Nothing
imports a vendor script. The event vocabulary is a closed list in
`src/lib/analytics/events.ts` — `lead_flow_started`, `lead_step_viewed`,
`lead_step_completed`, `lead_submitted`, `cta_click`, and so on.

### Consent gates everything

Three categories (necessary / statistik / markedsføring). No tag loads before an
explicit choice. Events fired earlier are queued in memory and released only if
analytics is later granted. Google Consent Mode v2 signals are set from the same
state. The choice is changeable from the footer.

### Attribution

First touch — campaign parameters, landing page and referrer — is captured on
arrival and never overwritten, so it survives the whole journey and is stored
with the lead. Last touch is captured separately so it can be added to reporting
without disturbing first touch.

Captured: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`,
`gclid`, `fbclid`, `msclkid`, landing page, referrer.

### Server-side observability

`src/lib/observability/logger.ts` writes one structured JSON line per
significant operation and **refuses to log personal data**. To add error
monitoring (Sentry or similar), wire it into `src/app/error.tsx` — which already
surfaces the error digest — and into the logger's `error` path. Do not send lead
rows to a third-party monitor.

---

## Integrations

See `src/services/README.md` for the full table. Current state:

| Service | State |
| --- | --- |
| CRM (Supabase) | Active |
| Notifications | **Queued, not sent.** Rows land in `notifications`; a worker sends them once a provider exists |
| Calendar | External link via `NEXT_PUBLIC_BOOKING_URL`; otherwise booking runs through the funnel |
| Email / SMS / AI | Interfaces only |

Nothing fakes a working integration. A booking confirmation nobody receives is
worse than no booking button.

---

## Testing

```bash
npm test                          # 49 unit tests
npm run build && npm run test:e2e # 74 E2E tests, desktop + mobile
```

**Unit** — lead validation (including honeypot, unknown products, oversized
attribution), scoring properties, rate limiting, IP truncation, log redaction,
and content integrity.

**E2E** — the whole private funnel end to end with the payload asserted;
segment pre-selection; validation blocking; a failed submit keeping every
answer; draft survival across reload; consent gating third-party requests;
first-touch attribution surviving navigation; admin routes redirecting to login;
sitemap and robots contents; every public page rendering with one `h1`, a
description, a canonical and no console errors.

If the environment's preinstalled Chromium differs from Playwright's own, set
`PLAYWRIGHT_CHROMIUM_PATH`.

---

## Deployment

Built for Vercel.

1. Import the repository.
2. Add the environment variables from `.env.example`. `SUPABASE_SERVICE_ROLE_KEY`
   must be a plain (non-`NEXT_PUBLIC_`) variable.
3. Apply both migrations to the Supabase project.
4. Deploy. The build fails on a type error or a lint error, by design.

Security headers (HSTS, nosniff, frame options, referrer policy, permissions
policy) are set in `next.config.ts`, with `noindex` and `no-store` forced on
`/admin/*`. A Content Security Policy is intentionally *not* enforced yet —
ship a report-only policy first once the final tag list is known, because a
wrong CSP silently breaks the conversion flow.

### Scaling note

Rate limiting is in-memory (`src/lib/security/rateLimit.ts`). That is enough for
a single instance. On multiple instances, swap the store for Redis/Upstash
behind the same interface — no call site changes.

---

## Before going live

Read **[`docs/COMPLIANCE.md`](docs/COMPLIANCE.md)**. Short version:

- Fill in `src/config/site.ts`: legal name, CVR, address, phone, email — and set
  `verified: true`. Until then those details are hidden everywhere, on purpose.
- Set `businessModel.providerRelationship`. While it is `"unknown"`, the site
  says nothing about which insurers we work with — which is correct, and must
  not be "fixed" with copy.
- Set `businessModel.reviewIsFree` before the word "gratis" appears in any CTA.
- Have a lawyer review `/privatlivspolitik`, `/cookiepolitik` and `/vilkaar`.
  They render a visible draft banner until then.
- Publish a case only when it is real and the customer has approved the wording.
  `src/content/cases.ts` is empty for that reason.
