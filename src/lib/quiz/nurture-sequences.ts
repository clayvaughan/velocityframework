/**
 * Three tier-specific nurture email sequences (5 emails each) scaffolded for
 * the Culture Health Check. Enrolled via HubSpot when the token is live.
 *
 * Copy is Clay-approved final content. Two ship-blockers are flagged in
 * MISSING_CONTENT_MANIFEST.md:
 *   1. Clay's direct calendar URL (Critical email 5)
 *   2. Any specific client anecdotes Clay wants swapped in
 */

import type { Tier } from "./copy";

export type NurtureEmail = {
  /** Days after enrollment. 0 = send immediately. */
  sendOnDay: number;
  subject: string;
  body: string;
};

export type NurtureSequence = {
  tier: Tier;
  /** Short label used as the HubSpot sequence name. */
  label: string;
  /** Theme tagline shown in internal HubSpot config. */
  theme: string;
  emails: NurtureEmail[];
};

const HEALTHY: NurtureSequence = {
  tier: "healthy",
  label: "Velocity Culture — Healthy — Protect and Deepen",
  theme: "Protect and Deepen (21 days, 5 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject: "Your Culture Health Check is in.",
      body:
        "Your results are attached, and your tier is Healthy. That's rare air. Most teams don't land here, and most of the ones that do lose it by taking it for granted. Over the next three weeks I'll send you four more short emails with what I've seen protect a healthy culture — and the three things that quietly kill one.",
    },
    {
      sendOnDay: 4,
      subject: "The 3 things that quietly kill a healthy culture.",
      body:
        "Complacency. New-hire dilution. Leader drift. I've seen all three sink healthy cultures faster than any outside threat. The Heart section of Velocity walks through how to stay ahead of each. Short read if you haven't gotten there yet — I'd skip to the chapter on culture maintenance.",
    },
    {
      sendOnDay: 9,
      subject: "The one question worth asking your team monthly.",
      body:
        "At Good Agency I ask every person in every monthly 1:1: 'What's something you've been meaning to raise but haven't?' It's the single highest-signal question I know, and healthy cultures answer it honestly. Try it this month and see what comes up.",
    },
    {
      sendOnDay: 14,
      subject: "Ready to take Heart further?",
      body:
        "The FRE Certification Workshop is built for leaders who already have the culture foundation and want to turn it into revenue growth. Two days in Austin, twelve seats. Details and application at velocityframework.com/workshop.",
    },
    {
      sendOnDay: 21,
      subject: "One last thing from Clay.",
      body:
        "If Velocity has been useful, here are three ways to go deeper: grab the book's companion workbook, apply for FRE Certification, or reply to this email and tell me what's actually working on your team. I read every one.",
    },
  ],
};

const AT_RISK: NurtureSequence = {
  tier: "at_risk",
  label: "Velocity Culture — At Risk — Shore Up the Weak Spots",
  theme: "Shore Up the Weak Spots (21 days, 5 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject: "Your Culture Health Check is in.",
      body:
        "Your results are attached. You're At Risk — real strengths and real risks. That's the tier I see most often, and it's the easiest to turn around. The next 30 days matter more than the next 30 months. Open the PDF, find your lowest dimension, and read the action at the bottom of that page.",
    },
    {
      sendOnDay: 3,
      subject: "The toxin most leaders don't catch in time.",
      body:
        "At-risk teams almost always have one of two leaks: sideways communication (people talking around each other, not to each other) or inconsistent accountability (standards some people meet and others don't). Both corrode faster than leaders realize. The Heart section has the pattern I use to name and fix them.",
    },
    {
      sendOnDay: 8,
      subject: "Your team is telling you where to focus.",
      body:
        "Re-read the dimension you scored lowest on. Take the one recommended action at the bottom of that page this week. Don't try to fix all five — you'll fix none. Pick the one and move. When you're ready to deepen the work, the FRE Certification Workshop is where we teach leaders to run this end-to-end: velocityframework.com/workshop.",
    },
    {
      sendOnDay: 14,
      subject: "This is the pattern we see every time.",
      body:
        "We've worked with dozens of teams that started in At Risk and landed in Healthy within six months. The move is almost always the same: one leader takes one dimension, assigns one owner, and makes one visible change. Then the next. The FRE Certification is how we train leaders to run the whole play.",
    },
    {
      sendOnDay: 21,
      subject: "30-day check-in.",
      body:
        "Three weeks ago you took the Culture Health Check. Did you do the one thing you said you'd do? If yes — what changed? If not — why not? Hit reply. I'm curious and I read every response.",
    },
  ],
};

const CRITICAL: NurtureSequence = {
  tier: "critical",
  label: "Velocity Culture — Critical — Stop the Bleeding",
  theme: "Stop the Bleeding (21 days, 5 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject: "Your Culture Health Check is in.",
      body:
        "Your results are attached. You're in Critical, and I want to be honest with you: this isn't a slow leak, it's a fire. But every team I've ever seen turn a culture around started exactly where you are. The first move is in your lowest dimension — open the PDF, read it, and start there.",
    },
    {
      sendOnDay: 2,
      subject: "The first conversation to have this week.",
      body:
        "Critical-tier cultures almost always start with a trust breakdown, even when trust isn't your lowest score. The fix is not a program — it's a conversation. This week, sit with each member of your leadership team, one at a time, and ask them what's broken. Don't defend. Don't fix in the meeting. Listen, write it down, and come back with what you heard. The Heart section of Velocity walks through exactly what to do with what they tell you.",
    },
    {
      sendOnDay: 6,
      subject: "The FRE Certification Workshop (and why I'm bringing it up now).",
      body:
        "Critical-tier teams are exactly who we built the FRE Certification for. If you want to bring in someone who has done this before — who knows what to say, when to say it, and what to fix first — the FRE network is where those leaders come from. Two days in Austin with Luke Frazier and me, twelve seats per cohort. velocityframework.com/workshop.",
    },
    {
      sendOnDay: 12,
      subject: "You're not alone in this.",
      body:
        "I've sat where you're sitting. There was a point at Good Agency where our own culture was in trouble, and I had to do the work I'm now asking you to do. The hardest part isn't the plan — the plan is in the Heart section of the book. The hardest part is being the first leader in the room to say 'I was wrong, and here's what I'm changing.' You can do it. And if you want help, apply for the FRE Workshop.",
    },
    {
      sendOnDay: 21,
      subject: "Want to talk?",
      body:
        "This email only goes to leaders who scored Critical on the Health Check, so let me say one practical thing: at this tier, the right next move is usually a conversation — not another download. If you want to walk through your situation with someone, Luke Frazier — Growth Lead at Good Agency — runs these strategy calls. He'll go through your Health Check results with you, hear what's actually broken, and explore where Good Agency might fit. No pitch, no sales process — just 30 minutes to point you at the right move. Book a strategy call: https://meetings.hubspot.com/luke911/velocity-strategy-call. Or reply to this email if you'd rather Luke reach out to you.",
    },
  ],
};

export const NURTURE_SEQUENCES: Record<Tier, NurtureSequence> = {
  healthy: HEALTHY,
  at_risk: AT_RISK,
  critical: CRITICAL,
};
