import type { Metadata } from "next";
import Link from "next/link";
import { Check, MapPin, CalendarDays, Users2, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import { SectionHeader } from "@/components/SectionHeader";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "FRE Certification Workshop",
  description:
    "Two days with Clay Vaughan and Luke Frazier in Austin. Twelve seats. Become a certified Fractional Revenue Executive.",
};

/**
 * Workshop page — Phase 1.
 *
 * Content is a reasonable-defaults migration from velocitybook.com/workshop
 * per Clay's direction (migrate verbatim where source content is available;
 * fill with sensible defaults otherwise). Final polish to come from Luke.
 *
 * The source page is a Lovable SPA — raw HTML doesn't expose body content,
 * so this version pulls from the facts Clay confirmed:
 *   - $5,000 per attendee · Austin · June 25–26, 2026 · 12 seats
 *   - $1,500/year certification renewal
 *   - EARLYBIRD2026 saves $1,000 through May 31, 2026
 * Luke refines copy post-migration.
 */
const programDays = [
  {
    day: "Day 1",
    subtitle: "Heart + Heading",
    bullets: [
      "Accountability Maps — defining ownership at the leadership level",
      "Unified Revenue — collapsing marketing, sales, and RevOps into one team",
      "Favorite Customer Profile — built from reality, not aspiration",
      "Messaging & Proof — the one-liner, the message map, and the case study",
    ],
  },
  {
    day: "Day 2",
    subtitle: "Hustle + Certification",
    bullets: [
      "Scorecards — the weekly pulse that rolls up to quarterly goals",
      "Sales conversation design — the 6-part structure that wins",
      "Dashboards — what's on, what's off, and why",
      "FRE role playbook — first 90 days inside a client business",
      "Certification assessment + cohort Q&A",
    ],
  },
];

const faqs = [
  {
    q: "Do I need to have read Velocity before attending?",
    a: "Yes — the book is required reading. If you haven't read it, we'll send you a copy once you're accepted so you can work through it before the workshop.",
  },
  {
    q: "Who is this for?",
    a: "Revenue leaders, heads of growth, fractional operators, and consultants who want to run the full Heart → Heading → Hustle operating system inside a client business — not just advise on pieces of it.",
  },
  {
    q: "What does the $5,000 include?",
    a: "Two full days of working sessions with Clay and Luke, all materials, lunch both days, one year of FRE certification, access to the FRE network, and follow-up office hours after the workshop.",
  },
  {
    q: "How does certification renewal work?",
    a: "Certification renews annually at $1,500/year and keeps you listed in the FRE network, with continuing access to new tools, cohort office hours, and updates to the framework.",
  },
  {
    q: "Is there a discount?",
    a: "Use EARLYBIRD2026 at checkout to save $1,000. Expires May 31, 2026.",
  },
  {
    q: "Can I get a refund?",
    a: "Full refund up to 30 days before the workshop. Cancellations after that receive credit toward a future cohort.",
  },
];

export default function WorkshopPage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent">
              FRE Certification Workshop
            </p>
            <h1 className="font-velocity text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider leading-[0.95]">
              Become a Fractional Revenue Executive
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-primary-foreground/80 max-w-2xl">
              Two days with Clay Vaughan and Luke Frazier in Austin. Twelve
              seats total. Built for revenue leaders who want to run the
              Velocity framework inside a client business — not just quote
              from it.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-sm font-heading uppercase tracking-wider text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-accent" />
                Jun 25–26, 2026
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                Austin, TX
              </li>
              <li className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-accent" />
                12 seats
              </li>
              <li className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4 text-accent" />
                $5,000
              </li>
            </ul>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild variant="cta" size="lg">
                <Link href="#apply">Apply now</Link>
              </Button>
              <Button asChild variant="gold-outline" size="lg">
                <Link href="#program">See the program</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <VisualPlaceholder
              filename="cohort-hero-1200x900.jpg"
              width={1200}
              height={900}
              label="FRE cohort — workshop hero"
              rounded="xl"
            />
          </div>
        </div>
      </section>

      {/* ---------- Founder note ---------- */}
      <section className="section-padding bg-background">
        <div className="container-wide grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4">
            <VisualPlaceholder
              filename="clay-workshop-portrait-800x1000.jpg"
              width={800}
              height={1000}
              label="Clay Vaughan — workshop portrait"
              rounded="xl"
            />
          </div>
          <div className="lg:col-span-8 space-y-5">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              A note from Clay
            </p>
            <h2 className="font-velocity text-4xl md:text-5xl uppercase tracking-wider">
              Why this workshop exists
            </h2>
            <div className="space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
              <p>
                I wrote <em>Velocity</em> because I was tired of watching good
                operators try to duct-tape growth together from disconnected
                frameworks. Heart, Heading, and Hustle work together — or they
                don&rsquo;t work at all.
              </p>
              <p>
                The FRE Certification is for the people who want to walk into a
                client business and run the whole operating system. Luke and I
                built it for twelve people at a time because that&rsquo;s as
                many as we can coach directly in two days.
              </p>
              <p className="font-heading uppercase tracking-wide text-foreground">
                — Clay Vaughan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Program ---------- */}
      <section id="program" className="section-padding bg-gradient-section">
        <div className="container-wide">
          <SectionHeader
            eyebrow="The program"
            title="Two days, fully worked through"
            description="No slide marathons. Every hour is hands-on work against the Velocity tools, in a room with eleven other revenue leaders."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {programDays.map((d) => (
              <div
                key={d.day}
                className="rounded-xl border border-border bg-card p-8 shadow-card"
              >
                <p className="font-heading text-xs uppercase tracking-widest text-accent-dark">
                  {d.day}
                </p>
                <h3 className="mt-2 font-velocity text-3xl md:text-4xl uppercase tracking-wider">
                  {d.subtitle}
                </h3>
                <ul className="mt-6 space-y-3">
                  {d.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed">
                      <Check className="h-4 w-4 mt-1 flex-shrink-0 text-accent-dark" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Social proof ---------- */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <SectionHeader
            eyebrow="FRE Network"
            title="Certified FREs work with"
            description="Once certified, FREs are listed in the network and referred to companies under $50M in revenue looking for embedded revenue leadership."
          />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <VisualPlaceholder
                key={i}
                filename={`fre-client-logo-${i + 1}-240x120.png`}
                width={240}
                height={120}
                label={`FRE client logo #${i + 1}`}
                rounded="md"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Apply / Pay ---------- */}
      <section id="apply" className="section-padding bg-gradient-section">
        <div className="container-wide grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Apply for the cohort"
              title="Start with an application"
              description="At $5,000, Luke wants a short conversation before collecting payment — it's a tighter cohort and better fit for everyone. Submit the application and we'll respond within 2 business days."
            />
            <div className="mt-8">
              <HubSpotFormSlot
                formKey="workshop_application"
                heading="Workshop application"
                subheading="Routes to Luke Frazier for review. Applicants added to HubSpot with lifecycle stage 'Workshop Applicant'."
                fields={[
                  { name: "firstname", label: "First name", required: true },
                  { name: "lastname", label: "Last name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone", type: "tel" },
                  { name: "company", label: "Company", required: true },
                  { name: "role", label: "Your role", required: true },
                  {
                    name: "years_leadership",
                    label: "Years in revenue leadership",
                    type: "select",
                  },
                  {
                    name: "why_certification",
                    label: "Why do you want to be certified as an FRE?",
                    type: "textarea",
                    required: true,
                  },
                  {
                    name: "apply_to",
                    label: "Where would you apply this? (clients, own business, other)",
                    type: "textarea",
                  },
                ]}
                workflow="workshop_applicant_intake_v1"
                submitLabel="Submit application"
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="font-heading text-xs uppercase tracking-widest text-accent-dark">
                Already talked with Luke?
              </p>
              <h3 className="mt-2 font-heading text-xl uppercase tracking-wide">
                Secure your seat
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                If you&rsquo;ve already had the call and Luke has confirmed your
                fit, you can complete registration with the Stripe checkout
                below.
              </p>
              {/*
                Stripe Payment Link checkout. Live URL is configured in
                `siteConfig.stripeWorkshopPaymentLink`. Opens in a new tab so
                the user doesn't lose their place on /workshop. EARLYBIRD2026
                promo is enabled on the Payment Link itself (no client-side
                code needed). If we ever switch to embedded checkout, swap
                this anchor for Stripe Elements + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
              */}
              <div className="mt-5 rounded-lg border border-border bg-secondary/40 px-4 py-6 text-center">
                <p className="font-velocity text-3xl tracking-wider">
                  $5,000
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Use promo code <span className="font-mono text-foreground">EARLYBIRD2026</span>{" "}
                  for $1,000 off (expires May 31, 2026).
                </p>
                <a
                  href={siteConfig.stripeWorkshopPaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-stripe-payment-link
                  data-product="fre-certification-austin-2026-06"
                  className="mt-5 inline-flex h-12 items-center justify-center rounded-lg bg-accent px-6 font-heading uppercase tracking-wide text-accent-foreground shadow-card transition hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-dark"
                >
                  Secure your seat →
                </a>
                <p className="mt-3 text-[0.65rem] font-mono uppercase tracking-widest text-muted-foreground">
                  Secure checkout via Stripe · opens in a new tab
                </p>
              </div>
            </div>

            <div id="hire-an-fre" className="rounded-xl border border-border bg-primary text-primary-foreground p-6">
              <p className="font-heading text-xs uppercase tracking-widest text-accent">
                Looking to hire, not attend?
              </p>
              <h3 className="mt-2 font-heading text-xl uppercase tracking-wide">
                Engage a certified FRE
              </h3>
              <p className="mt-3 text-sm text-primary-foreground/80">
                Certified FREs embed with companies under $50M in revenue to
                run the full framework. Typical engagement: $10k–$20k/month,
                10–20 hours/week, multi-year.
              </p>
              <Button asChild variant="cta" size="md" className="mt-5">
                <Link href="/contact?inquiry=hire-fre">Tell us what you need</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <SectionHeader
            align="center"
            eyebrow="FAQ"
            title="Questions, answered"
          />
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {faqs.map((item) => (
              <li key={item.q} className="py-6">
                <h3 className="font-heading text-lg uppercase tracking-wide">
                  {item.q}
                </h3>
                <p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
