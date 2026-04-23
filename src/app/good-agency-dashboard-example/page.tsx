import type { Metadata } from "next";
import { BarChart3, LayoutGrid, Target } from "lucide-react";
import { IntakeForm } from "@/components/dashboard-example/IntakeForm";

export const metadata: Metadata = {
  title: "Good Agency Dashboard Example",
  description:
    "See what a weekly dashboard that actually runs a business looks like. Four real dashboards from Good Agency — Leadership, Revenue, Operations, and Administration. Download the reference PDF.",
};

export default function GoodAgencyDashboardExampleLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Velocity Framework · Heading pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            See what a dashboard that actually runs a business looks like.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            Most dashboards become spreadsheets nobody opens. Clay&rsquo;s
            dashboards run the weekly rhythm of Good Agency — the metrics
            his leadership team reviews every Wednesday at 1:00 PM. Download
            the full reference PDF and use it as a template for your own.
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
              What&rsquo;s inside
            </p>
            <h2 className="font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
              Four dashboards that run every growing business.
            </h2>
            <ul className="mt-4 space-y-4">
              <Bullet icon={<LayoutGrid className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">One Leadership Dashboard.</strong>{" "}
                The 4 cross-functional metrics Clay&rsquo;s leadership team
                reviews weekly — the ones that determine whether the business
                is actually healthy.
              </Bullet>
              <Bullet icon={<BarChart3 className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">Three Department Dashboards.</strong>{" "}
                Revenue (Sales + Marketing), Operations (Delivery + Quality),
                and Business Administration (Finance + People). 15 metrics
                total, with targets.
              </Bullet>
              <Bullet icon={<Target className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">The framework behind it.</strong>{" "}
                Why every metric has an owner, a target, and a weekly cadence
                — and what separates a dashboard that drives Velocity from
                one that creates noise.
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
            Don&rsquo;t just chase numbers that look good on paper.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A dashboard that drives Velocity does three things every other
            dashboard doesn&rsquo;t: every metric has a named owner, every
            metric has a target, and every metric has a weekly cadence.
            Because by the time a monthly number comes in bad, the month is
            already gone.
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
