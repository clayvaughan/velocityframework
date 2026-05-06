/**
 * Supabase storage wrapper for the Leadership Accountability Map.
 * Graceful no-op when Supabase env vars are missing — same pattern as the
 * other Velocity tools.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RoleType } from "./constants";

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

export type MapStatus = "in_progress" | "saved" | "completed" | "abandoned";

export type MapIntake = {
  id: string;
  email: string;
  first_name: string;
  company_name: string;
  role: string;
  team_size: string;
  health_check_completed: boolean;
  health_check_url: string | null;
};

export type MapRow = MapIntake & {
  reflection_date_1: string | null;
  reflection_date_2: string | null;
  reflection_date_3: string | null;
  reflection_question: string | null;
  status: MapStatus;
  created_at: string;
  updated_at: string;
  saved_at: string | null;
  /** Markdown of the AI-Polished version the user added to their PDF, or null. */
  polished_version: string | null;
};

export type MapMetaPatch = Partial<
  Omit<MapRow, "id" | "created_at" | "saved_at" | "status"> & {
    status: MapStatus;
    saved_at: string | null;
    updated_at: string;
  }
>;

export type RoleInput = {
  map_id: string;
  position: number;
  role_type: RoleType;
  role_name: string;
  owner_name: string | null;
  mission_statement: string | null;
  responsibility_1: string | null;
  responsibility_2: string | null;
  responsibility_3: string | null;
  responsibility_4: string | null;
  responsibility_5: string | null;
  accountable_to: string | null;
  is_custom: boolean;
};

export type RoleRow = RoleInput & {
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

export async function createMapIntake(
  intake: MapIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("accountability_maps").insert({
    id: intake.id,
    email: intake.email,
    first_name: intake.first_name,
    company_name: intake.company_name,
    role: intake.role,
    team_size: intake.team_size,
    health_check_completed: intake.health_check_completed,
    health_check_url: intake.health_check_url,
    status: "in_progress",
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function updateMap(
  id: string,
  patch: MapMetaPatch
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const row = { ...patch, updated_at: patch.updated_at ?? new Date().toISOString() };
  const { error } = await client.from("accountability_maps").update(row).eq("id", id);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

/**
 * Upsert a single role at the given position. Roles are keyed by
 * (map_id, position) with a unique constraint, so we use upsert.
 */
export async function upsertRole(
  input: RoleInput
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("accountability_roles")
    .upsert(
      {
        map_id: input.map_id,
        position: input.position,
        role_type: input.role_type,
        role_name: input.role_name,
        owner_name: input.owner_name,
        mission_statement: input.mission_statement,
        responsibility_1: input.responsibility_1,
        responsibility_2: input.responsibility_2,
        responsibility_3: input.responsibility_3,
        responsibility_4: input.responsibility_4,
        responsibility_5: input.responsibility_5,
        accountable_to: input.accountable_to,
        is_custom: input.is_custom,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "map_id,position" }
    );
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

/**
 * Persist an AI-polished Markdown version onto the user's map row.
 * Subsequent PDF renders use this in place of the raw answers.
 */
export async function savePolishedVersion(
  mapId: string,
  polished: string | null
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("accountability_maps")
    .update({
      polished_version: polished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", mapId);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

export async function deleteRolesOutsideRange(
  mapId: string,
  positionsToKeep: number[]
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  let q = client.from("accountability_roles").delete().eq("map_id", mapId);
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

export async function getMap(
  id: string
): Promise<StorageResult<MapRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("accountability_maps")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as MapRow | null };
}

export async function getRoles(
  mapId: string
): Promise<StorageResult<RoleRow[]>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("accountability_roles")
    .select("*")
    .eq("map_id", mapId)
    .order("position", { ascending: true });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: (data ?? []) as RoleRow[] };
}
