import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { ToolboxCTASection } from "@/components/ToolboxCTASection";
import { resourcesByPillar, pillarMeta } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Heading — Strategy",
  description:
    "The Heading pillar: strategy. Unified revenue teams, Favorite Customer Profile, messaging & proof, and the FRE role.",
};

const pillar = "heading" as const;
const headingResources = resourcesByPillar(pillar);
/**
 * Reorder for the Heading hub: put the live interactive and reference tools
 * first — FCP Worksheet, Messaging & Proof Checklist, Dashboard Example.
 * The remaining placeholder-backed resources keep their default order after.
 */
const FEATURED_HEADING_SLUGS = [
  "fcp-worksheet",
  "messaging-proof-bundle",
  "unified-revenue-map",
  "dashboard-example",
  "fre-job-description",
];
const resources = [
  ...FEATURED_HEADING_SLUGS.map((slug) =>
    headingResources.find((r) => r.slug === slug)
  ).filter((r): r is NonNullable<typeof r> => Boolean(r)),
  ...headingResources.filter((r) => !FEATURED_HEADING_SLUGS.includes(r.slug)),
];

export default function HeadingPage() {
  const meta = pillarMeta[pillar];

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Pillar 02 · {meta.tagline}
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-6xl md:text-8xl lg:text-9xl uppercase tracking-wider">
            Heading
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            {meta.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="cta" size="lg">
              <Link href="/toolbox#heading">See strategy tools</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/workshop">Workshop &amp; Certification</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="resources" className="section-padding bg-gradient-download">
        <div className="container-wide">
          <SectionHeader
            tone="dark"
            eyebrow="Tools in the Heading pillar · Free downloads"
            title="Strategy tools"
            description="Worksheets and templates for the strategy side of the operating system. Released as they're finalized."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      </section>

      <ToolboxCTASection />
    </>
  );
}
