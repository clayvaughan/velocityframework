/**
 * mailto: builder + 30-day "messaging review" calendar event for the
 * Messaging & Proof Checklist saved page.
 */

import { googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";

export type LeadershipEmailContext = {
  firstName: string;
  companyName: string;
  planUrl: string;
  onelinerFinal: string | null;
};

function buildLeadershipBody(ctx: LeadershipEmailContext): string {
  const onelinerBlock = ctx.onelinerFinal
    ? `\n\nLocked one-liner:\n"${ctx.onelinerFinal}"\n\n`
    : "\n\n";
  return (
    `Team,\n\n` +
    `I just finished the Messaging & Proof Checklist for ${ctx.companyName}. Before we ship any of this into the site, the sales deck, or the nurture sequence, I want your eyes on it.${onelinerBlock}` +
    `Read the full checklist here: ${ctx.planUrl}\n\n` +
    `Three quick asks:\n` +
    `• Does the one-liner actually sound like us?\n` +
    `• On the collateral audit — did I score anything too hard or too easy?\n` +
    `• Any testimonial story I'm missing that belongs in here?\n\n` +
    `I'll roll up feedback and we'll lock it at our next marketing sync.\n\n` +
    `${ctx.firstName}`
  );
}

export function leadershipEmailContent(ctx: LeadershipEmailContext): {
  subject: string;
  body: string;
} {
  return {
    subject: "Our Messaging & Proof Checklist — For review",
    body: buildLeadershipBody(ctx),
  };
}

export function messagingReviewEvent(
  firstName: string,
  companyName: string,
  planUrl: string
): CalendarEvent {
  const start = new Date();
  start.setDate(start.getDate() + 30);
  start.setHours(9, 0, 0, 0);
  return {
    title: "Messaging & Proof Review",
    description:
      `30-day review of ${firstName}'s (${companyName}) Messaging & Proof Checklist.\n\n` +
      `Agenda:\n` +
      `• Is the one-liner showing up on the homepage, the sales deck, and team LinkedIn headlines?\n` +
      `• Which collateral audit items have moved from "no" or "partial" to "yes"?\n` +
      `• Any new testimonial stories worth capturing?\n` +
      `• What's the single next fix?\n\n` +
      `Checklist: ${planUrl}`,
    startISO: start.toISOString(),
    durationMinutes: 45,
  };
}

export function messagingReviewGoogleUrl(
  firstName: string,
  companyName: string,
  planUrl: string
): string {
  return googleCalendarUrl(messagingReviewEvent(firstName, companyName, planUrl));
}
