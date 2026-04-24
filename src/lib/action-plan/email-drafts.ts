/**
 * mailto: URL builders for the two pre-drafted emails on the Culture Action
 * Plan saved screen — the leadership team email and the accountability
 * partner invite.
 *
 * Copy is Clay-approved final (not placeholder). URL-encoded for
 * cross-client compatibility (Gmail, Outlook, Apple Mail).
 */

import { VIRTUES_BY_ID, type VirtueId } from "./virtues";
import { TOXINS_BY_ID, type ToxinId } from "./toxins";

export type ResolvedFocusArea = {
  toxinId: ToxinId;
  virtueId: VirtueId | null;
  sevenDayAction: string;
  weeklyRhythmLabel: string;
  counterMoveText: string;
};

export type EmailContext = {
  firstName: string;
  reassessmentDays: 30 | 60 | 90;
  reassessmentDateISO: string;
  accountabilityPartnerFirstName?: string | null;
  planUrl: string;
  focusAreas: ResolvedFocusArea[];
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Leadership team email
// ---------------------------------------------------------------------------

function buildLeadershipBody(ctx: EmailContext): string {
  const focusLines = ctx.focusAreas
    .map((f, i) => {
      const toxinTitle = TOXINS_BY_ID[f.toxinId].title.toLowerCase();
      const virtue = f.virtueId ? VIRTUES_BY_ID[f.virtueId].title.toLowerCase() : null;
      return virtue
        ? `${i + 1}. ${titleCase(toxinTitle)} — addressing ${toxinTitle}, building ${virtue}`
        : `${i + 1}. ${titleCase(toxinTitle)} — addressing ${toxinTitle}`;
    })
    .join("\n");
  const actionLines = ctx.focusAreas
    .map((f) => `• ${f.sevenDayAction}`)
    .join("\n");
  const rhythmLines = ctx.focusAreas
    .map((f) => `• ${f.weeklyRhythmLabel}`)
    .join("\n");

  return (
    `Team,\n\n` +
    `We recently looked hard at our culture. Here's what we're focusing on for the next ${ctx.reassessmentDays} days.\n\n` +
    `Focus areas:\n${focusLines}\n\n` +
    `What we're doing this week:\n${actionLines}\n\n` +
    `Our weekly rhythm going forward:\n${rhythmLines}\n\n` +
    `I'll be reviewing progress weekly, and we'll do a formal reassessment on ${formatDate(
      ctx.reassessmentDateISO
    )}.\n\n` +
    `I want your input on this. What's missing? What's unrealistic? What should we add?\n\n` +
    `Read the full plan: ${ctx.planUrl}\n\n` +
    `${ctx.firstName}`
  );
}

export function leadershipEmailContent(ctx: EmailContext): {
  subject: string;
  body: string;
} {
  return {
    subject: `Our Culture Action Plan — Next ${ctx.reassessmentDays} Days`,
    body: buildLeadershipBody(ctx),
  };
}

// ---------------------------------------------------------------------------
// Accountability partner invite
// ---------------------------------------------------------------------------

function buildPartnerBody(ctx: EmailContext): string {
  const partnerName = ctx.accountabilityPartnerFirstName ?? "";
  return (
    (partnerName ? `${partnerName},\n\n` : "") +
    `I just built a Culture Action Plan for my team over the next ${ctx.reassessmentDays} days. I need someone outside my organization to hold me accountable — and I thought of you.\n\n` +
    `Would you be willing to:\n` +
    `• Review my plan\n` +
    `• Check in with me weekly for the next ${ctx.reassessmentDays} days (15–30 minutes, phone or video)\n` +
    `• Tell me hard truths when I'm not doing what I said I'd do\n\n` +
    `Our first check-in would be on ${formatDate(
      new Date(Date.now() + 7 * 864e5).toISOString()
    )}. If you're in, let me know and I'll send you a calendar invite.\n\n` +
    `The plan is here: ${ctx.planUrl}\n\n` +
    `Thanks for considering,\n` +
    `${ctx.firstName}`
  );
}

export function partnerEmailContent(ctx: EmailContext): {
  subject: string;
  body: string;
} {
  return {
    subject: "Will you hold me accountable to this?",
    body: buildPartnerBody(ctx),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function titleCase(s: string): string {
  return s.replace(/\b([a-z])/g, (_, c: string) => c.toUpperCase());
}
