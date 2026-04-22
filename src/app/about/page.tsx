import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About Clay Vaughan",
  description:
    "Clay Vaughan is the founder of Good Agency and the author of Velocity: Less Chaos. More Profit. Real Growth.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5">
            <VisualPlaceholder
              filename="clay-headshot-about-900x1100.jpg"
              width={900}
              height={1100}
              label="Clay Vaughan — about page headshot"
              rounded="xl"
            />
          </div>
          <div className="lg:col-span-7">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              About the author
            </p>
            <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider">
              Clay Vaughan
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl">
              Founder of Good Agency. Author of <em>Velocity</em>. Working out
              of Austin, Texas.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow space-y-8 text-base md:text-lg leading-relaxed">
          <SectionHeader
            eyebrow="The short version"
            title="Built the framework by running it"
          />
          <p>
            Clay has spent the last decade inside companies under $50M in
            revenue — the ones past the startup scramble but still wrestling
            with the growth ceiling. The Heart → Heading → Hustle framework is
            what he built to run Good Agency, his own consultancy, before he
            ever wrote a page of <em>Velocity</em>.
          </p>
          <p>
            The book, published January 2026, is the playbook. This site is the
            toolkit — every worksheet, script, scorecard, and accountability
            map the book references, free and downloadable as they&rsquo;re
            released.
          </p>
          <p>
            Clay also runs the Fractional Revenue Executive (FRE) Certification
            with Luke Frazier, a two-day, twelve-seat working session in Austin
            that trains revenue leaders to implement the full framework inside
            a client business.
          </p>

          <div className="pt-6 flex flex-wrap gap-4">
            <Button asChild variant="cta" size="md">
              <Link href="/book">Read about the book</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/workshop">Workshop &amp; Certification</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Why this site exists"
            title="The book is the start, not the finish"
            description="Every chapter of Velocity references a worksheet, script, or scorecard. This site is where those resources live — free, downloadable, and updated as the framework evolves."
          />
        </div>
      </section>
    </>
  );
}
