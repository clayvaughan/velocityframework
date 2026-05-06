/**
 * Tool registry for the AI Polish feature.
 *
 * Each tool registered here gets two capabilities:
 *   - buildPrompt(userId): fetch the user's saved data and run it through
 *     the tool-specific prompt template, returning {system, user, combined}.
 *   - savePolishedVersion(userId, text): persist an AI-cleaned Markdown
 *     version to the right Supabase column so the next PDF render uses it.
 *
 * Adding a new tool is the bulk of "rolling out AI Polish to another tool" —
 * see src/lib/ai/README.md for the recipe.
 */

import {
  getChecklist,
  getCollateralItems,
  isStorageConfigured as isMessagingStorageConfigured,
  savePolishedVersion as saveMessagingPolishedVersion,
} from "@/lib/messaging/storage";
import { buildMessagingChecklistPrompt } from "./prompt-templates/messaging-checklist";

import {
  getWorksheet as getFcpWorksheet,
  getProfiles as getFcpProfiles,
  isStorageConfigured as isFcpStorageConfigured,
  savePolishedVersion as saveFcpPolishedVersion,
} from "@/lib/fcp/storage";
import { buildFcpPrompt } from "./prompt-templates/fcp";

import {
  getMap as getLeadershipMap,
  getRoles as getLeadershipRoles,
  isStorageConfigured as isLeadershipStorageConfigured,
  savePolishedVersion as saveLeadershipPolishedVersion,
} from "@/lib/accountability/storage";
import { buildLeadershipPrompt } from "./prompt-templates/leadership-accountability";

import {
  getRevenueMap,
  getRevenueRoles,
  isStorageConfigured as isRevenueStorageConfigured,
  savePolishedVersion as saveRevenuePolishedVersion,
} from "@/lib/revenue-team/storage";
import { buildRevenueTeamPrompt } from "./prompt-templates/revenue-team";

import {
  getActionPlan,
  getFocusAreas,
  isStorageConfigured as isActionPlanStorageConfigured,
  savePolishedVersion as saveActionPlanPolishedVersion,
} from "@/lib/action-plan/storage";
import { buildActionPlanPrompt } from "./prompt-templates/action-plan";

export type BuildPromptResult =
  | { ok: true; system: string; user: string; combined: string }
  | { ok: false; reason: "not_configured" | "not_found" | "db_error" };

export type SaveVersionResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "not_found" | "db_error" };

export type ToolHandler = {
  /** Fetch user's saved data + build the system+user prompts for the model. */
  buildPrompt: (userId: string) => Promise<BuildPromptResult>;
  /** Persist a polished Markdown version to the tool's storage row. */
  savePolishedVersion: (userId: string, text: string) => Promise<SaveVersionResult>;
};

const TOOLS: Record<string, ToolHandler> = {
  "messaging-checklist": {
    buildPrompt: async (userId) => {
      if (!isMessagingStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const cl = await getChecklist(userId);
      if (!cl.ok) return { ok: false, reason: "db_error" };
      if (!cl.data) return { ok: false, reason: "not_found" };
      const ci = await getCollateralItems(userId);
      const collateral = ci.ok
        ? ci.data.map((row) => ({
            item_key: row.item_key,
            status: row.status,
            notes: row.notes,
          }))
        : [];
      const built = buildMessagingChecklistPrompt({
        checklist: cl.data,
        collateral,
      });
      return {
        ok: true,
        system: built.system,
        user: built.user,
        combined: built.combined,
      };
    },
    savePolishedVersion: async (userId, text) => {
      if (!isMessagingStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const cl = await getChecklist(userId);
      if (!cl.ok) return { ok: false, reason: "db_error" };
      if (!cl.data) return { ok: false, reason: "not_found" };
      const result = await saveMessagingPolishedVersion(userId, text);
      if (!result.ok) {
        return {
          ok: false,
          reason: result.reason === "not_configured" ? "not_configured" : "db_error",
        };
      }
      return { ok: true };
    },
  },

  fcp: {
    buildPrompt: async (userId) => {
      if (!isFcpStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const ws = await getFcpWorksheet(userId);
      if (!ws.ok) return { ok: false, reason: "db_error" };
      if (!ws.data) return { ok: false, reason: "not_found" };
      const profilesRes = await getFcpProfiles(userId);
      const profiles = profilesRes.ok ? profilesRes.data : [];
      const built = buildFcpPrompt({ worksheet: ws.data, profiles });
      return {
        ok: true,
        system: built.system,
        user: built.user,
        combined: built.combined,
      };
    },
    savePolishedVersion: async (userId, text) => {
      if (!isFcpStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const ws = await getFcpWorksheet(userId);
      if (!ws.ok) return { ok: false, reason: "db_error" };
      if (!ws.data) return { ok: false, reason: "not_found" };
      const result = await saveFcpPolishedVersion(userId, text);
      if (!result.ok) {
        return {
          ok: false,
          reason: result.reason === "not_configured" ? "not_configured" : "db_error",
        };
      }
      return { ok: true };
    },
  },

  "leadership-accountability-map": {
    buildPrompt: async (userId) => {
      if (!isLeadershipStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const m = await getLeadershipMap(userId);
      if (!m.ok) return { ok: false, reason: "db_error" };
      if (!m.data) return { ok: false, reason: "not_found" };
      const rolesRes = await getLeadershipRoles(userId);
      const roles = rolesRes.ok ? rolesRes.data : [];
      const built = buildLeadershipPrompt({ map: m.data, roles });
      return {
        ok: true,
        system: built.system,
        user: built.user,
        combined: built.combined,
      };
    },
    savePolishedVersion: async (userId, text) => {
      if (!isLeadershipStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const m = await getLeadershipMap(userId);
      if (!m.ok) return { ok: false, reason: "db_error" };
      if (!m.data) return { ok: false, reason: "not_found" };
      const result = await saveLeadershipPolishedVersion(userId, text);
      if (!result.ok) {
        return {
          ok: false,
          reason: result.reason === "not_configured" ? "not_configured" : "db_error",
        };
      }
      return { ok: true };
    },
  },

  "revenue-team-map": {
    buildPrompt: async (userId) => {
      if (!isRevenueStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const m = await getRevenueMap(userId);
      if (!m.ok) return { ok: false, reason: "db_error" };
      if (!m.data) return { ok: false, reason: "not_found" };
      const rolesRes = await getRevenueRoles(userId);
      const roles = rolesRes.ok ? rolesRes.data : [];
      const built = buildRevenueTeamPrompt({ map: m.data, roles });
      return {
        ok: true,
        system: built.system,
        user: built.user,
        combined: built.combined,
      };
    },
    savePolishedVersion: async (userId, text) => {
      if (!isRevenueStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const m = await getRevenueMap(userId);
      if (!m.ok) return { ok: false, reason: "db_error" };
      if (!m.data) return { ok: false, reason: "not_found" };
      const result = await saveRevenuePolishedVersion(userId, text);
      if (!result.ok) {
        return {
          ok: false,
          reason: result.reason === "not_configured" ? "not_configured" : "db_error",
        };
      }
      return { ok: true };
    },
  },

  "action-plan": {
    buildPrompt: async (userId) => {
      if (!isActionPlanStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const p = await getActionPlan(userId);
      if (!p.ok) return { ok: false, reason: "db_error" };
      if (!p.data) return { ok: false, reason: "not_found" };
      const faRes = await getFocusAreas(userId);
      const focusAreas = faRes.ok ? faRes.data : [];
      const built = buildActionPlanPrompt({ plan: p.data, focusAreas });
      return {
        ok: true,
        system: built.system,
        user: built.user,
        combined: built.combined,
      };
    },
    savePolishedVersion: async (userId, text) => {
      if (!isActionPlanStorageConfigured()) {
        return { ok: false, reason: "not_configured" };
      }
      const p = await getActionPlan(userId);
      if (!p.ok) return { ok: false, reason: "db_error" };
      if (!p.data) return { ok: false, reason: "not_found" };
      const result = await saveActionPlanPolishedVersion(userId, text);
      if (!result.ok) {
        return {
          ok: false,
          reason: result.reason === "not_configured" ? "not_configured" : "db_error",
        };
      }
      return { ok: true };
    },
  },
};

export function getToolHandler(tool: string): ToolHandler | null {
  return TOOLS[tool] ?? null;
}

export function listRegisteredTools(): string[] {
  return Object.keys(TOOLS);
}
