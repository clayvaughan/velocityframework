import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes, essays, and podcast episodes on running the Velocity framework — launching later in 2026.",
};

export default function InsightsPage() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Coming later in 2026
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider">
            Insights
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            Field notes and essays from Clay. Short pieces on what&rsquo;s
            working, what&rsquo;s failing, and what we&rsquo;re changing in the
            framework this quarter. The podcast launches alongside.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <SectionHeader
            align="center"
            eyebrow="Get the first piece"
            title="First issue drops this summer"
            description="Leave your email and we'll deliver the first one the day it publishes."
          />
          <div className="mt-10 mx-auto max-w-xl">
            <HubSpotFormSlot
              formKey="insights_launch_waitlist"
              heading="Insights newsletter"
              subheading="Tagged as insights_subscriber: true"
              fields={[
                { name: "firstname", label: "First name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
              ]}
              workflow="insights_launch_v1"
              submitLabel="Subscribe"
            />
          </div>
        </div>
      </section>
    </>
  );
}
