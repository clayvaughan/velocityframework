/**
 * Static content for the Messaging & Proof Checklist screens.
 * One-liner examples, testimonial prompts, collateral-audit items — all
 * pulled directly from Chapter 10 of Velocity so the tool matches the
 * book verbatim where it can.
 */

// ---------------------------------------------------------------------------
// Screen 1 — one-liner examples (from the book)
// ---------------------------------------------------------------------------

export type OnelinerExample = {
  name: string;
  problem: string;
  solution: string;
  success: string;
};

export const ONELINER_EXAMPLES: OnelinerExample[] = [
  {
    name: "AAA Paving",
    problem: "It can be hard to find a paving contractor you can trust.",
    solution:
      "For over 50 years, AAA Paving has delivered quality work on time and on budget,",
    success: "so you know your project will be done right the first time.",
  },
  {
    name: "Safe House Project",
    problem:
      "Every day, traffickers target children in our homes, schools, and communities.",
    solution:
      "Safe House Project breaks the cycle by rescuing victims, strengthening laws,",
    success: "and equipping communities to act.",
  },
  {
    name: "Holly Hall Senior Living",
    problem: "Caring for aging parents can be overwhelming.",
    solution:
      "For over 70 years, Holly Hall has provided a safe, supportive Christian senior living community,",
    success: "giving families peace of mind knowing their loved ones will thrive.",
  },
];

// ---------------------------------------------------------------------------
// Screen 4 — testimonial prompts (book's exact prompts)
// ---------------------------------------------------------------------------

export const TESTIMONIAL_PROMPTS: string[] = [
  "What was the specific problem you were trying to solve before we started working together?",
  "What almost stopped you from saying yes? What was the hesitation?",
  "Walk me through one moment where you knew this was working.",
  "What's different in your business now that wasn't true six months ago?",
  "If a peer in your industry asked you whether they should work with us, what would you tell them?",
];

// ---------------------------------------------------------------------------
// Screen 5 — collateral audit items (book's Minimum Collateral Checklist)
// ---------------------------------------------------------------------------

export type CollateralItemKey =
  | "oneliner_locked"
  | "homepage_structure"
  | "case_slices"
  | "testimonial_video"
  | "overview_video"
  | "faq_section"
  | "nurture_sequence";

export type CollateralItem = {
  key: CollateralItemKey;
  label: string;
  /** Short gloss explaining what "yes" looks like for this item. */
  description: string;
};

export const COLLATERAL_ITEMS: CollateralItem[] = [
  {
    key: "oneliner_locked",
    label: "One-liner locked and shared with the team",
    description:
      "Everyone on sales and marketing can recite the same one-liner in their own words.",
  },
  {
    key: "homepage_structure",
    label: "Homepage hits problem, plan in 3 steps, proof, clear CTA",
    description:
      "The homepage opens with the customer's problem, offers a 3-step plan, surfaces proof, and has one direct CTA and one transitional CTA.",
  },
  {
    key: "case_slices",
    label: "Two 1-page case study slices",
    description:
      "Two short, structured case studies — problem, action, result — that a salesperson can send in a reply email.",
  },
  {
    key: "testimonial_video",
    label: "One 90-second testimonial video",
    description:
      "A real customer telling their story on camera in 90 seconds or less.",
  },
  {
    key: "overview_video",
    label: "One 2-minute product/service overview",
    description:
      "A short explainer that answers what you do, who it's for, and why it works.",
  },
  {
    key: "faq_section",
    label: "FAQ / Objections section with three real questions answered",
    description:
      "Three real objections — not marketing fluff — addressed publicly on the site.",
  },
  {
    key: "nurture_sequence",
    label: "Five-email nurture sequence for people not ready to buy",
    description:
      "Leads who aren't ready to buy get a five-email sequence that keeps them warm without pressure.",
  },
];

export type CollateralStatus = "yes" | "no" | "partial";

/**
 * Collateral readiness score = (full yeses × 2 + partials × 1) / (items × 2) × 100.
 */
export function collateralReadinessScore(
  statuses: Record<string, CollateralStatus | undefined>
): number {
  const values = COLLATERAL_ITEMS.map((i) => statuses[i.key]).filter(
    (s): s is CollateralStatus => !!s
  );
  const yes = values.filter((s) => s === "yes").length;
  const partial = values.filter((s) => s === "partial").length;
  const denominator = COLLATERAL_ITEMS.length * 2;
  const raw = (yes * 2 + partial) / denominator;
  return Math.round(raw * 100);
}
