import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { ResourceCard } from "@/components/ResourceCard";
import {
  resources,
  resourcesByPillar,
  pillarMeta,
  type Pillar,
} from "@/lib/resources";

export const metadata: Metadata = {
  title: "Toolbox",
  description:
    "All 13 Velocity resources in one place. Worksheets, scripts, scorecards, and accountability maps — released in phases, free to download.",
};

const order: Pillar[] = ["heart", "heading", "hustle"];

export default function ToolboxPage() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            The Toolbox
          </p>
          <h1 className="mt-4 font-velocity text-5xl md:text-7xl uppercase tracking-wider">
            Every tool, one place
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            Thirteen resources the book references, organized by pillar. Each
            one is short, practical, and stands on its own — no funnel tricks,
            no paywall. Grab what you need.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Total available: {resources.length + 1} resources
            (12 downloads + the Culture Health Check quiz).
          </p>
        </div>
      </section>

      {order.map((pillar) => {
        const group = resourcesByPillar(pillar);
        if (group.length === 0) return null;
        const meta = pillarMeta[pillar];
        return (
          <section
            key={pillar}
            id={pillar}
            className="section-padding odd:bg-background even:bg-gradient-section"
          >
            <div className="container-wide">
              <SectionHeader
                eyebrow={`Pillar · ${meta.tagline}`}
                title={meta.label}
                description={meta.description}
              />
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.map((r) => (
                  <ResourceCard key={r.slug} resource={r} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
