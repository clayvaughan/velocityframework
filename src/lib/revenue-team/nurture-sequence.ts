/**
 * "Unified Revenue = Predictable Growth" — 4-email, 60-day nurture sequence
 * fired when a user saves a Revenue Team Accountability Map. All four email
 * bodies ship as DRAFT placeholders awaiting Clay's final copy — subjects
 * and cadence are approved as-is.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const UNIFIED_REVENUE_PREDICTABLE_GROWTH_SEQUENCE: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity Heading — Unified Revenue = Predictable Growth",
  theme: "Unified Revenue = Predictable Growth (60 days, 4 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject:
        "Your Revenue Team Accountability Map is saved — the first meeting is everything",
      body: "[DRAFT — awaiting Clay]\n\nThe map is done. The real work starts at the first Revenue Team meeting. Don't hand people a PDF and ask for feedback — walk each seat together, live. Ask every person two questions about their own role: 'Do these three metrics actually predict whether you're doing a good job?' and 'What would you hand to someone else if you could?' That's where the map becomes your map instead of a template. Open it: {{planUrl}}",
    },
    {
      sendOnDay: 7,
      subject:
        "The three metrics a Director of Revenue is actually accountable for",
      body: "[DRAFT — awaiting Clay]\n\nEvery Director of Revenue role Clay has helped install comes down to three numbers, reviewed weekly: new revenue booked, pipeline value, and close rate. Not MQLs. Not activity. Not pipeline conversations. Those three. If the person in that seat can't give you those numbers in 30 seconds on a Tuesday morning, the seat isn't working yet. Your map: {{planUrl}}",
    },
    {
      sendOnDay: 30,
      subject:
        "Why marketing-sales silos kill growth (and the fix that actually works)",
      body: "[DRAFT — awaiting Clay]\n\nWhen marketing and sales report to different leaders, the business doesn't have a revenue team — it has two departments competing for credit. The fix isn't more meetings. The fix is a single owner over both functions with one scoreboard. That's what the Director of Revenue / Fractional Revenue Executive role exists to solve. A month in, ask yourself: when a deal slips, do marketing and sales agree on why? If not, the unification is still on paper, not in practice. Your map: {{planUrl}}",
    },
    {
      sendOnDay: 60,
      subject: "The FRE conversation — who's ready for one",
      body: "[DRAFT — awaiting Clay]\n\nTwo months in. If you've built out this map without filling the Director of Revenue seat, or if the person in the seat doesn't have the rhythm locked in — this is the conversation. A Fractional Revenue Executive isn't a consultant. It's a seat-holder who installs the framework and runs the rhythm while your team learns it. The book chapter is the roadmap. The workshop is where we hand it over. velocityframework.com/workshop",
    },
  ],
};
