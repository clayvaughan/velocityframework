import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IntakeForm } from "@/components/quiz/IntakeForm";

export const metadata: Metadata = {
  title: "Start the Culture Health Check",
  description:
    "Before we start — a few quick details so we can send your results.",
};

export default function StartIndividualPage() {
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
          Culture Health Check · Step 1 of 2
        </p>
        <h1 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider">
          Before we start — who&rsquo;s taking this?
        </h1>
        <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
          Fifteen questions, five minutes. We&rsquo;ll send your results and a
          shareable PDF to the email you enter below.
        </p>

        <div className="mt-10">
          <IntakeForm
            mode="individual"
            action="/api/quiz/intake"
            nextPathTemplate="/health-survey/question/1"
            sessionStorageKey="velocity-quiz:individual"
          />
        </div>
      </div>
    </section>
  );
}
