import { cn } from "@/lib/utils";
import {
  TIER_LABEL,
  TIER_OVERALL,
  TIER_SURFACE,
  type Tier,
} from "@/lib/quiz/copy";

/**
 * Tier treatments per Clay's final spec:
 *   Healthy  → LIGHT card (cream bg, slate text, harvest gold accent)
 *   At Risk  → DARK card (slate bg, cream text, harvest gold accent)
 *   Critical → DARK card (slate bg, cream text, harvest gold accent)
 *
 * Never red. Harvest gold is the accent for all three; background tonality
 * is what differentiates At Risk / Critical from Healthy.
 */
const LIGHT_STYLES = {
  wrap: "bg-card text-foreground border-accent/30",
  badge: "bg-accent text-accent-foreground",
  score: "text-accent-dark",
  subhead: "text-muted-foreground",
  headline: "text-foreground",
  scoreSuffix: "text-muted-foreground",
};
const DARK_STYLES = {
  wrap: "bg-primary text-primary-foreground border-accent/30",
  badge: "bg-accent text-accent-foreground",
  score: "text-accent",
  subhead: "text-primary-foreground/80",
  headline: "text-primary-foreground",
  scoreSuffix: "text-primary-foreground/70",
};

type Props = {
  score: number;
  tier: Tier;
  firstName?: string;
};

export function ResultsTier({ score, tier, firstName }: Props) {
  const surface = TIER_SURFACE[tier];
  const styles = surface === "dark" ? DARK_STYLES : LIGHT_STYLES;
  const copy = TIER_OVERALL[tier];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 p-6 md:p-10 shadow-elegant",
        styles.wrap
      )}
    >
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-heading text-xs uppercase tracking-widest",
              styles.badge
            )}
          >
            {TIER_LABEL[tier]}
          </span>
          {firstName ? (
            <span
              className={cn(
                "font-heading text-xs uppercase tracking-widest",
                styles.subhead
              )}
            >
              Results for {firstName}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span
            className={cn(
              "font-velocity text-7xl md:text-8xl tracking-wider leading-[0.9]",
              styles.score
            )}
          >
            {score}
          </span>
          <span
            className={cn(
              "font-heading text-base md:text-lg uppercase tracking-wider",
              styles.scoreSuffix
            )}
          >
            / 100 overall culture score
          </span>
        </div>

        <div className="space-y-4">
          <h2
            className={cn(
              "font-velocity text-3xl md:text-4xl uppercase tracking-wider leading-tight",
              styles.headline
            )}
          >
            {copy.headline}
          </h2>
          <p
            className={cn(
              "text-base md:text-lg leading-relaxed max-w-3xl",
              styles.subhead
            )}
          >
            {copy.body}
          </p>
        </div>
      </div>
    </div>
  );
}
