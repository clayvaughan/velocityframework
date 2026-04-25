/**
 * FRE Job Description — source-of-truth Google Doc.
 *
 * The PDF endpoint fetches this doc at render time via Google's plain-text
 * export URL, parses it into top-level sections + sub-sections + bullets,
 * and renders inside the Velocity-branded PDF template. Swap the DOC_ID if
 * Clay or Luke ever moves the source document; everything downstream picks
 * up the new content on the next cache miss.
 */

export const FRE_JOB_DESCRIPTION_DOC_ID =
  "1wRSgNuNC6lz4QeO69sqOFIsLSnGBuvbzJyaPrs-GmqA";

export function freJobDescriptionTxtExportUrl(docId: string): string {
  return `https://docs.google.com/document/d/${docId}/export?format=txt`;
}

/** In-memory cache TTL — 5 minutes per server instance. */
export const DOC_CACHE_TTL_MS = 5 * 60 * 1000;

/** Fetch timeout — don't hang if Google Docs is unresponsive. */
export const DOC_FETCH_TIMEOUT_MS = 8000;

/**
 * Top-level section names that warrant a fresh page break in the PDF and
 * a larger heading treatment. Anything not in this list that looks like a
 * heading falls through to the H2 sub-section style.
 *
 * If Luke/Clay renames a section in the source doc, update this list to
 * keep the PDF page breaks aligned. Match is case-insensitive and uses
 * `startsWith` so "What Clients Should Expect From an FRE" still matches
 * if the wording shifts.
 */
export const FRE_TOP_LEVEL_HEADINGS = [
  "Overview",
  "Key Responsibilities",
  "Core Competencies",
  "Character & Values",
  "What Clients Should Expect",
] as const;
