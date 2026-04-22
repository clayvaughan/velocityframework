/**
 * HubSpot integration for the Culture Health Check.
 *
 * The token is expected in Replit Secrets as `HUBSPOT_PRIVATE_APP_TOKEN`.
 * Without it every exported function returns a typed "not configured"
 * result and logs a warning — the quiz submission itself still succeeds
 * and the data is safe in Supabase, so Clay can backfill HubSpot later.
 *
 * Portal ID: 51279976 (velocityframework Good Agency).
 *
 * This module covers:
 *   1. Contact upsert + custom property writes (implemented)
 *   2. PDF email delivery trigger (stubbed — documented in
 *      MISSING_CONTENT_MANIFEST.md; requires a transactional-email
 *      template id Abby creates in HubSpot)
 *   3. Nurture sequence scaffolding (stubbed — the three tier-specific
 *      sequences will be created in HubSpot UI by Abby; the code path
 *      below enrolls a contact in the sequence matching their tier once
 *      the sequence ids are added here)
 */

import type { Tier } from "./quiz/copy";

const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const HUBSPOT_API = "https://api.hubapi.com";

export const HUBSPOT_PORTAL_ID = "51279976";

export function isHubSpotConfigured(): boolean {
  return Boolean(token);
}

// ---------------------------------------------------------------------------
// Contact sync
// ---------------------------------------------------------------------------

const TIER_HUBSPOT_LABEL: Record<Tier, string> = {
  healthy: "Healthy",
  at_risk: "At Risk",
  critical: "Critical",
};

export type QuizContactInput = {
  email: string;
  firstName: string;
  role: string;
  company?: string | null;
  companySize?: string | null;
  cultureHealthScore: number;
  cultureHealthTier: Tier;
  recommendedResourceSlugs: string[];
  /** If true, sets team_quiz_participant=true and skips the lifecycle/score write. */
  asTeamParticipant?: boolean;
};

export type HubSpotSyncResult =
  | { ok: true; contactId: string; skipped?: false }
  | { ok: false; skipped: true; reason: "no_token" }
  | { ok: false; skipped: false; reason: "api_error"; status?: number; error: string };

async function hubspotFetch(path: string, init: RequestInit) {
  const res = await fetch(`${HUBSPOT_API}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function syncContactWithQuizResult(
  input: QuizContactInput
): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping contact sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    role: input.role,
  };
  if (input.company) properties.company = input.company;
  if (input.companySize) properties.company_size = input.companySize;
  if (input.asTeamParticipant) {
    properties.team_quiz_participant = "true";
  } else {
    properties.culture_health_score = String(input.cultureHealthScore);
    properties.culture_health_tier = TIER_HUBSPOT_LABEL[input.cultureHealthTier];
    properties.resources_requested = input.recommendedResourceSlugs.join(";");
    properties.lifecyclestage = "subscriber";
  }

  // Upsert by email. HubSpot's search-and-update pattern:
  try {
    // 1. Try to find existing contact by email
    const search = await hubspotFetch(`/crm/v3/objects/contacts/search`, {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              { propertyName: "email", operator: "EQ", value: input.email },
            ],
          },
        ],
        properties: ["email"],
        limit: 1,
      }),
    });
    if (!search.ok) {
      const body = await search.text();
      return {
        ok: false,
        skipped: false,
        reason: "api_error",
        status: search.status,
        error: `search failed: ${body}`,
      };
    }
    const searchJson = (await search.json()) as { results: { id: string }[] };
    const existingId = searchJson.results?.[0]?.id;

    // 2. Update or create
    const path = existingId
      ? `/crm/v3/objects/contacts/${existingId}`
      : `/crm/v3/objects/contacts`;
    const method = existingId ? "PATCH" : "POST";
    const res = await hubspotFetch(path, {
      method,
      body: JSON.stringify({ properties }),
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        skipped: false,
        reason: "api_error",
        status: res.status,
        error: `${method} failed: ${body}`,
      };
    }
    const json = (await res.json()) as { id: string };
    return { ok: true, contactId: json.id };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      reason: "api_error",
      error: String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Nurture sequence enrollment (stubbed)
// ---------------------------------------------------------------------------

/**
 * HubSpot sequence ids for the three tier-specific nurture tracks. Populate
 * after Abby creates the sequences in HubSpot UI — until then, enrollment
 * is a no-op documented in the manifest.
 */
const NURTURE_SEQUENCE_IDS: Record<Tier, string | null> = {
  healthy: null,
  at_risk: null,
  critical: null,
};

export async function enrollInNurtureSequence(input: {
  contactId: string;
  tier: Tier;
}): Promise<{ ok: boolean; skipped: boolean; reason?: string }> {
  if (!token) {
    return { ok: false, skipped: true, reason: "no_token" };
  }
  const sequenceId = NURTURE_SEQUENCE_IDS[input.tier];
  if (!sequenceId) {
    console.warn(
      `[hubspot] Nurture sequence id for tier=${input.tier} is not configured — see MISSING_CONTENT_MANIFEST.md`
    );
    return { ok: false, skipped: true, reason: "sequence_id_missing" };
  }
  // TODO: call HubSpot Sequences API (requires Sales Hub) or substitute an
  // automation / workflow enrollment once Abby picks the pattern.
  console.info(
    `[hubspot] Would enroll contact ${input.contactId} in sequence ${sequenceId} (tier=${input.tier}) — not yet implemented.`
  );
  return { ok: false, skipped: true, reason: "not_implemented" };
}

// ---------------------------------------------------------------------------
// Transactional email (PDF delivery) — stubbed
// ---------------------------------------------------------------------------

/**
 * Send the user their quiz-result PDF via a HubSpot transactional email
 * template. Template id TBD (Abby creates in HubSpot). Until then, the
 * quiz ships the PDF via direct download only and this function logs.
 */
export async function sendQuizResultEmail(_input: {
  email: string;
  firstName: string;
  tier: Tier;
  pdfBase64: string;
  resultsUrl: string;
}): Promise<{ ok: boolean; skipped: boolean; reason?: string }> {
  if (!token) return { ok: false, skipped: true, reason: "no_token" };
  console.info(
    "[hubspot] sendQuizResultEmail — transactional template id not yet configured, see MISSING_CONTENT_MANIFEST.md"
  );
  return { ok: false, skipped: true, reason: "template_id_missing" };
}

// ---------------------------------------------------------------------------
// Culture Action Plan contact sync
// ---------------------------------------------------------------------------

/**
 * Contact upsert for a saved Culture Action Plan. Sets the custom
 * properties described in the Action Plan spec and enrolls the contact in
 * the "Making Culture Stick" nurture sequence once the sequence id is
 * populated in `ACTION_PLAN_SEQUENCE_ID` below.
 *
 * Silent no-op when the HubSpot token is missing.
 */
const ACTION_PLAN_SEQUENCE_ID: string | null = null;

export async function syncActionPlanContact(input: {
  email: string;
  firstName: string;
  role: string;
  teamSize?: string;
  focusAreaTitles: string[];
  virtues: string[];
  reassessmentDate: string | null;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping Action Plan sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    role: input.role,
    action_plan_focus_areas: input.focusAreaTitles.join(";"),
    action_plan_virtues: input.virtues.join(";"),
    action_plan_status: "In Progress",
    lifecyclestage: "subscriber",
  };
  if (input.teamSize) properties.company_size = input.teamSize;
  if (input.reassessmentDate)
    properties.action_plan_reassessment_date = input.reassessmentDate;

  try {
    const search = await hubspotFetch(`/crm/v3/objects/contacts/search`, {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              { propertyName: "email", operator: "EQ", value: input.email },
            ],
          },
        ],
        properties: ["email"],
        limit: 1,
      }),
    });
    if (!search.ok) {
      const body = await search.text();
      return {
        ok: false,
        skipped: false,
        reason: "api_error",
        status: search.status,
        error: `search failed: ${body}`,
      };
    }
    const searchJson = (await search.json()) as { results: { id: string }[] };
    const existingId = searchJson.results?.[0]?.id;

    const path = existingId
      ? `/crm/v3/objects/contacts/${existingId}`
      : `/crm/v3/objects/contacts`;
    const method = existingId ? "PATCH" : "POST";
    const res = await hubspotFetch(path, {
      method,
      body: JSON.stringify({ properties }),
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        skipped: false,
        reason: "api_error",
        status: res.status,
        error: `${method} failed: ${body}`,
      };
    }
    const json = (await res.json()) as { id: string };

    // Enrollment stub — activates once ACTION_PLAN_SEQUENCE_ID is populated.
    if (ACTION_PLAN_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in sequence ${ACTION_PLAN_SEQUENCE_ID}`
      );
    }

    return { ok: true, contactId: json.id };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      reason: "api_error",
      error: String(err),
    };
  }
}
