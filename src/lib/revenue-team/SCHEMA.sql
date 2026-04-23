-- Unified Revenue Team Accountability Map — Supabase schema
--
-- Mirrors the Leadership Accountability Map schema pattern. Extra fields
-- for the weekly meeting rhythm + 3 metrics per role (vs leadership's 5
-- responsibilities only).

create table if not exists public.revenue_team_maps (
  id                          text primary key,
  email                       text not null,
  first_name                  text not null,
  company_name                text not null,
  role                        text not null,
  team_size                   text not null,
  annual_revenue              text not null,
  has_director_of_revenue     text not null
    check (has_director_of_revenue in ('yes', 'no', 'planning')),
  leadership_map_url          text,

  -- Weekly revenue team meeting
  weekly_meeting_day          text,
  weekly_meeting_time         text,
  weekly_meeting_duration     text,
  weekly_meeting_agenda       text,

  reflection_date_1           date,
  reflection_date_2           date,
  reflection_date_3           date,
  reflection_question         text,

  status                      text not null default 'in_progress'
    check (status in ('in_progress', 'saved', 'completed', 'abandoned')),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  saved_at                    timestamptz
);

create index if not exists revenue_team_maps_email_idx on public.revenue_team_maps (email);
create index if not exists revenue_team_maps_status_idx on public.revenue_team_maps (status);

alter table public.revenue_team_maps enable row level security;
create policy "service_role_only_revenue_team_maps"
  on public.revenue_team_maps for all using (auth.role() = 'service_role');

-- One row per role on a map.
create table if not exists public.revenue_team_roles (
  id                  uuid primary key default gen_random_uuid(),
  map_id              text not null references public.revenue_team_maps(id) on delete cascade,
  position            smallint not null,
  role_type           text not null
    check (role_type in (
      'director_of_revenue',
      'marketing_lead',
      'sales_lead',
      'revops_lead',
      'account_management_lead',
      'custom'
    )),
  role_name           text not null,
  owner_name          text,
  mission_statement   text,
  metric_1            text,
  metric_2            text,
  metric_3            text,
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

create index if not exists revenue_team_roles_map_idx
  on public.revenue_team_roles (map_id);

alter table public.revenue_team_roles enable row level security;
create policy "service_role_only_revenue_team_roles"
  on public.revenue_team_roles for all using (auth.role() = 'service_role');
