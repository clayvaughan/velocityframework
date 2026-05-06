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

/**
 * Map the user-facing role label (as captured by <RoleSelect />) to the
 * internal value HubSpot's `role` dropdown expects. If a label doesn't
 * map (HubSpot allowed-list changes, or stored data drift), the caller
 * should omit `role` rather than send an invalid value — invalid options
 * trigger HubSpot 400 VALIDATION_ERROR and reject the entire contact
 * write atomically (no properties land).
 */
const ROLE_LABEL_TO_HUBSPOT_VALUE: Record<string, string> = {
  "Business Owner": "business_owner",
  "Fractional Revenue Executive": "fractional_revenue_executive",
  "Leader / Executive": "leader_or_executive",
  "Coach / Consultant": "coach_or_consultant",
  "Reader": "reader",
};

function hubspotRoleValue(label: string): string | undefined {
  return ROLE_LABEL_TO_HUBSPOT_VALUE[label];
}

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
    lifecyclestage: "subscriber",
    tool_used: "culture_health_check",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "culture_health_check",
    nurture_status: "active",
  };
  if (input.company) properties.company = input.company;
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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
const FCP_SEQUENCE_ID: string | null = null;
const MESSAGING_SEQUENCE_ID: string | null = null;
const ACCOUNTABILITY_SEQUENCE_ID: string | null = null;
const SCORECARD_EXAMPLE_SEQUENCE_ID: string | null = null;
const DASHBOARD_EXAMPLE_SEQUENCE_ID: string | null = null;
const REVENUE_TEAM_SEQUENCE_ID: string | null = null;
const TRUST_BUILDING_SCRIPT_SEQUENCE_ID: string | null = null;
const FRE_JOB_DESCRIPTION_SEQUENCE_ID: string | null = null;

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
    lifecyclestage: "subscriber",
    tool_used: "culture_action_plan",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "culture_action_plan",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

// ---------------------------------------------------------------------------
// Favorite Customer Profile contact sync
// ---------------------------------------------------------------------------

/**
 * Contact upsert for a saved Favorite Customer Profile worksheet. Sets
 * fcp_* custom properties so Abby can segment and enroll in the "Build
 * Around Your Favorite Customer" nurture sequence once FCP_SEQUENCE_ID
 * is populated above.
 */
export async function syncFcpContact(input: {
  email: string;
  firstName: string;
  companyName: string;
  role: string;
  industry: string;
  fcpProfileCount: 1 | 2 | 3;
  fcpHasScopeFilters: boolean;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping FCP sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    company: input.companyName,
    industry: input.industry,
    lifecyclestage: "subscriber",
    tool_used: "favorite_customer_profile",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "favorite_customer_profile",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

    if (FCP_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in FCP sequence ${FCP_SEQUENCE_ID}`
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

// ---------------------------------------------------------------------------
// Messaging & Proof Checklist contact sync
// ---------------------------------------------------------------------------

export async function syncMessagingChecklistContact(input: {
  email: string;
  firstName: string;
  companyName: string;
  role: string;
  onelinerFinal: string | null;
  collateralScore: number;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping Messaging sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    company: input.companyName,
    lifecyclestage: "subscriber",
    tool_used: "messaging_proof_checklist",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "messaging_proof_checklist",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

    if (MESSAGING_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in Messaging sequence ${MESSAGING_SEQUENCE_ID}`
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

// ---------------------------------------------------------------------------
// Leadership Accountability Map contact sync
// ---------------------------------------------------------------------------

export async function syncAccountabilityMapContact(input: {
  email: string;
  firstName: string;
  companyName: string;
  role: string;
  roleCount: number;
  nextReflectionDateISO: string | null;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping Accountability Map sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    company: input.companyName,
    lifecyclestage: "subscriber",
    tool_used: "leadership_accountability_map",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "leadership_accountability_map",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

    if (ACCOUNTABILITY_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in Accountability Map sequence ${ACCOUNTABILITY_SEQUENCE_ID}`
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

// ---------------------------------------------------------------------------
// Good Agency Scorecard Example download contact sync
// ---------------------------------------------------------------------------

export async function syncScorecardExampleContact(input: {
  email: string;
  firstName: string;
  companyName: string;
  role: string;
  scorecardTargetRole: string | null;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping Scorecard Example sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    company: input.companyName,
    lifecyclestage: "subscriber",
    tool_used: "scorecard_example",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "scorecard_example",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

    if (SCORECARD_EXAMPLE_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in Scorecard Example sequence ${SCORECARD_EXAMPLE_SEQUENCE_ID}`
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

// ---------------------------------------------------------------------------
// Good Agency Dashboard Example download contact sync
// ---------------------------------------------------------------------------

export async function syncDashboardExampleContact(input: {
  email: string;
  firstName: string;
  companyName: string;
  role: string;
  metricsChallenge: string | null;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping Dashboard Example sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    company: input.companyName,
    lifecyclestage: "subscriber",
    tool_used: "dashboard_example",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "dashboard_example",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

    if (DASHBOARD_EXAMPLE_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in Dashboard Example sequence ${DASHBOARD_EXAMPLE_SEQUENCE_ID}`
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

// ---------------------------------------------------------------------------
// Unified Revenue Team Accountability Map contact sync
// ---------------------------------------------------------------------------

export async function syncRevenueTeamMapContact(input: {
  email: string;
  firstName: string;
  companyName: string;
  role: string;
  roleCount: number;
  hasDirectorOfRevenue: "yes" | "no" | "planning";
  annualRevenueRange: string;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping Revenue Team sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    company: input.companyName,
    lifecyclestage: "subscriber",
    tool_used: "unified_revenue_team_map",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "unified_revenue_team_map",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

    if (REVENUE_TEAM_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in Revenue Team sequence ${REVENUE_TEAM_SEQUENCE_ID}`
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

// ---------------------------------------------------------------------------
// Sample Trust-Building Script download contact sync
// ---------------------------------------------------------------------------

export async function syncTrustBuildingScriptContact(input: {
  email: string;
  firstName: string;
  companyName: string;
  role: string;
  highestStakesSale: string | null;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping Trust-Building Script sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    company: input.companyName,
    lifecyclestage: "subscriber",
    tool_used: "sample_trust_building_script",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "sample_trust_building_script",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

    if (TRUST_BUILDING_SCRIPT_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in Trust-Building Script sequence ${TRUST_BUILDING_SCRIPT_SEQUENCE_ID}`
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

// ---------------------------------------------------------------------------
// FRE Job Description download contact sync
// ---------------------------------------------------------------------------

export async function syncFreJobDescriptionContact(input: {
  email: string;
  firstName: string;
  companyName: string;
  role: string;
  downloadReason: string | null;
}): Promise<HubSpotSyncResult> {
  if (!token) {
    console.warn(
      "[hubspot] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping FRE Job Description sync for",
      input.email
    );
    return { ok: false, skipped: true, reason: "no_token" };
  }

  const properties: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    company: input.companyName,
    lifecyclestage: "subscriber",
    tool_used: "fre_job_description",
    tool_downloaded_date: new Date().toISOString().slice(0, 10),
    nurture_track: "fre_job_description",
    nurture_status: "active",
  };
  const mappedRole = hubspotRoleValue(input.role);
  if (mappedRole) properties.role = mappedRole;

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

    if (FRE_JOB_DESCRIPTION_SEQUENCE_ID) {
      console.info(
        `[hubspot] Would enroll ${json.id} in FRE Job Description sequence ${FRE_JOB_DESCRIPTION_SEQUENCE_ID}`
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
