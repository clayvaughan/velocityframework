import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { AlertCircle, Bookmark } from "lucide-react";
import {
  getActionPlan,
  getFocusAreas,
  isStorageConfigured,
} from "@/lib/action-plan/storage";
import {
  counterMoveById,
  COUNTER_MOVES,
} from "@/lib/action-plan/counter-moves";
import { labelForRhythm } from "@/lib/action-plan/weekly-rhythms";
import { TOXINS_BY_ID, type ToxinId } from "@/lib/action-plan/toxins";
import type { VirtueId } from "@/lib/action-plan/virtues";
import type { WeeklyRhythmId } from "@/lib/action-plan/weekly-rhythms";
import { PlanSummary } from "@/components/action-plan/PlanSummary";
import { ActionButtons } from "@/components/action-plan/ActionButtons";
import {
  allCalendarUrls,
  type ActionPlanCalendarContext,
} from "@/lib/calendar";
import {
  leadershipEmailMailto,
  partnerEmailMailto,
  type ResolvedFocusArea,
} from "@/lib/action-plan/email-drafts";

export const metadata: Metadata = {
  title: "Your Culture Action Plan",
};

type Params = Promise<{ id: string }>;

export default async function SavedPage({ params }: { params: Params }) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const planRes = await getActionPlan(id);
  if (!planRes.ok) return <SavedError />;
  const plan = planRes.data;
  if (!plan) notFound();
  if (plan.status === "in_progress") redirect(`/action-plan/build/${id}`);

  const faRes = await getFocusAreas(id);
  if (!faRes.ok) return <SavedError />;

  const reassessmentDays = (plan.reassessment_days ?? 30) as 30 | 60 | 90;
  const reassessmentDateISO =
    plan.reassessment_date ??
    new Date(Date.now() + reassessmentDays * 864e5).toISOString();

  const resolved: ResolvedFocusArea[] = faRes.data.map((f) => {
    const toxinId = f.toxin_id as ToxinId;
    const counterMoveText =
      f.counter_move_custom ??
      counterMoveById(toxinId, f.counter_move_id ?? "")?.text ??
      COUNTER_MOVES[toxinId]?.[0]?.text ??
      "";
    const rhythmLabel = labelForRhythm(
      f.weekly_rhythm_id as WeeklyRhythmId | null,
      f.weekly_rhythm_custom
    );
    return {
      toxinId,
      virtueId: f.virtue as VirtueId | null,
      sevenDayAction: f.seven_day_action ?? "",
      weeklyRhythmLabel: rhythmLabel,
      counterMoveText,
    };
  });

  // Absolute URL for mailto bodies and calendar descriptions
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host =
    h.get("x-forwarded-host") ?? h.get("host") ?? "velocityframework.com";
  const planUrl = `${proto}://${host}/action-plan/saved/${id}`;

  const firstFocus = resolved[0];
  const firstBehavior =
    (firstFocus &&
      counterMoveById(
        firstFocus.toxinId,
        faRes.data[0].counter_move_id ?? ""
      )?.behavioralDefinition) ??
    "Measure this move by whether the behavior you named starts showing up this week.";

  const calendarCtx: ActionPlanCalendarContext = {
    firstName: plan.first_name,
    focusAreaSummaries: resolved.map((f) => {
      const toxin = TOXINS_BY_ID[f.toxinId];
      return `${toxin.title} — ${f.sevenDayAction}`;
    }),
    firstWeekAction: firstFocus?.sevenDayAction ?? "",
    firstWeekActionBehavior: firstBehavior,
    accountabilityPartnerName: plan.accountability_partner_name,
    reassessmentDays,
    planUrl,
  };

  const googleUrls = allCalendarUrls(calendarCtx, "google");
  const outlookUrls = allCalendarUrls(calendarCtx, "outlook");

  const emailCtx = {
    firstName: plan.first_name,
    reassessmentDays,
    reassessmentDateISO,
    accountabilityPartnerFirstName:
      plan.accountability_partner_name?.split(" ")[0] ?? null,
    planUrl,
    focusAreas: resolved,
  };
  const leadershipMailto = leadershipEmailMailto(emailCtx);
  const partnerMailto =
    plan.send_partner_invite && plan.accountability_partner_email
      ? partnerEmailMailto(emailCtx, plan.accountability_partner_email)
      : null;

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Culture Action Plan · Saved
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            You built the plan.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Bookmark this page — it&rsquo;s shareable with your leadership team
            and keeps a permanent record of the plan. Reminder: most culture
            work dies in week 2. The calendar events below are how you survive
            it.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <PlanSummary
            firstName={plan.first_name}
            reassessmentDays={reassessmentDays}
            reassessmentDateISO={reassessmentDateISO}
            focusAreas={resolved}
            accountabilityPartnerName={plan.accountability_partner_name}
            weeklyRhythmLabels={resolved.map((r) => r.weeklyRhythmLabel)}
          />
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Make it real
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Ship the plan.
          </h2>
          <div className="mt-8">
            <ActionButtons
              googleCalendarUrl={googleUrls.checkIn}
              outlookCalendarUrl={outlookUrls.checkIn}
              pdfUrl={`/api/action-plan/${id}/pdf`}
              leadershipMailtoUrl={leadershipMailto}
              partnerMailtoUrl={partnerMailto}
            />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3 text-xs">
            <a
              href={googleUrls.reassessment}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border bg-card px-3 py-2 text-muted-foreground hover:text-foreground hover:border-accent/60 transition-smooth"
            >
              + Add reassessment to Google ({reassessmentDays}-day)
            </a>
            <a
              href={outlookUrls.reassessment}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border bg-card px-3 py-2 text-muted-foreground hover:text-foreground hover:border-accent/60 transition-smooth"
            >
              + Add reassessment to Outlook
            </a>
            <a
              href={googleUrls.sevenDay}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border bg-card px-3 py-2 text-muted-foreground hover:text-foreground hover:border-accent/60 transition-smooth"
            >
              + Add 7-day deadline to Google
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent inline-flex items-center gap-2">
            <Bookmark className="h-3.5 w-3.5" /> Saved
          </p>
          <h2 className="mt-3 font-velocity text-primary-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
            Bookmark this URL. We&rsquo;ll email you a reminder on {new Date(reassessmentDateISO).toLocaleDateString("en-US", { month: "long", day: "numeric" })}.
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Your plan is saved to this link. Share it with your leadership
            team, return to it weekly, and on your reassessment date we&rsquo;ll
            send an email linking to the review page where you mark each
            commitment yes / partially / no / not yet.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-primary-foreground/60 break-all">
            {planUrl}
          </p>
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
          Supabase credentials aren&rsquo;t set. Once they&rsquo;re live in
          Replit Secrets, saved plans will load.
        </p>
      </div>
    </section>
  );
}

function SavedError() {
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
