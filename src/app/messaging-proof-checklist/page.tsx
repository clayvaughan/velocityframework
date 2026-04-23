import type { Metadata } from "next";
import { FileText, Sparkles, Target } from "lucide-react";
import { IntakeForm } from "@/components/messaging/IntakeForm";

export const metadata: Metadata = {
  title: "Messaging & Proof Checklist",
  description:
    "Lock your one-liner, audit your collateral, and build messaging that drives Velocity. Based on the Messaging & Proof Checklist from Chapter 10 of Velocity.",
};

export default function MessagingProofChecklistLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Messaging &amp; Proof · Heading pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            If you confuse, you lose.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            Lock your one-liner, audit your collateral, and build messaging
            that drives Velocity. Six sub-components from Chapter 10 of the
            book — one-liner worksheet, message map, case study template,
            testimonial prompts, collateral audit, CTA map — in one integrated
            flow.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
            15–20 minutes · Free · No account
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16 max-w-5xl">
          <div className="space-y-4">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              What you&rsquo;ll leave with
            </p>
            <h2 className="font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
              A message that ships.
            </h2>
            <ul className="mt-4 space-y-4">
              <Bullet icon={<Sparkles className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A locked one-liner.</strong>{" "}
                Problem → solution → success, in your customer&rsquo;s words.
                Ready to ship into your homepage, your sales opener, and your
                team&rsquo;s LinkedIn headlines.
              </Bullet>
              <Bullet icon={<FileText className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A collateral audit score.</strong>{" "}
                Honest read of the seven things every growing business needs
                in place — and a punch list for the gaps.
              </Bullet>
              <Bullet icon={<Target className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">CTAs that convert.</strong>{" "}
                One direct CTA, one transitional CTA, across three surfaces.
                No more 17-CTA homepages.
              </Bullet>
            </ul>
          </div>

          <div>
            <div className="rounded-2xl border-2 border-border bg-card p-6 md:p-8 shadow-elegant">
              <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
                Before we start
              </p>
              <h3 className="mt-2 font-heading text-xl uppercase tracking-wide text-foreground">
                A few details
              </h3>
              <div className="mt-6">
                <IntakeForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Bullet({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 flex-shrink-0">{icon}</span>
      <span className="text-base md:text-lg leading-relaxed text-muted-foreground">
        {children}
      </span>
    </li>
  );
}
