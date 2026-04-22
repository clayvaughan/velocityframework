import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { SectionHeader } from "@/components/SectionHeader";
import { PillarCard } from "@/components/PillarCard";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";

export const metadata: Metadata = {
  title: "The Book",
  description:
    "Velocity: Less Chaos. More Profit. Real Growth. A 368-page playbook by Clay Vaughan for leaders running companies under $50M in revenue.",
};

export default function BookPage() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              The book
            </p>
            <h1 className="mt-4 font-velocity text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.95] tracking-wider">
              Velocity
            </h1>
            <p className="mt-4 font-heading text-lg md:text-2xl uppercase tracking-wide text-foreground/80">
              Less Chaos. More Profit. Real Growth.
            </p>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
              A 368-page playbook for leaders running companies under $50M in
              revenue. Organized around three pillars — Heart, Heading, Hustle —
              and every chapter maps to a worksheet, script, or scorecard on
              this site.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild variant="cta" size="lg">
                <Link href="/toolbox">Browse the tools</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="https://www.amazon.com/s?k=velocity+clay+vaughan"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Find it on Amazon
                </a>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md border-t border-border pt-8">
              <div>
                <dt className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Pages
                </dt>
                <dd className="mt-1 font-velocity text-3xl tracking-wider">368</dd>
              </div>
              <div>
                <dt className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Published
                </dt>
                <dd className="mt-1 font-velocity text-3xl tracking-wider">
                  Jan 26
                </dd>
              </div>
              <div>
                <dt className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Resources
                </dt>
                <dd className="mt-1 font-velocity text-3xl tracking-wider">13</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5">
            <VisualPlaceholder
              filename="book-cover-detail-900x1100.jpg"
              width={900}
              height={1100}
              label="Velocity book cover — detail"
              rounded="xl"
              className="shadow-elegant"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Inside the book"
            title="Three pillars, three parts"
            description="Read it in order or pull the chapter you need. Each pillar opens with the principle, walks through the operating system, and ends with the tools you'll use on this site."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <PillarCard pillar="heart" />
            <PillarCard pillar="heading" />
            <PillarCard pillar="hustle" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-narrow">
          <SectionHeader
            align="center"
            eyebrow="Readers"
            title="Already read it? Start here."
            description="Tell us what you read and we'll route you straight to the worksheet for the chapter you're working on."
          />
          <div className="mt-10 mx-auto max-w-xl">
            <HubSpotFormSlot
              formKey="book_reader_intake"
              heading="I've read the book — now what?"
              subheading="Tagged as book_reader_source: book_page · multi_pillar_interest"
              fields={[
                { name: "firstname", label: "First name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                {
                  name: "pillar_interest",
                  label: "Which pillar are you working on? (multi-select)",
                  type: "checkbox",
                },
                {
                  name: "role",
                  label: "Your role",
                  type: "text",
                },
              ]}
              workflow="reader_intake_v1"
              submitLabel="Get my next step"
            />
          </div>
        </div>
      </section>
    </>
  );
}
