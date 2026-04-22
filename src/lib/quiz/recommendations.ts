/**
 * Score → toolbox resource recommendations.
 *
 * For each dimension that lands in At Risk or Critical, we surface a specific
 * download from the toolbox whose content addresses that dimension. Healthy
 * dimensions do not surface a resource (the reader's job is protection, not
 * acquisition). Every results page additionally surfaces the Heart-pillar
 * email series and the FRE Certification Workshop as universal CTAs.
 *
 * Mappings below are Claude-drafted defaults — flagged in
 * MISSING_CONTENT_MANIFEST.md for Clay to refine if a different resource
 * better serves a given dimension/tier combo.
 */

import type { Dimension } from "./questions";
import type { Tier } from "./copy";
import { resourceBySlug, type Resource } from "@/lib/resources";

/** Toolbox slug surfaced when a dimension scores At Risk or Critical. */
const DIMENSION_RESOURCE_SLUG: Record<Dimension, string> = {
  trust: "culture-action-plan",
  communication: "messaging-proof-bundle",
  accountability: "leadership-accountability-map",
  purpose_alignment: "fcp-worksheet",
  hospitality: "culture-action-plan",
};

export type DimensionRecommendation = {
  dimension: Dimension;
  tier: Tier;
  resource: Resource;
};

export function recommendationsFor(
  dimensionScores: { dimension: Dimension; tier: Tier }[]
): DimensionRecommendation[] {
  const out: DimensionRecommendation[] = [];
  for (const { dimension, tier } of dimensionScores) {
    if (tier === "healthy") continue;
    const slug = DIMENSION_RESOURCE_SLUG[dimension];
    const resource = resourceBySlug(slug);
    if (!resource) continue;
    // Dedupe — if two dimensions map to the same resource (e.g. trust and
    // hospitality both → culture-action-plan), only surface it once.
    if (out.some((r) => r.resource.slug === resource.slug)) continue;
    out.push({ dimension, tier, resource });
  }
  return out;
}
