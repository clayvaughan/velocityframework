import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Review submitted — Culture Action Plan",
};

type Params = Promise<{ id: string }>;

export default async function ReviewThanksPage({ params }: { params: Params }) {
  const { id } = await params;
  return (
    <section className="bg-gradient-hero section-padding">
      <div className="container-narrow max-w-2xl text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-accent-dark" />
        <p className="mt-4 font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
          Review submitted
        </p>
        <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
          Great work. Here&rsquo;s what to do next.
        </h1>
        <p className="mt-4 text-muted-foreground">
          The honest read you just did is rare. Most leaders don&rsquo;t look
          back. Pick one of the next moves below — and keep going.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <NextCard
            title="Re-take the Culture Health Check"
            description="See how your score has shifted after the work."
            href="/health-survey"
          />
          <NextCard
            title="Build the next 30/60/90"
            description="Start a new Action Plan on what&rsquo;s still unfinished."
            href="/action-plan"
          />
          <NextCard
            title="Book a strategy call"
            description="Walk through your plan with Luke Frazier, Growth Lead at Good Agency."
            href="https://meetings.hubspot.com/luke911/velocity-strategy-call"
            external
          />
        </div>
        <div className="mt-8">
          <Button asChild variant="link" size="sm">
            <Link href={`/action-plan/saved/${id}`}>Return to your plan</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function NextCard({
  title,
  description,
  href,
  external,
}: {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5 text-left">
      <h3 className="font-heading text-lg uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground flex-1">{description}</p>
      <span className="mt-4 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        Open →
      </span>
    </div>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <Link href={href}>{content}</Link>;
}
