-- Favorite Customer Profile — Supabase schema
--
-- Run in the Supabase SQL editor for the velocityframework project. Does
-- not touch existing tables. Service-role-only RLS matches the Culture
-- Health Check and Culture Action Plan schemas.
--
-- Design notes:
--   * fcp_worksheets.id is a server-generated nanoid; URL-as-auth.
--   * fcp_profiles uses gen_random_uuid() (pgcrypto, already enabled).
--   * Scope guardrails are stored as JSONB on the worksheet so we can
--     evolve the shape without migration friction.

create table if not exists public.fcp_worksheets (
  id                   text primary key,
  email                text not null,
  first_name           text not null,
  company_name         text not null,
  role                 text not null,
  industry             text not null,
  has_scope_filters    boolean not null default false,
  scope_guardrails     jsonb,
  status               text not null default 'in_progress'
    check (status in ('in_progress', 'saved', 'completed', 'abandoned')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  saved_at             timestamptz
);

create index if not exists fcp_worksheets_email_idx on public.fcp_worksheets (email);
create index if not exists fcp_worksheets_status_idx on public.fcp_worksheets (status);

alter table public.fcp_worksheets enable row level security;
create policy "service_role_only_worksheets"
  on public.fcp_worksheets for all using (auth.role() = 'service_role');

create table if not exists public.fcp_profiles (
  id                        uuid primary key default gen_random_uuid(),
  worksheet_id              text not null references public.fcp_worksheets(id) on delete cascade,
  position                  smallint not null check (position in (1, 2, 3)),
  profile_name              text,
  who_they_are              text,
  how_they_come_in          text,
  why_great_fit             text,
  what_they_say_yes_to      text,
  what_we_say_yes_to        text,
  when_we_say_no            text,
  examples                  text,
  hospitality_cues          text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  unique (worksheet_id, position)
);

create index if not exists fcp_profiles_worksheet_idx
  on public.fcp_profiles (worksheet_id, position);

alter table public.fcp_profiles enable row level security;
create policy "service_role_only_profiles"
  on public.fcp_profiles for all using (auth.role() = 'service_role');
