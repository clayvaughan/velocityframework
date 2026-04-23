/**
 * mailto: builder for the "Email to my leadership team" button on the
 * Favorite Customer Profile saved page. Plus a Google Calendar URL helper
 * for the "Revisit in 90 days" button.
 */

import { googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";

export type LeadershipEmailContext = {
  firstName: string;
  companyName: string;
  fcpCount: number;
  planUrl: string;
};

function buildLeadershipBody(ctx: LeadershipEmailContext): string {
  const fcpNoun = ctx.fcpCount === 1 ? "a Favorite Customer Profile" : `${ctx.fcpCount} Favorite Customer Profiles`;
  return (
    `Team,\n\n` +
    `I just finished working through ${fcpNoun} for ${ctx.companyName}. Before we operationalize them — marketing, sales, referrals, proposals — I want your eyes on the definitions.\n\n` +
    `Read the full worksheet here: ${ctx.planUrl}\n\n` +
    `Two asks:\n` +
    `• What's missing? Any archetype we didn't capture?\n` +
    `• What's wrong? Any definition that doesn't match your experience in the field?\n\n` +
    `Short responses welcome. I'll roll up the feedback and we'll finalize at our next leadership meeting.\n\n` +
    `${ctx.firstName}`
  );
}

export function leadershipEmailMailto(ctx: LeadershipEmailContext): string {
  const subject = "Our Favorite Customer Profiles — For review";
  const body = buildLeadershipBody(ctx);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Google Calendar event, 90 days out, titled "Revisit Favorite Customer
 * Profiles." Description links back to the saved worksheet. Outlook
 * equivalent ships as a separate URL when needed.
 */
export function revisitIn90DaysEvent(
  firstName: string,
  companyName: string,
  planUrl: string
): CalendarEvent {
  const start = new Date();
  start.setDate(start.getDate() + 90);
  start.setHours(9, 0, 0, 0);
  return {
    title: "Revisit Favorite Customer Profiles",
    description:
      `90-day revisit for ${firstName}'s (${companyName}) Favorite Customer Profiles.\n\n` +
      `Agenda:\n` +
      `• Read through each profile again with 90 days of field data in mind\n` +
      `• What still fits? What's shifted? Any new archetype to add?\n` +
      `• Update the messaging, sales scripts, and referral asks that rely on these definitions\n\n` +
      `Worksheet: ${planUrl}`,
    startISO: start.toISOString(),
    durationMinutes: 45,
  };
}

export function revisitGoogleCalendarUrl(
  firstName: string,
  companyName: string,
  planUrl: string
): string {
  return googleCalendarUrl(revisitIn90DaysEvent(firstName, companyName, planUrl));
}
