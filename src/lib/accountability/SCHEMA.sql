-- Leadership Accountability Map — Supabase schema
--
-- Run in the Supabase SQL editor for the velocityframework project.
-- Service-role-only RLS matches the other Velocity tools.

create table if not exists public.accountability_maps (
  id                        text primary key,
  email                     text not null,
  first_name                text not null,
  company_name              text not null,
  role                      text not null,
  team_size                 text not null,
  health_check_completed    boolean default false,
  health_check_url          text,

  reflection_date_1         date,
  reflection_date_2         date,
  reflection_date_3         date,
  reflection_question       text,

  status                    text not null default 'in_progress'
    check (status in ('in_progress', 'saved', 'completed', 'abandoned')),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  saved_at                  timestamptz,
  -- AI-Polished Markdown version, written when the user clicks "Add to my PDF"
  -- on the AI Polish flow. PDF endpoint renders this in place of raw answers
  -- when set; raw answers are never deleted.
  polished_version          text
);

-- Idempotent migration for existing deploys (safe to run repeatedly):
alter table public.accountability_maps
  add column if not exists polished_version text;

create index if not exists accountability_maps_email_idx on public.accountability_maps (email);
create index if not exists accountability_maps_status_idx on public.accountability_maps (status);

alter table public.accountability_maps enable row level security;
create policy "service_role_only_accountability_maps"
  on public.accountability_maps for all using (auth.role() = 'service_role');

-- One row per role on a map. Position orders the roles on the PDF and UI.
create table if not exists public.accountability_roles (
  id                  uuid primary key default gen_random_uuid(),
  map_id              text not null references public.accountability_maps(id) on delete cascade,
  position            smallint not null,
  role_type           text not null
    check (role_type in (
      'visionary',
      'integrator',
      'director_revenue',
      'director_operations',
      'director_business_admin',
      'custom'
    )),
  role_name           text not null,
  owner_name          text,
  mission_statement   text,
  responsibility_1    text,
  responsibility_2    text,
  responsibility_3    text,
  responsibility_4    text,
  responsibility_5    text,
  accountable_to      text,
  is_custom           boolean default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (map_id, position)
);

create index if not exists accountability_roles_map_idx
  on public.accountability_roles (map_id);

alter table public.accountability_roles enable row level security;
create policy "service_role_only_accountability_roles"
  on public.accountability_roles for all using (auth.role() = 'service_role');
