"use client";

import { cn } from "@/lib/utils";
import { TOXINS, type ToxinId } from "@/lib/action-plan/toxins";

type Props = {
  selected: ToxinId[];
  onChange: (next: ToxinId[]) => void;
  prePickedFromHealthCheck?: boolean;
};

const MAX = 3;

export function ToxinPicker({ selected, onChange, prePickedFromHealthCheck }: Props) {
  function toggle(id: ToxinId) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
      return;
    }
    if (selected.length >= MAX) return;
    onChange([...selected, id]);
  }

  return (
    <div>
      <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
        Screen 1 of 4 · Identify
      </p>
      <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
        What&rsquo;s breaking your team?
      </h2>
      <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
        Culture doesn&rsquo;t fail because of what you lack. It fails because
        of what you tolerate. Pick the 1–3 cultural toxins hurting your team
        the most right now.
      </p>
      {prePickedFromHealthCheck ? (
        <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-foreground">
          We pre-selected these based on your Health Check. Keep them or change them.
        </p>
      ) : null}
      <p className="mt-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">
        Pick 1–3. Fewer is better — focus beats effort every time. ({selected.length}/{MAX} selected)
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {TOXINS.map((t) => {
          const isSelected = selected.includes(t.id);
          const disabled = !isSelected && selected.length >= MAX;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => toggle(t.id)}
                disabled={disabled}
                aria-pressed={isSelected}
                className={cn(
                  "w-full text-left rounded-xl border-2 p-5 transition-smooth",
                  "focus:outline-none focus:ring-2 focus:ring-accent/40",
                  isSelected
                    ? "border-accent bg-accent/10 shadow-card"
                    : disabled
                    ? "border-border bg-card opacity-50 cursor-not-allowed"
                    : "border-border bg-card hover:border-accent/60 hover:shadow-card"
                )}
              >
                <span className="font-heading text-sm uppercase tracking-wide text-foreground">
                  {t.title}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
