"use client";

import { cn } from "@/lib/utils";

/**
 * 1–5 Likert scale input for the Culture Health Check.
 *
 * Mobile-first: five large tap-targets laid out in a row. Anchor labels
 * ("Strongly Disagree" / "Strongly Agree") sit beneath the row and shrink
 * to icons-only on the narrowest viewports.
 */

export type LikertValue = 1 | 2 | 3 | 4 | 5;

const OPTIONS: { value: LikertValue; label: string; short: string }[] = [
  { value: 1, label: "Strongly Disagree", short: "SD" },
  { value: 2, label: "Disagree", short: "D" },
  { value: 3, label: "Neutral", short: "N" },
  { value: 4, label: "Agree", short: "A" },
  { value: 5, label: "Strongly Agree", short: "SA" },
];

type Props = {
  value: LikertValue | null;
  onChange: (v: LikertValue) => void;
  name: string;
};

export function LikertScale({ value, onChange, name }: Props) {
  return (
    <fieldset className="w-full">
      <legend className="sr-only">Rate your agreement with this statement</legend>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-2 py-4 sm:py-5 cursor-pointer transition-smooth select-none",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                selected
                  ? "border-accent bg-accent text-accent-foreground shadow-glow"
                  : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  "font-velocity text-2xl sm:text-3xl tracking-wider",
                  selected ? "text-accent-foreground" : "text-foreground"
                )}
              >
                {opt.value}
              </span>
              <span
                className={cn(
                  "font-heading text-[0.6rem] sm:text-[0.65rem] uppercase tracking-widest text-center leading-tight",
                  selected
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span className="hidden sm:inline">{opt.label}</span>
                <span className="sm:hidden">{opt.short}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
