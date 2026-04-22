import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.domain}.`,
};

export default function PrivacyPage() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow prose-like space-y-6 text-sm md:text-base leading-relaxed text-foreground">
        <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
          Legal
        </p>
        <h1 className="font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">
          Last updated: April 21, 2026. <em>This is a placeholder template —
          final legal language to be reviewed with counsel before launch.</em>
        </p>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">1. Who we are</h2>
        <p>
          {siteConfig.domain} is operated by Clayton Vaughan Strategies. When
          we say &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our,&rdquo; we mean
          Clayton Vaughan Strategies.
        </p>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">2. What we collect</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Information you provide through forms — typically name, email, company, role.</li>
          <li>Resource download and quiz completion activity.</li>
          <li>Standard web analytics (pages viewed, referrer, device type).</li>
        </ul>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">3. How we use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>To deliver the resource you requested.</li>
          <li>To send the nurture sequence associated with that resource.</li>
          <li>To improve the site and the framework.</li>
        </ul>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">4. Who we share it with</h2>
        <p>
          Our CRM (HubSpot), our email provider, and our analytics providers
          (Google Analytics 4, Plausible). We do not sell your information.
        </p>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">5. Your rights</h2>
        <p>
          You can unsubscribe from any email we send, request a copy of the
          information we hold on you, or request deletion by emailing{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="underline-offset-4 hover:underline"
          >
            {siteConfig.contactEmail}
          </a>
          .
        </p>

        <h2 className="font-heading text-xl uppercase tracking-wide pt-4">6. Changes</h2>
        <p>
          We&rsquo;ll post updates to this page. Material changes will also be
          announced by email to subscribers.
        </p>
      </div>
    </section>
  );
}
