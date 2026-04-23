"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScopeGuardrailsForm } from "./ScopeGuardrailsForm";
import { FcpProfileForm, type ProfileDraft } from "./FcpProfileForm";
import { SummaryScreen } from "./SummaryScreen";
import type { ScopeGuardrails } from "@/lib/fcp/storage";

export type BuilderInitialState = {
  hasScopeFilters: boolean;
  scopeGuardrails: ScopeGuardrails;
  profiles: ProfileDraft[];
};

type Props = {
  worksheetId: string;
  companyName: string;
  initialState: BuilderInitialState;
};

const BLANK_PROFILE = (): ProfileDraft => ({
  profile_name: "",
  who_they_are: "",
  how_they_come_in: "",
  why_great_fit: "",
  what_they_say_yes_to: "",
  what_we_say_yes_to: "",
  when_we_say_no: "",
  examples: "",
  hospitality_cues: "",
});

export function BuildController({
  worksheetId,
  companyName,
  initialState,
}: Props) {
  const router = useRouter();
  const [scope, setScope] = useState<ScopeGuardrails>(initialState.scopeGuardrails);
  const [hasScope] = useState(initialState.hasScopeFilters);
  const [profiles, setProfiles] = useState<ProfileDraft[]>(
    initialState.profiles.length > 0
      ? initialState.profiles
      : [BLANK_PROFILE()]
  );
  const [step, setStep] = useState(initialState.hasScopeFilters ? 0 : 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step navigation:
  //   0 = scope (only if hasScope)
  //   1..3 = FCP #1..#3
  //   4 = summary (always last — label is "5" on screen if scope included)
  const summaryStep = 4;
  const firstProfileStep = 1;

  const totalSteps = (hasScope ? 1 : 0) + 3 + 1; // scope + 3 fcps + summary
  const shownStepNumber = useMemo(() => {
    if (step === 0) return 1;
    if (step === summaryStep) return totalSteps;
    return (hasScope ? 1 : 0) + step;
  }, [step, hasScope, totalSteps]);

  function updateProfile(index: number, next: ProfileDraft) {
    setProfiles((prev) => prev.map((p, i) => (i === index ? next : p)));
  }

  function addProfile() {
    if (profiles.length >= 3) return;
    setProfiles((prev) => [...prev, BLANK_PROFILE()]);
  }

  function removeProfile(index: number) {
    if (profiles.length <= 1) return;
    setProfiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function persist() {
    const res = await fetch(`/api/favorite-customer-profile/${worksheetId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hasScopeFilters: hasScope,
        scopeGuardrails: scope,
        profiles: profiles.map((p, i) => ({
          position: (i + 1) as 1 | 2 | 3,
          profile_name: p.profile_name || null,
          who_they_are: p.who_they_are || null,
          how_they_come_in: p.how_they_come_in || null,
          why_great_fit: p.why_great_fit || null,
          what_they_say_yes_to: p.what_they_say_yes_to || null,
          what_we_say_yes_to: p.what_we_say_yes_to || null,
          when_we_say_no: p.when_we_say_no || null,
          examples: p.examples || null,
          hospitality_cues: p.hospitality_cues || null,
        })),
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Could not save progress.");
    }
  }

  async function handleNext() {
    setSaving(true);
    setError(null);
    try {
      await persist();
      if (step === 0) setStep(1);
      else if (step === 1) setStep(2);
      else if (step === 2) setStep(3);
      else if (step === 3) setStep(summaryStep);
      else if (step === summaryStep) {
        const saveRes = await fetch(
          `/api/favorite-customer-profile/${worksheetId}/save`,
          { method: "POST" }
        );
        if (!saveRes.ok) {
          const body = await saveRes.json().catch(() => ({}));
          throw new Error(body.error ?? "Could not save your worksheet.");
        }
        router.push(`/favorite-customer-profile/saved/${worksheetId}`);
        return;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (step === 0) return;
    if (step === 1) setStep(hasScope ? 0 : 1);
    else if (step === summaryStep) setStep(3);
    else setStep(step - 1);
  }

  const profileIndex = step >= 1 && step <= 3 ? step - 1 : -1;
  const canNext =
    step === 0
      ? true
      : step === summaryStep
      ? profiles.some((p) => p.profile_name.trim().length > 0)
      : profileIndex === 0
      ? profiles[0]?.profile_name.trim().length > 0
      : true;

  return (
    <div className="space-y-10">
      <ol className="flex items-center gap-2 text-[0.65rem] font-heading uppercase tracking-widest">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <li
            key={i}
            className={cn(
              "flex-1 rounded-full h-1.5",
              i < shownStepNumber ? "bg-accent" : "bg-border"
            )}
          />
        ))}
      </ol>

      {step === 0 ? (
        <ScopeGuardrailsForm value={scope} onChange={setScope} />
      ) : null}

      {profileIndex >= 0 && profileIndex < profiles.length ? (
        <FcpProfileForm
          position={(profileIndex + 1) as 1 | 2 | 3}
          companyName={companyName}
          value={profiles[profileIndex]}
          onChange={(v) => updateProfile(profileIndex, v)}
          removable={profileIndex > 0}
          onRemove={() => removeProfile(profileIndex)}
        />
      ) : null}

      {profileIndex >= 0 && profileIndex === profiles.length - 1 && profiles.length < 3 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/40 p-6 text-center">
          <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
            Optional · up to 3 FCPs
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Most businesses land on 2 or 3 Favorite Customer Profiles. Add
            another if you have a clearly distinct archetype.
          </p>
          <Button type="button" variant="outline" size="md" className="mt-4" onClick={addProfile}>
            <Plus className="h-4 w-4" />
            Add another FCP
          </Button>
        </div>
      ) : null}

      {step === summaryStep ? (
        <SummaryScreen
          companyName={companyName}
          hasScopeFilters={hasScope}
          scopeGuardrails={scope}
          profiles={profiles}
        />
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between pt-2">
        {step > (hasScope ? 0 : 1) ? (
          <Button type="button" variant="link" size="sm" onClick={handleBack} disabled={saving}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="cta"
          size="lg"
          disabled={!canNext || saving}
          onClick={handleNext}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : step === summaryStep ? (
            <>
              Save my worksheet
              <ArrowRight className="h-4 w-4" />
            </>
          ) : step === 3 ? (
            <>
              Review &amp; save
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
