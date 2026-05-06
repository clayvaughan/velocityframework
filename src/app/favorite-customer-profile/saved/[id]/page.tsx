import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AlertCircle, Bookmark } from "lucide-react";
import { ActionButtons } from "@/components/fcp/ActionButtons";
import { AIAssist } from "@/components/ai/AIAssist";
import { isAiConfigured } from "@/lib/ai/anthropic-client";
import {
  getProfiles,
  getWorksheet,
  isStorageConfigured,
  type ScopeGuardrails,
} from "@/lib/fcp/storage";
import {
  PROFILE_SECTIONS,
  SCOPE_GUARDRAILS,
  renderLabelFor,
} from "@/lib/fcp/profile-sections";
import {
  leadershipEmailContent,
  revisitGoogleCalendarUrl,
} from "@/lib/fcp/email-drafts";

export const metadata: Metadata = {
  title: "Your Favorite Customer Profile Worksheet",
};

type Params = Promise<{ id: string }>;

export default async function FcpSavedPage({ params }: { params: Params }) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const wsRes = await getWorksheet(id);
  if (!wsRes.ok) return <SavedError />;
  const ws = wsRes.data;
  if (!ws) notFound();
  if (ws.status === "in_progress") redirect(`/favorite-customer-profile/build/${id}`);

  const pRes = await getProfiles(id);
  if (!pRes.ok) return <SavedError />;
  const profiles = pRes.data.filter((p) => p.profile_name && p.profile_name.trim().length > 0);

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "velocityframework.com";
  const shareUrl = `${proto}://${host}/favorite-customer-profile/saved/${id}`;
  const pdfUrl = `/api/favorite-customer-profile/${id}/pdf`;

  const leadershipEmail = leadershipEmailContent({
    firstName: ws.first_name,
    companyName: ws.company_name,
    fcpCount: profiles.length,
    planUrl: shareUrl,
  });
  const revisitUrl = revisitGoogleCalendarUrl(
    ws.first_name,
    ws.company_name,
    shareUrl
  );

  const scope = (ws.scope_guardrails as ScopeGuardrails | null) ?? null;
  const populatedScope = ws.has_scope_filters && scope
    ? SCOPE_GUARDRAILS.filter((g) => (scope[g.key] ?? "").trim().length > 0)
    : [];

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Favorite Customer Profile · Saved
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            {ws.company_name} FCP Worksheet.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Bookmark this page — it&rsquo;s shareable with your team and keeps
            a permanent record of your Favorite Customer Profiles. Revisit in
            90 days and refine.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl space-y-10">
          {populatedScope.length > 0 && scope ? (
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
                Scope guardrails
              </p>
              <dl className="mt-5 grid gap-4 md:grid-cols-2">
                {populatedScope.map((g) => (
                  <div key={g.key}>
                    <dt className="font-heading text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                      {g.label}
                    </dt>
                    <dd className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                      {scope[g.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <ol className="space-y-4 md:space-y-5">
            {profiles.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
                <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                  FCP #{p.position}
                </p>
                <h3 className="mt-2 font-heading text-xl md:text-2xl uppercase tracking-wide text-foreground">
                  {p.profile_name}
                </h3>
                <dl className="mt-5 grid gap-4 md:grid-cols-2">
                  {PROFILE_SECTIONS.filter((s) => s.key !== "profile_name").map((s) => {
                    const val = (p as unknown as Record<string, string | null>)[s.key];
                    if (!val || !val.trim()) return null;
                    return (
                      <div key={s.key}>
                        <dt className="font-heading text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                          {renderLabelFor(s, ws.company_name)}
                        </dt>
                        <dd className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                          {val}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* AI Polish — placed before "Make It Real" so it gets first attention. */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          <AIAssist
            tool="fcp"
            userId={id}
            aiCleanupAvailable={isAiConfigured()}
            initialSavedText={ws.polished_version ?? null}
          />
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-5xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Make it real
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Ship your FCPs.
          </h2>
          <div className="mt-8">
            <ActionButtons
              pdfUrl={pdfUrl}
              pdfFilename={`velocity-fcp-${id}.pdf`}
              leadershipEmail={leadershipEmail}
              shareUrl={shareUrl}
              revisitGoogleUrl={revisitUrl}
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
            Next move · Messaging &amp; Proof Checklist
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Your FCPs are the foundation. The Messaging &amp; Proof Checklist
            translates them into one-liners, case studies, and collateral you
            can actually ship — and it&rsquo;s the next tool in the Heading
            pillar.
          </p>
          <div className="mt-6">
            <Link
              href="/messaging-proof-checklist"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
            >
              Open the Messaging &amp; Proof Checklist →
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
          Couldn&rsquo;t load your worksheet
        </h1>
      </div>
    </section>
  );
}
