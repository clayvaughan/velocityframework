import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AlertCircle, Bookmark } from "lucide-react";
import { ActionButtons } from "@/components/messaging/ActionButtons";
import {
  getChecklist,
  getCollateralItems,
  isStorageConfigured,
} from "@/lib/messaging/storage";
import {
  COLLATERAL_ITEMS,
  collateralReadinessScore,
  type CollateralStatus,
} from "@/lib/messaging/constants";
import {
  leadershipEmailContent,
  messagingReviewGoogleUrl,
} from "@/lib/messaging/email-drafts";

export const metadata: Metadata = {
  title: "Your Messaging & Proof Checklist",
};

type Params = Promise<{ id: string }>;

export default async function MessagingSavedPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const c = await getChecklist(id);
  if (!c.ok) return <SavedError />;
  if (!c.data) notFound();
  if (c.data.status === "in_progress") {
    redirect(`/messaging-proof-checklist/build/${id}`);
  }

  const ci = await getCollateralItems(id);
  const statuses: Record<string, CollateralStatus> = {};
  if (ci.ok) {
    for (const item of ci.data) statuses[item.item_key] = item.status;
  }
  const score = collateralReadinessScore(statuses);

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "velocityframework.com";
  const shareUrl = `${proto}://${host}/messaging-proof-checklist/saved/${id}`;
  const pdfUrl = `/api/messaging-proof-checklist/${id}/pdf`;

  const leadershipEmail = leadershipEmailContent({
    firstName: c.data.first_name,
    companyName: c.data.company_name,
    planUrl: shareUrl,
    onelinerFinal: c.data.oneliner_final,
  });
  const reviewUrl = messagingReviewGoogleUrl(
    c.data.first_name,
    c.data.company_name,
    shareUrl
  );

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Messaging &amp; Proof Checklist · Saved
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            {c.data.company_name} — messaging locked.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Bookmark this page. Share with your team. Revisit in 30 days to
            re-audit the collateral and iterate.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl space-y-10">
          {c.data.oneliner_final ? (
            <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-6 md:p-10">
              <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                Your locked one-liner
              </p>
              <p className="mt-3 font-velocity text-foreground text-2xl md:text-3xl leading-tight tracking-wider">
                {c.data.oneliner_final}
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                Collateral readiness
              </p>
              <p className="font-velocity text-foreground text-4xl tracking-wider">{score}%</p>
            </div>
            <ul className="mt-5 space-y-2">
              {COLLATERAL_ITEMS.map((item) => {
                const s = statuses[item.key];
                return (
                  <li key={item.key} className="flex items-start gap-3">
                    <span
                      className={
                        s === "yes"
                          ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-success text-success-foreground font-heading text-[0.6rem]"
                          : s === "partial"
                          ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning text-warning-foreground font-heading text-[0.6rem]"
                          : s === "no"
                          ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground font-heading text-[0.6rem]"
                          : "inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-muted-foreground text-[0.6rem]"
                      }
                      aria-label={s ?? "not set"}
                    >
                      {s === "yes" ? "Y" : s === "partial" ? "~" : s === "no" ? "N" : "—"}
                    </span>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Make it real
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Ship your messaging.
          </h2>
          <div className="mt-8">
            <ActionButtons
              pdfUrl={pdfUrl}
              pdfFilename={`velocity-messaging-${id}.pdf`}
              leadershipEmail={leadershipEmail}
              shareUrl={shareUrl}
              reviewGoogleUrl={reviewUrl}
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
            Next move · Trust-Building Script
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Your messaging is locked. The Trust-Building Script is the sales
            conversation that turns it into revenue — the one place in the
            Hustle pillar that depends most on messaging clarity.
          </p>
          <div className="mt-6">
            <Link
              href="/toolbox/trust-building-script"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
            >
              Open the Trust-Building Script →
            </Link>
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
          Couldn&rsquo;t load your checklist
        </h1>
      </div>
    </section>
  );
}
