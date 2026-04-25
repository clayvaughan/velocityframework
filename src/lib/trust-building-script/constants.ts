/**
 * Sample Trust-Building Script — source-of-truth Google Doc.
 *
 * The PDF endpoint fetches this doc at render time via Google's plain-text
 * export URL, parses the 10 coached sections, and renders them into the
 * Velocity-branded PDF template. Swap the DOC_ID if Clay ever moves the
 * source document; everything downstream will pick up the new content on the
 * next cache miss.
 */

export const TRUST_BUILDING_SCRIPT_DOC_ID =
  "1-so7nDEbFNnBS_YtmYlaO_Vv6Xk3xFwLvrSdBJTkjPA";

export function trustBuildingScriptTxtExportUrl(docId: string): string {
  return `https://docs.google.com/document/d/${docId}/export?format=txt`;
}

/** In-memory cache TTL — 5 minutes per server instance. */
export const DOC_CACHE_TTL_MS = 5 * 60 * 1000;

/** Fetch timeout — don't hang if Google Docs is unresponsive. */
export const DOC_FETCH_TIMEOUT_MS = 8000;
