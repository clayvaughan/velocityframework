import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { ReviewForm } from "@/components/action-plan/ReviewForm";
import {
  getActionPlan,
  getFocusAreas,
  isStorageConfigured,
} from "@/lib/action-plan/storage";
import { counterMoveById } from "@/lib/action-plan/counter-moves";
import { labelForRhythm, type WeeklyRhythmId } from "@/lib/action-plan/weekly-rhythms";
import type { ToxinId } from "@/lib/action-plan/toxins";
import type { VirtueId } from "@/lib/action-plan/virtues";

export const metadata: Metadata = {
  title: "Review your Culture Action Plan",
};

type Params = Promise<{ id: string }>;

export default async function ReviewPage({ params }: { params: Params }) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const planRes = await getActionPlan(id);
  if (!planRes.ok) return <ReviewError />;
  const plan = planRes.data;
  if (!plan) notFound();

  const faRes = await getFocusAreas(id);
  if (!faRes.ok) return <ReviewError />;

  const focusAreas = faRes.data.map((f) => {
    const toxinId = f.toxin_id as ToxinId;
    const counterMoveText =
      f.counter_move_custom ??
      counterMoveById(toxinId, f.counter_move_id ?? "")?.text ??
      "";
    return {
      focusAreaId: f.id,
      toxinId,
      virtueId: f.virtue as VirtueId | null,
      sevenDayAction: f.seven_day_action ?? "",
      counterMoveText,
      weeklyRhythmLabel: labelForRhythm(
        f.weekly_rhythm_id as WeeklyRhythmId | null,
        f.weekly_rhythm_custom
      ),
    };
  });

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Culture Action Plan · Review
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            How did your {plan.reassessment_days ?? 30}-day plan go?
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Mark each commitment honestly. This is the highest-value moment in
            the whole process — the honest read is what fuels the next cycle.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-3xl">
          <ReviewForm planId={id} focusAreas={focusAreas} />
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
      </div>
    </section>
  );
}

function ReviewError() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Couldn&rsquo;t load your plan
        </h1>
      </div>
    </section>
  );
}
