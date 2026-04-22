"use client";

import { cn } from "@/lib/utils";
import { TOXINS_BY_ID, type ToxinId } from "@/lib/action-plan/toxins";
import { VIRTUES, type VirtueId } from "@/lib/action-plan/virtues";

type Props = {
  toxinId: ToxinId;
  index: number;
  total: number;
  value: VirtueId | null;
  onChange: (v: VirtueId) => void;
};

export function VirtueTagger({ toxinId, index, total, value, onChange }: Props) {
  const toxin = TOXINS_BY_ID[toxinId];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
      <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        Focus area {index + 1} of {total} · {toxin.title}
      </p>
      <h3 className="mt-2 font-heading text-xl md:text-2xl uppercase tracking-wide text-foreground">
        Which virtue are you building?
      </h3>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
        Pick the virtue this focus area most reinforces. You&rsquo;ll measure
        the change by how this virtue shows up on your team.
      </p>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {VIRTUES.map((v) => {
          const isSel = value === v.id;
          return (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => onChange(v.id)}
                aria-pressed={isSel}
                className={cn(
                  "w-full h-full text-left rounded-xl border-2 p-5 transition-smooth",
                  "focus:outline-none focus:ring-2 focus:ring-accent/40",
                  isSel
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background hover:border-accent/60"
                )}
              >
                <p className="font-heading text-sm uppercase tracking-wide text-foreground">
                  {v.title}
                </p>
                <p className="mt-1 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                  {v.tagline}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
