/**
 * "Making Culture Stick" — 5-email, 30-day nurture sequence fired when a
 * user saves a Culture Action Plan. Scaffolded in HubSpot (via workflow or
 * sequence) when the token + sequence id is available.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const MAKING_CULTURE_STICK_SEQUENCE: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity Culture — Making Culture Stick",
  theme: "Making Culture Stick (30 days, 5 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject: "Your Culture Action Plan.",
      body: "Your plan is attached, and your calendar has your weekly check-in and reassessment already on it. Quick framing for this week: you named what's broken. Now watch for what happens when you name the fix. Most leaders don't, and most cultures don't change. You do, and yours can.",
    },
    {
      sendOnDay: 3,
      subject: "The hardest part of changing culture is day 3.",
      body: "Most culture plans die between day 3 and day 10. Not because they were wrong — because nothing visible happened in week 1, and the leader started wondering if any of it was real. It's real, but invisible for now. Keep going. The Heart section of Velocity has the rhythm that gets you through this stretch.",
    },
    {
      sendOnDay: 10,
      subject: "Are you doing the thing?",
      body: "Your 7-day action was the one you named last week. Did it happen? No judgment — just honest reflection. If you haven't done it yet, the next step is not a bigger plan. The next step is the smallest possible version of the thing, today. Review your plan here if you need a reminder.",
    },
    {
      sendOnDay: 20,
      subject: "The virtue you're building.",
      body: "Every focus area in your plan is tagged to one of three virtues — Hospitality, Humility, or Grit. Hospitality says people feel cared for. Humility says people feel heard. Grit says people take action. When a team member notices the virtue you're building, you've won. That's the signal. Full breakdown in the Heart section of the book, and the FRE Certification Workshop is where we train leaders to run all three at once.",
    },
    {
      sendOnDay: 30,
      subject: "Time to reassess.",
      body: "Your reassessment is today. Whatever happened, this is the moment to look honestly and plan the next 30 days. Open your review page and mark each commitment: yes, partially, no, or not yet. Then decide — stay the course, double down on the one that's working, or take the Culture Health Check again to see where the picture has shifted. The link is in your plan.",
    },
  ],
};
