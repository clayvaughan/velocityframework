import { cn } from "@/lib/utils";

type Props = {
  current: number;
  total: number;
  className?: string;
};

export function QuizProgress({ current, total, className }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between">
        <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
          Question {current} of {total}
        </p>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {pct}%
        </p>
      </div>
      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full bg-accent transition-smooth"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
