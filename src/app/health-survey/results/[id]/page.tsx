import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResultsTier } from "@/components/quiz/ResultsTier";
import { DimensionBreakdown } from "@/components/quiz/DimensionBreakdown";
import { RecommendedResources } from "@/components/quiz/RecommendedResources";
import { getQuizResult, isStorageConfigured } from "@/lib/quiz/storage";
import { recommendationsFor } from "@/lib/quiz/recommendations";

export const metadata: Metadata = {
  title: "Your Culture Health Check results",
  description:
    "Your culture score by dimension, with specific next steps grounded in the Heart section of Velocity.",
};

type Params = Promise<{ id: string }>;

export default async function ResultsPage({ params }: { params: Params }) {
  const { id } = await params;

  if (!isStorageConfigured()) {
    return <StorageNotConfigured />;
  }

  const res = await getQuizResult(id);
  if (!res.ok) {
    if (res.reason === "not_configured") return <StorageNotConfigured />;
    console.error("[results] storage error", res);
    return <ResultsError />;
  }
  const row = res.data;
  if (!row) notFound();
  if (row.overall_score == null || row.overall_tier == null || !row.dimension_scores) {
    // Intake row exists but quiz not submitted yet — bounce them back to Q1.
    return <Incomplete />;
  }

  const recommendations = recommendationsFor(
    row.dimension_scores.map((d) => ({ dimension: d.dimension, tier: d.tier }))
  );
  const pdfUrl = `/api/quiz/pdf/${row.id}`;

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Culture Health Check · Results
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            Your results, {row.first_name}.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Save this page — the link is unique to you and shareable with your
            leadership team.
          </p>

          <div className="mt-10">
            <ResultsTier
              score={row.overall_score}
              tier={row.overall_tier}
              firstName={row.first_name}
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            The five dimensions
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Where your culture is strong, where it&rsquo;s at risk
          </h2>
          <div className="mt-10">
            <DimensionBreakdown items={row.dimension_scores} />
          </div>
        </div>
      </section>

      {recommendations.length > 0 ? (
        <section className="section-padding bg-gradient-section">
          <div className="container-wide max-w-4xl">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              Recommended downloads
            </p>
            <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
              Tools that match where you scored lowest
            </h2>
            <div className="mt-10">
              <RecommendedResources items={recommendations} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide max-w-4xl grid gap-8 md:grid-cols-2 items-start">
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent">
              Share with your leadership team
            </p>
            <h2 className="mt-3 font-velocity text-primary-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
              Download the PDF report.
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Six-page report with your score, the dimension breakdown, a
              facilitator guide for running the conversation with your
              leadership team, and links to the toolbox.
            </p>
            <div className="mt-6">
              <Button asChild variant="cta" size="lg">
                <a href={pdfUrl} download>
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent">
              FRE Certification Workshop
            </p>
            <h2 className="mt-3 font-velocity text-primary-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
              Ready to go deeper?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Two days in Austin with Clay Vaughan and Luke Frazier. Twelve
              seats. Built for revenue leaders who want to run the full
              framework inside a client business.
            </p>
            <div className="mt-6">
              <Button asChild variant="gold-outline" size="lg">
                <Link href="/workshop">Apply for the workshop</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StorageNotConfigured() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-accent-dark" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Results storage not configured
        </h1>
        <p className="mt-4 text-muted-foreground">
          The Supabase credentials aren&rsquo;t set in this environment, so we
          can&rsquo;t load saved results. Once{" "}
          <code className="font-mono text-foreground">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="font-mono text-foreground">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          are in Replit Secrets, results will persist and this page will
          load normally.
        </p>
      </div>
    </section>
  );
}

function ResultsError() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Couldn&rsquo;t load your results
        </h1>
        <p className="mt-4 text-muted-foreground">
          Something went wrong fetching your results. Please try again in a
          moment.
        </p>
      </div>
    </section>
  );
}

function Incomplete() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          This quiz isn&rsquo;t finished yet.
        </h1>
        <p className="mt-4 text-muted-foreground">
          The results page only shows after the last question is submitted.
          Your answers may still be saved in your browser — head back to the
          quiz to finish.
        </p>
        <div className="mt-6">
          <Button asChild variant="cta" size="md">
            <Link href="/health-survey/question/1">Return to the quiz</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
