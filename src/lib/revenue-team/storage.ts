/**
 * Supabase storage wrapper for the Unified Revenue Team Accountability Map.
 * Mirrors src/lib/accountability/storage.ts.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RevenueRoleType } from "./constants";

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

export type RevenueMapStatus =
  | "in_progress"
  | "saved"
  | "completed"
  | "abandoned";

export type RevenueMapIntake = {
  id: string;
  email: string;
  first_name: string;
  company_name: string;
  role: string;
  team_size: string;
  annual_revenue: string;
  has_director_of_revenue: "yes" | "no" | "planning";
  leadership_map_url: string | null;
};

export type RevenueMapRow = RevenueMapIntake & {
  weekly_meeting_day: string | null;
  weekly_meeting_time: string | null;
  weekly_meeting_duration: string | null;
  weekly_meeting_agenda: string | null;
  reflection_date_1: string | null;
  reflection_date_2: string | null;
  reflection_date_3: string | null;
  reflection_question: string | null;
  status: RevenueMapStatus;
  created_at: string;
  updated_at: string;
  saved_at: string | null;
};

export type RevenueMapMetaPatch = Partial<
  Omit<RevenueMapRow, "id" | "created_at" | "saved_at" | "status"> & {
    status: RevenueMapStatus;
    saved_at: string | null;
    updated_at: string;
  }
>;

export type RevenueRoleInput = {
  map_id: string;
  position: number;
  role_type: RevenueRoleType;
  role_name: string;
  owner_name: string | null;
  mission_statement: string | null;
  metric_1: string | null;
  metric_2: string | null;
  metric_3: string | null;
  responsibility_1: string | null;
  responsibility_2: string | null;
  responsibility_3: string | null;
  responsibility_4: string | null;
  responsibility_5: string | null;
  accountable_to: string | null;
  is_custom: boolean;
};

export type RevenueRoleRow = RevenueRoleInput & {
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

export async function createRevenueMapIntake(
  intake: RevenueMapIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("revenue_team_maps").insert({
    id: intake.id,
    email: intake.email,
    first_name: intake.first_name,
    company_name: intake.company_name,
    role: intake.role,
    team_size: intake.team_size,
    annual_revenue: intake.annual_revenue,
    has_director_of_revenue: intake.has_director_of_revenue,
    leadership_map_url: intake.leadership_map_url,
    status: "in_progress",
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function updateRevenueMap(
  id: string,
  patch: RevenueMapMetaPatch
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const row = { ...patch, updated_at: patch.updated_at ?? new Date().toISOString() };
  const { error } = await client.from("revenue_team_maps").update(row).eq("id", id);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}

export async function upsertRevenueRole(
  input: RevenueRoleInput
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("revenue_team_roles").upsert(
    {
      map_id: input.map_id,
      position: input.position,
      role_type: input.role_type,
      role_name: input.role_name,
      owner_name: input.owner_name,
      mission_statement: input.mission_statement,
      metric_1: input.metric_1,
      metric_2: input.metric_2,
      metric_3: input.metric_3,
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

export async function deleteRevenueRolesOutsideRange(
  mapId: string,
  positionsToKeep: number[]
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  let q = client.from("revenue_team_roles").delete().eq("map_id", mapId);
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

export async function getRevenueMap(
  id: string
): Promise<StorageResult<RevenueMapRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("revenue_team_maps")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as RevenueMapRow | null };
}

export async function getRevenueRoles(
  mapId: string
): Promise<StorageResult<RevenueRoleRow[]>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("revenue_team_roles")
    .select("*")
    .eq("map_id", mapId)
    .order("position", { ascending: true });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: (data ?? []) as RevenueRoleRow[] };
}
