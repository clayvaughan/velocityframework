/**
 * Predefined weekly-rhythm options for Culture Action Plan focus areas.
 * Users pick one of these or write their own.
 */

export type WeeklyRhythmId =
  | "daily_standup"
  | "leadership_meeting"
  | "skip_level"
  | "monthly_shoutouts"
  | "monthly_feedback_loop"
  | "quarterly_temp_check"
  | "custom";

export type WeeklyRhythm = {
  id: WeeklyRhythmId;
  label: string;
};

export const WEEKLY_RHYTHMS: WeeklyRhythm[] = [
  {
    id: "daily_standup",
    label: "Daily 15-minute team stand-up",
  },
  {
    id: "leadership_meeting",
    label:
      "Weekly leadership meeting with issues-clearing segment",
  },
  {
    id: "skip_level",
    label:
      "Weekly skip-level 1:1 (rotate one frontline team member per week)",
  },
  {
    id: "monthly_shoutouts",
    label:
      "Monthly team shout-outs (public recognition of lived values)",
  },
  {
    id: "monthly_feedback_loop",
    label:
      "Monthly feedback loop (anonymous team feedback with public leadership response)",
  },
  {
    id: "quarterly_temp_check",
    label: "Quarterly culture temperature check",
  },
  {
    id: "custom",
    label: "Write your own",
  },
];

export const WEEKLY_RHYTHMS_BY_ID: Record<WeeklyRhythmId, WeeklyRhythm> =
  Object.fromEntries(WEEKLY_RHYTHMS.map((r) => [r.id, r])) as Record<
    WeeklyRhythmId,
    WeeklyRhythm
  >;

export function labelForRhythm(
  id: WeeklyRhythmId | null | undefined,
  customText?: string | null
): string {
  if (!id) return "";
  if (id === "custom") return customText?.trim() || "Custom rhythm";
  return WEEKLY_RHYTHMS_BY_ID[id]?.label ?? "";
}
