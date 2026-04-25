/**
 * "The FRE Path" — 3-email, 21-day nurture sequence fired when a user
 * downloads the FRE Job Description. All three email bodies ship as
 * DRAFT placeholders awaiting Clay's final copy — subjects and cadence
 * are approved as-is.
 */

import type { NurtureEmail } from "@/lib/quiz/nurture-sequences";

export const FRE_PATH_SEQUENCE: {
  label: string;
  theme: string;
  emails: NurtureEmail[];
} = {
  label: "Velocity Heading — The FRE Path",
  theme: "The FRE Path (21 days, 3 emails)",
  emails: [
    {
      sendOnDay: 0,
      subject: "The FRE Job Description is in — here's how to use it",
      body: "[DRAFT — awaiting Clay]\n\nThe PDF is attached. Read it once all the way through before you adapt anything. Notice the structure — Heart (culture), Heading (strategy), Hustle (execution) — running through every responsibility. The role isn't a consultant chair; it's a seat inside the leadership team. If you're hiring, this is the bar. If you're considering becoming one, this is the curriculum.",
    },
    {
      sendOnDay: 7,
      subject: "Hiring an FRE? Three questions to ask every candidate",
      body: "[DRAFT — awaiting Clay]\n\nMost candidates can talk strategy. Few can install discipline. Three questions to separate them: (1) Walk me through the last weekly leadership rhythm you ran — what was on the agenda and who owned what? (2) Show me a scorecard you've used with a sales rep — what were the KPIs and what did red, yellow, green look like? (3) Tell me about a moment you held a peer accountable when it would have been easier not to. Look for specifics, not theory.",
    },
    {
      sendOnDay: 21,
      subject: "Becoming an FRE? The certification path explained",
      body: "[DRAFT — awaiting Clay]\n\nClay's FRE Certification is two days in Austin with him and Luke Frazier. Twelve seats per cohort. The curriculum walks the full Velocity Framework — Heart, Heading, Hustle — and the operating rhythm an FRE installs inside a client business. Graduates leave with the system, the language, and the network. velocityframework.com/workshop",
    },
  ],
};
