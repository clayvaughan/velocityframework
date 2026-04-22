import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Clay Vaughan and the Velocity Framework team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-narrow text-center">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Get in touch
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider">
            Contact
          </h1>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto">
            Questions about the book, the workshop, or hiring a Fractional
            Revenue Executive? Use the form below — it routes to the right
            person.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Or email us directly at{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="underline-offset-4 hover:underline text-foreground"
            >
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <HubSpotFormSlot
            formKey="contact_general"
            heading="Send a message"
            subheading="Routes to Clay, Luke, or general inbox based on inquiry type."
            fields={[
              { name: "firstname", label: "First name", required: true },
              { name: "lastname", label: "Last name" },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "company", label: "Company" },
              {
                name: "inquiry_type",
                label: "What's this about?",
                type: "select",
                required: true,
              },
              {
                name: "message",
                label: "Message",
                type: "textarea",
                required: true,
              },
            ]}
            workflow="contact_router_v1"
            submitLabel="Send message"
          />
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-narrow">
          <SectionHeader
            align="center"
            title="Looking for a specific path?"
            description="Jump straight to the resource or program you came for."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3 text-sm">
            <li className="rounded-xl border border-border bg-card p-5">
              <p className="font-heading uppercase text-xs tracking-widest text-accent-dark">
                Workshop
              </p>
              <p className="mt-2 text-muted-foreground">
                Apply to the FRE Certification in Austin.
              </p>
              <Link
                href="/workshop"
                className="mt-3 inline-flex font-heading text-xs uppercase tracking-wider underline-offset-4 hover:underline"
              >
                Apply →
              </Link>
            </li>
            <li className="rounded-xl border border-border bg-card p-5">
              <p className="font-heading uppercase text-xs tracking-widest text-accent-dark">
                Toolbox
              </p>
              <p className="mt-2 text-muted-foreground">
                All 13 Velocity resources, ready to download.
              </p>
              <Link
                href="/toolbox"
                className="mt-3 inline-flex font-heading text-xs uppercase tracking-wider underline-offset-4 hover:underline"
              >
                Browse →
              </Link>
            </li>
            <li className="rounded-xl border border-border bg-card p-5">
              <p className="font-heading uppercase text-xs tracking-widest text-accent-dark">
                Hire an FRE
              </p>
              <p className="mt-2 text-muted-foreground">
                Engage a certified FRE for your revenue team.
              </p>
              <Link
                href="/workshop#hire-an-fre"
                className="mt-3 inline-flex font-heading text-xs uppercase tracking-wider underline-offset-4 hover:underline"
              >
                Learn more →
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
