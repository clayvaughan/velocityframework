"use client";

import { cn } from "@/lib/utils";
import { TOXINS_BY_ID, type ToxinId } from "@/lib/action-plan/toxins";
import { COUNTER_MOVES } from "@/lib/action-plan/counter-moves";

export type CounterMoveSelection = {
  counterMoveId: string | null;
  counterMoveCustom: string | null;
};

type Props = {
  toxinId: ToxinId;
  index: number;
  total: number;
  value: CounterMoveSelection;
  onChange: (v: CounterMoveSelection) => void;
};

const CUSTOM = "__custom__";

export function CounterMovePicker({
  toxinId,
  index,
  total,
  value,
  onChange,
}: Props) {
  const toxin = TOXINS_BY_ID[toxinId];
  const moves = COUNTER_MOVES[toxinId];

  function pick(id: string) {
    if (id === CUSTOM) {
      onChange({ counterMoveId: null, counterMoveCustom: value.counterMoveCustom ?? "" });
    } else {
      onChange({ counterMoveId: id, counterMoveCustom: null });
    }
  }

  const selectedValue = value.counterMoveCustom !== null ? CUSTOM : value.counterMoveId;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
      <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        Focus area {index + 1} of {total} · {toxin.title}
      </p>
      <h3 className="mt-2 font-heading text-xl md:text-2xl uppercase tracking-wide text-foreground">
        Pick the counter-move.
      </h3>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
        Each option below comes from the Heart section. Pick the one that
        fits your situation, or write your own.
      </p>

      <ul className="mt-6 space-y-3">
        {moves.map((m) => {
          const isSel = selectedValue === m.id;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => pick(m.id)}
                aria-pressed={isSel}
                className={cn(
                  "w-full text-left rounded-xl border-2 p-4 transition-smooth",
                  "focus:outline-none focus:ring-2 focus:ring-accent/40",
                  isSel
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background hover:border-accent/60"
                )}
              >
                <p className="text-sm md:text-base leading-relaxed text-foreground">
                  {m.text}
                </p>
                <p className="mt-3 rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-heading uppercase tracking-widest text-accent-dark">
                    What success looks like:
                  </span>{" "}
                  {m.behavioralDefinition}
                </p>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => pick(CUSTOM)}
            aria-pressed={selectedValue === CUSTOM}
            className={cn(
              "w-full text-left rounded-xl border-2 border-dashed p-4 transition-smooth",
              selectedValue === CUSTOM
                ? "border-accent bg-accent/10"
                : "border-border bg-background hover:border-accent/60"
            )}
          >
            <p className="font-heading text-sm uppercase tracking-wide text-foreground">
              Write your own counter-move
            </p>
          </button>
          {selectedValue === CUSTOM ? (
            <textarea
              value={value.counterMoveCustom ?? ""}
              onChange={(e) =>
                onChange({
                  counterMoveId: null,
                  counterMoveCustom: e.target.value,
                })
              }
              rows={3}
              placeholder="Describe the specific move you'll make."
              className="mt-3 w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          ) : null}
        </li>
      </ul>
    </div>
  );
}
