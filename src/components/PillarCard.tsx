import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pillar } from "@/lib/resources";
import { pillarMeta } from "@/lib/resources";

/**
 * Intentional dark surface — renders slate-black-on-cream-text regardless of
 * background context (dark-section rhythm or light-section standalone use).
 * Accent gradient at the top is tinted gold-family so each pillar reads as a
 * subtle variation on the brand accent against the dark card body.
 */
const pillarAccent: Record<Pillar, string> = {
  heart: "from-accent/30 to-transparent",
  heading: "from-accent-light/25 to-transparent",
  hustle: "from-primary-foreground/10 to-transparent",
};

type PillarCardProps = {
  pillar: Pillar;
  className?: string;
};

export function PillarCard({ pillar, className }: PillarCardProps) {
  const { label, tagline, description } = pillarMeta[pillar];

  return (
    <Link
      href={`/${pillar}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-accent/20 bg-primary-light text-primary-foreground p-6 md:p-8 shadow-elegant transition-smooth hover:shadow-glow hover:-translate-y-0.5",
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-80",
          pillarAccent[pillar]
        )}
      />
      <div className="relative flex-1 flex flex-col">
        <span className="font-heading text-xs uppercase tracking-widest text-primary-foreground/70">
          {tagline}
        </span>
        <h3 className="font-velocity text-primary-foreground mt-2 text-4xl md:text-5xl uppercase tracking-wider">
          {label}
        </h3>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-primary-foreground/80">
          {description}
        </p>
        <div className="mt-6 inline-flex items-center gap-1 font-heading text-xs uppercase tracking-wider text-accent">
          Explore {label}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
