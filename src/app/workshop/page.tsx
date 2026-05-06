import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Monitor,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Velocity Workshop",
  description:
    "Two days deploying the Velocity Framework in your business. Virtual via Google Meet, July 1–2, 2026. Built for owners and leaders who want predictable revenue without the chaos.",
};

// =============================================================================
// TODO: Replace https://stripe.com with the real Stripe payment link before
// launch. This placeholder is used by every "Register" CTA on this page (hero,
// investment card, final CTA, mobile sticky bar). Updating this single constant
// updates all four locations.
// =============================================================================
const WORKSHOP_STRIPE_LINK = "https://stripe.com";

const LUKE_EMAIL = "luke@goodagency.com";

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------

const heroChecks = [
  "Complete digital workbook",
  "Recordings available for 30 days",
  "Direct interaction with Clay throughout",
] as const;

const personas = [
  {
    title: "Business Owners",
    body: "You're running a company between $1M and $20M in revenue and you know your team can run smoother than it does today.",
  },
  {
    title: "Executive Leaders",
    body: "You're a CEO, COO, or CRO who wants to install systems that survive without you in every meeting.",
  },
  {
    title: "Sales and Marketing Leaders",
    body: "You want your team unified under one revenue strategy instead of two competing departments.",
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

type AgendaSession = {
  time: string;
  title: string;
  bullets: string[];
};

type AgendaDay = {
  day: string;
  date: string;
  sessions: AgendaSession[];
};

const agenda: AgendaDay[] = [
  {
    day: "Day 1",
    date: "Wednesday, July 1",
    sessions: [
      {
        time: "Morning · 9 AM to 12 PM Central",
        title: "Heart",
        bullets: [
          "Building the cultural foundation that drives every revenue decision",
          "Defining what good business means for your specific team",
          "Installing the virtues that hold up under pressure",
          "Live exercise: Map your current culture against the Velocity Heart standard",
        ],
      },
      {
        time: "Afternoon · 1 PM to 4 PM Central",
        title: "Heading",
        bullets: [
          "Unifying marketing and sales into one revenue department",
          "Setting clear baselines and 90-day revenue goals",
          "Building the foundational sales and marketing assets you need",
          "Live exercise: Draft your unified revenue accountability map",
        ],
      },
    ],
  },
  {
    day: "Day 2",
    date: "Thursday, July 2",
    sessions: [
      {
        time: "Morning · 9 AM to 12 PM Central",
        title: "Hustle",
        bullets: [
          "Installing the meeting cadence that creates accountability",
          "Weekly, monthly, quarterly, and annual rhythms that sustain growth",
          "Hustle without burnout — the policies that protect your team",
          "Live exercise: Build your weekly revenue meeting agenda",
        ],
      },
      {
        time: "Afternoon · 1 PM to 4 PM Central",
        title: "Implementation Planning",
        bullets: [
          "Personalized planning for deploying Velocity in your specific business",
          "90-day implementation roadmap with clear milestones",
          "Q&A with Clay on your specific challenges",
          "Live exercise: Walk away with a written 90-day deployment plan",
        ],
      },
    ],
  },
];

const walkAwayLeader = [
  "Clear vision of what good business looks like in your specific industry",
  "Confidence to lead unified marketing and sales conversations",
  "The exact meeting cadence to install in your team next Monday",
  "A 90-day deployment roadmap customized to your business",
] as const;

const walkAwayBusiness = [
  "A unified revenue strategy instead of two competing departments",
  "Clear accountability standards that survive without you",
  "Predictable rhythms that create predictable growth",
  "A culture that attracts and retains the right people",
] as const;

const privateIncludes = [
  "Two-day intensive deployment for your leadership team",
  "Pre-work to customize the framework to your specific business and industry",
  "On-site delivery at your location (or virtual if preferred)",
  "Implementation framework tailored to your company's stage and challenges",
  "Post-workshop check-in 30 days after delivery to verify rhythms are sticking",
  "Direct access to Clay throughout the engagement",
  "Complete workbook and templates customized for your team",
] as const;

const LUKE_CALENDAR_URL =
  "https://meetings.hubspot.com/luke911/velocity-strategy-call";

const workshopRow = [
  "For business owners and leaders",
  "$997 per person",
  "Virtual, July 1–2, 2026",
  "Learn to deploy Velocity in your business",
  "You leave with a 90-day plan for your company",
] as const;

const certificationRow = [
  "For agency owners, consultants, and fractional executives",
  "$5,000 per person",
  "In-person, June 25–26, 2026, Austin, TX",
  "Get certified to deploy Velocity for clients",
  "You leave certified to charge $10K to $20K monthly retainers",
] as const;

const investmentIncludes = [
  "Two full days of live training with Clay (July 1–2, 2026)",
  "Complete digital workbook with frameworks and templates",
  "Live exercises and personalized feedback",
  "Recordings available for 30 days after the workshop",
  "Q&A with Clay throughout both days",
  "Walk away with your 90-day deployment plan",
] as const;

type Faq = { q: string; a: string };

const programFaqs: Faq[] = [
  {
    q: "Who should attend this workshop?",
    a: "Business owners, executive leaders, and sales or marketing leaders who want to deploy the Velocity Framework in their own business. If you're running a company between $1M and $20M in revenue and you want a system that brings predictability and clarity to your team, this is for you.",
  },
  {
    q: "Is this the same as the Velocity Fractional Certification?",
    a: "No. This workshop teaches you how to deploy Velocity in your own business. The Fractional Certification trains consultants and agency owners to deploy it for OTHER businesses. After this workshop, you'll know how to do this work yourself. If you want help, you can always hire a Certified Fractional Revenue Executive.",
  },
  {
    q: "Do I get certified by attending this workshop?",
    a: "No. This workshop teaches you the framework so you can deploy it in your business. If you want to be certified to deploy Velocity professionally for other businesses, you'd want the Velocity Fractional Certification.",
  },
  {
    q: "Do I need to read the book first?",
    a: "No, but it helps. The book gives you the conceptual foundation. The workshop is where you put it into action with your specific business in mind.",
  },
];

const logisticsFaqs: Faq[] = [
  {
    q: "When and where is the workshop?",
    a: "July 1–2, 2026 (Wednesday and Thursday). It's virtual via Google Meet. Sessions run from 9 AM to 4 PM Central Time both days. The Google Meet link will be sent to you after registration.",
  },
  {
    q: "Will the sessions be recorded?",
    a: "Yes. Recordings will be available for 30 days after the workshop for review or to share with team members who couldn't attend live.",
  },
  {
    q: "What if I can't attend the live sessions?",
    a: "We strongly recommend attending live for the interactive exercises and Q&A. If you have to miss part of it, the recordings are available for 30 days afterward.",
  },
  {
    q: "Can I bring team members?",
    a: "Each registration covers one person. If you want to bring multiple people from your team, register them individually.",
  },
  {
    q: "What materials are included?",
    a: "A complete digital workbook with all the frameworks, templates, and exercises from the workshop. You'll receive it before the workshop starts.",
  },
];

const investmentFaqs: Faq[] = [
  {
    q: "Is there a refund policy?",
    a: "Because this is a live virtual event with limited capacity, registration is non-refundable. If you can't attend live, you'll have full access to the recordings for 30 days.",
  },
  {
    q: "Why is there no refund?",
    a: "Live virtual events have real preparation costs and limited capacity. To keep the room focused on people who are committed to doing the work, registration is final. You get the recordings either way.",
  },
  {
    q: "Who do I contact if I have questions before registering?",
    a: "Email luke@goodagency.com. Luke will help you decide if this workshop is the right fit for your situation.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WorkshopPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. Hero                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-wide max-w-5xl">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-accent/15 border border-accent/30 px-4 py-1.5 text-[0.65rem] font-heading uppercase tracking-widest text-accent">
            <Monitor className="h-3.5 w-3.5" />
            Virtual workshop
            <span aria-hidden="true">·</span>
            <CalendarDays className="h-3.5 w-3.5" />
            July 1–2, 2026
            <span aria-hidden="true">·</span>
            <Clock className="h-3.5 w-3.5" />
            9 AM to 4 PM Central
          </div>
          <h1 className="mt-6 font-velocity text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider leading-[0.95]">
            The Velocity Workshop
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-primary-foreground/85">
            Two days deploying the Velocity Framework in your business. Built
            for owners and leaders who want predictable revenue without the
            chaos.
          </p>

          <div className="mt-8">
            <Button asChild variant="cta" size="lg">
              {/* TODO: Replace https://stripe.com with real Stripe payment link before launch */}
              <Link
                href={WORKSHOP_STRIPE_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register now
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

          <p className="mt-10 text-sm text-primary-foreground/70">
            Limited virtual seats. Register early to secure your spot.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Who This Is For                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Who it&rsquo;s for
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Who This Workshop Is For
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground italic">
            Built for owners and leaders ready to do the work.
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
            If you embody hospitality, humility, and hustle, this room is for
            you.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. What You'll Learn (Velocity Framework)                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-subtle">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              The framework
            </p>
            <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
              What You&rsquo;ll Learn
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Two days. Three pillars. One unified system.
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
      {/* 4. The Two-Day Agenda                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              The schedule
            </p>
            <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
              The Two-Day Agenda
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Live, virtual, focused. No filler.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {agenda.map((d) => (
              <div
                key={d.day}
                className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
              >
                <p className="font-heading text-xs uppercase tracking-widest text-accent-dark">
                  {d.day}
                </p>
                <h3 className="mt-2 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
                  {d.date}
                </h3>
                <div className="mt-6 space-y-8">
                  {d.sessions.map((s) => (
                    <div key={s.title}>
                      <p className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                        {s.time}
                      </p>
                      <p className="mt-1 font-heading text-base md:text-lg uppercase tracking-wide text-foreground">
                        {s.title}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {s.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex gap-3 text-sm leading-relaxed text-foreground"
                          >
                            <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent-dark" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-3xl text-sm md:text-base text-muted-foreground">
            All sessions live via Google Meet. Recordings available for 30
            days after the workshop for review and team sharing.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. What You'll Walk Away With                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-section">
        <div className="container-wide">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            The outcome
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            What You&rsquo;ll Walk Away With
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <h3 className="font-heading text-lg md:text-xl uppercase tracking-wide text-foreground">
                For You as a Leader
              </h3>
              <ul className="mt-6 space-y-3">
                {walkAwayLeader.map((b) => (
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
                For Your Business
              </h3>
              <ul className="mt-6 space-y-3">
                {walkAwayBusiness.map((b) => (
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
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. How This Differs From the Certification                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Comparing the two
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            How This Is Different From the Certification
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
            If you&rsquo;re trying to figure out which is right for you,
            here&rsquo;s the simple version: this workshop is for deploying
            Velocity in <strong className="text-foreground">your</strong>{" "}
            business. The Velocity Fractional Certification is for consultants
            and agency owners who want to deploy it for{" "}
            <strong className="text-foreground">other</strong> businesses.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-6 md:p-8">
              <p className="font-heading text-xs uppercase tracking-widest text-accent-dark">
                The Velocity Workshop · You&rsquo;re here
              </p>
              <ul className="mt-6 space-y-3">
                {workshopRow.map((b) => (
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
              <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
                The Velocity Fractional Certification
              </p>
              <ul className="mt-6 space-y-3">
                {certificationRow.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-sm md:text-base leading-relaxed text-foreground"
                  >
                    <Check className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-6 md:p-8">
            <p className="text-base md:text-lg leading-relaxed text-foreground">
              After this workshop, you&rsquo;ll know how to deploy Velocity
              in your own business. If you want to scale faster or you
              don&rsquo;t have the bandwidth to do it yourself, you can
              always hire a Certified Fractional Revenue Executive who&rsquo;s
              been certified through the Velocity Fractional Certification to
              help you deploy it. Either path works. Pick the one that fits
              where you are.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/certification"
              className="inline-flex items-center gap-2 font-heading text-sm uppercase tracking-wider text-accent-dark hover:text-foreground transition-smooth"
            >
              Learn about the certification
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. Private Workshops                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-subtle">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Another way to do this
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Want Velocity for Your Whole Team?
          </h2>
          <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
            Some leaders don&rsquo;t want to wait for a public workshop, and
            they don&rsquo;t want their team learning the framework
            piecemeal. They want Velocity deployed in their business, with
            their team, customized to their specific revenue goals. For
            those companies, we run private workshops.
          </p>

          {/* What's included */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <h3 className="font-heading text-base md:text-lg uppercase tracking-wide text-foreground">
              What&rsquo;s included in a private workshop
            </h3>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {privateIncludes.map((b) => (
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

          {/* Investment card */}
          <div className="mt-10 rounded-2xl border-2 border-accent/40 bg-card p-6 md:p-10 shadow-card">
            <div className="text-center">
              <h3 className="font-heading text-sm uppercase tracking-widest text-accent-dark">
                Investment
              </h3>
              <p className="mt-3 font-velocity text-5xl md:text-6xl tracking-wider text-foreground">
                Starts at $35,000
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
                Includes up to 10 attendees. Additional team members at $750
                per person. Maximum 25 attendees per private workshop.
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xs md:text-sm text-muted-foreground italic">
                Travel and venue costs not included for on-site engagements.
                Virtual private workshops available without travel costs.
              </p>
            </div>
          </div>

          {/* Who this is for */}
          <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-6 md:p-8">
            <h3 className="font-heading text-sm uppercase tracking-widest text-accent-dark">
              Who private workshops work best for
            </h3>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-foreground">
              Private workshops work best for companies between $2 million
              and $50 million in revenue with leadership teams ready to do
              hard work. If you&rsquo;re earlier than that, the public
              workshop or the toolbox is probably a better starting point.
              We&rsquo;re not trying to upsell you. We&rsquo;re trying to
              make sure you get value from this.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <h3 className="font-velocity text-3xl md:text-4xl uppercase tracking-wider text-foreground">
              Ready to talk?
            </h3>
            <p className="mt-4 max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-muted-foreground">
              Luke runs intake calls for private workshops. He&rsquo;ll ask
              you about your situation, your team, and your revenue goals to
              confirm it&rsquo;s the right fit. There&rsquo;s no pitch. Just
              a conversation about whether this makes sense for where your
              business is right now.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild variant="gold-outline" size="lg">
                <Link
                  href={LUKE_CALENDAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Schedule a conversation with Luke
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground italic">
              Most private workshops are scheduled 30 days out to allow for
              proper preparation.
            </p>
          </div>

          {/* Honest framing footer */}
          <p className="mt-12 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
            Private workshops aren&rsquo;t right for every business. If
            you&rsquo;re not sure which option fits, the public workshop on
            July 1–2 is the easiest entry point and gives you everything
            you need to deploy Velocity yourself.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. About Clay                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Your guide
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Who You&rsquo;ll Be Learning From
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
            Clay Vaughan is the founder of Good Agency, author of Velocity,
            and creator of the Heart → Heading → Hustle framework. He&rsquo;s
            spent over a decade helping business owners build revenue systems
            that scale without chaos. The Velocity Framework is what
            he&rsquo;s used with his own clients to help them grow predictably
            without burning out their teams.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 9. Investment                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Investment
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Your Investment
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground italic">
            Two days. One framework. A clearer path forward.
          </p>

          <div className="mt-10 rounded-2xl border-2 border-accent/40 bg-card p-6 md:p-10 shadow-card">
            <div className="text-center">
              <h3 className="font-heading text-sm uppercase tracking-widest text-accent-dark">
                Workshop Registration
              </h3>
              <p className="mt-3 font-velocity text-6xl md:text-7xl tracking-wider text-foreground">
                $997
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Per person. Virtual format.
              </p>
            </div>

            <ul className="mt-8 grid gap-3 md:grid-cols-2 max-w-2xl mx-auto">
              {investmentIncludes.map((b) => (
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
                {/* TODO: Replace https://stripe.com with real Stripe payment link before launch */}
                <Link
                  href={WORKSHOP_STRIPE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <p className="mt-8 text-sm md:text-base text-muted-foreground text-center max-w-3xl mx-auto">
            Because this is a live virtual event with limited capacity,
            registration is non-refundable. If you can&rsquo;t attend live,
            you&rsquo;ll have access to the recordings for 30 days.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 10. FAQ                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-gradient-subtle">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            FAQ
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Frequently Asked Questions
          </h2>

          <FaqGroup heading="Program Details" faqs={programFaqs} />
          <FaqGroup heading="Logistics" faqs={logisticsFaqs} />
          <FaqGroup heading="Investment & Policies" faqs={investmentFaqs} />

          <p className="mt-12 text-base md:text-lg text-muted-foreground">
            Still have questions? Email{" "}
            <a
              href={`mailto:${LUKE_EMAIL}`}
              className="underline underline-offset-2 text-accent-dark hover:text-foreground transition-smooth"
            >
              {LUKE_EMAIL}
            </a>{" "}
            or check the{" "}
            <Link
              href="/certification"
              className="underline underline-offset-2 text-accent-dark hover:text-foreground transition-smooth"
            >
              certification page
            </Link>{" "}
            if you&rsquo;re trying to decide which option is right for you.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 11. Final CTA                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent">
            July 1–2, 2026 · Virtual via Google Meet
          </p>
          <h2 className="mt-3 font-velocity text-primary-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Two days. One framework. A clearer path forward for your business.
          </h2>
          <div className="mt-8">
            <Button asChild variant="cta" size="lg">
              {/* TODO: Replace https://stripe.com with real Stripe payment link before launch */}
              <Link
                href={WORKSHOP_STRIPE_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-primary-foreground/70">
            Limited virtual seats. Registration is non-refundable. Recordings
            included for 30 days after the workshop.
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
          {/* TODO: Replace https://stripe.com with real Stripe payment link before launch */}
          <Link
            href={WORKSHOP_STRIPE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
          >
            Register — July 1–2
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
