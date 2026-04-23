/**
 * Supabase storage wrapper for the Messaging & Proof Checklist.
 * Graceful no-op when Supabase env vars are missing.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CollateralItemKey, CollateralStatus } from "./constants";

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

export type ChecklistStatus = "in_progress" | "saved" | "completed" | "abandoned";

export type ChecklistIntake = {
  id: string;
  email: string;
  first_name: string;
  company_name: string;
  role: string;
  favorite_customer: string;
  fcp_worksheet_url: string | null;
};

export type ChecklistRow = ChecklistIntake & {
  oneliner_problem: string | null;
  oneliner_solution: string | null;
  oneliner_success: string | null;
  oneliner_final: string | null;
  message_top_of_funnel: string | null;
  message_middle_of_funnel: string | null;
  message_bottom_of_funnel: string | null;
  message_post_purchase: string | null;
  case_customer: string | null;
  case_problem: string | null;
  case_why_chose_you: string | null;
  case_what_you_did: string | null;
  case_result: string | null;
  case_friend_quote: string | null;
  testimonial_outreach_notes: string | null;
  cta_home_direct: string | null;
  cta_home_transitional: string | null;
  cta_product_direct: string | null;
  cta_product_transitional: string | null;
  cta_email_direct: string | null;
  cta_email_transitional: string | null;
  status: ChecklistStatus;
  created_at: string;
  updated_at: string;
  saved_at: string | null;
};

export type ChecklistMetaPatch = Partial<
  Omit<ChecklistRow, "id" | "created_at" | "saved_at" | "status"> & {
    status: ChecklistStatus;
    saved_at: string | null;
    updated_at: string;
  }
>;

export type CollateralItemRow = {
  id: string;
  checklist_id: string;
  item_key: CollateralItemKey;
  status: CollateralStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "db_error" | "not_found"; error?: unknown };

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

export async function createChecklistIntake(
  intake: ChecklistIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("messaging_checklists").insert({
    id: intake.id,
    email: intake.email,
    first_name: intake.first_name,
    company_name: intake.company_name,
    role: intake.role,
    favorite_customer: intake.favorite_customer,
    fcp_worksheet_url: intake.fcp_worksheet_url,
    status: "in_progress",
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function updateChecklist(
  id: string,
  patch: ChecklistMetaPatch
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const row = { ...patch, updated_at: patch.updated_at ?? new Date().toISOString() };
  const { error } = await client.from("messaging_checklists").update(row).eq("id", id);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

export async function upsertCollateralItem(payload: {
  checklist_id: string;
  item_key: CollateralItemKey;
  status: CollateralStatus;
  notes: string | null;
}): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("messaging_collateral_items")
    .upsert(
      { ...payload, updated_at: new Date().toISOString() },
      { onConflict: "checklist_id,item_key" }
    );
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function getChecklist(
  id: string
): Promise<StorageResult<ChecklistRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("messaging_checklists")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as ChecklistRow | null };
}

export async function getCollateralItems(
  checklistId: string
): Promise<StorageResult<CollateralItemRow[]>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("messaging_collateral_items")
    .select("*")
    .eq("checklist_id", checklistId);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: (data ?? []) as CollateralItemRow[] };
}
