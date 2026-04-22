import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pillar } from "@/lib/resources";
import { pillarMeta } from "@/lib/resources";

const pillarAccent: Record<Pillar, string> = {
  heart: "from-accent/20 to-transparent",
  heading: "from-primary/10 to-transparent",
  hustle: "from-foreground/10 to-transparent",
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
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5",
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
        <span className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
          {tagline}
        </span>
        <h3 className="font-velocity text-foreground mt-2 text-4xl md:text-5xl uppercase tracking-wider">
          {label}
        </h3>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-6 inline-flex items-center gap-1 font-heading text-xs uppercase tracking-wider text-accent-dark">
          Explore {label}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
