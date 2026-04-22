"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToxinPicker } from "./ToxinPicker";
import { CounterMovePicker, type CounterMoveSelection } from "./CounterMovePicker";
import { FocusAreaForm, type FocusAreaDetails } from "./FocusAreaForm";
import { VirtueTagger } from "./VirtueTagger";
import type { ToxinId } from "@/lib/action-plan/toxins";
import type { VirtueId } from "@/lib/action-plan/virtues";
import type { WeeklyRhythmId } from "@/lib/action-plan/weekly-rhythms";

export type BuilderFocusArea = {
  toxinId: ToxinId;
  counterMoveId: string | null;
  counterMoveCustom: string | null;
  virtueId: VirtueId | null;
  sevenDayAction: string;
  weeklyRhythmId: WeeklyRhythmId | null;
  weeklyRhythmCustom: string | null;
};

export type BuilderInitialState = {
  focusAreas: BuilderFocusArea[];
  reassessmentDays: 30 | 60 | 90 | null;
  accountabilityPartnerName: string;
  accountabilityPartnerEmail: string;
  sendPartnerInvite: boolean;
  prePickedFromHealthCheck: boolean;
};

type Props = {
  planId: string;
  initialState: BuilderInitialState;
};

type Step = 1 | 2 | 3 | 4;

export function BuildController({ planId, initialState }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [focusAreas, setFocusAreas] = useState<BuilderFocusArea[]>(
    initialState.focusAreas
  );
  const [reassessmentDays, setReassessmentDays] = useState<30 | 60 | 90>(
    initialState.reassessmentDays ?? 30
  );
  const [partnerName, setPartnerName] = useState(
    initialState.accountabilityPartnerName
  );
  const [partnerEmail, setPartnerEmail] = useState(
    initialState.accountabilityPartnerEmail
  );
  const [sendInvite, setSendInvite] = useState(initialState.sendPartnerInvite);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedToxins = useMemo(() => focusAreas.map((f) => f.toxinId), [focusAreas]);

  function setToxins(next: ToxinId[]) {
    // Preserve existing focus-area data for toxins that remain; reset for new ones.
    const kept = next.map((id) => {
      const prev = focusAreas.find((f) => f.toxinId === id);
      return (
        prev ?? {
          toxinId: id,
          counterMoveId: null,
          counterMoveCustom: null,
          virtueId: null,
          sevenDayAction: "",
          weeklyRhythmId: null,
          weeklyRhythmCustom: null,
        }
      );
    });
    setFocusAreas(kept);
  }

  function updateFocusArea(index: number, patch: Partial<BuilderFocusArea>) {
    setFocusAreas((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  // ---------- step-by-step validation ----------
  const step1Valid = focusAreas.length > 0 && focusAreas.length <= 3;
  const step2Valid = focusAreas.every(
    (f) =>
      (f.counterMoveId !== null) ||
      (f.counterMoveCustom !== null && f.counterMoveCustom.trim().length > 0)
  );
  const step3Valid =
    focusAreas.every(
      (f) =>
        f.sevenDayAction.trim().length > 0 &&
        f.weeklyRhythmId !== null &&
        (f.weeklyRhythmId !== "custom" ||
          (f.weeklyRhythmCustom !== null && f.weeklyRhythmCustom.trim().length > 0))
    ) &&
    Boolean(reassessmentDays) &&
    // If they provided a partner email, require the name too (and vice versa)
    ((!partnerEmail.trim() && !partnerName.trim()) ||
      (partnerEmail.trim().length > 0 && partnerName.trim().length > 0));
  const step4Valid = focusAreas.every((f) => f.virtueId !== null);

  const canNext =
    step === 1
      ? step1Valid
      : step === 2
      ? step2Valid
      : step === 3
      ? step3Valid
      : step4Valid;

  async function persistAndAdvance(direction: "next" | "save") {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/action-plan/${planId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focusAreas,
          reassessmentDays,
          accountabilityPartnerName: partnerName.trim() || null,
          accountabilityPartnerEmail: partnerEmail.trim() || null,
          sendPartnerInvite: sendInvite,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save progress.");
      }
      if (direction === "save") {
        const saveRes = await fetch(`/api/action-plan/${planId}/save`, {
          method: "POST",
        });
        if (!saveRes.ok) {
          const body = await saveRes.json().catch(() => ({}));
          throw new Error(body.error ?? "Could not finalize plan.");
        }
        router.push(`/action-plan/saved/${planId}`);
        return;
      }
      setStep((step + 1) as Step);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function goBack() {
    if (step > 1) setStep((step - 1) as Step);
  }

  return (
    <div className="space-y-10">
      {/* Progress indicator */}
      <ol className="flex items-center gap-2 text-[0.65rem] font-heading uppercase tracking-widest">
        {[1, 2, 3, 4].map((n) => (
          <li
            key={n}
            className={cn(
              "flex-1 rounded-full h-1.5",
              n <= step ? "bg-accent" : "bg-border"
            )}
          />
        ))}
      </ol>

      {/* Screen body */}
      {step === 1 ? (
        <ToxinPicker
          selected={selectedToxins}
          onChange={setToxins}
          prePickedFromHealthCheck={initialState.prePickedFromHealthCheck}
        />
      ) : null}

      {step === 2 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Screen 2 of 4 · Counter-moves
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Define the counter-move.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            For each toxin, pick the move that will make the biggest
            visible difference in the next 30 days.
          </p>
          <div className="mt-8 space-y-6">
            {focusAreas.map((f, i) => (
              <CounterMovePicker
                key={f.toxinId}
                toxinId={f.toxinId}
                index={i}
                total={focusAreas.length}
                value={
                  {
                    counterMoveId: f.counterMoveId,
                    counterMoveCustom: f.counterMoveCustom,
                  } as CounterMoveSelection
                }
                onChange={(v) =>
                  updateFocusArea(i, {
                    counterMoveId: v.counterMoveId,
                    counterMoveCustom: v.counterMoveCustom,
                  })
                }
              />
            ))}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Screen 3 of 4 · Action &amp; rhythm
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Build the rhythm.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            For each focus area: a specific 7-day action, a weekly rhythm
            you&rsquo;ll install, and — optionally — an accountability
            partner who&rsquo;ll check in with you.
          </p>

          <div className="mt-8 space-y-6">
            {focusAreas.map((f, i) => (
              <FocusAreaForm
                key={f.toxinId}
                toxinId={f.toxinId}
                index={i}
                total={focusAreas.length}
                value={{
                  sevenDayAction: f.sevenDayAction,
                  weeklyRhythmId: f.weeklyRhythmId,
                  weeklyRhythmCustom: f.weeklyRhythmCustom,
                } as FocusAreaDetails}
                onChange={(v) =>
                  updateFocusArea(i, {
                    sevenDayAction: v.sevenDayAction,
                    weeklyRhythmId: v.weeklyRhythmId,
                    weeklyRhythmCustom: v.weeklyRhythmCustom,
                  })
                }
              />
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
            <div>
              <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                Accountability partner
              </p>
              <h3 className="mt-2 font-heading text-xl uppercase tracking-wide text-foreground">
                Someone outside your org who&rsquo;ll check in.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Optional but recommended. The relationship only works if they
                can tell you hard truths.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-heading text-xs uppercase tracking-widest text-foreground">
                  Name
                </span>
                <input
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full rounded-lg border-2 border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </label>
              <label className="block space-y-2">
                <span className="font-heading text-xs uppercase tracking-widest text-foreground">
                  Email or phone
                </span>
                <input
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border-2 border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </label>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendInvite}
                onChange={(e) => setSendInvite(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-muted-foreground">
                Send them a pre-drafted invitation email when I finalize this
                plan. (Opens your mail client with a draft — doesn&rsquo;t
                send automatically.)
              </span>
            </label>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
              Reassessment
            </p>
            <h3 className="font-heading text-xl uppercase tracking-wide text-foreground">
              When do you come back to this?
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              {([30, 60, 90] as const).map((d) => {
                const isSel = reassessmentDays === d;
                const label =
                  d === 30
                    ? "30 days — urgent changes"
                    : d === 60
                    ? "60 days — deeper shifts"
                    : "90 days — cultural transformation";
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setReassessmentDays(d)}
                    aria-pressed={isSel}
                    className={cn(
                      "rounded-lg border-2 p-4 text-left transition-smooth",
                      "focus:outline-none focus:ring-2 focus:ring-accent/40",
                      isSel
                        ? "border-accent bg-accent/10"
                        : "border-border bg-background hover:border-accent/60"
                    )}
                  >
                    <p className="font-velocity text-2xl tracking-wider">{d}</p>
                    <p className="mt-1 font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                      {label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Screen 4 of 4 · Virtues
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Which virtue are you building?
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Every culture move in Velocity ties to one of three virtues.
            Tagging your focus area to a virtue is how you make the change
            stick — and how you measure it later.
          </p>
          <div className="mt-8 space-y-6">
            {focusAreas.map((f, i) => (
              <VirtueTagger
                key={f.toxinId}
                toxinId={f.toxinId}
                index={i}
                total={focusAreas.length}
                value={f.virtueId}
                onChange={(v) => updateFocusArea(i, { virtueId: v })}
              />
            ))}
          </div>
        </div>
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
        {step > 1 ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={goBack}
            disabled={saving}
          >
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
          onClick={() => persistAndAdvance(step === 4 ? "save" : "next")}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : step === 4 ? (
            <>
              Finalize my plan
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
