import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";

export const metadata: Metadata = {
  title: "Velocity Conference",
  description:
    "The annual Velocity Conference — details coming soon. Register interest and we'll notify you when dates are announced.",
};

export default function ConferencePage() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Coming
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider">
            Velocity Conference
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            One day, one room, every pillar. The annual gathering for readers,
            FREs, and revenue operators running the Velocity framework inside
            their businesses. Details drop this fall.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <SectionHeader
            align="center"
            eyebrow="Register interest"
            title="Get the invite first"
            description="No commitment — we'll email you when dates, location, and the agenda are announced."
          />
          <div className="mt-10 mx-auto max-w-xl">
            <HubSpotFormSlot
              formKey="conference_interest"
              heading="Conference notifications"
              subheading="Tagged as conference_interested: true"
              fields={[
                { name: "firstname", label: "First name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "company", label: "Company" },
                { name: "role", label: "Your role" },
              ]}
              workflow="conference_interest_v1"
              submitLabel="Notify me"
            />
          </div>
        </div>
      </section>
    </>
  );
}
