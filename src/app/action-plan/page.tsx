import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { Route, Target, Users } from "lucide-react";
import { ActionPlanIntakeForm } from "@/components/action-plan/ActionPlanIntakeForm";
import { createActionPlanIntake, isStorageConfigured } from "@/lib/action-plan/storage";
import { suggestedToxinsForLowestDimensions } from "@/lib/action-plan/toxins";
import { replaceFocusAreas } from "@/lib/action-plan/storage";
import { getQuizResult } from "@/lib/quiz/storage";

export const metadata: Metadata = {
  title: "Culture Action Plan",
  description:
    "The prescription that follows the Culture Health Check. Pick your toxins, define the counter-moves, build a 30/60/90-day plan — with calendar events, an accountability partner, and an email ready to send your leadership team.",
};

type SearchParams = Promise<{ source?: string; id?: string }>;

export default async function ActionPlanLanding({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // Pass-through from Culture Health Check results — pre-populate and jump
  // directly into the 4-screen builder.
  if (
    params.source === "health-check" &&
    typeof params.id === "string" &&
    params.id.length > 0 &&
    isStorageConfigured()
  ) {
    const hc = await getQuizResult(params.id);
    if (hc.ok && hc.data && hc.data.dimension_scores) {
      const newId = nanoid(32);
      const intakeResult = await createActionPlanIntake({
        id: newId,
        email: hc.data.email,
        first_name: hc.data.first_name,
        role: hc.data.role,
        team_size: hc.data.company_size,
        source: "health_check",
        health_check_id: params.id,
      });
      if (intakeResult.ok) {
        // Map the three lowest-scoring dimensions to suggested toxins.
        const lowestThree = [...hc.data.dimension_scores]
          .sort((a, b) => a.subscore - b.subscore)
          .slice(0, 3)
          .map((d) => d.dimension);
        const toxinIds = suggestedToxinsForLowestDimensions(lowestThree);
        if (toxinIds.length > 0) {
          await replaceFocusAreas(
            newId,
            toxinIds.map((toxin_id, i) => ({
              order_index: i + 1,
              toxin_id,
              counter_move_id: null,
              counter_move_custom: null,
              virtue: null,
              seven_day_action: null,
              weekly_rhythm_id: null,
              weekly_rhythm_custom: null,
            }))
          );
        }
        redirect(`/action-plan/build/${newId}`);
      }
    }
    // Fall through to the intake form if the pass-through couldn't resolve.
  }

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Culture Action Plan · Heart pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            Turn the diagnosis into a plan.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            The Culture Action Plan takes you from &ldquo;my culture has
            problems&rdquo; to a 30/60/90-day plan with a weekly rhythm, an
            accountability partner, calendar events, and an email ready to send
            your leadership team — all in ten minutes.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
            10 minutes · Free · No account
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16 max-w-5xl">
          <div className="space-y-4">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              What you&rsquo;ll leave with
            </p>
            <h2 className="font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
              A plan you actually execute.
            </h2>
            <ul className="mt-4 space-y-4">
              <Bullet icon={<Target className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">1–3 focus areas.</strong> Named toxins, paired counter-moves from the book, tagged to one of the three virtues (Hospitality, Humility, Grit).
              </Bullet>
              <Bullet icon={<Route className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A weekly rhythm.</strong> One check-in on your calendar, one reassessment date, one 7-day action deadline — populated automatically.
              </Bullet>
              <Bullet icon={<Users className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">An accountability partner (optional).</strong> Pre-drafted invite you can send — they check in with you weekly so you don&rsquo;t drift.
              </Bullet>
            </ul>
          </div>

          <div>
            <div className="rounded-2xl border-2 border-border bg-card p-6 md:p-8 shadow-elegant">
              <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
                Before we start
              </p>
              <h3 className="mt-2 font-heading text-xl uppercase tracking-wide text-foreground">
                A few details
              </h3>
              <div className="mt-6">
                <ActionPlanIntakeForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Bullet({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 flex-shrink-0">{icon}</span>
      <span className="text-base md:text-lg leading-relaxed text-muted-foreground">
        {children}
      </span>
    </li>
  );
}
