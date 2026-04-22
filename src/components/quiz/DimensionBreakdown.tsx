import { cn } from "@/lib/utils";
import {
  DIMENSION_LABEL,
  DIMENSION_TAGLINE,
  type Dimension,
} from "@/lib/quiz/questions";
import { DIMENSION_COPY, TIER_LABEL, type Tier } from "@/lib/quiz/copy";

/**
 * Tier pill styling mirrors ResultsTier — harvest gold for Critical,
 * amber for At Risk, green for Healthy.
 */
const TIER_PILL: Record<Tier, string> = {
  healthy: "bg-success text-success-foreground",
  at_risk: "bg-warning text-warning-foreground",
  critical: "bg-accent text-accent-foreground",
};

const TIER_BAR: Record<Tier, string> = {
  healthy: "bg-success",
  at_risk: "bg-warning",
  critical: "bg-accent",
};

export type DimensionBreakdownItem = {
  dimension: Dimension;
  subscore: number;
  tier: Tier;
};

type Props = {
  items: DimensionBreakdownItem[];
};

export function DimensionBreakdown({ items }: Props) {
  return (
    <ul className="space-y-4 md:space-y-5">
      {items.map((item) => {
        const copy = DIMENSION_COPY[item.dimension][item.tier];
        return (
          <li
            key={item.dimension}
            className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg md:text-xl uppercase tracking-wide text-foreground">
                  {DIMENSION_LABEL[item.dimension]}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {DIMENSION_TAGLINE[item.dimension]}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 font-heading text-[0.65rem] uppercase tracking-widest",
                    TIER_PILL[item.tier]
                  )}
                >
                  {TIER_LABEL[item.tier]}
                </span>
                <span className="font-velocity text-3xl md:text-4xl text-foreground tracking-wider leading-none">
                  {item.subscore}
                </span>
              </div>
            </div>

            <div
              className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={item.subscore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${DIMENSION_LABEL[item.dimension]} score: ${item.subscore} of 100`}
            >
              <div
                className={cn("h-full transition-smooth", TIER_BAR[item.tier])}
                style={{ width: `${item.subscore}%` }}
              />
            </div>

            <p className="mt-5 text-sm md:text-base leading-relaxed text-muted-foreground">
              {copy.interpretation}
            </p>

            <div className="mt-4 rounded-lg bg-secondary/60 p-4">
              <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                Next step
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {copy.nextStep}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
