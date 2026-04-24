/**
 * Parse the Bellamere Trust-Building Script plain-text export.
 *
 * Google Docs' plain-text export preserves labels we can rely on
 * (`Objective:`, `Script:`, `Coaching Tip:`) and emits numbered lists as
 * literal `N.` prefixes and bullets as `*`. Every line is padded with
 * increasingly deep indent as Google tries to render nested lists in plain
 * text; we strip all leading whitespace per line and classify the trimmed
 * line by pattern.
 *
 * The output is a structured document — 10 sections + best-practices — that
 * the PDF renderer walks to lay out one section per page.
 */

export type Block =
  | { kind: "objective"; text: string }
  | { kind: "coaching"; label: string; text: string }
  | { kind: "script"; text: string }
  | { kind: "step"; number: string; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "paragraph"; text: string };

export type Section = {
  number: string;
  title: string;
  blocks: Block[];
};

export type ParsedDoc = {
  sections: Section[];
  bestPractices: Block[];
};

const SECTION_HEADING_RE = /^(\d{1,2})\.\s+([A-Z].{3,})$/;
const STEP_RE = /^(\d{1,2})\.\s+(.+)$/;
const BULLET_RE = /^\*\s+(.*)$/;
const OBJECTIVE_RE = /^Objective:\s*(.*)$/;
const COACHING_RE = /^(Coaching(?: Tip)?(?: #\d+)?)\s*:\s*(.*)$/;
const SCRIPT_LABEL_RE = /^Script:\s*(.*)$/;
const BEST_PRACTICES_RE = /^Best Practices(?:\s+&\s+Reminders)?$/i;
const QUOTED_RE = /^[“"'].+[”"']\.?$/;

function stripBom(s: string): string {
  return s.replace(/^﻿/, "");
}

function cleanLine(line: string): string {
  return line
    .replace(/^\s+/, "")
    .replace(/\s+$/, "")
    // Smart-quote preservation — leave as-is; the PDF font renders them.
    .replace(/ /g, " ");
}

type RawLine = { text: string; raw: string };

export function parseTrustBuildingScript(content: string): ParsedDoc {
  const lines: RawLine[] = stripBom(content)
    .split(/\r?\n/)
    .map((raw) => ({ raw, text: cleanLine(raw) }));

  // ---------- Step 1: locate the 10 section boundaries ----------
  // Section boundaries are lines that:
  //   (a) are at column 0 in the raw export (no leading whitespace) — this
  //       rules out sub-steps that Google indents at depth,
  //   (b) match the heading pattern AND whose captured number increases
  //       monotonically from 1.
  // Without the column-0 check, a deeply-indented sub-step like
  // "2. Set Up Reception Area" inside section 1 gets mis-matched as the
  // section 2 boundary because it appears before "2. Arrival & Welcome".
  const boundaries: { lineIndex: number; number: string; title: string }[] = [];
  let expectedNextSection = 1;
  let bestPracticesIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].text;
    const raw = lines[i].raw;
    if (BEST_PRACTICES_RE.test(t) && bestPracticesIndex === -1) {
      bestPracticesIndex = i;
      continue;
    }
    if (/^\s/.test(raw)) continue;
    const m = t.match(SECTION_HEADING_RE);
    if (!m) continue;
    const n = parseInt(m[1], 10);
    if (n !== expectedNextSection) continue;
    boundaries.push({ lineIndex: i, number: m[1], title: m[2].trim() });
    expectedNextSection += 1;
    if (expectedNextSection > 50) break; // safety
  }

  // ---------- Step 2: slice each section's body ----------
  const sections: Section[] = boundaries.map((b, idx) => {
    const nextStart = boundaries[idx + 1]?.lineIndex ?? bestPracticesIndex ?? lines.length;
    const bodyLines = lines.slice(b.lineIndex + 1, nextStart);
    return {
      number: b.number,
      title: b.title,
      blocks: parseBlocks(bodyLines),
    };
  });

  // ---------- Step 3: best-practices block (everything between BP heading
  // and the next top-level marker — typically EOF or "© Clayton…") ----------
  let bestPractices: Block[] = [];
  if (bestPracticesIndex !== -1) {
    // End at the copyright line if present.
    let end = lines.length;
    for (let i = bestPracticesIndex + 1; i < lines.length; i++) {
      if (/^©\s*Clayton/.test(lines[i].text)) {
        end = i;
        break;
      }
    }
    const bpLines = lines.slice(bestPracticesIndex + 1, end);
    bestPractices = parseBlocks(bpLines);
  }

  return { sections, bestPractices };
}

function parseBlocks(lines: RawLine[]): Block[] {
  const blocks: Block[] = [];
  let paragraphBuf: string[] = [];

  function flushParagraph() {
    if (paragraphBuf.length === 0) return;
    const joined = paragraphBuf.join(" ").replace(/\s+/g, " ").trim();
    if (joined.length > 0) {
      blocks.push({ kind: "paragraph", text: joined });
    }
    paragraphBuf = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const text = lines[i].text;
    if (text.length === 0) {
      flushParagraph();
      continue;
    }

    // Coaching tip — highest priority, since "Coaching Tip #1:" also matches
    // some other regexes.
    const coaching = text.match(COACHING_RE);
    if (coaching) {
      flushParagraph();
      const label = coaching[1].replace(/Coaching(?! Tip)/, "Coaching Tip");
      blocks.push({ kind: "coaching", label, text: coaching[2].trim() });
      continue;
    }

    // Objective line.
    const obj = text.match(OBJECTIVE_RE);
    if (obj) {
      flushParagraph();
      blocks.push({ kind: "objective", text: obj[1].trim() });
      continue;
    }

    // "Script:" standalone label — consume following bullet-quote as the
    // script content if present.
    const scriptLabel = text.match(SCRIPT_LABEL_RE);
    if (scriptLabel) {
      flushParagraph();
      let scriptText = scriptLabel[1].trim();
      if (!scriptText) {
        // Look ahead for the quote line.
        const next = i + 1 < lines.length ? lines[i + 1].text : "";
        const bulletMatch = next.match(BULLET_RE);
        const candidate = bulletMatch ? bulletMatch[1] : next;
        if (candidate && QUOTED_RE.test(candidate)) {
          scriptText = candidate.trim();
          i += 1;
        }
      }
      if (scriptText) blocks.push({ kind: "script", text: scriptText });
      continue;
    }

    // Bulleted "* Script:" label
    const bullet = text.match(BULLET_RE);
    if (bullet) {
      const inner = bullet[1];
      const innerScript = inner.match(SCRIPT_LABEL_RE);
      if (innerScript) {
        flushParagraph();
        let scriptText = innerScript[1].trim();
        if (!scriptText) {
          const next = i + 1 < lines.length ? lines[i + 1].text : "";
          const nextBullet = next.match(BULLET_RE);
          const candidate = nextBullet ? nextBullet[1] : next;
          if (candidate && QUOTED_RE.test(candidate)) {
            scriptText = candidate.trim();
            i += 1;
          }
        }
        if (scriptText) blocks.push({ kind: "script", text: scriptText });
        continue;
      }
      // Plain bullet — if the inner text is a quoted line directly below a
      // previous "Script:" label, we already consumed it. Otherwise treat as
      // a bullet.
      if (QUOTED_RE.test(inner)) {
        // Orphan quote bullet; likely a script example without a label.
        flushParagraph();
        blocks.push({ kind: "script", text: inner.trim() });
        continue;
      }
      flushParagraph();
      blocks.push({ kind: "bullet", text: inner.trim() });
      continue;
    }

    // Numbered step.
    const step = text.match(STEP_RE);
    if (step) {
      flushParagraph();
      blocks.push({ kind: "step", number: step[1], text: step[2].trim() });
      continue;
    }

    // Otherwise: free-form paragraph; accumulate and flush on blank line.
    paragraphBuf.push(text);
  }
  flushParagraph();
  return blocks;
}
