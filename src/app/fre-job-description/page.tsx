import type { Metadata } from "next";
import { ClipboardList, Compass, Users } from "lucide-react";
import { IntakeForm } from "@/components/fre-job-description/IntakeForm";

export const metadata: Metadata = {
  title: "FRE Job Description",
  description:
    "The full role definition for a Fractional Revenue Executive — responsibilities, competencies, character requirements, and what clients should expect. Use it to hire, evaluate, or become one.",
};

export default function FreJobDescriptionLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Velocity Framework · Heading pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            The job description for the role most growing businesses don&rsquo;t know they need to hire.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            A Fractional Revenue Executive unifies sales, marketing, and
            revenue operations into one disciplined Revenue Department.
            They lead from inside the team — not from a consultant&rsquo;s
            chair. Use this job description to define the role internally,
            post the position, or give it to a candidate you&rsquo;re
            already evaluating.
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
            Three reasons this document earns its keep.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <InsideCard
              icon={<ClipboardList className="h-6 w-6 text-accent-dark" />}
              title="The full role definition"
              body="Responsibilities, expectations, competencies, and what clients should expect from an FRE — laid out so you can hand this to a candidate, a board member, or a consultant evaluating the position."
            />
            <InsideCard
              icon={<Compass className="h-6 w-6 text-accent-dark" />}
              title="Built on the Velocity framework"
              body="The role is structured around Heart (culture and alignment), Heading (strategy and direction), and Hustle (execution and accountability). Every responsibility ties back to one of the three pillars from the book."
            />
            <InsideCard
              icon={<Users className="h-6 w-6 text-accent-dark" />}
              title="For hiring or becoming"
              body="Use it to recruit and define an FRE for your business. Or use it as the bar to clear if you're considering becoming one yourself through the FRE Certification Workshop."
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
              Sales and marketing, finally on the same team.
            </h2>
            <p className="text-muted-foreground">
              In Chapter 7 of <em>Velocity</em>, Clay argues that growth
              stalls not from lack of effort but from lack of alignment —
              two departments competing for credit instead of one Revenue
              Department running one strategy. The Fractional Revenue
              Executive is the role that closes that gap. One leader. One
              scoreboard. One unified operating rhythm.
            </p>
            <p className="text-muted-foreground">
              This document is the role definition Good Agency uses for
              its own FREs and the candidates Clay certifies. Use it as
              the bar — for hiring, evaluating, or becoming.
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
