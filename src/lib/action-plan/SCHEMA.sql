-- Culture Action Plan — Supabase schema
--
-- Run in the Supabase SQL editor for the velocityframework project AFTER
-- the Culture Health Check schema (quiz_responses, team_quizzes,
-- team_quiz_responses) is in place. Does not touch those tables.
--
-- All ids are server-generated nanoids. URL-as-auth model. RLS is on with
-- no policies — only the service-role key (used by API routes) can read
-- or write these tables. Anon key sees nothing.

-- ---------------------------------------------------------------------------
-- action_plans — one row per plan (draft or saved)
-- ---------------------------------------------------------------------------
create table if not exists public.action_plans (
  id                              text primary key,               -- nanoid
  email                           text not null,
  first_name                      text not null,
  role                            text not null,
  team_size                       text,                           -- '1-10', '11-50', etc.
  source                          text not null default 'direct'
    check (source in ('direct', 'health_check')),
  health_check_id                 text references public.quiz_responses(id),
  status                          text not null default 'in_progress'
    check (status in ('in_progress', 'saved', 'completed', 'abandoned')),
  reassessment_days               integer check (reassessment_days in (30, 60, 90)),
  reassessment_date               date,
  accountability_partner_name     text,
  accountability_partner_email    text,
  send_partner_invite             boolean not null default false,
  created_at                      timestamptz not null default now(),
  saved_at                        timestamptz,
  completed_at                    timestamptz
);

create index if not exists action_plans_email_idx       on public.action_plans (email);
create index if not exists action_plans_created_at_idx  on public.action_plans (created_at desc);
create index if not exists action_plans_status_idx      on public.action_plans (status);

alter table public.action_plans enable row level security;

-- ---------------------------------------------------------------------------
-- action_plan_focus_areas — 1..3 focus areas per plan
-- ---------------------------------------------------------------------------
create table if not exists public.action_plan_focus_areas (
  id                    bigserial primary key,
  action_plan_id        text not null references public.action_plans(id) on delete cascade,
  order_index           smallint not null,                         -- 1, 2, 3
  toxin_id              text not null,                             -- key from TOXINS
  counter_move_id       text,                                      -- predefined move id
  counter_move_custom   text,                                      -- or user-written text
  virtue                text check (virtue in ('hospitality', 'humility', 'grit')),
  seven_day_action      text,
  weekly_rhythm_id      text,                                      -- predefined rhythm id
  weekly_rhythm_custom  text,                                      -- or user-written text
  created_at            timestamptz not null default now()
);

create index if not exists focus_areas_plan_idx
  on public.action_plan_focus_areas (action_plan_id, order_index);

alter table public.action_plan_focus_areas enable row level security;

-- ---------------------------------------------------------------------------
-- action_plan_reviews — reassessment submissions
-- ---------------------------------------------------------------------------
create table if not exists public.action_plan_reviews (
  id                  bigserial primary key,
  action_plan_id      text not null references public.action_plans(id) on delete cascade,
  responses           jsonb not null,          -- { focus_area_id: 'yes'|'partially'|'no'|'not_yet' }
  overall_reflection  text,
  submitted_at        timestamptz not null default now()
);

create index if not exists action_plan_reviews_plan_idx
  on public.action_plan_reviews (action_plan_id);

alter table public.action_plan_reviews enable row level security;
