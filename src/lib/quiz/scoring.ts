/**
 * Culture Health Check — scoring logic.
 *
 * Pure functions. No I/O. Importable from server routes or tests.
 *
 * Scoring formula:
 *   - Each answer is 1–5 (Likert)
 *   - Each dimension has 3 questions → raw sum in [3, 15]
 *   - Subscore (0–100) = round( ((raw - 3) / 12) * 100 )
 *   - Overall = round( mean of 5 dimension subscores )
 *   - Tier:   0–44 Critical · 45–74 At Risk · 75–100 Healthy
 */

import {
  DIMENSIONS,
  QUESTIONS,
  type Dimension,
  type Question,
} from "./questions";
import type { Tier } from "./copy";

export type Answers = Record<string, number>;

export type DimensionScore = {
  dimension: Dimension;
  subscore: number; // 0–100
  tier: Tier;
};

export type ScoringResult = {
  overall_score: number; // 0–100
  overall_tier: Tier;
  dimension_scores: DimensionScore[];
};

/** Map a 0–100 score to a tier per the spec. */
export function tierFor(score: number): Tier {
  if (score >= 75) return "healthy";
  if (score >= 45) return "at_risk";
  return "critical";
}

/**
 * Validate that the answers object contains a 1–5 integer for every
 * question in the bank. Returns a list of missing or invalid question ids
 * (empty = valid).
 */
export function validateAnswers(answers: Answers): string[] {
  const problems: string[] = [];
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (typeof v !== "number" || !Number.isInteger(v) || v < 1 || v > 5) {
      problems.push(q.id);
    }
  }
  return problems;
}

/**
 * Compute the full scoring result for a set of answers.
 * Assumes validateAnswers has already passed.
 */
export function scoreAnswers(answers: Answers): ScoringResult {
  const dimensionScores: DimensionScore[] = DIMENSIONS.map((dimension) => {
    const dimQuestions = QUESTIONS.filter((q: Question) => q.dimension === dimension);
    const raw = dimQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 3), 0);
    const subscore = Math.round(((raw - dimQuestions.length) / (dimQuestions.length * 4)) * 100);
    return { dimension, subscore, tier: tierFor(subscore) };
  });

  const overallSum = dimensionScores.reduce((s, d) => s + d.subscore, 0);
  const overall_score = Math.round(overallSum / dimensionScores.length);
  const overall_tier = tierFor(overall_score);

  return { overall_score, overall_tier, dimension_scores: dimensionScores };
}

/**
 * Team aggregate: given all responses to a team quiz, compute average + variance
 * per dimension. "Variance" here uses standard deviation of the 1–5 raw answers
 * averaged across the three questions in a dimension — the larger the SD, the
 * more the team disagrees on that dimension.
 */
export type TeamDimensionAggregate = {
  dimension: Dimension;
  /** Mean subscore across all respondents (0–100). */
  meanSubscore: number;
  /** Standard deviation of the 1–5 raw answers within this dimension. */
  answerStdDev: number;
  /** Tier based on mean subscore. */
  tier: Tier;
};

export type TeamAggregate = {
  respondentCount: number;
  meanOverallScore: number;
  meanOverallTier: Tier;
  dimensionAggregates: TeamDimensionAggregate[];
  /** Dimensions sorted by descending disagreement (highest-variance first). */
  highVarianceDimensions: TeamDimensionAggregate[];
};

export function aggregateTeamResponses(
  responses: Array<{ answers: Answers; dimension_scores: DimensionScore[]; overall_score: number }>
): TeamAggregate {
  const n = responses.length;
  if (n === 0) {
    return {
      respondentCount: 0,
      meanOverallScore: 0,
      meanOverallTier: "critical",
      dimensionAggregates: [],
      highVarianceDimensions: [],
    };
  }

  const meanOverallScore = Math.round(
    responses.reduce((s, r) => s + r.overall_score, 0) / n
  );

  const dimensionAggregates: TeamDimensionAggregate[] = DIMENSIONS.map((dim) => {
    const dimQs = QUESTIONS.filter((q) => q.dimension === dim);
    // Mean subscore across respondents
    const subscores = responses
      .map((r) => r.dimension_scores.find((d) => d.dimension === dim)?.subscore ?? 0);
    const meanSubscore = Math.round(subscores.reduce((s, x) => s + x, 0) / n);

    // Pool every raw answer for every respondent in this dimension, compute SD
    const pooled: number[] = [];
    for (const r of responses) {
      for (const q of dimQs) {
        const v = r.answers[q.id];
        if (typeof v === "number") pooled.push(v);
      }
    }
    const mean = pooled.reduce((s, x) => s + x, 0) / pooled.length;
    const variance = pooled.reduce((s, x) => s + (x - mean) ** 2, 0) / pooled.length;
    const answerStdDev = Math.sqrt(variance);

    return {
      dimension: dim,
      meanSubscore,
      answerStdDev: Math.round(answerStdDev * 100) / 100,
      tier: tierFor(meanSubscore),
    };
  });

  const highVarianceDimensions = [...dimensionAggregates].sort(
    (a, b) => b.answerStdDev - a.answerStdDev
  );

  return {
    respondentCount: n,
    meanOverallScore,
    meanOverallTier: tierFor(meanOverallScore),
    dimensionAggregates,
    highVarianceDimensions,
  };
}
