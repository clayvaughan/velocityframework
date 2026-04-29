/**
 * Prompt template for the Messaging & Proof Checklist AI Polish.
 *
 * Two outputs from one builder so both the "Copy AI Prompt" path (which
 * surfaces the embedded user inputs verbatim, no API call) and the "Generate
 * AI Cleanup" path (which actually calls Claude) use the same source of truth.
 *
 * Quality of this prompt determines the quality of every cleaned output the
 * user sees — keep it crisp, leave no room for the model to ask clarifying
 * questions or invent data.
 */

import type { ChecklistRow } from "@/lib/messaging/storage";
import type {
  CollateralItemKey,
  CollateralStatus,
} from "@/lib/messaging/constants";

export type CollateralEntry = {
  item_key: CollateralItemKey;
  status: CollateralStatus;
  notes?: string | null;
};

export type MessagingPromptInputs = {
  checklist: ChecklistRow;
  collateral: CollateralEntry[];
};

export type MessagingPrompt = {
  /** System prompt for the API call. */
  system: string;
  /** User message — also what we surface as the copyable prompt body. */
  user: string;
  /** Combined `system\n\n---\n\nuser` text — what "Copy AI Prompt" puts on the clipboard so users can paste into their own AI tool. */
  combined: string;
};

const SYSTEM_PROMPT = `You are a messaging strategist trained on Clay Vaughan's Velocity Framework, with deep familiarity with Donald Miller's StoryBrand thinking. Your job is to take a user's draft messaging from the Velocity Messaging & Proof Checklist and return a polished version they can paste into their website, sales emails, and proof assets without further editing.

Your role:
- Fix spelling, grammar, and punctuation.
- Tighten verbose language and cut filler. Default to fewer words, stronger verbs, and concrete nouns.
- Where a section is empty or thin, fill the gap with a reasonable default that fits the user's voice and the rest of their answers — but mark every gap-fill inline with the literal token "(suggested)" so the user can see exactly what they need to verify.
- Preserve the user's voice. If they sound warm, stay warm. If they sound technical, stay technical. Do not push sales-y copy toward corporate or vice versa.
- Do NOT change the meaning of any answer the user provided.
- Do NOT invent customers, numbers, dates, or testimonial quotes that aren't in the source. Use bracketed placeholders like \`[exact metric]\` or \`[customer name]\` when a fact is implied but missing.

Output format — clean GitHub-flavored Markdown, in this exact section order:

1. \`## One-Liner\` — the polished final one-liner on its own line, then a short rationale (1-2 sentences). If the four sub-fields conflict, default to the synthesized "Final" line.
2. \`## Message Map\` — four labeled subsections (Top of funnel, Middle of funnel, Bottom of funnel, Post-purchase), each with the polished line in italics on its own line.
3. \`## Case Study\` — a single paragraph that flows: customer → problem → why-chose-us → what-we-did → result. Then the friend-pitch quote in blockquote format.
4. \`## Testimonial Outreach\` — polished outreach notes; if empty, draft a 60-word outreach email template the user can adapt.
5. \`## CTAs\` — three subsections (Homepage, Product/Service Page, Email), each with "Direct:" and "Transitional:" lines.
6. \`## Collateral Status\` — list each item with a one-line action: if status is \`yes\`, confirm; if \`partial\`, name the next concrete step; if \`no\`, name the smallest first step.
7. \`## What I changed and why\` — three to six plain-language bullets summarizing the meaningful shifts. Write like you're explaining your thinking to a smart friend, not writing clinical edit notes. This is your handoff note, not a transcript.

Hard rules:
- Return only the Markdown. No preamble, no signoff.
- Every "(suggested)" gap-fill must be inline with the polished text, not in a separate list.
- Do not ask clarifying questions. You have one shot.`;

export function buildMessagingChecklistPrompt(
  inputs: MessagingPromptInputs
): MessagingPrompt {
  const user = formatUserMessage(inputs);
  const combined = `${SYSTEM_PROMPT}\n\n---\n\n${user}`;
  return { system: SYSTEM_PROMPT, user, combined };
}

function formatUserMessage(inputs: MessagingPromptInputs): string {
  const { checklist: c, collateral } = inputs;
  const lines: string[] = [];

  lines.push("# Velocity Messaging & Proof Checklist — draft inputs to polish");
  lines.push("");
  lines.push(
    `**Author:** ${c.first_name} (${c.role}) at ${c.company_name}`
  );
  lines.push(
    `**Favorite customer profile:** ${blank(c.favorite_customer)}`
  );
  if (c.fcp_worksheet_url) {
    lines.push(`**FCP worksheet URL:** ${c.fcp_worksheet_url}`);
  }
  lines.push("");

  lines.push("## One-Liner (raw inputs)");
  lines.push(`- **Problem they have:** ${blank(c.oneliner_problem)}`);
  lines.push(`- **What we do for them:** ${blank(c.oneliner_solution)}`);
  lines.push(`- **What success looks like:** ${blank(c.oneliner_success)}`);
  lines.push(
    `- **Final synthesized one-liner:** ${blank(c.oneliner_final)}`
  );
  lines.push("");

  lines.push("## Message Map (raw inputs)");
  lines.push(
    `- **Top of funnel — curious / not aware they have the problem:** ${blank(c.message_top_of_funnel)}`
  );
  lines.push(
    `- **Middle of funnel — aware of problem, evaluating:** ${blank(c.message_middle_of_funnel)}`
  );
  lines.push(
    `- **Bottom of funnel — ready to buy / decision:** ${blank(c.message_bottom_of_funnel)}`
  );
  lines.push(
    `- **Post-purchase — existing customer:** ${blank(c.message_post_purchase)}`
  );
  lines.push("");

  lines.push("## Case Study (raw inputs)");
  lines.push(`- **Customer:** ${blank(c.case_customer)}`);
  lines.push(
    `- **Their problem before working with us:** ${blank(c.case_problem)}`
  );
  lines.push(`- **Why they chose us:** ${blank(c.case_why_chose_you)}`);
  lines.push(`- **What we did:** ${blank(c.case_what_you_did)}`);
  lines.push(`- **Result:** ${blank(c.case_result)}`);
  lines.push(
    `- **Friend-pitch quote (one sentence the customer would use describing us to a friend):** ${blank(c.case_friend_quote)}`
  );
  lines.push("");

  lines.push("## Testimonial Outreach (raw inputs)");
  lines.push(blank(c.testimonial_outreach_notes));
  lines.push("");

  lines.push("## CTAs (raw inputs)");
  lines.push("**Homepage**");
  lines.push(`- Direct: ${blank(c.cta_home_direct)}`);
  lines.push(`- Transitional: ${blank(c.cta_home_transitional)}`);
  lines.push("**Product / service page**");
  lines.push(`- Direct: ${blank(c.cta_product_direct)}`);
  lines.push(`- Transitional: ${blank(c.cta_product_transitional)}`);
  lines.push("**Email**");
  lines.push(`- Direct: ${blank(c.cta_email_direct)}`);
  lines.push(`- Transitional: ${blank(c.cta_email_transitional)}`);
  lines.push("");

  lines.push("## Collateral Status (raw inputs)");
  if (collateral.length === 0) {
    lines.push("(no collateral status recorded)");
  } else {
    for (const item of collateral) {
      const labelText = describeCollateralKey(item.item_key);
      const noteText = item.notes ? ` — ${item.notes}` : "";
      lines.push(`- ${labelText}: **${item.status}**${noteText}`);
    }
  }
  lines.push("");

  lines.push("---");
  lines.push("Polish the inputs above per your role and output format.");

  return lines.join("\n");
}

function blank(value: string | null | undefined): string {
  if (value === null || value === undefined) return "(empty)";
  const trimmed = value.trim();
  return trimmed.length === 0 ? "(empty)" : trimmed;
}

const COLLATERAL_LABELS: Record<CollateralItemKey, string> = {
  oneliner_locked: "One-liner locked + shared with the team",
  homepage_structure:
    "Homepage hits problem + plan in 3 steps + proof + clear CTA",
  case_slices: "Two 1-page case study slices",
  testimonial_video: "One 90-second testimonial video",
  overview_video: "One 2-minute product / service overview video",
  faq_section:
    "FAQ / objections section with 3 real questions answered",
  nurture_sequence:
    "Five-email nurture sequence for not-ready-to-buy leads",
};

function describeCollateralKey(key: CollateralItemKey): string {
  return COLLATERAL_LABELS[key];
}
