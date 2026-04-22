-- Culture Health Check — Supabase schema
--
-- Run this in the Supabase SQL editor for the velocityframework project.
-- Keep this file in sync with the shape expected by src/lib/quiz/storage.ts.
--
-- Design notes:
--   * All `id` columns are server-generated nanoids (32-char, cryptographically
--     random). URL-as-auth model.
--   * RLS is intentionally enabled + restrictive. All quiz reads/writes flow
--     through the API route with the service-role key. Anon key has no access,
--     so accidental client-side queries are a safe no-op.
--   * Scores are stored as JSONB so we can add new dimensions later without
--     a migration cascade.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- quiz_responses
-- Individual-mode submissions. Intake row created before the user starts,
-- updated with answers + scores on completion.
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_responses (
  id              text primary key,              -- nanoid from server
  email           text not null,
  first_name      text not null,
  role            text not null,
  company         text,
  company_size    text,
  taking_for      text not null default 'self' check (taking_for in ('self', 'team')),
  answers         jsonb,                          -- { question_id: 1..5 }
  dimension_scores jsonb,                         -- [{ dimension, subscore, tier }]
  overall_score   integer check (overall_score between 0 and 100),
  overall_tier    text check (overall_tier in ('healthy', 'at_risk', 'critical')),
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists quiz_responses_email_idx on public.quiz_responses (email);
create index if not exists quiz_responses_created_at_idx on public.quiz_responses (created_at desc);

alter table public.quiz_responses enable row level security;

-- ---------------------------------------------------------------------------
-- team_quizzes
-- One row per team-mode campaign. `id` is the share nanoid that appears in
-- both /take and /dashboard URLs.
-- ---------------------------------------------------------------------------
create table if not exists public.team_quizzes (
  id              text primary key,              -- nanoid from server
  owner_email     text not null,
  owner_first_name text not null,
  owner_role      text not null,
  owner_company   text,
  owner_company_size text,
  team_name       text,
  created_at      timestamptz not null default now()
);

create index if not exists team_quizzes_owner_email_idx on public.team_quizzes (owner_email);

alter table public.team_quizzes enable row level security;

-- ---------------------------------------------------------------------------
-- team_quiz_responses
-- Anonymous responses tied to a team_quiz. No email stored against the
-- response itself. If a team member opts in to HubSpot marketing, their
-- contact is created separately — never linked to their response.
-- ---------------------------------------------------------------------------
create table if not exists public.team_quiz_responses (
  id              bigserial primary key,
  team_quiz_id    text not null references public.team_quizzes(id) on delete cascade,
  answers         jsonb not null,                 -- { question_id: 1..5 }
  dimension_scores jsonb not null,                -- [{ dimension, subscore, tier }]
  overall_score   integer not null check (overall_score between 0 and 100),
  overall_tier    text not null check (overall_tier in ('healthy', 'at_risk', 'critical')),
  submitted_at    timestamptz not null default now()
);

create index if not exists team_quiz_responses_quiz_idx
  on public.team_quiz_responses (team_quiz_id);

alter table public.team_quiz_responses enable row level security;
