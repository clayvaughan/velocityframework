import { cn } from "@/lib/utils";
import { TOXINS_BY_ID } from "@/lib/action-plan/toxins";
import { VIRTUES_BY_ID } from "@/lib/action-plan/virtues";
import type { ResolvedFocusArea } from "@/lib/action-plan/email-drafts";

type Props = {
  firstName: string;
  reassessmentDays: 30 | 60 | 90;
  reassessmentDateISO: string;
  focusAreas: ResolvedFocusArea[];
  accountabilityPartnerName: string | null;
  weeklyRhythmLabels: string[];
  className?: string;
};

export function PlanSummary({
  firstName,
  reassessmentDays,
  reassessmentDateISO,
  focusAreas,
  accountabilityPartnerName,
  weeklyRhythmLabels,
  className,
}: Props) {
  const formattedDate = new Date(reassessmentDateISO).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-2xl border-2 border-accent/30 bg-card p-6 md:p-10 shadow-elegant">
        <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
          Culture Action Plan · {reassessmentDays}-day
        </p>
        <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
          {firstName}&rsquo;s plan, through {formattedDate}.
        </h2>
      </div>

      <ol className="space-y-4 md:space-y-5">
        {focusAreas.map((f, i) => {
          const toxin = TOXINS_BY_ID[f.toxinId];
          const virtue = f.virtueId ? VIRTUES_BY_ID[f.virtueId] : null;
          return (
            <li
              key={i}
              className="rounded-2xl border border-border bg-card p-5 md:p-7 shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                  Focus area {i + 1} · {toxin.title}
                </p>
                {virtue ? (
                  <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-3 py-1 font-heading text-[0.65rem] uppercase tracking-widest">
                    Building {virtue.title}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {toxin.description}
              </p>
              <dl className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <dt className="font-heading text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Counter-move
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    {f.counterMoveText}
                  </dd>
                </div>
                <div>
                  <dt className="font-heading text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Weekly rhythm
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    {f.weeklyRhythmLabel}
                  </dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="font-heading text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    7-day action
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    {f.sevenDayAction}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl bg-primary text-primary-foreground p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent">
              Accountability partner
            </p>
            <p className="mt-1 text-primary-foreground">
              {accountabilityPartnerName ?? "Not named yet"}
            </p>
          </div>
          <div>
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent">
              Weekly rhythms
            </p>
            <ul className="mt-1 space-y-0.5 text-primary-foreground/80 text-sm">
              {weeklyRhythmLabels.map((l, i) => (
                <li key={i}>• {l}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent">
              Reassessment
            </p>
            <p className="mt-1 text-primary-foreground">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
