import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { TeamDashboard } from "@/components/quiz/TeamDashboard";
import {
  getTeamQuiz,
  getTeamQuizResponses,
  isStorageConfigured,
} from "@/lib/quiz/storage";
import { aggregateTeamResponses } from "@/lib/quiz/scoring";

export const metadata: Metadata = {
  title: "Team dashboard — Culture Health Check",
  description:
    "Aggregate and variance across your team's anonymous Culture Health Check responses.",
};

type Params = Promise<{ id: string }>;

export default async function TeamDashboardPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const quizRes = await getTeamQuiz(id);
  if (!quizRes.ok) {
    if (quizRes.reason === "not_configured") return <StorageNotConfigured />;
    console.error("[team dashboard] getTeamQuiz", quizRes);
    return <DashboardError />;
  }
  if (!quizRes.data) notFound();

  const respRes = await getTeamQuizResponses(id);
  if (!respRes.ok) {
    console.error("[team dashboard] getTeamQuizResponses", respRes);
    return <DashboardError />;
  }
  const responses = respRes.data;

  const aggregate = aggregateTeamResponses(
    responses.map((r) => ({
      answers: r.answers,
      dimension_scores: r.dimension_scores,
      overall_score: r.overall_score,
    }))
  );

  // Build the share URL from the request host so Replit preview vs. prod
  // both render correctly.
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "velocityframework.com";
  const shareUrl = `${proto}://${host}/health-survey/team/${id}/take`;

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Team Culture Health Check · Dashboard
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            {quizRes.data.team_name ?? `${quizRes.data.owner_first_name}'s team`}
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl">
            Bookmark this page — it&rsquo;s the only way back to the
            dashboard. Data updates automatically as team members submit
            their anonymous responses.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <TeamDashboard
            teamQuizId={quizRes.data.id}
            teamName={quizRes.data.team_name}
            ownerFirstName={quizRes.data.owner_first_name}
            respondentCount={aggregate.respondentCount}
            meanOverallScore={aggregate.meanOverallScore}
            meanOverallTier={aggregate.meanOverallTier}
            dimensionAggregates={aggregate.dimensionAggregates}
            highVarianceDimensions={aggregate.highVarianceDimensions}
            shareUrl={shareUrl}
          />
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
          Dashboard storage not configured
        </h1>
        <p className="mt-4 text-muted-foreground">
          The Supabase credentials aren&rsquo;t set in this environment, so we
          can&rsquo;t load team data. Once the Supabase secrets are in
          Replit, the dashboard loads normally.
        </p>
      </div>
    </section>
  );
}

function DashboardError() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Couldn&rsquo;t load the team dashboard
        </h1>
        <p className="mt-4 text-muted-foreground">
          Something went wrong fetching your team&rsquo;s data. Please try
          again in a moment.
        </p>
      </div>
    </section>
  );
}
