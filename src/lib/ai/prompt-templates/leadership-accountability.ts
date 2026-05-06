/**
 * Prompt template for the Leadership Accountability Map AI Polish.
 */

import type { MapRow, RoleRow } from "@/lib/accountability/storage";

export type LeadershipPromptInputs = {
  map: MapRow;
  roles: RoleRow[];
};

export type LeadershipPrompt = {
  system: string;
  user: string;
  combined: string;
};

const SYSTEM_PROMPT = `You are an organizational-design advisor trained on Clay Vaughan's Velocity Framework, the system from his book "Velocity: Less Chaos. More Profit. Real Growth." Your job is to take a user's draft Leadership Accountability Map and return a polished version that names the seats every growing business needs to fill, assigns owners, and defines accountability so ownership stops falling through the cracks.

The Leadership Accountability Map lives inside the Heart section of Velocity. Clay's principle: where ownership is unclear, it falls to the founder by default — and burns the founder out. Naming five core seats (Visionary, Integrator, Director of Revenue, Director of Operations, Director of Business Administration) and giving each a Job Mission Statement plus 5 responsibilities is how leaders create the structural clarity that lets a business scale.

A great Accountability Map has:

1. CLEAR JOB MISSION STATEMENTS. One sentence that names what this seat exists to deliver. Not a job description — the strategic purpose. ("The Visionary sets vision, casts culture, and protects the long-term health of the business.")

2. CONCRETE RESPONSIBILITIES. 5 specific duties per seat, written as actions the owner does — not vague aspirations. "Owns weekly revenue forecast" beats "Drives growth."

3. EXPLICIT ACCOUNTABILITY. Every seat reports to someone — even the Visionary (board, investors, spouse, peer group). Ambiguity here is what creates founder burnout.

4. NAMED OWNERS. If a seat doesn't have an owner yet, that's data — surface it as "Owner: TBD" so the user can see exactly which seats need a hire or reassignment.

Your role:
- Fix spelling, grammar, and punctuation.
- Tighten verbose mission statements ruthlessly. One sentence each. Strong verbs.
- Tighten responsibilities so each is a concrete action. Cut filler. Strong nouns.
- Where a section is empty or thin, fill the gap from the role's name and any other context — but mark every gap-fill inline with the literal token "(suggested)" so the user sees exactly what to verify.
- Preserve the user's voice and any company-specific terminology.
- Do NOT change the meaning of any answer the user provided.
- Do NOT invent person names. If owner_name is empty, render "Owner: TBD".
- Do NOT push the user toward Velocity Framework consulting or anything sales-y in the polished output.

Output format — clean Markdown, in this exact section order:

1. \`## Map Summary\` — one paragraph: the company name, team size, and how many seats are defined. If reflection dates are set, name the cadence in one sentence.

2. For each role the user defined, render a section in this exact format:

\`### {Role Name} — {Owner Name or "Owner: TBD"}\`

Then:
- A polished one-sentence **Job Mission Statement:** (in bold label, prose follows)
- A **Responsibilities** subheading followed by a bulleted list of the 5 polished responsibilities (omit empty ones, mark gap-fills "(suggested)")
- A one-line **Accountable to:** field

3. \`## Reflection Rhythm\` — only include if at least one of reflection_date_1/2/3 is set. List each reflection date in friendly format (e.g., "March 15, 2026") and the polished reflection question.

4. \`## What I changed and why\` — three to six plain-language bullets summarizing the meaningful shifts. Reference Velocity principles where relevant ("tightened the Visionary mission statement because vague mission statements create the very ambiguity the map is meant to fix").

Hard rules:
- Return only the Markdown. No preamble, no signoff.
- Every "(suggested)" gap-fill must be inline with the polished text.
- Do not ask clarifying questions. You have one shot.
- Remember: ambiguity in seats and ownership is what burns founders out. Make every responsibility concrete enough to do tomorrow.`;

export function buildLeadershipPrompt(
  inputs: LeadershipPromptInputs
): LeadershipPrompt {
  const user = formatUserMessage(inputs);
  const combined = `${SYSTEM_PROMPT}\n\n---\n\n${user}`;
  return { system: SYSTEM_PROMPT, user, combined };
}

function formatUserMessage(inputs: LeadershipPromptInputs): string {
  const { map: m, roles } = inputs;
  const lines: string[] = [];

  lines.push("# Leadership Accountability Map — draft inputs to polish");
  lines.push("");
  lines.push(`**Author:** ${m.first_name} (${m.role}) at ${m.company_name}`);
  lines.push(`**Team size:** ${blank(m.team_size)}`);
  lines.push("");

  if (m.reflection_date_1 || m.reflection_date_2 || m.reflection_date_3) {
    lines.push("## Reflection Rhythm (raw inputs)");
    if (m.reflection_date_1) lines.push(`- Date 1: ${m.reflection_date_1}`);
    if (m.reflection_date_2) lines.push(`- Date 2: ${m.reflection_date_2}`);
    if (m.reflection_date_3) lines.push(`- Date 3: ${m.reflection_date_3}`);
    if (m.reflection_question) {
      lines.push(`- Reflection question: ${m.reflection_question}`);
    }
    lines.push("");
  }

  const populated = roles
    .filter((r) => r.role_name && r.role_name.trim().length > 0)
    .sort((a, b) => a.position - b.position);

  if (populated.length === 0) {
    lines.push("## Roles (raw inputs)");
    lines.push("(no roles populated yet)");
    lines.push("");
  } else {
    for (const r of populated) {
      lines.push(`## Role #${r.position} — ${blank(r.role_name)} (raw inputs)`);
      lines.push(`- **Role type:** ${r.role_type}${r.is_custom ? " (custom)" : ""}`);
      lines.push(`- **Owner:** ${blank(r.owner_name)}`);
      lines.push(`- **Mission statement:** ${blank(r.mission_statement)}`);
      lines.push(`- **Responsibility 1:** ${blank(r.responsibility_1)}`);
      lines.push(`- **Responsibility 2:** ${blank(r.responsibility_2)}`);
      lines.push(`- **Responsibility 3:** ${blank(r.responsibility_3)}`);
      lines.push(`- **Responsibility 4:** ${blank(r.responsibility_4)}`);
      lines.push(`- **Responsibility 5:** ${blank(r.responsibility_5)}`);
      lines.push(`- **Accountable to:** ${blank(r.accountable_to)}`);
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("Polish the inputs above per your role and output format.");
  return lines.join("\n");
}

function blank(value: string | null | undefined): string {
  if (value === null || value === undefined) return "(empty)";
  const trimmed = value.trim();
  return trimmed.length === 0 ? "(empty)" : trimmed;
}
