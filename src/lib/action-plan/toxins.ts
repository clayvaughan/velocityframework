/**
 * The 12 Culture Toxins from the Heart section of Velocity (Common Culture
 * Toxins Checklist).
 *
 * Shipping as final content — not placeholders.
 */

export type ToxinId =
  | "chronic_gossip"
  | "territorial_silos"
  | "overload_of_approvals"
  | "high_turnover"
  | "no_ownership"
  | "fear_of_mistakes"
  | "leadership_blind_spots"
  | "micromanagement"
  | "unclear_authority"
  | "fear_of_conflict"
  | "poor_accountability"
  | "hero_culture";

export type Toxin = {
  id: ToxinId;
  title: string;
  description: string;
};

export const TOXINS: Toxin[] = [
  {
    id: "chronic_gossip",
    title: "Chronic gossip",
    description:
      "People privately complain about each other but never address issues directly.",
  },
  {
    id: "territorial_silos",
    title: "Territorial silos",
    description:
      "Departments guard their turf and resist collaboration.",
  },
  {
    id: "overload_of_approvals",
    title: "Overload of approvals",
    description:
      "Projects move slowly because no one can make decisions.",
  },
  {
    id: "high_turnover",
    title: "High turnover or low morale",
    description:
      "Employees leave quickly or stay but seem disengaged.",
  },
  {
    id: "no_ownership",
    title: "No ownership",
    description:
      "Everyone is “busy,” yet key tasks fall through the cracks.",
  },
  {
    id: "fear_of_mistakes",
    title: "Fear of mistakes",
    description: "Team members avoid risk-taking or hide errors.",
  },
  {
    id: "leadership_blind_spots",
    title: "Leadership blind spots",
    description: "Leaders rarely hear from frontline staff.",
  },
  {
    id: "micromanagement",
    title: "Micromanagement",
    description:
      "Every decision requires multiple approvals; managers hoard authority.",
  },
  {
    id: "unclear_authority",
    title: "Unclear authority and roles",
    description:
      "Leadership structure is vague, causing “who owns this?” confusion.",
  },
  {
    id: "fear_of_conflict",
    title: "Fear of conflict",
    description:
      "Issues get glossed over; tough conversations happen only in side chats.",
  },
  {
    id: "poor_accountability",
    title: "Poor accountability",
    description:
      "Deadlines come and go without consequences.",
  },
  {
    id: "hero_culture",
    title: "Hero culture",
    description:
      "A few “saviors” rescue work at the last minute and burn everyone else out.",
  },
];

export const TOXINS_BY_ID: Record<ToxinId, Toxin> = Object.fromEntries(
  TOXINS.map((t) => [t.id, t])
) as Record<ToxinId, Toxin>;

/**
 * Suggested toxin pre-selection when a user arrives from the Culture Health
 * Check. For each low-scoring dimension, we seed these toxins; the user's
 * three lowest dimensions get their suggested toxins pooled, deduped, and
 * capped at 3. User can change them on screen 1.
 */
import type { Dimension } from "@/lib/quiz/questions";

export const DIMENSION_TO_SUGGESTED_TOXINS: Record<Dimension, ToxinId[]> = {
  trust: ["chronic_gossip", "fear_of_mistakes"],
  communication: ["fear_of_conflict", "leadership_blind_spots"],
  accountability: ["poor_accountability", "no_ownership", "hero_culture"],
  purpose_alignment: ["unclear_authority", "leadership_blind_spots"],
  hospitality: ["high_turnover", "fear_of_conflict"],
};

/**
 * Given the scored dimensions from a Culture Health Check result (lowest
 * first), return up to three unique suggested toxins.
 */
export function suggestedToxinsForLowestDimensions(
  lowestDimensions: Dimension[]
): ToxinId[] {
  const suggested: ToxinId[] = [];
  for (const dim of lowestDimensions) {
    for (const toxin of DIMENSION_TO_SUGGESTED_TOXINS[dim] ?? []) {
      if (!suggested.includes(toxin)) suggested.push(toxin);
      if (suggested.length >= 3) return suggested;
    }
  }
  return suggested;
}
