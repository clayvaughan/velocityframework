"use client";

import { cn } from "@/lib/utils";
import { TOXINS_BY_ID, type ToxinId } from "@/lib/action-plan/toxins";
import { WEEKLY_RHYTHMS, type WeeklyRhythmId } from "@/lib/action-plan/weekly-rhythms";

export type FocusAreaDetails = {
  sevenDayAction: string;
  weeklyRhythmId: WeeklyRhythmId | null;
  weeklyRhythmCustom: string | null;
};

type Props = {
  toxinId: ToxinId;
  index: number;
  total: number;
  value: FocusAreaDetails;
  onChange: (v: FocusAreaDetails) => void;
};

const inputClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-base text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

export function FocusAreaForm({
  toxinId,
  index,
  total,
  value,
  onChange,
}: Props) {
  const toxin = TOXINS_BY_ID[toxinId];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
      <div>
        <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
          Focus area {index + 1} of {total} · {toxin.title}
        </p>
        <h3 className="mt-2 font-heading text-xl md:text-2xl uppercase tracking-wide text-foreground">
          Your 7-day action and weekly rhythm
        </h3>
      </div>

      <label className="block space-y-2">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground">
          7-day action <span className="text-accent-dark">*</span>
        </span>
        <textarea
          value={value.sevenDayAction}
          onChange={(e) => onChange({ ...value, sevenDayAction: e.target.value })}
          rows={3}
          placeholder="What you'll do this week — specific, small, measurable. Example: 'Have a direct conversation with [name] about the gossip I noticed.'"
          className={inputClass}
        />
      </label>

      <div className="space-y-2">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground">
          Weekly rhythm <span className="text-accent-dark">*</span>
        </span>
        <div className="space-y-2">
          {WEEKLY_RHYTHMS.map((r) => {
            const isSel = value.weeklyRhythmId === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    weeklyRhythmId: r.id,
                    weeklyRhythmCustom: r.id === "custom" ? value.weeklyRhythmCustom ?? "" : null,
                  })
                }
                aria-pressed={isSel}
                className={cn(
                  "w-full text-left rounded-lg border-2 px-4 py-3 text-sm transition-smooth",
                  "focus:outline-none focus:ring-2 focus:ring-accent/40",
                  isSel
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-accent/60 hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            );
          })}
          {value.weeklyRhythmId === "custom" ? (
            <input
              value={value.weeklyRhythmCustom ?? ""}
              onChange={(e) =>
                onChange({ ...value, weeklyRhythmCustom: e.target.value })
              }
              placeholder="Describe the rhythm you'll install."
              className={inputClass}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
