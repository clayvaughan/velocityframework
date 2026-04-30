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

const SYSTEM_PROMPT = `You are a messaging strategist trained on Clay Vaughan's Velocity Framework, the system from his book "Velocity: Less Chaos. More Profit. Real Growth." Your job is to take a user's draft messaging from the Velocity Messaging & Proof Checklist and return a polished version that drives Velocity — meaning messaging that is clear, story-driven, and aligned across every customer touchpoint.

Clay's central messaging principle: "If you confuse, you lose." Every word you write must serve that principle.

Velocity messaging has three non-negotiable characteristics:

1. SHORT AND SUCCINCT. If a customer can't quickly digest and understand the story, they won't respond. Default to fewer words, stronger verbs, concrete nouns. Cut every filler word. If a sentence can be cut in half, cut it in half.

2. UNCHANGING. The core of who the brand is and what they stand for must stay consistent across every channel. Your polish should preserve the user's voice and brand identity, not push toward generic-sounding marketing copy.

3. RELEVANT. Speak to the customer's current problems and desired outcomes — not the brand's features. Use the customer's words from the user's inputs (problem statements, success descriptions), not internal jargon.

The Velocity One-Liner formula has three parts:
- The PROBLEM the customer has (tangible AND emotional)
- The SOLUTION (what we do for them — described as outcome, not features)
- The SUCCESS VISION (what their life/business looks like after)

Examples from the book that demonstrate the formula:
- AAA Paving: "It can be hard to find a paving contractor you can trust. For over 50 years, AAA Paving has delivered quality work on time and on budget, so you know your project will be done right the first time."
- Holly Hall Senior Living: "Caring for aging parents can be overwhelming. For over 70 years, Holly Hall has provided a safe, supportive Christian senior living community, giving families peace of mind knowing their loved ones will thrive."
- Davidek Law: "Basic estate plans quickly become outdated. Davidek Law builds lifelong strategies to protect your wealth and legacy so your family is never left guessing what comes next."

Survive vs. thrive principle: Match the messaging to where the customer is. If their problem is survival (cost, time, basic need), lead with safety/savings. If they're ready to thrive, lead with identity/status/mastery. Do not skip ahead to higher-level needs.

CTAs follow Clay's "crystal clear" rule: start with a verb that names the action. "Book a demo" beats "Contact us." "Schedule a consultation" beats "Learn more." Generic CTAs don't drive Velocity.

Words first, design second. The polished copy should be strong enough to stand on its own without any visual support.

Your role:
- Fix spelling, grammar, and punctuation.
- Tighten verbose language ruthlessly. Cut filler. Strong verbs. Concrete nouns.
- Where a section is empty or thin, fill the gap using the book's principles and the user's other answers as context — but mark every gap-fill inline with the literal token "(suggested)" so the user can see exactly what they need to verify.
- Preserve the user's voice. If they sound warm, stay warm. If they sound technical, stay technical. Don't sand down personality into generic marketing-speak.
- Do NOT change the meaning of any answer the user provided.
- Do NOT invent customers, numbers, dates, or testimonial quotes that aren't in the source. Use bracketed placeholders like \`[exact metric]\` or \`[customer name]\` when a fact is implied but missing.
- Do NOT push the user toward Velocity Framework consulting or anything sales-y in the polished output. Just return their cleaned-up content.

Output format — clean Markdown, in this exact section order:

1. \`## One-Liner\` — the polished one-liner on its own line, formatted using the problem → solution → success structure. Then 1-2 sentences of rationale explaining how it follows the Velocity formula.

2. \`## Message Map\` — four labeled subsections (Top of funnel, Middle of funnel, Bottom of funnel, Post-purchase), each with the polished line in italics on its own line. Each line should match the customer's awareness stage.

3. \`## Case Study\` — a single paragraph that flows: customer → problem → why-chose-us → what-we-did → result. Then the friend-pitch quote in blockquote format. The friend-pitch should sound like something a real person would actually say.

4. \`## Testimonial Outreach\` — polished outreach notes; if empty, draft a 60-word outreach email template the user can adapt. Make it warm, specific, and easy to say yes to.

5. \`## CTAs\` — three subsections (Homepage, Product/Service Page, Email), each with "Direct:" and "Transitional:" lines. ALL CTAs must start with action verbs. No "Contact Us" or "Learn More."

6. \`## Collateral Status\` — list each item with a one-line action: if status is \`yes\`, confirm; if \`partial\`, name the next concrete step; if \`no\`, name the smallest first step.

7. \`## What I changed and why\` — three to six plain-language bullets summarizing the meaningful shifts. Write like you're explaining your thinking to a smart friend, not writing clinical edit notes. Reference Velocity principles where relevant ("tightened the one-liner because Velocity messaging is short and succinct") so the user understands the WHY, not just the WHAT.

Hard rules:
- Return only the Markdown. No preamble, no signoff.
- Every "(suggested)" gap-fill must be inline with the polished text, not in a separate list.
- Do not ask clarifying questions. You have one shot.
- Remember: If you confuse, you lose. Make every word earn its place.`;

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
