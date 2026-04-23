"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DIMENSION_LABEL,
  DIMENSION_TAGLINE,
  type Dimension,
} from "@/lib/quiz/questions";
import {
  TIER_LABEL,
  TIER_OVERALL,
  TIER_SURFACE,
  type Tier,
} from "@/lib/quiz/copy";

type DimensionAggregate = {
  dimension: Dimension;
  meanSubscore: number;
  answerStdDev: number;
  tier: Tier;
};

type Props = {
  teamQuizId: string;
  teamName: string | null;
  ownerFirstName: string;
  respondentCount: number;
  meanOverallScore: number;
  meanOverallTier: Tier;
  dimensionAggregates: DimensionAggregate[];
  highVarianceDimensions: DimensionAggregate[];
  shareUrl: string;
};

const TIER_PILL: Record<Tier, string> = {
  healthy: "bg-success text-success-foreground",
  at_risk: "bg-warning text-warning-foreground",
  critical: "bg-accent text-accent-foreground",
};

const TIER_BAR: Record<Tier, string> = {
  healthy: "bg-success",
  at_risk: "bg-warning",
  critical: "bg-accent",
};

export function TeamDashboard(props: Props) {
  const {
    teamQuizId,
    teamName,
    ownerFirstName,
    respondentCount,
    meanOverallScore,
    meanOverallTier,
    dimensionAggregates,
    highVarianceDimensions,
    shareUrl,
  } = props;

  const [copied, setCopied] = useState(false);
  const tierOverall = TIER_OVERALL[meanOverallTier];
  const pdfUrl = `/api/quiz/team/${teamQuizId}/pdf`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const hasResponses = respondentCount > 0;

  return (
    <div className="space-y-10 md:space-y-14">
      {/* Share link panel */}
      <section className="rounded-2xl border border-accent/30 bg-primary text-primary-foreground p-6 md:p-8 shadow-elegant">
        <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent">
          Share link for {teamName ?? `${ownerFirstName}'s team`}
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <code className="flex-1 rounded-md bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground font-mono break-all">
            {shareUrl}
          </code>
          <Button
            type="button"
            variant="cta"
            size="sm"
            onClick={copyLink}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <p className="mt-4 text-sm text-primary-foreground/70">
          Send this link to every person on your team. They&rsquo;ll take the
          same 15-question quiz, anonymously. Their answers roll up into the
          aggregate below — no individual response is ever shown to you or to
          anyone.
        </p>
      </section>

      {hasResponses ? (
        <>
          {/* Aggregate tier card */}
          <section
            className={cn(
              "relative overflow-hidden rounded-2xl border-2 border-accent/30 p-6 md:p-10 shadow-elegant",
              TIER_SURFACE[meanOverallTier] === "dark"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-4 py-1.5 font-heading text-xs uppercase tracking-widest",
                  TIER_PILL[meanOverallTier]
                )}
              >
                {TIER_LABEL[meanOverallTier]}
              </span>
              <span
                className={cn(
                  "font-heading text-xs uppercase tracking-widest",
                  TIER_SURFACE[meanOverallTier] === "dark"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {respondentCount}{" "}
                {respondentCount === 1 ? "response" : "responses"} so far
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span
                className={cn(
                  "font-velocity text-7xl md:text-8xl tracking-wider leading-[0.9]",
                  TIER_SURFACE[meanOverallTier] === "dark"
                    ? "text-accent"
                    : "text-accent-dark"
                )}
              >
                {meanOverallScore}
              </span>
              <span
                className={cn(
                  "font-heading text-base md:text-lg uppercase tracking-wider",
                  TIER_SURFACE[meanOverallTier] === "dark"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                / 100 team average
              </span>
            </div>
            <div className="mt-6 max-w-3xl space-y-3">
              <h2
                className={cn(
                  "font-velocity text-3xl md:text-4xl uppercase tracking-wider leading-tight",
                  TIER_SURFACE[meanOverallTier] === "dark"
                    ? "text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {tierOverall.headline}
              </h2>
              <p
                className={cn(
                  "text-base md:text-lg leading-relaxed",
                  TIER_SURFACE[meanOverallTier] === "dark"
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {tierOverall.body}
              </p>
            </div>
          </section>

          {/* Dimension averages */}
          <section>
            <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wide text-foreground">
              Team averages by dimension
            </h3>
            <ul className="mt-6 space-y-4">
              {dimensionAggregates.map((d) => (
                <li
                  key={d.dimension}
                  className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-heading text-lg uppercase tracking-wide">
                        {DIMENSION_LABEL[d.dimension]}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {DIMENSION_TAGLINE[d.dimension]}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 font-heading text-[0.65rem] uppercase tracking-widest",
                          TIER_PILL[d.tier]
                        )}
                      >
                        {TIER_LABEL[d.tier]}
                      </span>
                      <span className="font-velocity text-3xl md:text-4xl text-foreground tracking-wider leading-none">
                        {d.meanSubscore}
                      </span>
                    </div>
                  </div>
                  <div
                    className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border"
                    aria-label={`${DIMENSION_LABEL[d.dimension]} mean: ${d.meanSubscore}`}
                  >
                    <div
                      className={cn("h-full transition-smooth", TIER_BAR[d.tier])}
                      style={{ width: `${d.meanSubscore}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Variance — the real signal */}
          <section className="rounded-2xl bg-primary text-primary-foreground p-6 md:p-10 shadow-elegant">
            <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent">
              Variance
            </p>
            <h3 className="mt-2 font-velocity text-3xl md:text-4xl uppercase tracking-wider text-primary-foreground">
              The conversations worth having first
            </h3>
            <p className="mt-4 max-w-3xl text-primary-foreground/80">
              The dimensions where your team disagrees most are the
              dimensions where the most important leadership conversation
              lives. Low variance means everyone&rsquo;s seeing the same
              thing. High variance means different people are living in
              different realities — and that gap itself is the signal.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {highVarianceDimensions.slice(0, 3).map((d, i) => (
                <li
                  key={d.dimension}
                  className="rounded-xl border border-accent/30 bg-primary-foreground/5 p-5"
                >
                  <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent">
                    #{i + 1} most disagreement
                  </p>
                  <p className="mt-2 font-heading text-lg uppercase tracking-wide text-primary-foreground">
                    {DIMENSION_LABEL[d.dimension]}
                  </p>
                  <p className="mt-3 text-sm text-primary-foreground/70">
                    Mean {d.meanSubscore} · SD {d.answerStdDev.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Actions */}
          <section className="flex flex-wrap gap-4">
            <Button asChild variant="cta" size="lg">
              <a href={pdfUrl} download>Download team PDF report</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/workshop">Apply for FRE Workshop</a>
            </Button>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border-2 border-dashed border-border bg-card/60 p-8 md:p-12 text-center">
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Waiting for responses
          </p>
          <h3 className="mt-3 font-velocity text-3xl md:text-4xl uppercase tracking-wider text-foreground">
            Send the link above to your team.
          </h3>
          <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed text-muted-foreground">
            As each person completes the quiz anonymously, this dashboard
            updates with aggregate scores, dimension averages, and the
            high-variance dimensions — the places where your team is seeing
            culture most differently.
          </p>
        </section>
      )}
    </div>
  );
}
