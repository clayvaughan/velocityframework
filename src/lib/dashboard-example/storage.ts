/**
 * Supabase storage wrapper for the Good Agency Dashboard Example download log.
 * Same pattern as src/lib/scorecard-example/storage.ts.
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

export type DashboardDownloadIntake = {
  id: string;
  email: string;
  first_name: string;
  company_name: string;
  role: string;
  metrics_challenge: string | null;
};

export type DashboardDownloadRow = DashboardDownloadIntake & {
  downloaded_at: string | null;
  created_at: string;
};

type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "db_error" | "not_found"; error?: unknown };

export async function createDashboardDownload(
  intake: DashboardDownloadIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("dashboard_downloads").insert({
    id: intake.id,
    email: intake.email,
    first_name: intake.first_name,
    company_name: intake.company_name,
    role: intake.role,
    metrics_challenge: intake.metrics_challenge,
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function getDashboardDownload(
  id: string
): Promise<StorageResult<DashboardDownloadRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("dashboard_downloads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as DashboardDownloadRow | null };
}

export async function markDashboardDownloaded(
  id: string
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("dashboard_downloads")
    .update({ downloaded_at: new Date().toISOString() })
    .eq("id", id)
    .is("downloaded_at", null);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}
