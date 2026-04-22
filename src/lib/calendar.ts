/**
 * Calendar URL generation for the Culture Action Plan saved page.
 *
 * Three events per plan:
 *   1. Weekly Accountability Check-In (recurring weekly, 30 min)
 *   2. 30/60/90-Day Reassessment (single event, 60 min, on reassessment date)
 *   3. 7-Day Action Deadline (single event, 30 min, 7 days from today)
 *
 * URL formats used:
 *   - Google Calendar: https://www.google.com/calendar/render?action=TEMPLATE
 *   - Outlook Live:    https://outlook.live.com/calendar/0/deeplink/compose
 *
 * Outlook's compose URL doesn't support RRULE for recurring events. For the
 * weekly check-in we emit a single-event URL with a note in the description
 * instructing the user to set weekly recurrence. Google Calendar supports
 * RRULE via the `recur` param.
 */

export type CalendarEvent = {
  title: string;
  description: string;
  startISO: string;      // ISO 8601, local or Z
  durationMinutes: number;
  /**
   * RRULE string without the leading `RRULE:` prefix. Optional.
   * Example: `FREQ=WEEKLY`
   */
  recur?: string;
};

/**
 * Format a Date into the compact UTC string Google Calendar wants:
 * `YYYYMMDDTHHMMSSZ`.
 */
function gcalDate(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function addMinutes(isoOrDate: string | Date, min: number): Date {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : new Date(isoOrDate);
  d.setUTCMinutes(d.getUTCMinutes() + min);
  return d;
}

export function googleCalendarUrl(ev: CalendarEvent): string {
  const start = gcalDate(ev.startISO);
  const end = gcalDate(addMinutes(ev.startISO, ev.durationMinutes));
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${start}/${end}`,
    details: ev.description,
  });
  if (ev.recur) {
    params.append("recur", `RRULE:${ev.recur}`);
  }
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(ev: CalendarEvent): string {
  const startDate = new Date(ev.startISO);
  const endDate = addMinutes(ev.startISO, ev.durationMinutes);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: ev.description,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Event factories — shared by both Google and Outlook URL builders
// ---------------------------------------------------------------------------

export type ActionPlanCalendarContext = {
  firstName: string;
  focusAreaSummaries: string[]; // human-readable one-liners per focus area
  firstWeekAction: string;
  firstWeekActionBehavior: string;
  accountabilityPartnerName: string | null;
  reassessmentDays: 30 | 60 | 90;
  planUrl: string;
};

/**
 * Pick the upcoming Friday at 4pm local, or the Friday AFTER if today is
 * Friday past 4pm. Using local time is what the user expects from a "this
 * week" check-in.
 */
function nextFriday4pmUtcISO(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  // Target: next Friday (day=5)
  let daysUntilFriday = (5 - day + 7) % 7;
  if (daysUntilFriday === 0) {
    // Today is Friday; if it's past 4pm local, bump a week
    if (now.getHours() >= 16) daysUntilFriday = 7;
  }
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilFriday);
  target.setHours(16, 0, 0, 0);
  return target.toISOString();
}

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export function buildCheckInEvent(
  ctx: ActionPlanCalendarContext
): CalendarEvent {
  const focusBullets = ctx.focusAreaSummaries
    .map((s) => `• ${s}`)
    .join("\n");
  const description =
    `Weekly culture check-in for ${ctx.firstName}'s Culture Action Plan.\n\n` +
    `Focus areas:\n${focusBullets}\n\n` +
    `This week's commitment:\n${ctx.firstWeekAction}\n\n` +
    `What success looks like:\n${ctx.firstWeekActionBehavior}\n\n` +
    (ctx.accountabilityPartnerName
      ? `Accountability partner: ${ctx.accountabilityPartnerName}\n\n`
      : "") +
    `Plan: ${ctx.planUrl}`;
  return {
    title: "Culture Action Plan — Weekly Check-In",
    description,
    startISO: nextFriday4pmUtcISO(),
    durationMinutes: 30,
    recur: "FREQ=WEEKLY",
  };
}

export function buildReassessmentEvent(
  ctx: ActionPlanCalendarContext
): CalendarEvent {
  const description =
    `${ctx.reassessmentDays}-day reassessment of ${ctx.firstName}'s Culture Action Plan.\n\n` +
    `Agenda:\n` +
    `• Review each focus area — what improved, what didn't\n` +
    `• Discuss what's still stuck, and why\n` +
    `• Adjust your 7-day actions if needed\n` +
    `• Decide whether to re-take the Culture Health Check\n\n` +
    `Open your review page: ${ctx.planUrl.replace(
      "/saved/",
      "/review/"
    )}`;
  return {
    title: `Culture Action Plan — ${ctx.reassessmentDays}-Day Reassessment`,
    description,
    startISO: addDaysISO(ctx.reassessmentDays),
    durationMinutes: 60,
  };
}

export function buildSevenDayActionEvent(
  ctx: ActionPlanCalendarContext
): CalendarEvent {
  const description =
    `This week's action from your Culture Action Plan:\n\n` +
    `${ctx.firstWeekAction}\n\n` +
    `What success looks like:\n${ctx.firstWeekActionBehavior}\n\n` +
    `Plan: ${ctx.planUrl}`;
  return {
    title: "Culture Action Plan — 7-Day Action Due",
    description,
    startISO: addDaysISO(7),
    durationMinutes: 30,
  };
}

export function allCalendarUrls(
  ctx: ActionPlanCalendarContext,
  provider: "google" | "outlook"
): { checkIn: string; reassessment: string; sevenDay: string } {
  const build = provider === "google" ? googleCalendarUrl : outlookCalendarUrl;
  return {
    checkIn: build(buildCheckInEvent(ctx)),
    reassessment: build(buildReassessmentEvent(ctx)),
    sevenDay: build(buildSevenDayActionEvent(ctx)),
  };
}
