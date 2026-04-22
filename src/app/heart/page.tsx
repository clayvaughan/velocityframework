import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";
import { resourcesByPillar, pillarMeta } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Heart — Culture",
  description:
    "The Heart pillar: culture. Accountability maps, the Culture Health Check, and the people work behind every growing company.",
};

const pillar = "heart" as const;
const resources = resourcesByPillar(pillar);

export default function HeartPage() {
  const meta = pillarMeta[pillar];

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Pillar 01 · {meta.tagline}
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-6xl md:text-8xl lg:text-9xl uppercase tracking-wider">
            Heart
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            {meta.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="cta" size="lg">
              <Link href="/health-survey">Take the Culture Health Check</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#resources">See Heart resources</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="resources" className="section-padding bg-gradient-download">
        <div className="container-wide">
          <SectionHeader
            tone="dark"
            eyebrow="Tools in the Heart pillar · Free downloads"
            title="Culture tools"
            description="Worksheets and frameworks for the culture side of the operating system. Released as they're finalized."
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
            title="A short email series on Heart"
            description="Four short emails from Clay across two weeks — one core idea per email, drawn from the Heart section of the book."
          />
          <div className="mt-10 mx-auto max-w-xl">
            <HubSpotFormSlot
              formKey="heart_nurture_subscribe"
              heading="Subscribe to the Heart series"
              subheading="Tagged as pillar_interest: heart"
              fields={[
                { name: "firstname", label: "First name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
              ]}
              workflow="heart_pillar_nurture_v1"
              submitLabel="Send me the series"
            />
          </div>
        </div>
      </section>
    </>
  );
}
