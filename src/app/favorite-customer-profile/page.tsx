import type { Metadata } from "next";
import { Target, Users, Filter } from "lucide-react";
import { IntakeForm } from "@/components/fcp/IntakeForm";

export const metadata: Metadata = {
  title: "Favorite Customer Profile Worksheet",
  description:
    "Define the exact customer your business does its best work for. Used by your entire team for marketing, sales qualification, referrals, and proposals. Interactive tool grounded in the Heading section of Velocity.",
};

export default function FavoriteCustomerProfileLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Favorite Customer Profile · Heading pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            Know exactly who you do your best work for.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            The first step to better marketing isn&rsquo;t better messaging —
            it&rsquo;s a clearer picture of who you&rsquo;re trying to reach.
            This worksheet defines one to three Favorite Customer Profiles
            your entire team can use for marketing, sales qualification,
            referrals, and proposals.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
            15 minutes · Free · No account
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
              A shared definition, not a guess.
            </h2>
            <ul className="mt-4 space-y-4">
              <Bullet icon={<Users className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">1–3 Favorite Customer Profiles.</strong>{" "}
                Eight-section definitions covering who they are, how they come
                in, why they&rsquo;re a fit, what you say yes to, and when you
                say no.
              </Bullet>
              <Bullet icon={<Filter className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">Optional scope guardrails.</strong>{" "}
                If your business needs company-wide sales filters — geography,
                deal size, no-go work — add them before defining profiles.
              </Bullet>
              <Bullet icon={<Target className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A PDF to share.</strong>{" "}
                Branded worksheet with a summary table, deep-dive pages per
                FCP, and the guardrails. Email it to your leadership team for
                alignment.
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
