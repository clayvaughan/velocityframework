import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import {
  BuildController,
  type BuilderFocusArea,
  type BuilderInitialState,
} from "@/components/action-plan/BuildController";
import {
  getActionPlan,
  getFocusAreas,
  isStorageConfigured,
} from "@/lib/action-plan/storage";
import type { ToxinId } from "@/lib/action-plan/toxins";
import type { VirtueId } from "@/lib/action-plan/virtues";
import type { WeeklyRhythmId } from "@/lib/action-plan/weekly-rhythms";

export const metadata: Metadata = {
  title: "Build your Culture Action Plan",
  description:
    "Four screens — toxins, counter-moves, 7-day action & rhythm, and virtues. Under 10 minutes.",
};

type Params = Promise<{ id: string }>;

export default async function BuildPage({ params }: { params: Params }) {
  const { id } = await params;

  if (!isStorageConfigured()) return <StorageNotConfigured />;
  const planRes = await getActionPlan(id);
  if (!planRes.ok) {
    console.error("[build] plan fetch", planRes);
    return <BuildError />;
  }
  const plan = planRes.data;
  if (!plan) notFound();
  if (plan.status === "saved" || plan.status === "completed") {
    redirect(`/action-plan/saved/${id}`);
  }

  const faRes = await getFocusAreas(id);
  if (!faRes.ok) {
    console.error("[build] focus areas fetch", faRes);
    return <BuildError />;
  }

  const initialState: BuilderInitialState = {
    focusAreas: faRes.data.map(
      (f): BuilderFocusArea => ({
        toxinId: f.toxin_id as ToxinId,
        counterMoveId: f.counter_move_id,
        counterMoveCustom: f.counter_move_custom,
        virtueId: f.virtue as VirtueId | null,
        sevenDayAction: f.seven_day_action ?? "",
        weeklyRhythmId: f.weekly_rhythm_id as WeeklyRhythmId | null,
        weeklyRhythmCustom: f.weekly_rhythm_custom,
      })
    ),
    reassessmentDays: plan.reassessment_days,
    accountabilityPartnerName: plan.accountability_partner_name ?? "",
    accountabilityPartnerEmail: plan.accountability_partner_email ?? "",
    sendPartnerInvite: plan.send_partner_invite,
    prePickedFromHealthCheck:
      plan.source === "health_check" && faRes.data.length > 0,
  };

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Culture Action Plan · Build
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            Building {plan.first_name}&rsquo;s plan.
          </h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <BuildController planId={id} initialState={initialState} />
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
          Storage not configured
        </h1>
        <p className="mt-4 text-muted-foreground">
          Supabase credentials aren&rsquo;t set in this environment. Once
          they&rsquo;re in Replit Secrets, the Action Plan builder will load.
        </p>
      </div>
    </section>
  );
}

function BuildError() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Couldn&rsquo;t load your plan
        </h1>
        <p className="mt-4 text-muted-foreground">
          Something went wrong. Refresh the page or start again from{" "}
          <a href="/action-plan" className="underline underline-offset-4">
            /action-plan
          </a>
          .
        </p>
      </div>
    </section>
  );
}
