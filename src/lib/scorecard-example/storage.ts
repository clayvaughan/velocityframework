/**
 * Supabase storage wrapper for the Good Agency Scorecard Example download log.
 * Graceful no-op when Supabase env vars are missing.
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

export type ScorecardDownloadIntake = {
  id: string;
  email: string;
  first_name: string;
  company_name: string;
  role: string;
  scorecard_target_role: string | null;
};

export type ScorecardDownloadRow = ScorecardDownloadIntake & {
  downloaded_at: string | null;
  created_at: string;
};

type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "db_error" | "not_found"; error?: unknown };

export async function createScorecardDownload(
  intake: ScorecardDownloadIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("scorecard_downloads").insert({
    id: intake.id,
    email: intake.email,
    first_name: intake.first_name,
    company_name: intake.company_name,
    role: intake.role,
    scorecard_target_role: intake.scorecard_target_role,
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function getScorecardDownload(
  id: string
): Promise<StorageResult<ScorecardDownloadRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("scorecard_downloads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as ScorecardDownloadRow | null };
}

export async function markScorecardDownloaded(
  id: string
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("scorecard_downloads")
    .update({ downloaded_at: new Date().toISOString() })
    .eq("id", id)
    .is("downloaded_at", null);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}
