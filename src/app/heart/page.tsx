import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";
import { PillarTag } from "@/components/PillarTag";
import { resourcesByPillar, pillarMeta } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Heart — Culture",
  description:
    "The Heart pillar: culture. Accountability maps, the Culture Health Check, and the people work behind every growing company.",
};

const pillar = "heart" as const;
const heartResources = resourcesByPillar(pillar);
/**
 * Reorder for the Heart hub: put the Culture Action Plan (the prescription
 * paired to the Culture Health Check diagnostic) before the rest of the
 * heart tools. Other tabs (/toolbox, /book) keep their default order.
 */
const orderedHeartResources = [
  ...heartResources.filter((r) => r.slug === "culture-action-plan"),
  ...heartResources.filter((r) => r.slug !== "culture-action-plan"),
];

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
            eyebrow="Tools in the Heart pillar · Diagnostic, prescription, deep work"
            title="Culture tools"
            description="Start with the Health Check to see where you are. Build the Action Plan to decide what changes next. Use the rest for the deeper work."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Diagnostic — the Culture Health Check is a live interactive
                tool, not a download, so it renders as a hardcoded card
                linking out to /health-survey. */}
            <Link
              href="/health-survey"
              className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-3">
                <PillarTag pillar="heart" />
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3" /> Diagnostic
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg md:text-xl tracking-wide">
                Culture Health Check
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">
                A 5-minute, 15-question pulse check on your team&rsquo;s
                culture across five dimensions. Solo or send it to your whole
                team for an anonymous aggregate read.
              </p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                  Interactive quiz · 5 minutes
                </span>
                <span className="inline-flex items-center gap-1 font-heading text-[0.7rem] uppercase tracking-widest text-accent-dark">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {orderedHeartResources.map((r) => (
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
