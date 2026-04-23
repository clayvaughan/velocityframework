/**
 * "Clear Your Message, Grow Your Revenue" — 4-email, 21-day nurture sequence
 * fired when a user saves a Messaging & Proof Checklist. All four email
 * bodies ship as DRAFT placeholders awaiting Clay's final copy — subjects
 * and cadence are approved as-is.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const CLEAR_YOUR_MESSAGE_SEQUENCE: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity Messaging — Clear Your Message, Grow Your Revenue",
  theme: "Clear Your Message, Grow Your Revenue (21 days, 4 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject: "Your Messaging & Proof Checklist is saved — the one-liner test",
      body: "[DRAFT — awaiting Clay]\n\nYour checklist is attached. The fastest first move: read your locked one-liner out loud. Then text it to one teammate and one customer. If either stumbles or asks a clarifying question, the next iteration starts there. If you confuse, you lose. Full worksheet: {{planUrl}}",
    },
    {
      sendOnDay: 5,
      subject: "Why beautiful design means nothing without the right words",
      body: "[DRAFT — awaiting Clay]\n\nMost teams redesign the site first and fix the words second. That's backwards. The book's rule: start with the words, then wireframe, then visuals. Take a look at your current homepage against the one-liner you just locked — which sentence comes first on screen? If it's not the problem your customer is trying to solve, that's the first fix.",
    },
    {
      sendOnDay: 12,
      subject: "The testimonial question that gets stories instead of praise",
      body: "[DRAFT — awaiting Clay]\n\nGeneric testimonials — 'Great service!' — don't move prospects. Story-shaped testimonials do. The book's five prompts are in your checklist. Pick the three best customers on your list today and send them prompt #1: 'What was the specific problem you were trying to solve before we started working together?' Nothing else. Just that question.",
    },
    {
      sendOnDay: 21,
      subject: "Check-in: did you actually use your one-liner this week?",
      body: "[DRAFT — awaiting Clay]\n\n21 days in. The test is whether the one-liner you locked has made it into three places: your homepage, your sales opener, and at least one team member's LinkedIn headline. If any of those three is still running old messaging, that's this week's to-do. The worksheet is still here when you need it: {{planUrl}}",
    },
  ],
};
