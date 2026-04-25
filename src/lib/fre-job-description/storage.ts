/**
 * Supabase storage wrapper for the FRE Job Description download log.
 * Mirrors the Sample Trust-Building Script storage layer.
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

export type FreJobDescriptionIntake = {
  id: string;
  email: string;
  first_name: string;
  company_name: string;
  role: string;
  download_reason: string | null;
};

export type FreJobDescriptionRow = FreJobDescriptionIntake & {
  downloaded_at: string | null;
  created_at: string;
};

type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "db_error" | "not_found"; error?: unknown };

export async function createFreJobDescriptionDownload(
  intake: FreJobDescriptionIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("fre_job_description_downloads")
    .insert({
      id: intake.id,
      email: intake.email,
      first_name: intake.first_name,
      company_name: intake.company_name,
      role: intake.role,
      download_reason: intake.download_reason,
    });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function getFreJobDescriptionDownload(
  id: string
): Promise<StorageResult<FreJobDescriptionRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("fre_job_description_downloads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as FreJobDescriptionRow | null };
}

export async function markFreJobDescriptionDownloaded(
  id: string
): Promise<StorageResult<null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("fre_job_description_downloads")
    .update({ downloaded_at: new Date().toISOString() })
    .eq("id", id)
    .is("downloaded_at", null);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: null };
}
