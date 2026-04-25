-- Sample Trust-Building Script — Supabase schema
--
-- Run in the Supabase SQL editor for the velocityframework project.
-- Service-role-only RLS matches the other Velocity tools.
--
-- Download log — one row per email capture on the landing page. Content
-- itself lives in Google Docs and is fetched at PDF render time.

create table if not exists public.trust_building_script_downloads (
  id                      text primary key,
  email                   text not null,
  first_name              text not null,
  company_name            text not null,
  role                    text not null,
  highest_stakes_sale     text,
  downloaded_at           timestamptz,
  created_at              timestamptz not null default now()
);

create index if not exists trust_building_script_downloads_email_idx
  on public.trust_building_script_downloads (email);

alter table public.trust_building_script_downloads enable row level security;
create policy "service_role_only_trust_building_script_downloads"
  on public.trust_building_script_downloads for all using (auth.role() = 'service_role');
