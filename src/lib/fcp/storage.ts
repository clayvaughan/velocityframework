/**
 * Supabase storage wrapper for the Favorite Customer Profile worksheet.
 * Graceful no-op when Supabase env vars are missing — same pattern as
 * quiz/storage.ts and action-plan/storage.ts.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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

export type ScopeGuardrails = {
  core_focus: string | null;
  minimum_threshold: string | null;
  geography: string | null;
  strategic_priorities: string | null;
  do_not_pursue: string | null;
  proceed_with_caution: string | null;
};

export type WorksheetStatus = "in_progress" | "saved" | "completed" | "abandoned";

export type WorksheetIntake = {
  id: string;
  email: string;
  first_name: string;
  company_name: string;
  role: string;
  industry: string;
  has_scope_filters: boolean;
};

export type WorksheetRow = WorksheetIntake & {
  scope_guardrails: ScopeGuardrails | null;
  status: WorksheetStatus;
  created_at: string;
  updated_at: string;
  saved_at: string | null;
};

export type FcpProfileInput = {
  worksheet_id: string;
  position: 1 | 2 | 3;
  profile_name: string | null;
  who_they_are: string | null;
  how_they_come_in: string | null;
  why_great_fit: string | null;
  what_they_say_yes_to: string | null;
  what_we_say_yes_to: string | null;
  when_we_say_no: string | null;
  examples: string | null;
  hospitality_cues: string | null;
};

export type FcpProfileRow = FcpProfileInput & {
  id: string;
  created_at: string;
  updated_at: string;
};

type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "db_error" | "not_found"; error?: unknown };

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

export async function createWorksheetIntake(
  intake: WorksheetIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("fcp_worksheets").insert({
    id: intake.id,
    email: intake.email,
    first_name: intake.first_name,
    company_name: intake.company_name,
    role: intake.role,
    industry: intake.industry,
    has_scope_filters: intake.has_scope_filters,
    status: "in_progress",
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function updateWorksheetMeta(
  id: string,
  patch: Partial<{
    scope_guardrails: ScopeGuardrails | null;
    has_scope_filters: boolean;
    status: WorksheetStatus;
    saved_at: string | null;
    updated_at: string;
  }>
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const row = { ...patch, updated_at: patch.updated_at ?? new Date().toISOString() };
  const { error } = await client.from("fcp_worksheets").update(row).eq("id", id);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

/**
 * Upsert a single profile at the given position. Profiles are keyed by
 * (worksheet_id, position) with a unique constraint, so we use upsert.
 */
export async function upsertProfile(
  input: FcpProfileInput
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("fcp_profiles")
    .upsert(
      {
        worksheet_id: input.worksheet_id,
        position: input.position,
        profile_name: input.profile_name,
        who_they_are: input.who_they_are,
        how_they_come_in: input.how_they_come_in,
        why_great_fit: input.why_great_fit,
        what_they_say_yes_to: input.what_they_say_yes_to,
        what_we_say_yes_to: input.what_we_say_yes_to,
        when_we_say_no: input.when_we_say_no,
        examples: input.examples,
        hospitality_cues: input.hospitality_cues,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "worksheet_id,position" }
    );
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

export async function deleteProfilesOutsideRange(
  worksheetId: string,
  positionsToKeep: number[]
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  let q = client.from("fcp_profiles").delete().eq("worksheet_id", worksheetId);
  if (positionsToKeep.length > 0) {
    q = q.not("position", "in", `(${positionsToKeep.join(",")})`);
  }
  const { error } = await q;
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function getWorksheet(
  id: string
): Promise<StorageResult<WorksheetRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("fcp_worksheets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as WorksheetRow | null };
}

export async function getProfiles(
  worksheetId: string
): Promise<StorageResult<FcpProfileRow[]>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("fcp_profiles")
    .select("*")
    .eq("worksheet_id", worksheetId)
    .order("position", { ascending: true });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: (data ?? []) as FcpProfileRow[] };
}
