/**
 * Parse the FRE Job Description plain-text export.
 *
 * Doc structure (verified against the live Google Doc):
 *   Line 1:  "Job Description: Fractional Revenue Executive (FRE)" (title — skipped, we use our own cover)
 *   Line 2+: Mix of H1 sections, H2 sub-sections, paragraphs, and "* "-prefixed bullets
 *
 * Plain-text export has no syntactic distinction between H1 and H2 — both
 * appear as bare lines. We use the explicit `FRE_TOP_LEVEL_HEADINGS` list
 * (constants.ts) to identify H1; everything else that looks heading-like
 * (short, no terminal period, no bullet prefix) is H2.
 *
 * Output is a flat sequence of typed blocks; the PDF renderer paginates on
 * H1 boundaries.
 */

import { FRE_TOP_LEVEL_HEADINGS } from "./constants";

export type Block =
  | { kind: "heading1"; text: string }
  | { kind: "heading2"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "bullet"; text: string };

export type ParsedDoc = {
  title: string;
  blocks: Block[];
};

const COPYRIGHT_RE = /^©\s*Clayton\s*Vaughan/;
const BULLET_RE = /^\*\s+(.*)$/;

function stripBom(s: string): string {
  return s.replace(/^﻿/, "");
}

function isTopLevelHeading(line: string): boolean {
  return FRE_TOP_LEVEL_HEADINGS.some((h) =>
    line.toLowerCase().startsWith(h.toLowerCase())
  );
}

function isHeadingLike(line: string): boolean {
  // Heuristic: short line (under ~80 chars), no trailing period, doesn't start
  // with a bullet, has at least one capital letter. Body paragraphs in this
  // doc reliably end with "." so the no-period check is the load-bearing
  // signal — combined with length to avoid mis-classifying short prose.
  if (line.length === 0 || line.length > 90) return false;
  if (line.endsWith(".")) return false;
  if (BULLET_RE.test(line)) return false;
  if (!/[A-Z]/.test(line)) return false;
  return true;
}

export function parseFreJobDescription(content: string): ParsedDoc {
  const lines = stripBom(content)
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s+/, "").replace(/\s+$/, ""));

  // Line 1 is the doc title — we render our own cover page so just capture
  // it for metadata.
  const title = lines[0] ?? "FRE Job Description";

  const blocks: Block[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) continue;
    if (COPYRIGHT_RE.test(line)) break;

    const bullet = line.match(BULLET_RE);
    if (bullet) {
      blocks.push({ kind: "bullet", text: bullet[1].trim() });
      continue;
    }

    if (isTopLevelHeading(line)) {
      blocks.push({ kind: "heading1", text: line });
      continue;
    }

    if (isHeadingLike(line)) {
      blocks.push({ kind: "heading2", text: line });
      continue;
    }

    blocks.push({ kind: "paragraph", text: line });
  }

  return { title, blocks };
}
