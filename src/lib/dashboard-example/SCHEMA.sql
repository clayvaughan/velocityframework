-- Good Agency Dashboard Example — Supabase schema
--
-- Simple download log. Mirrors src/lib/scorecard-example/SCHEMA.sql.

create table if not exists public.dashboard_downloads (
  id                  text primary key,
  email               text not null,
  first_name          text not null,
  company_name        text not null,
  role                text not null,
  metrics_challenge   text,
  downloaded_at       timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists dashboard_downloads_email_idx on public.dashboard_downloads (email);

alter table public.dashboard_downloads enable row level security;
create policy "service_role_only_dashboard_downloads"
  on public.dashboard_downloads for all using (auth.role() = 'service_role');
