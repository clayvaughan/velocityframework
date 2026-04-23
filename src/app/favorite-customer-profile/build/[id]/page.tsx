import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import {
  BuildController,
  type BuilderInitialState,
} from "@/components/fcp/BuildController";
import type { ProfileDraft } from "@/components/fcp/FcpProfileForm";
import {
  getProfiles,
  getWorksheet,
  isStorageConfigured,
  type ScopeGuardrails,
} from "@/lib/fcp/storage";

export const metadata: Metadata = {
  title: "Build your Favorite Customer Profile Worksheet",
};

type Params = Promise<{ id: string }>;

const EMPTY_SCOPE: ScopeGuardrails = {
  core_focus: null,
  minimum_threshold: null,
  geography: null,
  strategic_priorities: null,
  do_not_pursue: null,
  proceed_with_caution: null,
};

export default async function FcpBuildPage({ params }: { params: Params }) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const wsRes = await getWorksheet(id);
  if (!wsRes.ok) return <BuildError />;
  const ws = wsRes.data;
  if (!ws) notFound();
  if (ws.status !== "in_progress") {
    redirect(`/favorite-customer-profile/saved/${id}`);
  }

  const pRes = await getProfiles(id);
  if (!pRes.ok) return <BuildError />;

  const profiles: ProfileDraft[] = pRes.data.map((p) => ({
    profile_name: p.profile_name ?? "",
    who_they_are: p.who_they_are ?? "",
    how_they_come_in: p.how_they_come_in ?? "",
    why_great_fit: p.why_great_fit ?? "",
    what_they_say_yes_to: p.what_they_say_yes_to ?? "",
    what_we_say_yes_to: p.what_we_say_yes_to ?? "",
    when_we_say_no: p.when_we_say_no ?? "",
    examples: p.examples ?? "",
    hospitality_cues: p.hospitality_cues ?? "",
  }));

  const initial: BuilderInitialState = {
    hasScopeFilters: ws.has_scope_filters,
    scopeGuardrails: (ws.scope_guardrails as ScopeGuardrails | null) ?? EMPTY_SCOPE,
    profiles,
  };

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Favorite Customer Profile · Build
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            {ws.company_name}&rsquo;s FCPs, in your words.
          </h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <BuildController
            worksheetId={id}
            companyName={ws.company_name}
            initialState={initial}
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
          Storage not configured
        </h1>
        <p className="mt-4 text-muted-foreground">
          Supabase credentials aren&rsquo;t set in this environment. Once
          they&rsquo;re live in Replit Secrets the worksheet builder loads.
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
          Couldn&rsquo;t load your worksheet
        </h1>
      </div>
    </section>
  );
}
