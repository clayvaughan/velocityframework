/**
 * Supabase storage wrapper for the Culture Health Check.
 *
 * Individual mode: quiz_responses table.
 * Team mode: team_quizzes (campaign) + team_quiz_responses (anonymous answers).
 *
 * If Supabase env vars are missing, every function returns a typed
 * "not configured" result instead of throwing — local dev still works and
 * API routes surface a clear error to the client instead of crashing.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Dimension } from "./questions";
import type { Tier } from "./copy";
import type { Answers, DimensionScore } from "./scoring";

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

export type QuizIntake = {
  id: string;
  email: string;
  first_name: string;
  role: string;
  company: string | null;
  company_size: string | null;
  taking_for: "self" | "team";
};

export type QuizRow = QuizIntake & {
  answers: Answers | null;
  dimension_scores: DimensionScore[] | null;
  overall_score: number | null;
  overall_tier: Tier | null;
  created_at: string;
  completed_at: string | null;
};

export type TeamQuizIntake = {
  id: string;
  owner_email: string;
  owner_first_name: string;
  owner_role: string;
  owner_company: string | null;
  owner_company_size: string | null;
  team_name: string | null;
};

export type TeamQuizRow = TeamQuizIntake & {
  created_at: string;
};

export type TeamQuizResponseRow = {
  id: number;
  team_quiz_id: string;
  answers: Answers;
  dimension_scores: DimensionScore[];
  overall_score: number;
  overall_tier: Tier;
  submitted_at: string;
};

type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "db_error" | "not_found"; error?: unknown };

// ---------------------------------------------------------------------------
// Individual-mode writes
// ---------------------------------------------------------------------------

export async function createQuizIntake(
  intake: QuizIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("quiz_responses").insert({
    id: intake.id,
    email: intake.email,
    first_name: intake.first_name,
    role: intake.role,
    company: intake.company,
    company_size: intake.company_size,
    taking_for: intake.taking_for,
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function completeQuizSubmission(
  id: string,
  payload: {
    answers: Answers;
    overall_score: number;
    overall_tier: Tier;
    dimension_scores: DimensionScore[];
  }
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client
    .from("quiz_responses")
    .update({
      answers: payload.answers,
      overall_score: payload.overall_score,
      overall_tier: payload.overall_tier,
      dimension_scores: payload.dimension_scores,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id } };
}

// ---------------------------------------------------------------------------
// Individual-mode reads
// ---------------------------------------------------------------------------

export async function getQuizResult(
  id: string
): Promise<StorageResult<QuizRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("quiz_responses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as QuizRow | null };
}

// ---------------------------------------------------------------------------
// Team-mode writes
// ---------------------------------------------------------------------------

export async function createTeamQuiz(
  intake: TeamQuizIntake
): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("team_quizzes").insert({
    id: intake.id,
    owner_email: intake.owner_email,
    owner_first_name: intake.owner_first_name,
    owner_role: intake.owner_role,
    owner_company: intake.owner_company,
    owner_company_size: intake.owner_company_size,
    team_name: intake.team_name,
  });
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: intake.id } };
}

export async function submitTeamQuizResponse(payload: {
  team_quiz_id: string;
  answers: Answers;
  dimension_scores: DimensionScore[];
  overall_score: number;
  overall_tier: Tier;
}): Promise<StorageResult<{ id: string }>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { error } = await client.from("team_quiz_responses").insert(payload);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: { id: payload.team_quiz_id } };
}

// ---------------------------------------------------------------------------
// Team-mode reads
// ---------------------------------------------------------------------------

export async function getTeamQuiz(
  id: string
): Promise<StorageResult<TeamQuizRow | null>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("team_quizzes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: data as TeamQuizRow | null };
}

export async function getTeamQuizResponses(
  teamQuizId: string
): Promise<StorageResult<TeamQuizResponseRow[]>> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };
  const { data, error } = await client
    .from("team_quiz_responses")
    .select("*")
    .eq("team_quiz_id", teamQuizId);
  if (error) return { ok: false, reason: "db_error", error };
  return { ok: true, data: (data ?? []) as TeamQuizResponseRow[] };
}

// Re-export the dimension type for convenience in API routes.
export type { Dimension };
