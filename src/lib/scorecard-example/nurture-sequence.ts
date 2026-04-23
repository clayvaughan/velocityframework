/**
 * "Scorecards That Actually Work" — 3-email, 21-day nurture sequence fired
 * when a user downloads the Good Agency Scorecard Example. All three email
 * bodies ship as DRAFT placeholders awaiting Clay's final copy — subjects
 * and cadence are approved as-is.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const SCORECARDS_THAT_WORK_SEQUENCE: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity Hustle — Scorecards That Actually Work",
  theme: "Scorecards That Actually Work (21 days, 3 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject:
        "Your Scorecard Example is in — start with the job mission statement",
      body: "[DRAFT — awaiting Clay]\n\nThe PDF is attached. Before you copy the KPI table into a spreadsheet for your team, do one thing first: write the job mission statement for the role. One sentence. Present tense. 'I am responsible for…' Name the outcome, not the activity. Everything else on the scorecard builds off that sentence — if it's wrong, the rest of the scorecard is wrong too.",
    },
    {
      sendOnDay: 7,
      subject: "Why self-scores matter as much as supervisor scores",
      body: "[DRAFT — awaiting Clay]\n\nMost companies skip the self-score section. They shouldn't. The gap between how the team member scores themselves and how the supervisor scores them is the single most valuable conversation in the whole document. Big gaps reveal blind spots — on either side. Small gaps reveal alignment. The scorecard isn't the point. The conversation the scorecard starts is.",
    },
    {
      sendOnDay: 21,
      subject: "The quarterly recalibration most leaders skip",
      body: "[DRAFT — awaiting Clay]\n\nMonthly reviews keep the scorecard honest. Quarterly recalibrations keep it relevant. Every 90 days, the whole scorecard gets refreshed — OKRs reset, KPIs re-examined for whether they're still the right metrics, responsibilities and competencies re-scored. This is where seat changes, role expansions, and succession conversations happen. The leaders who skip this step end up measuring last year's business.",
    },
  ],
};
