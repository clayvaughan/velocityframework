import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PillarTag } from "@/components/PillarTag";
import type { Resource } from "@/lib/resources";

type ResourceCardProps = {
  resource: Resource;
  className?: string;
};

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const href = resource.externalHref ?? `/toolbox/${resource.slug}`;
  const ctaLabel = resource.externalHref ? "Open" : "Download";
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <PillarTag pillar={resource.pillar} />
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          No. {resource.number}
        </span>
      </div>
      <h3 className="mt-5 font-heading text-lg md:text-xl tracking-wide">
        {resource.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">
        {resource.hook}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
          {resource.format}
        </span>
        <span className="inline-flex items-center gap-1 font-heading text-[0.7rem] uppercase tracking-widest text-accent-dark">
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
