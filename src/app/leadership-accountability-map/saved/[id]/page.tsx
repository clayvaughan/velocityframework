import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AlertCircle, Bookmark } from "lucide-react";
import { ActionButtons } from "@/components/accountability/ActionButtons";
import { AIAssist } from "@/components/ai/AIAssist";
import { isAiConfigured } from "@/lib/ai/anthropic-client";
import {
  getMap,
  getRoles,
  isStorageConfigured,
} from "@/lib/accountability/storage";
import { DEFAULT_REFLECTION_QUESTION } from "@/lib/accountability/constants";
import {
  allReflectionCalendarUrls,
  leadershipEmailContent,
  type ReflectionCalendarContext,
} from "@/lib/accountability/email-drafts";

export const metadata: Metadata = {
  title: "Your Leadership Accountability Map",
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

export default async function AccountabilitySavedPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const mapRes = await getMap(id);
  if (!mapRes.ok) return <SavedError />;
  if (!mapRes.data) notFound();
  if (mapRes.data.status === "in_progress") {
    redirect(`/leadership-accountability-map/build/${id}`);
  }
  const map = mapRes.data;

  const rolesRes = await getRoles(id);
  if (!rolesRes.ok) return <SavedError />;
  const roles = rolesRes.data;

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "velocityframework.com";
  const shareUrl = `${proto}://${host}/leadership-accountability-map/saved/${id}`;
  const pdfUrl = `/api/leadership-accountability-map/${id}/pdf`;

  const reflectionQuestion =
    map.reflection_question && map.reflection_question.trim().length > 0
      ? map.reflection_question
      : DEFAULT_REFLECTION_QUESTION;

  const leadershipEmail = leadershipEmailContent({
    firstName: map.first_name,
    companyName: map.company_name,
    planUrl: shareUrl,
  });

  const calendarCtx: ReflectionCalendarContext = {
    firstName: map.first_name,
    companyName: map.company_name,
    planUrl: shareUrl,
    reflectionQuestion,
    reflectionDateISO1: map.reflection_date_1 ?? "",
    reflectionDateISO2: map.reflection_date_2 ?? "",
    reflectionDateISO3: map.reflection_date_3 ?? "",
  };

  const googleUrls = allReflectionCalendarUrls(calendarCtx, "google");
  const outlookUrls = allReflectionCalendarUrls(calendarCtx, "outlook");

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Leadership Accountability Map · Saved
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            {map.company_name} — ownership locked.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Bookmark this page. Share it with your leadership team. Come back
            at each reflection date and walk the seats together.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl space-y-10">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
            <div className="grid grid-cols-[1.3fr_1fr_2fr_1fr] gap-4 px-5 py-3 border-b border-border bg-secondary/40">
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
                Accountable to
              </span>
            </div>
            {roles.map((r) => {
              const mission = (r.mission_statement ?? "").trim();
              const firstSentence = mission.match(/^[^.!?]+[.!?]/);
              return (
                <div
                  key={r.id}
                  className="grid grid-cols-[1.3fr_1fr_2fr_1fr] gap-4 px-5 py-4 border-b border-border last:border-b-0 text-sm"
                >
                  <span className="font-heading text-foreground">
                    {r.role_name}
                  </span>
                  <span className="text-muted-foreground">
                    {r.owner_name && r.owner_name.trim().length > 0
                      ? r.owner_name
                      : "(Open seat)"}
                  </span>
                  <span className="text-muted-foreground">
                    {firstSentence?.[0] ?? mission ?? "—"}
                  </span>
                  <span className="text-muted-foreground">
                    {r.accountable_to && r.accountable_to.trim().length > 0
                      ? r.accountable_to
                      : "—"}
                  </span>
                </div>
              );
            })}
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

      {/* AI Polish — placed before "Make It Real" so it gets first attention. */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <AIAssist
            tool="leadership-accountability-map"
            userId={id}
            aiCleanupAvailable={isAiConfigured()}
            initialSavedText={map.polished_version ?? null}
          />
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Make it real
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Put it in front of your team.
          </h2>
          <div className="mt-8">
            <ActionButtons
              pdfUrl={pdfUrl}
              pdfFilename={`velocity-accountability-map-${id}.pdf`}
              leadershipEmail={leadershipEmail}
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
            Next move · Unified Revenue Team Map
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            You&rsquo;ve named the seats at the leadership level. The next
            drill-down is the Revenue department — where marketing, sales,
            and RevOps still report to different leaders at most growing
            companies. Unify them into one revenue team.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/revenue-team-accountability-map"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
            >
              Open the Unified Revenue Map →
            </Link>
            <Link
              href="/good-agency-scorecard-example"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-transparent text-primary-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide transition-smooth hover:bg-accent/10 hover:border-accent"
            >
              Or grab the Scorecard Example →
            </Link>
          </div>
          <p className="mt-4 text-xs text-primary-foreground/60 max-w-2xl">
            The Scorecard Example turns each seat you just named into an
            individual-level accountability tool. Same structure Good Agency
            uses for every role on the team.
          </p>
        </div>
      </section>
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
