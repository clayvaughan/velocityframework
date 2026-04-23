import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";
import { resourcesByPillar, pillarMeta } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Hustle — Execution",
  description:
    "The Hustle pillar: execution. Scorecards, sales scripts, dashboards, and the weekly rhythm that turns strategy into results.",
};

const pillar = "hustle" as const;
const hustleResources = resourcesByPillar(pillar);
/**
 * Reorder for the Hustle hub: put the Good Agency Scorecard Example first
 * — it's the first substantive interactive resource in the pillar and the
 * anchor that the other Hustle tools (sales script, dashboards, etc.) build
 * around. Other tabs (/toolbox) keep their default order.
 */
const FEATURED_HUSTLE_SLUGS = ["scorecard-example"];
const resources = [
  ...FEATURED_HUSTLE_SLUGS.map((slug) =>
    hustleResources.find((r) => r.slug === slug)
  ).filter((r): r is NonNullable<typeof r> => Boolean(r)),
  ...hustleResources.filter((r) => !FEATURED_HUSTLE_SLUGS.includes(r.slug)),
];

export default function HustlePage() {
  const meta = pillarMeta[pillar];

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Pillar 03 · {meta.tagline}
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-6xl md:text-8xl lg:text-9xl uppercase tracking-wider">
            Hustle
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            {meta.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="cta" size="lg">
              <Link href="/toolbox#hustle">See execution tools</Link>
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
            eyebrow="Tools in the Hustle pillar · Free downloads"
            title="Execution tools"
            description="Scorecards, scripts, and dashboards for the weekly rhythm."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-narrow">
          <SectionHeader
            align="center"
            eyebrow="Read the pillar email"
            title="A short email series on Hustle"
            description="Four short emails from Clay — one core idea per email, drawn from the Hustle section of the book."
          />
          <div className="mt-10 mx-auto max-w-xl">
            <HubSpotFormSlot
              formKey="hustle_nurture_subscribe"
              heading="Subscribe to the Hustle series"
              subheading="Tagged as pillar_interest: hustle"
              fields={[
                { name: "firstname", label: "First name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
              ]}
              workflow="hustle_pillar_nurture_v1"
              submitLabel="Send me the series"
            />
          </div>
        </div>
      </section>
    </>
  );
}
