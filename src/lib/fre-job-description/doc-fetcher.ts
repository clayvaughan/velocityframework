/**
 * Fetch + cache the FRE Job Description Google Doc as plain text.
 *
 * Mirrors the Sample Trust-Building Script fetcher: 5-minute in-memory
 * cache per server instance, 8-second timeout, follows Google's 307
 * redirect, returns a typed result so the renderer can show a graceful
 * fallback instead of crashing on network errors.
 */

import {
  DOC_CACHE_TTL_MS,
  DOC_FETCH_TIMEOUT_MS,
  freJobDescriptionTxtExportUrl,
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

export async function fetchFreJobDescriptionDoc(
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
    const res = await fetch(freJobDescriptionTxtExportUrl(docId), {
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
