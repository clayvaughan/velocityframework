import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Culture Health Check",
  description:
    "A 5-minute pulse check on your team's culture, grounded in the Heart section of Velocity. Takes 5 minutes. Free. Anonymous when sent to a team.",
};

export default function HealthSurveyLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark inline-flex items-center gap-2">
            <ClipboardCheck className="h-3.5 w-3.5" /> Diagnostic · Heart pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            Take a 5-minute pulse check on your team&rsquo;s culture.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            Your business can have great strategy and sharp execution, but if
            the culture is broken, none of it sticks. The Velocity Culture
            Health Check shows you where your team is strong, where toxins are
            sneaking in, and what to do about it — before it costs you people,
            clients, or momentum.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
            5 minutes · Anonymous when sent to a team · Free
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide grid gap-6 md:grid-cols-2 max-w-4xl">
          <PathCard
            icon={<User className="h-5 w-5 text-accent-dark" />}
            eyebrow="For me"
            title="Take it for myself"
            description="Answer 15 questions, get your culture score and a shareable PDF report for your leadership team in under 5 minutes."
            href="/health-survey/start"
            cta="Start the Health Check"
          />
          <PathCard
            icon={<Users className="h-5 w-5 text-accent-dark" />}
            eyebrow="For my team"
            title="Send it to my team"
            description="Get a private link to share with your whole team. Responses stay anonymous. You see the aggregate + variance — the highest-signal data any leader gets."
            href="/health-survey/team/start"
            cta="Create a team quiz"
          />
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            What you&rsquo;ll learn
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider">
            Five dimensions of culture
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { t: "Trust", d: "Do people bring up bad news as fast as good?" },
              {
                t: "Communication",
                d: "Is information reaching everyone, or splintering?",
              },
              {
                t: "Accountability",
                d: "Does ownership travel with the task, or get lost?",
              },
              {
                t: "Purpose Alignment",
                d: "Can everyone connect their work to the company's point?",
              },
              {
                t: "Hospitality",
                d: "Do teammates and clients feel genuinely cared for?",
              },
            ].map((x) => (
              <li
                key={x.t}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <p className="font-heading text-sm uppercase tracking-wide text-foreground">
                  {x.t}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {x.d}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function PathCard({
  icon,
  eyebrow,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border-2 border-border bg-card p-7 md:p-8 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-elegant">
      <p className="inline-flex items-center gap-2 font-heading text-[0.65rem] uppercase tracking-[0.3em] text-accent-dark">
        {icon}
        {eyebrow}
      </p>
      <h3 className="mt-4 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
        {title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground flex-1">
        {description}
      </p>
      <div className="mt-6">
        <Button asChild variant="cta" size="md">
          <Link href={href}>{cta}</Link>
        </Button>
      </div>
    </div>
  );
}
