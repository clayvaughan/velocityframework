import Link from "next/link";
import { ArrowRight, BookOpen, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { PillarCard } from "@/components/PillarCard";
import { ResourceCard } from "@/components/ResourceCard";
import { SectionHeader } from "@/components/SectionHeader";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";
import { resources } from "@/lib/resources";
import { siteConfig } from "@/config/site";

const featuredResources = resources.slice(0, 3);

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 animate-fade-in-up">
            <p className="font-heading text-xs md:text-sm uppercase tracking-[0.3em] text-accent-dark">
              The Velocity Framework
            </p>
            <h1 className="mt-5 font-velocity text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wider">
              Less Chaos.
              <br />
              More Profit.
              <br />
              <span className="text-accent-dark">Real Growth.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg md:text-xl leading-relaxed text-muted-foreground">
              The public tools and resource library for Clay Vaughan&rsquo;s
              book <em>Velocity</em> — worksheets, scripts, scorecards, and
              accountability maps for Heart, Heading, and Hustle.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild variant="cta" size="lg">
                <Link href="/toolbox">
                  Browse the Toolbox
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/book">Get the Book</Link>
              </Button>
              <Button asChild variant="link" size="lg">
                <a
                  href={siteConfig.amazonBookUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Buy on Amazon
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-muted-foreground font-heading">
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-accent-dark" />
                368-page playbook
              </span>
              <span className="inline-flex items-center gap-2">
                <Download className="h-3.5 w-3.5 text-accent-dark" />
                13 resources, no paywall
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-accent-dark" />
                FRE Certification cohort
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <VisualPlaceholder
                filename="book-cover-hero-3d.png"
                width={1500}
                height={1383}
                label="Velocity book by Clay Vaughan — 3D cover"
                rounded="none"
                className="drop-shadow-2xl mx-auto w-full object-contain"
              />
              <div className="absolute -bottom-5 -left-5 hidden md:block glass rounded-xl px-5 py-3">
                <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                  Published
                </p>
                <p className="font-velocity text-2xl tracking-wider">
                  Jan 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Three pillars ---------- */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <SectionHeader
            eyebrow="The three pillars"
            title="Heart. Heading. Hustle."
            description="Every resource on this site maps to one of the three pillars of the Velocity framework. Culture, strategy, execution — built to be used in order, but read in any order."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <PillarCard pillar="heart" />
            <PillarCard pillar="heading" />
            <PillarCard pillar="hustle" />
          </div>
        </div>
      </section>

      {/* ---------- Featured resources ---------- */}
      <section className="section-padding bg-gradient-section">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeader
              eyebrow="The toolbox"
              title="Download what you read about"
              description="Every worksheet, script, and scorecard the book references, free. Released in phases — newest on top."
            />
            <Button asChild variant="link" size="sm">
              <Link href="/toolbox">
                View all 13 resources
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredResources.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- About strip ---------- */}
      <section className="section-padding bg-background">
        <div className="container-wide grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-4">
            <VisualPlaceholder
              filename="clay-headshot-primary-800x1000.jpg"
              width={800}
              height={1000}
              label="Clay Vaughan headshot — primary"
              rounded="xl"
            />
          </div>
          <div className="lg:col-span-8 space-y-5">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              About the author
            </p>
            <h2 className="font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider">
              Clay Vaughan
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl">
              Clay is the founder of Good Agency and the author of{" "}
              <em>Velocity: Less Chaos. More Profit. Real Growth.</em> He built
              the Heart → Heading → Hustle framework the same way he built the
              agency — by running it on real companies before writing a word
              about it.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" size="md">
                <Link href="/about">More about Clay</Link>
              </Button>
              <Button asChild variant="link" size="md">
                <Link href="/book">
                  Read about the book
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Workshop teaser ---------- */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent">
              FRE Certification · Austin · June 25–26, 2026
            </p>
            <h2 className="font-velocity text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider">
              Become a Fractional Revenue Executive
            </h2>
            <p className="text-lg leading-relaxed text-primary-foreground/80 max-w-2xl">
              Two days with Clay Vaughan and Luke Frazier. Twelve seats.
              Structured to turn revenue leaders into FREs who can run the
              entire Heart → Heading → Hustle operating system inside a client
              business.
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-primary-foreground/70">
              <li>$5,000 · 12 seats total</li>
              <li>Save $1,000 with <span className="font-mono text-accent">EARLYBIRD2026</span> (thru May 31)</li>
              <li>$1,500 / year renewal</li>
            </ul>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild variant="cta" size="lg">
                <Link href="/workshop">Apply for the Workshop</Link>
              </Button>
              <Button asChild variant="gold-outline" size="lg">
                <Link href="/workshop#program">See the program</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <VisualPlaceholder
              filename="cohort-photo-past-1200x800.jpg"
              width={1200}
              height={800}
              label="Past FRE cohort — group photo"
              rounded="xl"
            />
          </div>
        </div>
      </section>

      {/* ---------- Newsletter capture ---------- */}
      <section className="section-padding bg-gradient-subtle">
        <div className="container-narrow">
          <SectionHeader
            align="center"
            eyebrow="Get new releases"
            title="Get the next resource first"
            description="One short email when a new worksheet, script, or scorecard goes live. No spam, no drip, no funnel tricks — just a heads-up."
          />
          <div className="mt-10 mx-auto max-w-xl">
            <HubSpotFormSlot
              formKey="homepage_newsletter"
              heading="Release notifications"
              subheading="Tagged as book_reader_source: homepage"
              fields={[
                { name: "firstname", label: "First name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
              ]}
              workflow="welcome_sequence_v1"
              submitLabel="Subscribe"
            />
          </div>
        </div>
      </section>
    </>
  );
}
