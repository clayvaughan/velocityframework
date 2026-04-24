/**
 * Supabase storage wrapper for the Bellamere Trust-Building Script download
 * log. Graceful no-op when Supabase env vars are missing. Mirrors the
 * Scorecard Example pattern exactly.
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

export type TrustBuildingScriptIntake = {
  id: string;
  email: string;
  first_name: string;
  company_name: string;
  role: string;
  highest_stakes_sale: string | null;
};

export type TrustBuildingScriptRow = TrustBuildingScriptIntake & {
  downloaded_at: string | null;
  created_at: string;
};

type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "db_error" | "not_found"; error?: unknown };

export async function createTrustBuildingScriptDownload(
  intake: TrustBuildingScriptIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("trust_building_script_downloads")
    .insert({
      id: intake.id,
      email: intake.email,
      first_name: intake.first_name,
      company_name: intake.company_name,
      role: intake.role,
      highest_stakes_sale: intake.highest_stakes_sale,
    });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function getTrustBuildingScriptDownload(
  id: string
): Promise<StorageResult<TrustBuildingScriptRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("trust_building_script_downloads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as TrustBuildingScriptRow | null };
}

export async function markTrustBuildingScriptDownloaded(
  id: string
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("trust_building_script_downloads")
    .update({ downloaded_at: new Date().toISOString() })
    .eq("id", id)
    .is("downloaded_at", null);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}
