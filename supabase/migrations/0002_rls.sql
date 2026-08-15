-- ============================================================================
-- Row Level Security
--
-- Threat model: the anon key is public by definition — it ships in the browser
-- bundle. Everything here assumes an attacker holds it.
--
-- Rules:
--   1. anon has NO access to any table. Not read, not insert, not count.
--      Lead submission goes through the server route using the service role,
--      which lets us rate-limit, validate and score before anything is stored.
--   2. authenticated users get access only if they have an active row in
--      admin_users. Being able to sign up is not the same as being staff.
--   3. RLS is enabled on every table, including the ones with no policies —
--      a table with RLS on and no policy denies everything, which is the
--      correct default for data we have not explicitly opened up.
-- ============================================================================

alter table admin_users      enable row level security;
alter table companies        enable row level security;
alter table leads            enable row level security;
alter table lead_events      enable row level security;
alter table lead_notes       enable row level security;
alter table appointments     enable row level security;
alter table consent_records  enable row level security;
alter table notifications    enable row level security;
alter table content_entries  enable row level security;

-- Force RLS for table owners too, so a mistakenly-owner-privileged connection
-- does not silently bypass every policy below.
alter table leads            force row level security;
alter table lead_events      force row level security;
alter table lead_notes       force row level security;
alter table appointments     force row level security;
alter table consent_records  force row level security;
alter table companies        force row level security;
alter table notifications    force row level security;

-- --------------------------------------------------------------------------
-- Revoke the default grants. Supabase grants anon/authenticated broad table
-- privileges by default; RLS then decides. Removing the grants from anon means
-- even a policy mistake cannot expose lead data to the public key.
-- --------------------------------------------------------------------------
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;

grant select, insert, update on
  leads, lead_notes, appointments, companies, lead_events, notifications
  to authenticated;
grant select on admin_users, consent_records to authenticated;
grant select, insert, update on content_entries to authenticated;

-- --------------------------------------------------------------------------
-- admin_users
-- --------------------------------------------------------------------------

-- A signed-in user may read their own row (so the app can resolve their role)
-- and other admins only if they are themselves an active admin.
create policy admin_users_select_self on admin_users
  for select to authenticated
  using (id = auth.uid() or is_active_admin());

-- Role changes are an administrative action performed with the service role,
-- never from the browser session. No insert/update/delete policies exist.

-- --------------------------------------------------------------------------
-- leads
-- --------------------------------------------------------------------------
create policy leads_select_admin on leads
  for select to authenticated
  using (is_active_admin());

create policy leads_update_admin on leads
  for update to authenticated
  using (is_active_admin())
  with check (is_active_admin());

-- Public submissions are inserted by the server (service role), so there is
-- deliberately no insert policy for authenticated or anon.

-- --------------------------------------------------------------------------
-- companies
-- --------------------------------------------------------------------------
create policy companies_select_admin on companies
  for select to authenticated using (is_active_admin());

create policy companies_update_admin on companies
  for update to authenticated
  using (is_active_admin()) with check (is_active_admin());

-- --------------------------------------------------------------------------
-- lead_events
-- --------------------------------------------------------------------------
create policy lead_events_select_admin on lead_events
  for select to authenticated using (is_active_admin());

-- Admin-generated events (status changes, notes) are attributed to the actor.
create policy lead_events_insert_admin on lead_events
  for insert to authenticated
  with check (is_active_admin() and actor_id = auth.uid());

-- --------------------------------------------------------------------------
-- lead_notes
-- --------------------------------------------------------------------------
create policy lead_notes_select_admin on lead_notes
  for select to authenticated using (is_active_admin());

create policy lead_notes_insert_admin on lead_notes
  for insert to authenticated
  with check (is_active_admin() and author_id = auth.uid());

-- Notes may only be edited by whoever wrote them.
create policy lead_notes_update_own on lead_notes
  for update to authenticated
  using (is_active_admin() and author_id = auth.uid())
  with check (author_id = auth.uid());

-- --------------------------------------------------------------------------
-- appointments
-- --------------------------------------------------------------------------
create policy appointments_select_admin on appointments
  for select to authenticated using (is_active_admin());

create policy appointments_write_admin on appointments
  for insert to authenticated with check (is_active_admin());

create policy appointments_update_admin on appointments
  for update to authenticated
  using (is_active_admin()) with check (is_active_admin());

-- --------------------------------------------------------------------------
-- consent_records
--
-- Read-only from the application. Consent proof must not be editable by the
-- people it protects against.
-- --------------------------------------------------------------------------
create policy consent_records_select_admin on consent_records
  for select to authenticated using (is_active_admin());

-- --------------------------------------------------------------------------
-- notifications
-- --------------------------------------------------------------------------
create policy notifications_select_admin on notifications
  for select to authenticated using (is_active_admin());

-- --------------------------------------------------------------------------
-- content_entries
--
-- Published content could be read publicly later; until an editor UI exists,
-- only staff can see it. Opening this up is a deliberate future decision.
-- --------------------------------------------------------------------------
create policy content_select_admin on content_entries
  for select to authenticated using (is_active_admin());

create policy content_write_admin on content_entries
  for insert to authenticated with check (is_active_admin());

create policy content_update_admin on content_entries
  for update to authenticated
  using (is_active_admin()) with check (is_active_admin());
