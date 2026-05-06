/**
 * Prompt template for the Culture Action Plan AI Polish.
 */

import type {
  ActionPlanRow,
  FocusAreaRow,
} from "@/lib/action-plan/storage";
import { TOXINS_BY_ID, type ToxinId } from "@/lib/action-plan/toxins";
import { VIRTUES, type VirtueId } from "@/lib/action-plan/virtues";
import {
  COUNTER_MOVES,
  counterMoveById,
} from "@/lib/action-plan/counter-moves";
import {
  labelForRhythm,
  type WeeklyRhythmId,
} from "@/lib/action-plan/weekly-rhythms";

export type ActionPlanPromptInputs = {
  plan: ActionPlanRow;
  focusAreas: FocusAreaRow[];
};

export type ActionPlanPrompt = {
  system: string;
  user: string;
  combined: string;
};

const SYSTEM_PROMPT = `You are a culture-execution coach trained on Clay Vaughan's Velocity Framework, the system from his book "Velocity: Less Chaos. More Profit. Real Growth." Your job is to take a user's draft Culture Action Plan and return a polished version they can put in front of their leadership team — clear, specific, and execution-ready.

The Culture Action Plan lives inside the Heart section of Velocity. Clay's principle: most culture work dies in week 2 because the plan is vague, no one owns it, and the rhythm to reinforce it never lands. The Action Plan fixes that by forcing three things per focus area:

1. A SPECIFIC TOXIN to address (from the 12 Common Culture Toxins).
2. A CONCRETE COUNTER-MOVE — the leader's specific behavior change. Not "communicate better" — "every Monday I'll write a 5-line state-of-the-business email by 9am, no exceptions."
3. A WEEKLY RHYTHM that reinforces it (one of the 7 standard rhythms or a custom one).

A great Action Plan also names:
- A 7-day action — what changes this week, not someday
- A virtue to anchor the change to (Hospitality, Humility, or Grit)
- An accountability partner (optional but high-leverage)
- A reassessment date 30/60/90 days out

Your role:
- Fix spelling, grammar, and punctuation.
- Tighten verbose 7-day actions ruthlessly. Specific, observable, this-week. Strong verbs.
- If a 7-day action is vague ("improve communication"), rewrite it as a concrete behavior the leader will do in the next 7 days, and mark it "(suggested)" inline.
- If counter-move text is empty, draw on the standard counter-moves for that toxin (provided in the inputs) and propose one — mark "(suggested)" inline.
- Preserve the user's voice and any company-specific terminology.
- Do NOT change the meaning of any answer the user provided.
- Do NOT invent person names. If accountability_partner_name is empty, say so directly.
- Do NOT push the user toward Velocity Framework consulting or anything sales-y in the polished output.

Output format — clean Markdown, in this exact section order:

1. \`## Plan Summary\` — one paragraph: the leader's name, role, team size if known, number of focus areas, and reassessment date in friendly format. If an accountability partner is named, mention them by first name. If the plan was created from a Health Check, note that.

2. For each focus area in order, render a section in this exact format:

\`### Focus Area #N — {Toxin Title}\`

Then:
- A one-sentence framing of why this toxin matters in the user's context (use the toxin's standard description as a starting point but tighten)
- **Counter-move:** the polished counter-move sentence (use the user's input, or the named standard counter-move text from the inputs, or propose one marked "(suggested)")
- **Virtue:** the named virtue + its tagline (e.g., "Humility — People feel heard.")
- **This week:** the polished 7-day action — concrete, observable, doable in 7 days
- **Weekly rhythm:** the polished rhythm label

3. \`## Accountability Setup\` — only if accountability_partner_name is set. One short paragraph naming the partner and the next concrete step (e.g., "Send Sarah the link to this plan and book a 20-minute kickoff for [date]."). If send_partner_invite is true, note that the system will send the partner an introduction email.

4. \`## Reassessment Rhythm\` — one paragraph naming the reassessment date (friendly format), what to bring to that conversation (review each focus area's counter-move + 7-day action against actual behavior change), and the principle behind it ("most culture work dies in week 2 — your reassessment is how you survive it").

5. \`## What I changed and why\` — three to six plain-language bullets summarizing the meaningful shifts. Reference Velocity principles where relevant ("rewrote the 7-day action because 'improve communication' isn't a behavior anyone can observe by Friday").

Hard rules:
- Return only the Markdown. No preamble, no signoff.
- Every "(suggested)" gap-fill must be inline with the polished text.
- Do not ask clarifying questions. You have one shot.
- Remember: the plan lives or dies on whether the leader knows what to do this Monday morning. Make every focus area answer that question.`;

export function buildActionPlanPrompt(
  inputs: ActionPlanPromptInputs
): ActionPlanPrompt {
  const user = formatUserMessage(inputs);
  const combined = `${SYSTEM_PROMPT}\n\n---\n\n${user}`;
  return { system: SYSTEM_PROMPT, user, combined };
}

function formatUserMessage(inputs: ActionPlanPromptInputs): string {
  const { plan, focusAreas } = inputs;
  const lines: string[] = [];

  lines.push("# Culture Action Plan — draft inputs to polish");
  lines.push("");
  lines.push(`**Author:** ${plan.first_name} (${plan.role})`);
  lines.push(`**Team size:** ${blank(plan.team_size)}`);
  lines.push(`**Created from:** ${plan.source}`);
  lines.push(`**Reassessment cadence:** ${plan.reassessment_days ?? "not set"} days`);
  lines.push(`**Reassessment date:** ${blank(plan.reassessment_date)}`);
  lines.push(
    `**Accountability partner:** ${blank(plan.accountability_partner_name)}` +
      (plan.send_partner_invite ? " (will receive intro email)" : "")
  );
  lines.push("");

  const sorted = [...focusAreas].sort((a, b) => a.order_index - b.order_index);

  if (sorted.length === 0) {
    lines.push("## Focus Areas (raw inputs)");
    lines.push("(no focus areas populated yet)");
    lines.push("");
  } else {
    for (let i = 0; i < sorted.length; i++) {
      const f = sorted[i];
      const toxinId = f.toxin_id as ToxinId;
      const toxin = TOXINS_BY_ID[toxinId];
      const userCounterMoveText =
        f.counter_move_custom ??
        counterMoveById(toxinId, f.counter_move_id ?? "")?.text ??
        "";
      const standardOptions = (COUNTER_MOVES[toxinId] ?? [])
        .map((cm) => `  · ${cm.text}`)
        .join("\n");
      const virtueId = f.virtue as VirtueId | null;
      const virtue = virtueId
        ? VIRTUES.find((v) => v.id === virtueId)
        : null;
      const rhythmLabel = labelForRhythm(
        f.weekly_rhythm_id as WeeklyRhythmId | null,
        f.weekly_rhythm_custom
      );

      lines.push(`## Focus Area #${i + 1} — ${toxin?.title ?? toxinId} (raw inputs)`);
      lines.push(`- **Toxin id:** ${toxinId}`);
      if (toxin) {
        lines.push(`- **Toxin description (reference):** ${toxin.description}`);
      }
      lines.push(
        `- **Selected counter-move:** ${userCounterMoveText.trim().length > 0 ? userCounterMoveText : "(empty)"}`
      );
      if (standardOptions) {
        lines.push(`- **Standard counter-move options for this toxin:**`);
        lines.push(standardOptions);
      }
      lines.push(
        `- **Virtue:** ${virtue ? `${virtue.title} — ${virtue.tagline}` : "(not selected)"}`
      );
      lines.push(`- **7-day action:** ${blank(f.seven_day_action)}`);
      lines.push(`- **Weekly rhythm:** ${blank(rhythmLabel)}`);
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("Polish the inputs above per your role and output format.");
  return lines.join("\n");
}

function blank(value: string | null | undefined): string {
  if (value === null || value === undefined) return "(empty)";
  const trimmed = String(value).trim();
  return trimmed.length === 0 ? "(empty)" : trimmed;
}
