/**
 * mailto: builder + reflection-date calendar events for the Leadership
 * Accountability Map saved page.
 *
 * Three calendar events — one per reflection date. Each event recurs every
 * 90 days on Google (`FREQ=DAILY;INTERVAL=90` is more forgiving than the
 * yearly/monthly specifiers across calendar apps). Outlook compose URLs
 * don't support RRULE so we emit single events with a note in the body
 * instructing the user to set quarterly recurrence by hand.
 */

import {
  googleCalendarUrl,
  outlookCalendarUrl,
  type CalendarEvent,
} from "@/lib/calendar";

export type LeadershipEmailContext = {
  firstName: string;
  companyName: string;
  planUrl: string;
};

function buildLeadershipBody(ctx: LeadershipEmailContext): string {
  return (
    `Team —\n\n` +
    `I built out a Leadership Accountability Map based on the Velocity framework. ` +
    `It names who owns what, what each seat's mission is, and where we go for ` +
    `clarity when something falls through the cracks. I'd love to walk through ` +
    `it at our next leadership meeting. Attached is the PDF. The full version ` +
    `is also here: ${ctx.planUrl}.\n\n` +
    `See you Monday.\n\n` +
    `—${ctx.firstName}`
  );
}

export function leadershipEmailContent(ctx: LeadershipEmailContext): {
  subject: string;
  body: string;
} {
  return {
    subject:
      "Our Leadership Accountability Map — For review at our next leadership meeting",
    body: buildLeadershipBody(ctx),
  };
}

// ---------------------------------------------------------------------------
// Reflection calendar events
// ---------------------------------------------------------------------------

export type ReflectionCalendarContext = {
  firstName: string;
  companyName: string;
  planUrl: string;
  reflectionQuestion: string;
  reflectionDateISO1: string;
  reflectionDateISO2: string;
  reflectionDateISO3: string;
};

function reflectionDescription(
  ctx: ReflectionCalendarContext,
  which: 1 | 2 | 3
): string {
  return (
    `Leadership Accountability Map reflection #${which} for ${ctx.firstName}'s team at ${ctx.companyName}.\n\n` +
    `Ask the reflection question for every seat on the map:\n"${ctx.reflectionQuestion}"\n\n` +
    `Agenda:\n` +
    `• Walk each seat. Is the right person in it?\n` +
    `• Are the responsibilities still aligned with where the business is going?\n` +
    `• Does the mission statement still describe what that seat needs to do?\n` +
    `• Update the map if anything has changed — it's a living document.\n\n` +
    `Open the map: ${ctx.planUrl}`
  );
}

function atNineAM(dateISO: string): string {
  const d = new Date(dateISO);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export function buildReflectionEvent(
  ctx: ReflectionCalendarContext,
  which: 1 | 2 | 3
): CalendarEvent {
  const dateISO =
    which === 1
      ? ctx.reflectionDateISO1
      : which === 2
      ? ctx.reflectionDateISO2
      : ctx.reflectionDateISO3;
  return {
    title: `Leadership Accountability Map Review (${which} of 3)`,
    description: reflectionDescription(ctx, which),
    startISO: atNineAM(dateISO),
    durationMinutes: 60,
  };
}

export function allReflectionCalendarUrls(
  ctx: ReflectionCalendarContext,
  provider: "google" | "outlook"
): { r1: string; r2: string; r3: string } {
  const build = provider === "google" ? googleCalendarUrl : outlookCalendarUrl;
  return {
    r1: build(buildReflectionEvent(ctx, 1)),
    r2: build(buildReflectionEvent(ctx, 2)),
    r3: build(buildReflectionEvent(ctx, 3)),
  };
}
