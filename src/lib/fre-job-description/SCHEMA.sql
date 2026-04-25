-- FRE Job Description — Supabase schema
--
-- Run in the Supabase SQL editor for the velocityframework project.
-- Service-role-only RLS matches the other Velocity tools.
--
-- Download log — one row per email capture on the landing page. Content
-- itself lives in Google Docs and is fetched at PDF render time.

create table if not exists public.fre_job_description_downloads (
  id                    text primary key,
  email                 text not null,
  first_name            text not null,
  company_name          text not null,
  role                  text not null,
  download_reason       text,
  downloaded_at         timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists fre_job_description_downloads_email_idx
  on public.fre_job_description_downloads (email);

alter table public.fre_job_description_downloads enable row level security;
create policy "service_role_only_fre_job_description_downloads"
  on public.fre_job_description_downloads for all using (auth.role() = 'service_role');
