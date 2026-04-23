import type { Metadata } from "next";
import { FileText, Layers, Ruler } from "lucide-react";
import { IntakeForm } from "@/components/scorecard-example/IntakeForm";

export const metadata: Metadata = {
  title: "Good Agency Scorecard Example",
  description:
    "The exact scorecard structure Good Agency uses for every role on the team — core values, GWC, OKRs, KPIs, responsibilities, and competencies. Download the reference PDF.",
};

export default function GoodAgencyScorecardExampleLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Velocity Framework · Hustle pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            The scorecard that turns expectations into accountability.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            Most companies measure output. Clay&rsquo;s scorecards measure
            output, character, and capacity — because a top performer
            delivering results while poisoning the culture isn&rsquo;t
            actually a top performer. This is the exact scorecard structure
            Good Agency uses for every role on the team. Download the
            reference PDF and adapt it for yours.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Reference PDF · 8 pages · Free
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16 max-w-5xl items-start">
          <div className="space-y-4">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              What you&rsquo;ll get
            </p>
            <h2 className="font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
              A scorecard worth stealing.
            </h2>
            <ul className="mt-4 space-y-4">
              <Bullet icon={<FileText className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A full worked example.</strong>{" "}
                A complete scorecard for a Director of Operations — core
                values, GWC, OKRs, KPIs with red/yellow/green targets,
                responsibilities, and competencies. Every section filled in.
              </Bullet>
              <Bullet icon={<Layers className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">Why each section matters.</strong>{" "}
                Scorecards fail when they&rsquo;re just KPI trackers.
                Clay&rsquo;s framework layers character and capacity alongside
                performance — so you&rsquo;re measuring the whole person, not
                just the output.
              </Bullet>
              <Bullet icon={<Ruler className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">The framework to build your own.</strong>{" "}
                Step-by-step guidance for adapting this structure to any role
                on your team, plus what to avoid when your scorecard turns
                into a checkbox exercise instead of a leadership tool.
              </Bullet>
            </ul>
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

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            From the book
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Accountability is love at scale.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A scorecard that sits in a Google Doc and gets reviewed quarterly
            is a file. A scorecard that drives Velocity is a monthly
            conversation that holds the weekly numbers accountable.
            That&rsquo;s the rhythm that turns expectations into
            accountability — without drama.
          </p>
        </div>
      </section>
    </>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-border bg-card">
        {icon}
      </span>
      <div className="text-sm md:text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </li>
  );
}
