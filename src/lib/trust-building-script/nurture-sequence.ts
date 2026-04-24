/**
 * "Sales That Feel Like Service" — 3-email, 21-day nurture sequence fired
 * when a user downloads the Bellamere Trust-Building Script. All three
 * email bodies ship as DRAFT placeholders awaiting Clay's final copy —
 * subjects and cadence are approved as-is.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const SALES_THAT_FEEL_LIKE_SERVICE_SEQUENCE: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity Hustle — Sales That Feel Like Service",
  theme: "Sales That Feel Like Service (21 days, 3 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject:
        "The Bellamere script is in — here's how to read it the first time",
      body: "[DRAFT — awaiting Clay]\n\nThe PDF is attached. Read it once, all the way through, before you try to adapt anything. Notice the rhythm — hospitality first, discovery second, information only after the relationship is set. The sections are the structure. The script lines are the examples. The coaching tips are the real product.",
    },
    {
      sendOnDay: 7,
      subject:
        "The one question that separates a closer from a trust-builder",
      body: "[DRAFT — awaiting Clay]\n\nLook at the Check-In pattern Luke uses across every section — \"How does this feel for you?\" It's the same question, asked in different rooms. A closer rattles off features and asks for the yes. A trust-builder walks their prospect through the space and asks what landed. The prospect decides. That's why the script works.",
    },
    {
      sendOnDay: 21,
      subject:
        "Your turn — adapt this script to your industry in 30 days",
      body: "[DRAFT — awaiting Clay]\n\nThe best FREs Clay certifies rewrite this into their own voice in about 30 days — same bones, their business. Pick one section this week and rewrite the language for your industry, keeping the structure intact. Reply to this email with your version and we'll give you direct feedback.",
    },
  ],
};
