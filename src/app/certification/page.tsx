import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  MapPin,
  Users2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Velocity Fractional Certification",
  description:
    "Become certified to deploy the Velocity Framework as a Fractional Revenue Executive. Two-day intensive in Austin, TX. Limited to 12 seats. June 25–26, 2026.",
};

const STRIPE = siteConfig.stripeWorkshopPaymentLink;
const AMAZON = siteConfig.amazonBookUrl;
const LUKE_EMAIL = "luke@goodagency.com";

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------

const heroChecks = [
  "Complete fractional toolkit and templates",
  "Private network for referrals",
  "Field-tested frameworks, not theory",
] as const;

const introBullets = [
  "Unite marketing, sales, and revenue operations into one system",
  "Earn what executives earn through multi-year retainers",
  "Deliver real results clients can build a business around",
  "Own the entire revenue function as a strategic leader",
] as const;

const personas = [
  {
    title: "Senior Marketing / Sales Leaders",
    body: "Ready to own the full revenue function and earn executive-level fees.",
  },
  {
    title: "Agency Owners and Consultants",
    body: "Evolving from service provider to strategic partner.",
  },
  {
    title: "Internal Revenue Leaders",
    body: "Unifying teams with a proven framework that delivers measurable results.",
  },
] as const;

const frameworkColumns = [
  {
    pillar: "Heart",
    subtitle: "Culture That Fuels Growth",
    bullets: [
      "Define what good business means for your team",
      "Build norms around hospitality, humility, and hustle",
      "Create internal accountability standards",
      "Remove cultural toxins and install virtues",
      "Establish response standards and wow-moment protocols",
    ],
  },
  {
    pillar: "Heading",
    subtitle: "Systems That Build Momentum",
    bullets: [
      "Merge marketing and sales into one revenue department",
      "Set clear baselines and 90-day goals",
      "Build foundational sales collateral and trust-building scripts",
      "Train your team with consultative sales methodology",
      "Create repeatable processes that drive predictable growth",
    ],
  },
  {
    pillar: "Hustle",
    subtitle: "Rhythms That Sustain Growth",
    bullets: [
      "Weekly 90-minute revenue meetings with clear accountability",
      "Monthly 1:1 reviews for coaching and development",
      "Quarterly strategy offsites to recalibrate",
      "Annual vision resets to align long-term goals",
      "Healthy hustle policies that prevent burnout",
    ],
  },
] as const;

const whyAttend = [
  "Master the Velocity Framework — Heart, Heading, Hustle as one unified system",
  "Earn your certification — official credential to lead unified revenue departments",
  "Deploy proven execution rhythms — weekly, quarterly, and annual systems for predictable growth",
  "Use AI-enhanced tools — call scoring, CRM intelligence, and pipeline forecasting",
  "Join a real community — network with practitioners doing this work in real businesses",
] as const;

const walkAway = [
  "Repeatable framework that creates predictable revenue growth",
  "Official Fractional Revenue Executive certification",
  "Complete toolkit with templates, scripts, and proven methodologies",
  "Private network for collaboration and referrals",
  "Confidence to charge what this work earns: $10K to $20K monthly retainers",
] as const;

const beforeRows = [
  "Siloed teams, constant blame cycles",
  "Competing on price and hours",
  "No proven framework to follow",
  "Unpredictable growth patterns",
] as const;

const afterRows = [
  "Unified revenue department",
  "$10K to $20K monthly retainers",
  "Repeatable Velocity system",
  "Predictable, scalable revenue",
] as const;

const includes = [
  "Official Fractional Revenue Executive certification",
  "All meals, including fine dining at Tilly's at Camp Lucy",
  "Complete frameworks and templates",
  "Premium welcome kit",
  "One year of private community access",
  "Co-branded marketing materials",
] as const;

type Faq = { q: string; a: string };

const programFaqs: Faq[] = [
  {
    q: "Who should attend this certification?",
    a: "Senior marketing or sales leaders with 5+ years of leadership experience, agency owners ready to move into fractional executive roles, and consultants who embody hospitality, humility, and hustle. You should be ready to charge $10K to $20K monthly retainers and deliver real results.",
  },
  {
    q: "What makes this different from other certifications?",
    a: "This is the only certification for Fractional Revenue Executives, developed by Clay Vaughan based on real-world implementations. You'll master the Velocity Framework — Heart, Heading, Hustle — that has generated significant client revenue across multiple industries.",
  },
  {
    q: "Is this for agencies or internal leaders?",
    a: "Both. Whether you're serving multiple clients or leading revenue transformation within your organization, the Velocity Framework gives you a system to unify marketing, sales, and revenue operations.",
  },
  {
    q: "What's included in the investment?",
    a: "Two full days of intensive training, official certification, all meals including fine dining at Tilly's, premium welcome kit, complete frameworks and templates, one year of private community access, and co-branded marketing materials.",
  },
];

const logisticsFaqs: Faq[] = [
  {
    q: "Where is it held?",
    a: "Austin, Texas area. Exact venue details are shared with accepted attendees. Includes evening hospitality at Tilly's at Camp Lucy, one of Austin's finest restaurants.",
  },
  {
    q: "Can I bring a team member?",
    a: "Yes. Contact us about team pricing for groups of three or more from the same organization.",
  },
  {
    q: "When is the next certification?",
    a: "The next certification is June 25–26, 2026 in Austin, TX. Secure your spot at the link above. Limited to 12 seats per cohort.",
  },
];

const investmentFaqs: Faq[] = [
  {
    q: "What's the refund policy?",
    a: "30-day money-back guarantee. Notify us within 30 days of payment for a full refund.",
  },
  {
    q: "What support do I get after certification?",
    a: "Private community for collaboration, quarterly check-ins, framework updates, ongoing professional development, and direct access to Clay and the Velocity team.",
  },
  {
    q: "Can I use the Velocity brand and materials?",
    a: "Yes. Certified practitioners receive licensing to use the framework, methodologies, and materials. Annual renewal maintains licensing rights and provides updates.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CertificationPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. Hero                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-wide max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 border border-accent/30 px-4 py-1.5 text-[0.65rem] font-heading uppercase tracking-widest text-accent">
            <Users2 className="h-3.5 w-3.5" />
            Limited to 12 seats · June 25–26, 2026 · Austin, TX
          </div>
          <h1 className="mt-6 font-velocity text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider leading-[0.95]">
            The Velocity Fractional Certification
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-primary-foreground/85">
            Become certified to deploy the Velocity Framework as a Fractional
            Revenue Executive. The work commands $10K to $20K monthly
            retainers and unifies marketing, sales, and revenue under one
            proven system.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-4 py-2 text-sm text-accent">
            Use code <span className="font-mono font-bold">EARLYBIRD2026</span>{" "}
            at checkout to save $1,000
          </div>

          <div className="mt-8">
            <Button asChild variant="cta" size="lg">
              <Link
                href={STRIPE}
                target="_blank"
                rel="noopener noreferrer"
              >
                Secure your spot
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3 max-w-3xl">
            {heroChecks.map((c) => (
              <li
                key={c}
                className="flex items-start gap-2 text-sm text-primary-foreground/85"
              >
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                <span>{c}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-primary-foreground/70 max-w-2xl">
            Limited to 12 seats per cohort. Bringing team members? Email{" "}
            <a
              href={`mailto:${LUKE_EMAIL}`}
              className="underline underline-offset-2 hover:text-accent transition-smooth"
            >
              {LUKE_EMAIL}
            </a>{" "}
            for bulk discounts.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Intro                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Why this exists
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Become the Leader Who Unifies Revenue
          </h2>
          <p className="mt-4 text-lg text-muted-foreground italic">
            Fractional Revenue Executives don&rsquo;t just advise. They lead.
          </p>

          <ul className="mt-8 space-y-3 max-w-3xl">
            {introBullets.map((b) => (
              <li key={b} className="flex gap-3 text-base md:text-lg leading-relaxed text-foreground">
                <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-accent-dark" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-card">
            <p className="font-heading text-xs uppercase tracking-widest text-accent-dark text-center">
              The Velocity Progression
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {[
                { label: "Heart", sub: "Culture" },
                { label: "Heading", sub: "Strategy" },
                { label: "Hustle", sub: "Execution" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-4 md:gap-6">
                  <div className="text-center">
                    <p className="font-velocity text-3xl md:text-4xl uppercase tracking-wider text-foreground">
                      {step.label}
                    </p>
                    <p className="mt-1 font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                      {step.sub}
                    </p>
                  </div>
                  {i < 2 ? (
                    <ArrowRight className="h-6 w-6 text-accent flex-shrink-0" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Who Should Attend                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Who it&rsquo;s for
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Who Should Attend
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl">
            A workshop for senior leaders with 5+ years in leadership roles.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {personas.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
              >
                <h3 className="font-heading text-lg md:text-xl uppercase tracking-wide text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-3xl text-base md:text-lg leading-relaxed text-foreground italic">
            You embody hospitality (client-first), humility (continuous
            learning), and hustle (relentless execution).
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Built On The Velocity Framework                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Built on the book
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Built on the Velocity Framework
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
            This certification brings Clay Vaughan&rsquo;s proven framework to
            life through hands-on application with the author himself. Learn
            the complete Heart → Heading → Hustle system and join a network
            of practitioners deploying Velocity in real businesses.
          </p>

          <div className="mt-8">
            <Button asChild variant="gold-outline" size="md">
              <Link
                href={AMAZON}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy the book on Amazon
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. The Velocity Framework Breakdown                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-subtle">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              The framework
            </p>
            <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
              The Velocity Framework
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              A proven system that unifies culture, strategy, and execution.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {frameworkColumns.map((col) => (
              <div
                key={col.pillar}
                className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
              >
                <p className="font-velocity text-3xl md:text-4xl uppercase tracking-wider text-foreground">
                  {col.pillar}
                </p>
                <p className="mt-2 font-heading text-sm uppercase tracking-wide text-accent-dark">
                  {col.subtitle}
                </p>
                <ul className="mt-6 space-y-3">
                  {col.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-foreground">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent-dark" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border-2 border-accent/40 bg-accent/5 p-6 md:p-8 text-center">
            <p className="font-velocity text-2xl md:text-3xl uppercase tracking-wider text-foreground">
              Culture + Systems + Rhythm = Predictable Growth
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. What You'll Experience                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              The experience
            </p>
            <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
              What You&rsquo;ll Experience
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Two intensive days designed to transform you into a confident
              Fractional Revenue Executive.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <h3 className="font-heading text-lg md:text-xl uppercase tracking-wide text-foreground">
                Why Attend
              </h3>
              <ul className="mt-6 space-y-3">
                {whyAttend.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-sm md:text-base leading-relaxed text-foreground"
                  >
                    <Check className="h-4 w-4 mt-1 flex-shrink-0 text-accent-dark" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <h3 className="font-heading text-lg md:text-xl uppercase tracking-wide text-foreground">
                What You&rsquo;ll Walk Away With
              </h3>
              <ul className="mt-6 space-y-3">
                {walkAway.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-sm md:text-base leading-relaxed text-foreground"
                  >
                    <Check className="h-4 w-4 mt-1 flex-shrink-0 text-accent-dark" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 md:p-8">
              <p className="font-heading text-xs uppercase tracking-widest text-destructive">
                Before Certification
              </p>
              <ul className="mt-4 space-y-2.5">
                {beforeRows.map((r) => (
                  <li key={r} className="flex gap-3 text-sm md:text-base text-foreground">
                    <X className="h-4 w-4 mt-1 flex-shrink-0 text-destructive" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-success/30 bg-success/5 p-6 md:p-8">
              <p className="font-heading text-xs uppercase tracking-widest text-success">
                After Certification
              </p>
              <ul className="mt-4 space-y-2.5">
                {afterRows.map((r) => (
                  <li key={r} className="flex gap-3 text-sm md:text-base text-foreground">
                    <Check className="h-4 w-4 mt-1 flex-shrink-0 text-success" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. Unreasonable Hospitality                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            The week of
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Unreasonable Hospitality Included
          </h2>
          <p className="mt-4 text-lg text-muted-foreground italic">
            More than learning. An experience you&rsquo;ll remember.
          </p>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground">
            All meals included both days, from breakfast through our signature
            dinner at Tilly&rsquo;s at Camp Lucy. Plus premium materials,
            beautiful venues, and connections that last beyond the workshop.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. Testimonials                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              Past attendees
            </p>
            <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
              What Past Attendees Say
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Real feedback from people who&rsquo;ve done this work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <figure className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <blockquote className="text-base leading-relaxed text-foreground">
                &ldquo;Clay, like most of us who attended, I said yes to
                something I didn&rsquo;t quite understand, mostly because Clay
                said to show up. And I know I speak for everyone there, it
                was 10x more than what we expected. I went from confused to
                excited to overwhelmed to pumped. This book is the real deal
                and will change businesses everywhere. I can&rsquo;t wait to
                share it with my clients. Luke&rsquo;s hospitality is top
                shelf, right up there with his barista skills.&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-heading text-sm uppercase tracking-wide text-accent-dark">
                Daniel Palmer
              </figcaption>
            </figure>

            <figure className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <blockquote className="text-base leading-relaxed text-foreground">
                &ldquo;Clay, what you&rsquo;ve built combines the very best of
                EOS with your proven processes for accelerating revenue growth
                with marketing excellence. You&rsquo;ve built a compelling
                vision for sales and marketing unity — one revenue team — with
                Velocity. Velocity is intensely practical and stripped of
                jargon. Founders from all industries can implement it down to
                the ground.&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-heading text-sm uppercase tracking-wide text-accent-dark">
                Levi Kirwin
              </figcaption>
            </figure>
          </div>

          <figure className="mt-10 rounded-2xl border-2 border-accent/40 bg-accent/5 p-8 md:p-10">
            <blockquote className="text-lg md:text-xl leading-relaxed text-foreground italic">
              &ldquo;There really isn&rsquo;t anyone else doing what
              you&rsquo;re doing. The certification model could be big for
              certifying internal leaders. Companies could send their top
              talent to learn the Velocity language. It&rsquo;s also the
              perfect path for anyone leaving corporate America to start their
              own consulting practice.&rdquo;
            </blockquote>
            <figcaption className="mt-6 font-heading text-sm uppercase tracking-wide text-accent-dark">
              Jonny Holsten · Founder, BridgeSelling
            </figcaption>
          </figure>

          <p className="mt-10 text-center font-heading text-sm md:text-base uppercase tracking-widest text-muted-foreground">
            &ldquo;The actionable side of EOS and StoryBrand.&rdquo;
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 9. Investment                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Investment
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Your Investment
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl">
            Join a network of practitioners commanding premium rates and
            delivering real results.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-4 py-1.5 text-[0.65rem] font-heading uppercase tracking-widest text-accent-dark">
            <CalendarDays className="h-3.5 w-3.5" />
            June 25–26, 2026
            <span aria-hidden="true">·</span>
            <MapPin className="h-3.5 w-3.5" />
            Austin, TX
            <span aria-hidden="true">·</span>
            <Users2 className="h-3.5 w-3.5" />
            Limited to 12 seats
          </div>

          <div className="mt-10 rounded-2xl border-2 border-accent/40 bg-card p-6 md:p-10 shadow-card">
            <div className="text-center">
              <h3 className="font-heading text-sm uppercase tracking-widest text-accent-dark">
                Certification Investment
              </h3>
              <p className="mt-3 font-velocity text-6xl md:text-7xl tracking-wider text-foreground">
                $5,000
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Per participant. Limited to 12 seats per cohort.
              </p>
            </div>

            <ul className="mt-8 grid gap-3 md:grid-cols-2 max-w-2xl mx-auto">
              {includes.map((b) => (
                <li
                  key={b}
                  className="flex gap-3 text-sm md:text-base leading-relaxed text-foreground"
                >
                  <Check className="h-4 w-4 mt-1 flex-shrink-0 text-accent-dark" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Button asChild variant="cta" size="lg">
                <Link
                  href={STRIPE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Secure your spot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Use code{" "}
                <span className="font-mono font-bold text-foreground">
                  EARLYBIRD2026
                </span>{" "}
                at checkout to save $1,000
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Bringing team members? Email{" "}
                <a
                  href={`mailto:${LUKE_EMAIL}`}
                  className="underline underline-offset-2 hover:text-accent-dark transition-smooth"
                >
                  {LUKE_EMAIL}
                </a>{" "}
                for bulk discounts.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <h3 className="font-heading text-base uppercase tracking-wide text-foreground">
              Annual Renewal: $1,500/year
            </h3>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              Maintain your certification with framework updates, community
              access, co-branded materials, and access to at least one
              workshop per year.
            </p>
          </div>

          <p className="mt-8 text-center text-xs md:text-sm font-heading uppercase tracking-widest text-muted-foreground">
            30-day money-back guarantee · Secure payment processing · Transfer
            to future cohort available
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 10. FAQ                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            FAQ
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            Everything you need to know about the certification.
          </p>

          <FaqGroup heading="Program Details" faqs={programFaqs} />
          <FaqGroup heading="Logistics" faqs={logisticsFaqs} />
          <FaqGroup heading="Investment & Support" faqs={investmentFaqs} />

          <p className="mt-12 text-base md:text-lg text-muted-foreground">
            Still have questions? Email us at{" "}
            <a
              href={`mailto:${LUKE_EMAIL}`}
              className="underline underline-offset-2 text-accent-dark hover:text-foreground transition-smooth"
            >
              {LUKE_EMAIL}
            </a>{" "}
            or reach out to discuss your specific situation.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 11. Final CTA                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent">
            June 25–26, 2026 · Austin, TX
          </p>
          <h2 className="mt-3 font-velocity text-primary-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Secure your seat in the next Velocity Fractional Certification
          </h2>
          <p className="mt-6 text-base md:text-lg text-primary-foreground/85">
            Use code{" "}
            <span className="font-mono font-bold text-accent">
              EARLYBIRD2026
            </span>{" "}
            at checkout to save $1,000.
          </p>
          <div className="mt-8">
            <Button asChild variant="cta" size="lg">
              <Link
                href={STRIPE}
                target="_blank"
                rel="noopener noreferrer"
              >
                Secure your spot
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-primary-foreground/70">
            Limited to 12 seats per cohort. Bringing team members? Email{" "}
            <a
              href={`mailto:${LUKE_EMAIL}`}
              className="underline underline-offset-2 hover:text-accent transition-smooth"
            >
              {LUKE_EMAIL}
            </a>{" "}
            for bulk discounts.
          </p>
        </div>
      </section>

      {/* Mobile bottom-padding spacer so the sticky CTA doesn't cover the
          last line of the final section. md:h-0 zeroes it out on tablet+. */}
      <div className="h-20 md:h-0" aria-hidden="true" />

      {/* ------------------------------------------------------------------ */}
      {/* 12. Mobile sticky CTA                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur shadow-lg">
        <div className="px-4 py-3">
          <Link
            href={STRIPE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
          >
            Secure your spot — June 25–26
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// FAQ subcomponent — native <details>/<summary> for zero-JS collapsing
// ---------------------------------------------------------------------------

function FaqGroup({ heading, faqs }: { heading: string; faqs: Faq[] }) {
  return (
    <div className="mt-12">
      <h3 className="font-heading text-sm uppercase tracking-widest text-accent-dark">
        {heading}
      </h3>
      <div className="mt-4 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-border bg-card overflow-hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-heading text-sm md:text-base uppercase tracking-wide text-foreground hover:bg-secondary/50 transition-smooth">
              <span>{f.q}</span>
              <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 text-sm md:text-base leading-relaxed text-muted-foreground">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
