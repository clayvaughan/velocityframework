import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AlertCircle, Bookmark } from "lucide-react";
import { ActionButtons } from "@/components/revenue-team/ActionButtons";
import {
  getRevenueMap,
  getRevenueRoles,
  isStorageConfigured,
} from "@/lib/revenue-team/storage";
import {
  DEFAULT_MEETING_AGENDA,
  DEFAULT_MEETING_DAY,
  DEFAULT_MEETING_DURATION,
  DEFAULT_MEETING_TIME,
  DEFAULT_REFLECTION_QUESTION,
} from "@/lib/revenue-team/constants";
import {
  allRevenueCalendarUrls,
  revenueTeamEmailContent,
  type RevenueCalendarContext,
} from "@/lib/revenue-team/email-drafts";

export const metadata: Metadata = {
  title: "Your Unified Revenue Team Accountability Map",
};

type Params = Promise<{ id: string }>;

function formatDate(iso: string | null): string {
  if (!iso) return "Not yet set";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Not yet set";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function RevenueSavedPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const mapRes = await getRevenueMap(id);
  if (!mapRes.ok) return <SavedError />;
  if (!mapRes.data) notFound();
  if (mapRes.data.status === "in_progress") {
    redirect(`/revenue-team-accountability-map/build/${id}`);
  }
  const map = mapRes.data;

  const rolesRes = await getRevenueRoles(id);
  if (!rolesRes.ok) return <SavedError />;
  const roles = rolesRes.data;

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "velocityframework.com";
  const shareUrl = `${proto}://${host}/revenue-team-accountability-map/saved/${id}`;
  const pdfUrl = `/api/revenue-team-accountability-map/${id}/pdf`;

  const reflectionQuestion =
    map.reflection_question && map.reflection_question.trim().length > 0
      ? map.reflection_question
      : DEFAULT_REFLECTION_QUESTION;

  const teamEmail = revenueTeamEmailContent({
    firstName: map.first_name,
    companyName: map.company_name,
    planUrl: shareUrl,
  });

  const attendeeNames = roles
    .map((r) => r.owner_name)
    .filter((n): n is string => !!(n && n.trim().length > 0));

  const hasSalesLead = roles.some(
    (r) => r.role_type === "sales_lead" && r.role_name && r.role_name.trim().length > 0
  );

  const calendarCtx: RevenueCalendarContext = {
    firstName: map.first_name,
    companyName: map.company_name,
    planUrl: shareUrl,
    weeklyMeetingDay: map.weekly_meeting_day ?? DEFAULT_MEETING_DAY,
    weeklyMeetingTime: map.weekly_meeting_time ?? DEFAULT_MEETING_TIME,
    weeklyMeetingDuration:
      map.weekly_meeting_duration ?? DEFAULT_MEETING_DURATION,
    weeklyMeetingAgenda: map.weekly_meeting_agenda ?? DEFAULT_MEETING_AGENDA,
    attendeeNames,
    reflectionQuestion,
    reflectionDateISO1: map.reflection_date_1 ?? "",
    reflectionDateISO2: map.reflection_date_2 ?? "",
    reflectionDateISO3: map.reflection_date_3 ?? "",
  };

  const googleUrls = allRevenueCalendarUrls(calendarCtx, "google");
  const outlookUrls = allRevenueCalendarUrls(calendarCtx, "outlook");

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Revenue Team Accountability Map · Saved
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            {map.company_name} — revenue team mapped.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Bookmark this page. Share it with your revenue team. Start
            running the weekly rhythm on Wednesday.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl space-y-10">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
            <div className="grid grid-cols-[1.3fr_1fr_1.6fr_1.3fr_1fr] gap-4 px-5 py-3 border-b border-border bg-secondary/40">
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Role
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Owner
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Mission
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Key metric #1
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Reports to
              </span>
            </div>
            {roles.map((r) => {
              const mission = (r.mission_statement ?? "").trim();
              const firstSentence = mission.match(/^[^.!?]+[.!?]/);
              return (
                <div
                  key={r.id}
                  className="grid grid-cols-[1.3fr_1fr_1.6fr_1.3fr_1fr] gap-4 px-5 py-4 border-b border-border last:border-b-0 text-sm"
                >
                  <span className="font-heading text-foreground">
                    {r.role_name}
                  </span>
                  <span className="text-muted-foreground">
                    {r.owner_name && r.owner_name.trim().length > 0
                      ? r.owner_name
                      : "(Vacant)"}
                  </span>
                  <span className="text-muted-foreground">
                    {firstSentence?.[0] ?? mission ?? "—"}
                  </span>
                  <span className="text-muted-foreground">
                    {r.metric_1 ?? "—"}
                  </span>
                  <span className="text-muted-foreground">
                    {r.accountable_to ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
              Weekly Revenue Team Meeting
            </p>
            <p className="mt-3 font-heading text-lg text-foreground">
              {map.weekly_meeting_day ?? DEFAULT_MEETING_DAY}s at{" "}
              {map.weekly_meeting_time ?? DEFAULT_MEETING_TIME} ·{" "}
              {map.weekly_meeting_duration ?? DEFAULT_MEETING_DURATION}
            </p>
            {attendeeNames.length > 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Attendees: {attendeeNames.join(", ")}
              </p>
            ) : null}
            <pre className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground font-sans bg-secondary/40 rounded-lg p-4">
              {map.weekly_meeting_agenda ?? DEFAULT_MEETING_AGENDA}
            </pre>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
              Reflection rhythm
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <ReflectionDateCard
                label="First reflection"
                value={formatDate(map.reflection_date_1)}
              />
              <ReflectionDateCard
                label="Second reflection"
                value={formatDate(map.reflection_date_2)}
              />
              <ReflectionDateCard
                label="Third reflection"
                value={formatDate(map.reflection_date_3)}
              />
            </div>
            <div className="mt-6 rounded-lg bg-secondary/60 p-4 text-sm text-muted-foreground italic">
              &ldquo;{reflectionQuestion}&rdquo;
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Make it real
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Ship it to your team.
          </h2>
          <div className="mt-8">
            <ActionButtons
              pdfUrl={pdfUrl}
              pdfFilename={`velocity-revenue-team-map-${id}.pdf`}
              teamEmail={teamEmail}
              shareUrl={shareUrl}
              googleCalendarUrls={googleUrls}
              outlookCalendarUrls={outlookUrls}
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent inline-flex items-center gap-2">
            <Bookmark className="h-3.5 w-3.5" /> Saved
          </p>
          <h2 className="mt-3 font-velocity text-primary-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
            Next move · See the weekly numbers in practice
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Now see what the weekly numbers look like in practice — download
            Clay&rsquo;s actual revenue team dashboard. Four real dashboards
            from Good Agency, one per department.
          </p>
          <div className="mt-6">
            <Link
              href="/good-agency-dashboard-example"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
            >
              Download the Dashboard Example →
            </Link>
          </div>
        </div>
      </section>

      {hasSalesLead ? (
        <section className="section-padding bg-gradient-section">
          <div className="container-wide max-w-3xl">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              Also recommended · For your Sales Lead
            </p>
            <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
              Give your Sales Lead the script they need.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              The Bellamere Trust-Building Script is the living example
              every FRE Clay certifies studies first. Ten coached sections
              covering pre-arrival hospitality through the final farewell —
              same bones any Sales Lead can adapt to your business.
            </p>
            <div className="mt-6">
              <Link
                href="/bellamere-trust-building-script"
                className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
              >
                Open the Trust-Building Script →
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function ReflectionDateCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        {label}
      </p>
      <p className="mt-2 font-heading text-base text-foreground">{value}</p>
    </div>
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

function SavedError() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Couldn&rsquo;t load your map
        </h1>
      </div>
    </section>
  );
}
