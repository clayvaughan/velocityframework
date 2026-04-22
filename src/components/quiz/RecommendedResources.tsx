import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DIMENSION_LABEL } from "@/lib/quiz/questions";
import { TIER_LABEL } from "@/lib/quiz/copy";
import type { DimensionRecommendation } from "@/lib/quiz/recommendations";

type Props = {
  items: DimensionRecommendation[];
};

/**
 * Dimension-triggered resource recommendations. Rendered only when at least
 * one dimension came back At Risk or Critical — Healthy scores don't surface
 * recommendations because the work at that tier is protection, not
 * acquisition.
 */
export function RecommendedResources({ items }: Props) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-3 md:space-y-4">
      {items.map(({ dimension, tier, resource }) => (
        <li key={resource.slug}>
          <Link
            href={`/toolbox/${resource.slug}`}
            className="group flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5"
          >
            <div>
              <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                Because {DIMENSION_LABEL[dimension]} scored {TIER_LABEL[tier]}
              </p>
              <h4 className="mt-1 font-heading text-base md:text-lg uppercase tracking-wide text-foreground">
                {resource.title}
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">{resource.hook}</p>
            </div>
            <span className="inline-flex items-center gap-1 font-heading text-xs uppercase tracking-widest text-accent-dark whitespace-nowrap">
              Download
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
