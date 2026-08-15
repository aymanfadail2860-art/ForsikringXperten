-- ============================================================================
-- Forsikringxperten — core schema
--
-- Design notes:
--  * Leads are written exclusively through the server (service role). No
--    browser client ever touches this schema directly — see 0002_rls.sql.
--  * Personal data is limited to what is needed to advise and call back.
--    There is deliberately NO column for CPR, health data or payment details;
--    if a future feature needs those, it needs its own review first.
--  * Funnel progression lives in lead_events so drop-off can be analysed
--    without storing half-finished people as leads.
-- ============================================================================

create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------------
-- Enums
-- --------------------------------------------------------------------------
create type lead_type as enum ('privat', 'erhverv');

create type lead_status as enum (
  'new',
  'attempted_contact',
  'contacted',
  'qualified',
  'meeting_booked',
  'proposal',
  'won',
  'lost',
  'follow_up'
);

create type lead_temperature as enum ('low', 'medium', 'high');

create type contact_method as enum ('ring', 'book', 'email');

create type appointment_type as enum ('phone', 'video', 'physical');

create type appointment_status as enum (
  'scheduled',
  'completed',
  'cancelled',
  'no_show'
);

create type admin_role as enum ('admin', 'advisor', 'viewer');

-- --------------------------------------------------------------------------
-- Shared trigger: keep updated_at honest
-- --------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------------------
-- admin_users — who may see the CRM
--
-- Mirrors auth.users. A row here is what grants access; creating an auth user
-- alone does not. That keeps "who can read leads" answerable in one query.
-- --------------------------------------------------------------------------
create table admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role admin_role not null default 'advisor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger admin_users_updated_at
  before update on admin_users
  for each row execute function set_updated_at();

-- Helper used by every policy below. SECURITY DEFINER so policies can check
-- membership without granting users the right to read the table itself.
create or replace function is_active_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from admin_users
    where id = auth.uid() and is_active = true
  );
$$;

-- --------------------------------------------------------------------------
-- companies
-- --------------------------------------------------------------------------
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cvr text,
  industry text,
  employee_range text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint companies_cvr_format check (cvr is null or cvr ~ '^\d{8}$')
);

-- CVR is unique when known, but most B2B leads arrive without one.
create unique index companies_cvr_key on companies (cvr) where cvr is not null;
create index companies_name_idx on companies (lower(name));

create trigger companies_updated_at
  before update on companies
  for each row execute function set_updated_at();

-- --------------------------------------------------------------------------
-- consent_records — proof of what was agreed to, and when
-- --------------------------------------------------------------------------
create table consent_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  purpose text not null,            -- e.g. 'lead_contact'
  consent_text text not null,       -- the exact wording shown to the user
  consent_version integer not null default 1,
  granted boolean not null,
  -- Truncated to /24 before storage: enough to demonstrate provenance,
  -- not enough to be a precise location record.
  ip_prefix text,
  user_agent text
);

create index consent_records_created_at_idx on consent_records (created_at desc);

-- --------------------------------------------------------------------------
-- leads
-- --------------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  lead_type lead_type not null,
  status lead_status not null default 'new',
  status_changed_at timestamptz not null default now(),

  -- Person
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,

  -- Company (erhverv only)
  company_id uuid references companies (id) on delete set null,
  industry text,
  employees_range text,

  -- Needs
  current_provider text,
  selected_products text[] not null default '{}',
  primary_goal text,
  preferred_contact_method contact_method,
  comment text,

  -- Qualification
  score integer not null default 0 check (score between 0 and 100),
  temperature lead_temperature not null default 'low',
  -- The factors behind the score, so it stays explainable after a model change.
  score_factors jsonb not null default '[]'::jsonb,
  scoring_version integer not null default 1,

  -- Work management
  assigned_to uuid references admin_users (id) on delete set null,
  next_follow_up_at timestamptz,
  last_contacted_at timestamptz,
  contact_attempts integer not null default 0,

  -- Acquisition (first touch)
  source text,
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  fbclid text,
  msclkid text,

  consent_id uuid references consent_records (id) on delete set null,
  -- Anonymous funnel session, links the lead to its pre-submit events.
  session_id uuid
);

-- Index for the queries the CRM actually runs.
create index leads_created_at_idx on leads (created_at desc);
create index leads_status_idx on leads (status, created_at desc);
create index leads_temperature_idx on leads (temperature, created_at desc);
create index leads_follow_up_idx on leads (next_follow_up_at)
  where next_follow_up_at is not null;
create index leads_assigned_idx on leads (assigned_to, status);
create index leads_company_idx on leads (company_id);
create index leads_email_idx on leads (lower(email));
create index leads_session_idx on leads (session_id);
create index leads_utm_campaign_idx on leads (utm_campaign)
  where utm_campaign is not null;

create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- Stamp status_changed_at automatically so pipeline age is always correct.
create or replace function set_status_changed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status then
    new.status_changed_at = now();
  end if;
  return new;
end;
$$;

create trigger leads_status_changed
  before update on leads
  for each row execute function set_status_changed_at();

-- --------------------------------------------------------------------------
-- lead_events — funnel progression and audit trail
--
-- Holds anonymous funnel steps (before a lead exists) and lead history
-- (after). `session_id` is what stitches the two halves together.
-- --------------------------------------------------------------------------
create table lead_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  lead_id uuid references leads (id) on delete cascade,
  session_id uuid,
  event_type text not null,
  step_id text,
  step_index integer,
  lead_type lead_type,
  landing_page text,
  actor_id uuid references admin_users (id) on delete set null,
  payload jsonb not null default '{}'::jsonb
);

create index lead_events_lead_idx on lead_events (lead_id, created_at desc);
create index lead_events_session_idx on lead_events (session_id, created_at);
create index lead_events_type_idx on lead_events (event_type, created_at desc);

-- --------------------------------------------------------------------------
-- lead_notes
-- --------------------------------------------------------------------------
create table lead_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid not null references leads (id) on delete cascade,
  author_id uuid references admin_users (id) on delete set null,
  body text not null check (length(btrim(body)) > 0)
);

create index lead_notes_lead_idx on lead_notes (lead_id, created_at desc);

create trigger lead_notes_updated_at
  before update on lead_notes
  for each row execute function set_updated_at();

-- --------------------------------------------------------------------------
-- appointments
--
-- Provider-agnostic: `provider` and `external_id` let a Google Calendar or
-- Calendly booking be represented without the schema knowing which one.
-- --------------------------------------------------------------------------
create table appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid not null references leads (id) on delete cascade,
  advisor_id uuid references admin_users (id) on delete set null,
  type appointment_type not null default 'phone',
  status appointment_status not null default 'scheduled',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  notes text,
  provider text,
  external_id text,
  constraint appointments_time_order check (ends_at > starts_at)
);

create index appointments_lead_idx on appointments (lead_id, starts_at desc);
create index appointments_upcoming_idx on appointments (starts_at)
  where status = 'scheduled';

create trigger appointments_updated_at
  before update on appointments
  for each row execute function set_updated_at();

-- --------------------------------------------------------------------------
-- notifications — outbox for future email/SMS automation
--
-- Rows are queued here by the application. Nothing is sent until a delivery
-- integration is configured; until then this is an intention log, which makes
-- the automation step additive rather than a rewrite.
-- --------------------------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references leads (id) on delete cascade,
  channel text not null,              -- 'email' | 'sms' | 'internal'
  template text not null,
  recipient text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending',  -- pending | sent | failed | skipped
  sent_at timestamptz,
  error text
);

create index notifications_status_idx on notifications (status, created_at);
create index notifications_lead_idx on notifications (lead_id, created_at desc);

-- --------------------------------------------------------------------------
-- content_entries — reserved for content that outgrows the repo
--
-- Guides, industry pages and cases live as typed files in `src/content` today,
-- which keeps them in review and in version control. This table exists so
-- editor-managed content can be introduced later without a migration scramble.
-- --------------------------------------------------------------------------
create table content_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  kind text not null,                 -- 'case' | 'guide' | 'faq' | ...
  slug text not null,
  title text not null,
  body jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  featured boolean not null default false,
  published_at timestamptz,
  author_id uuid references admin_users (id) on delete set null,
  unique (kind, slug)
);

create index content_entries_published_idx on content_entries (kind, published, published_at desc);

create trigger content_entries_updated_at
  before update on content_entries
  for each row execute function set_updated_at();
