-- Messaging & Proof Checklist — Supabase schema
--
-- Run in the Supabase SQL editor for the velocityframework project.
-- Service-role-only RLS matches the other Velocity tools.

create table if not exists public.messaging_checklists (
  id                          text primary key,
  email                       text not null,
  first_name                  text not null,
  company_name                text not null,
  role                        text not null,
  favorite_customer           text not null,
  fcp_worksheet_url           text,

  -- Screen 1: One-liner
  oneliner_problem            text,
  oneliner_solution           text,
  oneliner_success            text,
  oneliner_final              text,

  -- Screen 2: Message map
  message_top_of_funnel       text,
  message_middle_of_funnel    text,
  message_bottom_of_funnel    text,
  message_post_purchase       text,

  -- Screen 3: Case study
  case_customer               text,
  case_problem                text,
  case_why_chose_you          text,
  case_what_you_did           text,
  case_result                 text,
  case_friend_quote           text,

  -- Screen 4: Testimonial outreach notes
  testimonial_outreach_notes  text,

  -- Screen 6: CTA map
  cta_home_direct             text,
  cta_home_transitional       text,
  cta_product_direct          text,
  cta_product_transitional    text,
  cta_email_direct            text,
  cta_email_transitional      text,

  status                      text not null default 'in_progress'
    check (status in ('in_progress', 'saved', 'completed', 'abandoned')),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  saved_at                    timestamptz
);

create index if not exists messaging_checklists_email_idx on public.messaging_checklists (email);
create index if not exists messaging_checklists_status_idx on public.messaging_checklists (status);

alter table public.messaging_checklists enable row level security;
create policy "service_role_only_messaging_checklists"
  on public.messaging_checklists for all using (auth.role() = 'service_role');

-- Screen 5: Collateral audit — one row per audit item
create table if not exists public.messaging_collateral_items (
  id              uuid primary key default gen_random_uuid(),
  checklist_id    text not null references public.messaging_checklists(id) on delete cascade,
  item_key        text not null,
  status          text not null check (status in ('yes', 'no', 'partial')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (checklist_id, item_key)
);

create index if not exists messaging_collateral_items_checklist_idx
  on public.messaging_collateral_items (checklist_id);

alter table public.messaging_collateral_items enable row level security;
create policy "service_role_only_messaging_collateral_items"
  on public.messaging_collateral_items for all using (auth.role() = 'service_role');
