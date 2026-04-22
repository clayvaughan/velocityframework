import { cn } from "@/lib/utils";
import type { Pillar } from "@/lib/resources";

const pillarStyles: Record<Pillar, string> = {
  heart: "border-accent/60 text-accent-dark",
  heading: "border-primary/40 text-primary",
  hustle: "border-foreground/40 text-foreground",
};

const pillarLabel: Record<Pillar, string> = {
  heart: "Heart · Culture",
  heading: "Heading · Strategy",
  hustle: "Hustle · Execution",
};

type PillarTagProps = {
  pillar: Pillar;
  className?: string;
};

export function PillarTag({ pillar, className }: PillarTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-heading text-xs uppercase tracking-wider",
        pillarStyles[pillar],
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          pillar === "heart" && "bg-accent",
          pillar === "heading" && "bg-primary",
          pillar === "hustle" && "bg-foreground"
        )}
      />
      {pillarLabel[pillar]}
    </span>
  );
}
