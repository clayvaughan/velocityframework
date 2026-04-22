import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thanks for taking the Health Check",
  description:
    "Your response is in. Your team leader will share the aggregate report.",
};

export default function TeamThanksPage() {
  return (
    <section className="bg-gradient-hero section-padding">
      <div className="container-narrow max-w-xl text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-accent-dark" />
        <p className="mt-4 font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
          Response recorded · Anonymous
        </p>
        <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
          Your response is in.
        </h1>
        <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
          Your team leader will share the aggregate report when the team
          quiz closes. Your individual answers never surface — they only
          contribute to the aggregate averages and variance.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" size="md">
            <Link href="/">Back to Velocity</Link>
          </Button>
          <Button asChild variant="link" size="md">
            <Link href="/health-survey">
              Take it for yourself
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
