/**
 * Culture Health Check — final 15 questions.
 *
 * Copy comes directly from the Heart section of Velocity / the Team Culture
 * Health Check callout. Shipping as-is per Clay's direction; no placeholders
 * flagged on these statements.
 *
 * Display order is round-robin across the five dimensions so respondents
 * don't feel they're marching through a section at a time — reduces
 * dimension-clustering bias. The dimension mix still totals 3 questions per
 * dimension (5 × 3 = 15).
 */

export type Dimension =
  | "trust"
  | "communication"
  | "accountability"
  | "purpose_alignment"
  | "hospitality";

export const DIMENSIONS: Dimension[] = [
  "trust",
  "communication",
  "accountability",
  "purpose_alignment",
  "hospitality",
];

export const DIMENSION_LABEL: Record<Dimension, string> = {
  trust: "Trust",
  communication: "Communication",
  accountability: "Accountability",
  purpose_alignment: "Purpose Alignment",
  hospitality: "Hospitality",
};

export const DIMENSION_TAGLINE: Record<Dimension, string> = {
  trust: "Do people bring up bad news as fast as good?",
  communication: "Is the same information reaching everyone, or does it splinter?",
  accountability: "Does ownership travel with the task, or get lost?",
  purpose_alignment: "Can everyone connect their work to the company's point?",
  hospitality: "Do new people and outsiders feel welcome here?",
};

export type Question = {
  id: string;
  dimension: Dimension;
  /** 1-based order shown to the user (1..15, round-robin across dimensions) */
  order: number;
  statement: string;
};

export const QUESTIONS: Question[] = [
  // Round 1
  {
    id: "trust_1",
    dimension: "trust",
    order: 1,
    statement:
      "On my team, people can raise concerns to leadership without fear of being punished for it.",
  },
  {
    id: "communication_1",
    dimension: "communication",
    order: 2,
    statement:
      "When there's a problem on my team, we address it directly with the person involved instead of going around them.",
  },
  {
    id: "accountability_1",
    dimension: "accountability",
    order: 3,
    statement:
      "When someone underperforms on my team, we address it in a reasonable amount of time.",
  },
  {
    id: "purpose_alignment_1",
    dimension: "purpose_alignment",
    order: 4,
    statement:
      "The people on my team can explain what our company is trying to accomplish and why it matters.",
  },
  {
    id: "hospitality_1",
    dimension: "hospitality",
    order: 5,
    statement:
      "We treat our clients and customers with genuine care, not just professional politeness.",
  },

  // Round 2
  {
    id: "trust_2",
    dimension: "trust",
    order: 6,
    statement:
      "When someone on my team commits to something, I expect it to get done without chasing them down.",
  },
  {
    id: "communication_2",
    dimension: "communication",
    order: 7,
    statement:
      "Our team meetings produce real decisions, not just status updates.",
  },
  {
    id: "accountability_2",
    dimension: "accountability",
    order: 8,
    statement:
      "Every person on my team knows what they specifically own and what they're measured on.",
  },
  {
    id: "purpose_alignment_2",
    dimension: "purpose_alignment",
    order: 9,
    statement:
      "I believe what I do here matters beyond the paycheck.",
  },
  {
    id: "hospitality_2",
    dimension: "hospitality",
    order: 10,
    statement:
      "People on my team look out for each other — they celebrate wins and show up when someone's struggling.",
  },

  // Round 3
  {
    id: "trust_3",
    dimension: "trust",
    order: 11,
    statement:
      "The people I work with are willing to admit when they've made a mistake or don't know something.",
  },
  {
    id: "communication_3",
    dimension: "communication",
    order: 12,
    statement:
      "When we disagree, we argue well — we get to the best answer instead of protecting egos.",
  },
  {
    id: "accountability_3",
    dimension: "accountability",
    order: 13,
    statement:
      "My leadership team holds each other accountable, not just the people below us.",
  },
  {
    id: "purpose_alignment_3",
    dimension: "purpose_alignment",
    order: 14,
    statement:
      "The decisions we make as a company line up with the values we say we hold.",
  },
  {
    id: "hospitality_3",
    dimension: "hospitality",
    order: 15,
    statement:
      "Small things get done around here without anyone being asked — people take initiative to make others' work easier.",
  },
];

export const QUESTION_COUNT = QUESTIONS.length;
export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q])
);

/** Return the question shown at 1-based position `n` (throws on out-of-range). */
export function getQuestionByOrder(n: number): Question {
  const q = QUESTIONS.find((x) => x.order === n);
  if (!q) {
    throw new Error(`No quiz question at position ${n}`);
  }
  return q;
}
