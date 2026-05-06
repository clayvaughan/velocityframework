/**
 * Supabase storage wrapper for the Culture Action Plan.
 *
 * Graceful no-op if Supabase env vars are missing — so local dev and
 * pre-provision tests don't crash. Same pattern as quiz/storage.ts.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ToxinId } from "./toxins";
import type { VirtueId } from "./virtues";
import type { WeeklyRhythmId } from "./weekly-rhythms";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cachedClient: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  if (!supabaseUrl || !serviceRoleKey) return null;
  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

export function isStorageConfigured(): boolean {
  return Boolean(supabaseUrl && serviceRoleKey);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActionPlanSource = "direct" | "health_check";
export type ActionPlanStatus =
  | "in_progress"
  | "saved"
  | "completed"
  | "abandoned";

export type ActionPlanIntake = {
  id: string;
  email: string;
  first_name: string;
  role: string;
  team_size: string | null;
  source: ActionPlanSource;
  health_check_id: string | null;
};

export type ActionPlanRow = ActionPlanIntake & {
  status: ActionPlanStatus;
  reassessment_days: 30 | 60 | 90 | null;
  reassessment_date: string | null;
  accountability_partner_name: string | null;
  accountability_partner_email: string | null;
  send_partner_invite: boolean;
  created_at: string;
  saved_at: string | null;
  completed_at: string | null;
  /** Markdown of the AI-Polished version the user added to their PDF, or null. */
  polished_version: string | null;
};

export type FocusAreaInput = {
  action_plan_id: string;
  order_index: number;
  toxin_id: ToxinId;
  counter_move_id: string | null;
  counter_move_custom: string | null;
  virtue: VirtueId | null;
  seven_day_action: string | null;
  weekly_rhythm_id: WeeklyRhythmId | null;
  weekly_rhythm_custom: string | null;
};

export type FocusAreaRow = FocusAreaInput & {
  id: number;
  created_at: string;
};

export type ReviewResponse = "yes" | "partially" | "no" | "not_yet";

type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "db_error" | "not_found"; error?: unknown };

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

export async function createActionPlanIntake(
  intake: ActionPlanIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("action_plans").insert({
    id: intake.id,
    email: intake.email,
    first_name: intake.first_name,
    role: intake.role,
    team_size: intake.team_size,
    source: intake.source,
    health_check_id: intake.health_check_id,
    status: "in_progress",
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function updateActionPlanMeta(
  id: string,
  patch: Partial<{
    reassessment_days: 30 | 60 | 90;
    reassessment_date: string;
    accountability_partner_name: string | null;
    accountability_partner_email: string | null;
    send_partner_invite: boolean;
    status: ActionPlanStatus;
    saved_at: string | null;
    completed_at: string | null;
  }>
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("action_plans").update(patch).eq("id", id);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

/**
 * Replace all focus areas for a plan with a new set. Used throughout the
 * 4-screen flow — each screen passes the full current list. Simpler than
 * diffing upserts and keeps the data model consistent.
 */
export async function replaceFocusAreas(
  planId: string,
  focusAreas: Omit<FocusAreaInput, "action_plan_id">[]
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error: delErr } = await client
    .from("action_plan_focus_areas")
    .delete()
    .eq("action_plan_id", planId);
  if (delErr) return { ok: false, reason: "db_error", error: delErr };
  if (focusAreas.length === 0) return { ok: true, data: null };
  const rows = focusAreas.map((f) => ({ ...f, action_plan_id: planId }));
  const { error: insErr } = await client.from("action_plan_focus_areas").insert(rows);
  if (insErr) return { ok: false, reason: "db_error", error: insErr };
  return { ok: true, data: null };
}

/**
 * Persist an AI-polished Markdown version onto the user's plan row.
 * Subsequent PDF renders use this in place of the raw answers.
 */
export async function savePolishedVersion(
  planId: string,
  polished: string | null
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("action_plans")
    .update({ polished_version: polished })
    .eq("id", planId);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

export async function submitActionPlanReview(payload: {
  action_plan_id: string;
  responses: Record<string, ReviewResponse>;
  overall_reflection: string | null;
}): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("action_plan_reviews").insert({
    action_plan_id: payload.action_plan_id,
    responses: payload.responses,
    overall_reflection: payload.overall_reflection,
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function getActionPlan(
  id: string
): Promise<StorageResult<ActionPlanRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("action_plans")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as ActionPlanRow | null };
}

export async function getFocusAreas(
  planId: string
): Promise<StorageResult<FocusAreaRow[]>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("action_plan_focus_areas")
    .select("*")
    .eq("action_plan_id", planId)
    .order("order_index", { ascending: true });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: (data ?? []) as FocusAreaRow[] };
}
