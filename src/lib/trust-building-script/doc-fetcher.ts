/**
 * Fetch + cache the Bellamere Trust-Building Script Google Doc as plain text.
 *
 * - 5-minute in-memory cache per server instance (simple Map, no Redis).
 * - 8-second timeout — a Google Docs hang must not take down the PDF
 *   endpoint for everyone else.
 * - Follows Google's 307 redirect to the googleusercontent.com export host.
 * - On any failure, returns { ok: false, reason } so the PDF renderer can
 *   show a graceful fallback page instead of crashing.
 */

import {
  DOC_CACHE_TTL_MS,
  DOC_FETCH_TIMEOUT_MS,
  trustBuildingScriptTxtExportUrl,
} from "./constants";

type CacheEntry = { content: string; fetchedAt: number };
const cache = new Map<string, CacheEntry>();

export type DocFetchResult =
  | { ok: true; content: string; cached: boolean }
  | {
      ok: false;
      reason: "timeout" | "http_error" | "network_error" | "empty";
      status?: number;
    };

export async function fetchTrustBuildingScriptDoc(
  docId: string
): Promise<DocFetchResult> {
  const cached = cache.get(docId);
  const now = Date.now();
  if (cached && now - cached.fetchedAt < DOC_CACHE_TTL_MS) {
    return { ok: true, content: cached.content, cached: true };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DOC_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(trustBuildingScriptTxtExportUrl(docId), {
      signal: controller.signal,
      redirect: "follow",
    });
    if (!res.ok) {
      return { ok: false, reason: "http_error", status: res.status };
    }
    const content = await res.text();
    if (!content || content.trim().length === 0) {
      return { ok: false, reason: "empty" };
    }
    cache.set(docId, { content, fetchedAt: now });
    return { ok: true, content, cached: false };
  } catch (err) {
    const aborted =
      err instanceof DOMException && err.name === "AbortError";
    return {
      ok: false,
      reason: aborted ? "timeout" : "network_error",
    };
  } finally {
    clearTimeout(timer);
  }
}
