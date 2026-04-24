/**
 * mailto: builder + calendar events for the Revenue Team Accountability Map
 * saved page.
 *
 * Four calendar events total:
 *   - One weekly recurring revenue team meeting (Google supports RRULE)
 *   - Three reflection-date single events (every 90 days by hand)
 */

import {
  googleCalendarUrl,
  outlookCalendarUrl,
  type CalendarEvent,
} from "@/lib/calendar";

export type RevenueLeadershipEmailContext = {
  firstName: string;
  companyName: string;
  planUrl: string;
};

function buildRevenueTeamEmailBody(
  ctx: RevenueLeadershipEmailContext
): string {
  return (
    `Team —\n\n` +
    `I built out a Unified Revenue Team Accountability Map based on the ` +
    `Velocity framework. It lays out what each of us owns, what we're ` +
    `measured on, and how we work together as one revenue department ` +
    `instead of separate marketing and sales teams. I'd love to walk ` +
    `through it at our next meeting and make sure we're aligned.\n\n` +
    `Attached is the PDF. Full version also here: ${ctx.planUrl}.\n\n` +
    `—${ctx.firstName}`
  );
}

export function revenueTeamEmailContent(
  ctx: RevenueLeadershipEmailContext
): { subject: string; body: string } {
  return {
    subject:
      "Our Unified Revenue Team Accountability Map — For review at our next meeting",
    body: buildRevenueTeamEmailBody(ctx),
  };
}

// ---------------------------------------------------------------------------
// Weekly revenue team meeting event
// ---------------------------------------------------------------------------

export type RevenueCalendarContext = {
  firstName: string;
  companyName: string;
  planUrl: string;
  weeklyMeetingDay: string;
  weeklyMeetingTime: string; // "HH:MM"
  weeklyMeetingDuration: string; // "60 min" etc.
  weeklyMeetingAgenda: string;
  attendeeNames: string[];
  reflectionQuestion: string;
  reflectionDateISO1: string;
  reflectionDateISO2: string;
  reflectionDateISO3: string;
};

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function parseDurationMinutes(duration: string): number {
  const m = duration.match(/(\d+)/);
  if (!m) return 60;
  return parseInt(m[1], 10);
}

function nextOccurrenceOf(dayName: string, timeHHMM: string): string {
  const targetDay = DAY_INDEX[dayName] ?? 3; // default Wednesday
  const [hStr, mStr] = timeHHMM.split(":");
  const hour = parseInt(hStr ?? "9", 10);
  const minute = parseInt(mStr ?? "0", 10);
  const now = new Date();
  const today = now.getDay();
  let daysAhead = (targetDay - today + 7) % 7;
  const target = new Date(now);
  target.setDate(now.getDate() + daysAhead);
  target.setHours(hour, minute, 0, 0);
  if (daysAhead === 0 && target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target.toISOString();
}

export function buildWeeklyMeetingEvent(
  ctx: RevenueCalendarContext
): CalendarEvent {
  const attendeesLine =
    ctx.attendeeNames.filter((n) => n.trim().length > 0).length > 0
      ? `Attendees: ${ctx.attendeeNames.filter((n) => n.trim().length > 0).join(", ")}\n\n`
      : "";
  return {
    title: `Revenue Team Meeting — ${ctx.companyName}`,
    description:
      `Weekly Revenue Team meeting for ${ctx.firstName}'s team at ${ctx.companyName}.\n\n` +
      attendeesLine +
      `Standing agenda:\n${ctx.weeklyMeetingAgenda}\n\n` +
      `Full accountability map: ${ctx.planUrl}`,
    startISO: nextOccurrenceOf(
      ctx.weeklyMeetingDay,
      ctx.weeklyMeetingTime
    ),
    durationMinutes: parseDurationMinutes(ctx.weeklyMeetingDuration),
    recur: "FREQ=WEEKLY",
  };
}

function atNineAM(dateISO: string): string {
  const d = new Date(dateISO);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export function buildRevenueReflectionEvent(
  ctx: RevenueCalendarContext,
  which: 1 | 2 | 3
): CalendarEvent {
  const dateISO =
    which === 1
      ? ctx.reflectionDateISO1
      : which === 2
      ? ctx.reflectionDateISO2
      : ctx.reflectionDateISO3;
  return {
    title: `Revenue Team Map Reflection (${which} of 3)`,
    description:
      `Revenue Team Accountability Map reflection #${which} for ${ctx.firstName}'s team at ${ctx.companyName}.\n\n` +
      `Ask the reflection question for every seat on the map:\n"${ctx.reflectionQuestion}"\n\n` +
      `Open the map: ${ctx.planUrl}`,
    startISO: atNineAM(dateISO),
    durationMinutes: 60,
  };
}

export function allRevenueCalendarUrls(
  ctx: RevenueCalendarContext,
  provider: "google" | "outlook"
): { weekly: string; r1: string; r2: string; r3: string } {
  const build = provider === "google" ? googleCalendarUrl : outlookCalendarUrl;
  return {
    weekly: build(buildWeeklyMeetingEvent(ctx)),
    r1: build(buildRevenueReflectionEvent(ctx, 1)),
    r2: build(buildRevenueReflectionEvent(ctx, 2)),
    r3: build(buildRevenueReflectionEvent(ctx, 3)),
  };
}
