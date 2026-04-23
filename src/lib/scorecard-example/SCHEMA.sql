-- Good Agency Scorecard Example — Supabase schema
--
-- Run in the Supabase SQL editor for the velocityframework project.
-- Service-role-only RLS matches the other Velocity tools.
--
-- This is a simple download log — no multi-screen build flow, no nested
-- rows. One row per email capture on the landing page.

create table if not exists public.scorecard_downloads (
  id                       text primary key,
  email                    text not null,
  first_name               text not null,
  company_name             text not null,
  role                     text not null,
  scorecard_target_role    text,
  downloaded_at            timestamptz,
  created_at               timestamptz not null default now()
);

create index if not exists scorecard_downloads_email_idx on public.scorecard_downloads (email);

alter table public.scorecard_downloads enable row level security;
create policy "service_role_only_scorecard_downloads"
  on public.scorecard_downloads for all using (auth.role() = 'service_role');
