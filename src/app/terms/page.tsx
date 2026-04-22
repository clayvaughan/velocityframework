import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.domain}.`,
};

export default function TermsPage() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow space-y-6 text-sm md:text-base leading-relaxed text-foreground">
        <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
          Legal
        </p>
        <h1 className="font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider">
          Terms of Service
        </h1>
        <p className="text-muted-foreground">
          Last updated: April 21, 2026. <em>This is a placeholder template —
          final legal language to be reviewed with counsel before launch.</em>
        </p>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">1. Use of this site</h2>
        <p>
          You&rsquo;re welcome to browse, download resources, and use what you
          find on {siteConfig.domain}. The written content and downloadable
          resources are the intellectual property of Clayton Vaughan Strategies
          and licensed to you for your own use, not for resale or repackaging.
        </p>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">2. Workshop registration</h2>
        <p>
          FRE Certification Workshop registrations are governed by the separate
          Workshop Agreement you receive on acceptance. Cancellation and refund
          policy is described there.
        </p>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">3. Disclaimers</h2>
        <p>
          The tools and frameworks on this site are educational. We don&rsquo;t
          guarantee specific business outcomes. Your mileage will vary based on
          your team, your market, and what you actually do with the material.
        </p>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">4. Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="underline-offset-4 hover:underline"
          >
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
