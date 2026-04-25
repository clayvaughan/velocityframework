import type { Metadata } from "next";
import { BookOpen, Building2, RefreshCw } from "lucide-react";
import { IntakeForm } from "@/components/trust-building-script/IntakeForm";

export const metadata: Metadata = {
  title: "The Sample Trust-Building Script",
  description:
    "The exact sales script Luke Frazier built for a boutique wedding venue — 10 coached sections covering pre-arrival hospitality through final farewell. The living example every FRE Clay certifies studies first.",
};

export default function SampleTrustBuildingScriptLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Velocity Framework · Hustle pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            The exact sales script that turned a venue tour into a trusted relationship.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            Most sales scripts sound like sales scripts. The Sample
            Trust-Building Script sounds like a thoughtful conversation
            between two people — because that&rsquo;s what it is. Luke
            Frazier built this for a boutique wedding venue as a living
            example of how to structure a high-trust, high-conversion sales
            meeting. Every FRE Clay certifies studies this first.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Reference PDF · Living document · Free
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            What&rsquo;s inside
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Three reasons this script works.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <InsideCard
              icon={<BookOpen className="h-6 w-6 text-accent-dark" />}
              title="Ten coached sections"
              body="From pre-arrival hospitality setup through the final farewell. Every section includes word-for-word scripts plus coaching tips on the psychological moves behind the language."
            />
            <InsideCard
              icon={<Building2 className="h-6 w-6 text-accent-dark" />}
              title="Built for a real business"
              body="This isn't a generic template. It's the actual script the example client uses during a venue tour — a $20K+ decision often made in 90 minutes. Adapt the structure to your industry; the principles work anywhere trust matters."
            />
            <InsideCard
              icon={<RefreshCw className="h-6 w-6 text-accent-dark" />}
              title="Living document"
              body="Luke and Clay update this script as they learn from FREs implementing it with clients. The PDF you download reflects the latest version, always."
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16 max-w-5xl items-start">
          <div className="space-y-4">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              From the book
            </p>
            <h2 className="font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
              Sales that feel like service.
            </h2>
            <p className="text-muted-foreground">
              In the Hustle section of <em>Velocity</em>, Clay argues that
              execution isn&rsquo;t a personality trait — it&rsquo;s a system.
              The Trust-Building Script is that system for the conversation
              where most businesses lose their highest-stakes deals: the
              first meeting. Every section is designed to slow down the
              information dump, speed up the trust, and give the prospect
              a reason to say yes that isn&rsquo;t about price.
            </p>
            <p className="text-muted-foreground">
              The script works because it treats the sale as the beginning
              of a relationship, not the end of a pursuit. Read it once,
              practice it out loud, adapt it to your industry — and use it
              at your next high-stakes meeting.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 md:p-8 shadow-card">
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
              Free download
            </p>
            <h3 className="mt-3 font-velocity text-foreground text-2xl md:text-3xl uppercase tracking-wider leading-tight">
              Grab the PDF
            </h3>
            <div className="mt-6">
              <IntakeForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InsideCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
        {icon}
      </span>
      <h3 className="mt-4 font-heading text-lg uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
