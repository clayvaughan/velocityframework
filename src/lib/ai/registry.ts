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
import {
  buildMessagingChecklistPrompt,
} from "./prompt-templates/messaging-checklist";

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
      // Verify the row exists before writing — better error surfaces than
      // a silent UPDATE-zero-rows.
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
};

export function getToolHandler(tool: string): ToolHandler | null {
  return TOOLS[tool] ?? null;
}

export function listRegisteredTools(): string[] {
  return Object.keys(TOOLS);
}
