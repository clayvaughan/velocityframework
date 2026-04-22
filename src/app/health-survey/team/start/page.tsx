import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IntakeForm } from "@/components/quiz/IntakeForm";

export const metadata: Metadata = {
  title: "Create a team Culture Health Check",
  description:
    "Create a private team link. Your team takes the quiz anonymously. You see the aggregate + variance.",
};

export default function TeamStartPage() {
  return (
    <section className="bg-gradient-hero section-padding">
      <div className="container-narrow max-w-2xl">
        <Link
          href="/health-survey"
          className="inline-flex items-center gap-1 font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
        <p className="mt-6 font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
          Team Culture Health Check · Create
        </p>
        <h1 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider">
          Set up your team&rsquo;s Health Check.
        </h1>
        <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
          Fill out the form below and we&rsquo;ll generate a private link you
          can share with your team. Their answers come back to you as
          aggregate — never as individual responses.
        </p>

        <div className="mt-10">
          <IntakeForm
            mode="team"
            action="/api/quiz/team/create"
            nextPathTemplate="/health-survey/team/{id}/dashboard"
            submitLabel="Create team link"
          />
        </div>
      </div>
    </section>
  );
}
