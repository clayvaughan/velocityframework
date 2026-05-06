/**
 * Prompt template for the Unified Revenue Team Accountability Map AI Polish.
 */

import type {
  RevenueMapRow,
  RevenueRoleRow,
} from "@/lib/revenue-team/storage";

export type RevenuePromptInputs = {
  map: RevenueMapRow;
  roles: RevenueRoleRow[];
};

export type RevenuePrompt = {
  system: string;
  user: string;
  combined: string;
};

const SYSTEM_PROMPT = `You are a revenue-operations advisor trained on Clay Vaughan's Velocity Framework, the system from his book "Velocity: Less Chaos. More Profit. Real Growth." Your job is to take a user's draft Unified Revenue Team Accountability Map and return a polished version that aligns marketing, sales, RevOps, and retention under one Director of Revenue and a clear weekly cadence.

The Unified Revenue Team Accountability Map lives inside the Heading section of Velocity (Chapter 7 — Director of Revenue / FRE structure). Clay's principle: revenue stops being unpredictable when one leader owns the entire revenue function across marketing → sales → retention, with a unified team meeting weekly to look at one set of numbers. Most companies fail because each function (marketing, sales, RevOps, customer success) runs on different metrics, accountable to different leaders, and never lines up.

A great Revenue Team Map has:

1. THE DIRECTOR OF REVENUE (DOR) SEAT NAMED. Whether internal hire, fractional FRE, or "TBD — we're hiring," the DOR has explicit ownership of the unified revenue forecast. If the user has has_director_of_revenue = "no" or "planning," surface that gap honestly in the polish.

2. CONCRETE METRICS PER SEAT. Each role owns 3 specific, measurable numbers — not vague KPIs. "Monthly qualified leads ≥ 150" beats "Drive lead growth."

3. CONCRETE RESPONSIBILITIES. 5 specific duties per seat, written as actions the owner does — not vague aspirations.

4. UNIFIED WEEKLY MEETING. The meeting is the unification mechanism. Day, time, duration, agenda — all should be specific. If empty, surface as "(suggested: Monday 9am, 60 min, agenda below)" with a short default agenda.

5. EXPLICIT ACCOUNTABILITY. Every seat reports to someone (typically the DOR for the revenue team).

Your role:
- Fix spelling, grammar, and punctuation.
- Tighten verbose mission statements ruthlessly. One sentence each.
- Tighten metrics so each is concrete and measurable. Numbers are good. Strong nouns.
- Tighten responsibilities so each is a concrete action. Cut filler.
- Where a section is empty or thin, fill the gap from role/team context — but mark every gap-fill inline with the literal token "(suggested)" so the user sees exactly what to verify.
- Preserve the user's voice and any company-specific terminology.
- Do NOT change the meaning of any answer the user provided.
- Do NOT invent person names. If owner_name is empty, render "Owner: TBD".
- Do NOT push the user toward Velocity Framework consulting or anything sales-y in the polished output.

Output format — clean Markdown, in this exact section order:

1. \`## Map Summary\` — one paragraph: the company name, team size, annual revenue band, and DOR status. Name the unified weekly meeting cadence in one sentence if any of the meeting fields are populated.

2. \`## Weekly Meeting\` — only if at least one weekly_meeting field is populated. Render:
   - **When:** day + time + duration (compose from the populated fields)
   - **Agenda:** the polished agenda as a paragraph or bulleted list mirroring the input shape

3. For each role the user defined, render a section in this exact format:

\`### {Role Name} — {Owner Name or "Owner: TBD"}\`

Then:
- A polished one-sentence **Job Mission Statement:**
- A **Metrics** subheading followed by a bulleted list of the 3 polished metrics (omit empty)
- A **Responsibilities** subheading followed by a bulleted list of the 5 polished responsibilities (omit empty, mark gap-fills "(suggested)")
- A one-line **Accountable to:** field

4. \`## Reflection Rhythm\` — only include if at least one of reflection_date_1/2/3 is set. List each in friendly format and the polished reflection question.

5. \`## What I changed and why\` — three to six plain-language bullets summarizing the meaningful shifts. Reference Velocity principles where relevant ("renamed metrics from vague KPIs to specific numbers because unmeasured goals don't drive accountability").

Hard rules:
- Return only the Markdown. No preamble, no signoff.
- Every "(suggested)" gap-fill must be inline with the polished text.
- Do not ask clarifying questions. You have one shot.
- Remember: the unified weekly meeting is the unification mechanism. If it's not specific and on the calendar, the team will revert to silos.`;

export function buildRevenueTeamPrompt(
  inputs: RevenuePromptInputs
): RevenuePrompt {
  const user = formatUserMessage(inputs);
  const combined = `${SYSTEM_PROMPT}\n\n---\n\n${user}`;
  return { system: SYSTEM_PROMPT, user, combined };
}

function formatUserMessage(inputs: RevenuePromptInputs): string {
  const { map: m, roles } = inputs;
  const lines: string[] = [];

  lines.push("# Unified Revenue Team Accountability Map — draft inputs to polish");
  lines.push("");
  lines.push(`**Author:** ${m.first_name} (${m.role}) at ${m.company_name}`);
  lines.push(`**Team size:** ${blank(m.team_size)}`);
  lines.push(`**Annual revenue:** ${blank(m.annual_revenue)}`);
  lines.push(`**Director of Revenue status:** ${m.has_director_of_revenue}`);
  lines.push("");

  if (
    m.weekly_meeting_day ||
    m.weekly_meeting_time ||
    m.weekly_meeting_duration ||
    m.weekly_meeting_agenda
  ) {
    lines.push("## Weekly Meeting (raw inputs)");
    lines.push(`- **Day:** ${blank(m.weekly_meeting_day)}`);
    lines.push(`- **Time:** ${blank(m.weekly_meeting_time)}`);
    lines.push(`- **Duration:** ${blank(m.weekly_meeting_duration)}`);
    lines.push(`- **Agenda:** ${blank(m.weekly_meeting_agenda)}`);
    lines.push("");
  }

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
      lines.push(`- **Metric 1:** ${blank(r.metric_1)}`);
      lines.push(`- **Metric 2:** ${blank(r.metric_2)}`);
      lines.push(`- **Metric 3:** ${blank(r.metric_3)}`);
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
