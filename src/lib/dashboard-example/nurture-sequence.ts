/**
 * "From Dashboard to Discipline" — 3-email, 21-day nurture sequence fired when
 * a user downloads the Good Agency Dashboard Example. All three email bodies
 * ship as DRAFT placeholders awaiting Clay's final copy — subjects and
 * cadence are approved as-is.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const FROM_DASHBOARD_TO_DISCIPLINE_SEQUENCE: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity Heading — From Dashboard to Discipline",
  theme: "From Dashboard to Discipline (21 days, 3 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject: "Your Good Agency Dashboard Example is in — here's how to use it",
      body: "[DRAFT — awaiting Clay]\n\nThe PDF is attached. Don't copy it into your own spreadsheet yet. First, walk each of the four dashboards against your business and ask a single question at each: 'If this metric went red for three weeks in a row, would someone in this company notice, and would they know what to do about it?' If the answer is no, that's either the wrong metric for your stage or the wrong owner on the seat. Fix that before you build anything.",
    },
    {
      sendOnDay: 7,
      subject: "The one metric most leaders are missing (and why)",
      body: "[DRAFT — awaiting Clay]\n\nMost dashboards measure pipeline and revenue. The one that almost always gets missed: retention. Not net revenue retention — gross customer retention, month over month, segmented by cohort. Every dollar lost to churn costs 5–10x more than a dollar earned from new business. If retention isn't a named metric with a named owner and a specific weekly review, your dashboard is optimizing the wrong end of the funnel.",
    },
    {
      sendOnDay: 21,
      subject: "When to add more metrics, and when to cut them",
      body: "[DRAFT — awaiting Clay]\n\nThree weeks in, you've probably noticed the instinct: add another metric. Resist. The rule from the book: 4–5 metrics per dashboard, never more. Every added metric dilutes the attention on the ones that matter. When a metric stops telling you something you can act on, cut it. The dashboard is a decision-making tool, not a data warehouse. If you can't point at a metric and say exactly what you'd do when it goes red, it doesn't belong on the dashboard.",
    },
  ],
};
