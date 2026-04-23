/**
 * "Ownership Makes Culture Stick" — 4-email, 60-day nurture sequence fired
 * when a user saves a Leadership Accountability Map. All four email bodies
 * ship as DRAFT placeholders awaiting Clay's final copy — subjects and
 * cadence are approved as-is.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const OWNERSHIP_MAKES_CULTURE_STICK_SEQUENCE: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity Heart — Ownership Makes Culture Stick",
  theme: "Ownership Makes Culture Stick (60 days, 4 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject:
        "Your Accountability Map is saved — here's how to run the first conversation",
      body: "[DRAFT — awaiting Clay]\n\nThe map is done. The real work is the conversation you have with your leadership team this week. Don't hand them a PDF and ask for feedback. Walk each seat with them, live. Ask two questions per seat: 'Does this mission statement still describe what you actually do?' and 'Which of these responsibilities would you hand to someone else if you could?' That's where the map becomes real. Your map: {{planUrl}}",
    },
    {
      sendOnDay: 7,
      subject:
        "The question that separates real accountability from theater",
      body: "[DRAFT — awaiting Clay]\n\nMost leadership teams think they have accountability. What they have is a reporting structure. Real accountability shows up when something fails and exactly one person owns the next move. The question to test your map: when your last cross-functional miss happened — marketing promising something sales couldn't deliver, ops shipping something that hadn't been scoped — could you, from the map alone, name the one person who owned the outcome? If no, the seat definitions still need work. Walk the map again: {{planUrl}}",
    },
    {
      sendOnDay: 30,
      subject: "How to tell if someone's in the wrong seat",
      body: "[DRAFT — awaiting Clay]\n\nThe framework Clay uses at Good Agency is GWC — Get It, Want It, Capacity to do it. Look at each person on your map. Do they GET the seat's mission at a gut level? Do they genuinely WANT the responsibilities, or are they tolerating them? Do they have the CAPACITY — time, energy, skill, and permission — to do the work excellently? A 'no' on any one of the three is a signal. Two 'nos' is usually an answer. Bring this to your first reflection date. Your map: {{planUrl}}",
    },
    {
      sendOnDay: 60,
      subject:
        "Two weeks out from your first reflection date — here's the prep",
      body: "[DRAFT — awaiting Clay]\n\nThe calendar invite is on your team's calendar. Don't wing it. In the next two weeks, do three things: (1) ask every seat-holder to bring one edit they'd propose to their own mission or responsibilities — nothing else; (2) pull three examples from the last 90 days of cross-functional work that went well AND three that didn't; (3) decide who's running the reflection meeting — the Integrator, not the Visionary. Protect that distinction. Your map: {{planUrl}}",
    },
  ],
};
