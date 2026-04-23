/**
 * "Build Around Your Favorite Customer" — 4-email, 21-day nurture sequence
 * fired when a user saves an FCP Worksheet. Scaffolded as data; final copy
 * is a DRAFT awaiting Clay. Flagged in MISSING_CONTENT_MANIFEST.md.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const BUILD_AROUND_YOUR_FAVORITE_CUSTOMER: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity FCP — Build Around Your Favorite Customer",
  theme: "Build Around Your Favorite Customer (21 days, 4 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject: "Your Favorite Customer Profiles are saved — here's what to do next",
      body: "[DRAFT — awaiting Clay]\n\nYour FCPs are attached. The first 48 hours after this exercise is when it's easiest to make them operational. Pick one of the profiles you just defined and have one conversation this week with someone on your team — sales, marketing, or CS — about how your current outreach matches (or doesn't). That one conversation compounds faster than any workshop. Full report: {{planUrl}}",
    },
    {
      sendOnDay: 3,
      subject: "The messaging question that breaks most service businesses",
      body: "[DRAFT — awaiting Clay]\n\nMost marketing teams write for a demographic. Your FCPs describe a behavior. The next move is to rewrite your top three marketing assets — a homepage headline, a proposal opener, a sales deck first slide — through the lens of the customer you just defined. Short checklist inside.",
    },
    {
      sendOnDay: 10,
      subject: "Why your referral requests aren't working (and the fix)",
      body: "[DRAFT — awaiting Clay]\n\nReferrals die when the ask is vague. 'Send me anyone who needs X' asks your champions to guess. Your FCPs give them a pattern to match against. Here's the template for an FCP-grounded referral request — and why it doubles response rates.",
    },
    {
      sendOnDay: 21,
      subject: "The test: can your team describe your Favorite Customer in 30 seconds?",
      body: "[DRAFT — awaiting Clay]\n\n21 days in, here's the test. Ask three people on your team to describe your top FCP, separately, in under 30 seconds. If the answers diverge, the work isn't done — the definition lives in your file, not in their heads. Three exercises to close the gap.",
    },
  ],
};
