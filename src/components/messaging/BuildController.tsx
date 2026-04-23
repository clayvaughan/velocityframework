"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  COLLATERAL_ITEMS,
  ONELINER_EXAMPLES,
  TESTIMONIAL_PROMPTS,
  collateralReadinessScore,
  type CollateralItemKey,
  type CollateralStatus,
} from "@/lib/messaging/constants";
import type { ChecklistRow } from "@/lib/messaging/storage";

type Props = {
  checklistId: string;
  initialChecklist: Pick<
    ChecklistRow,
    | "oneliner_problem"
    | "oneliner_solution"
    | "oneliner_success"
    | "oneliner_final"
    | "message_top_of_funnel"
    | "message_middle_of_funnel"
    | "message_bottom_of_funnel"
    | "message_post_purchase"
    | "case_customer"
    | "case_problem"
    | "case_why_chose_you"
    | "case_what_you_did"
    | "case_result"
    | "case_friend_quote"
    | "testimonial_outreach_notes"
    | "cta_home_direct"
    | "cta_home_transitional"
    | "cta_product_direct"
    | "cta_product_transitional"
    | "cta_email_direct"
    | "cta_email_transitional"
  >;
  initialCollateral: Record<CollateralItemKey, { status: CollateralStatus | null; notes: string }>;
  favoriteCustomer: string;
};

type BuilderFields = NonNullable<Props["initialChecklist"]>;

const inputClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

export function BuildController({
  checklistId,
  initialChecklist,
  initialCollateral,
  favoriteCustomer,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [fields, setFields] = useState<BuilderFields>(initialChecklist);
  const [collateral, setCollateral] = useState(initialCollateral);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPrompts, setCopiedPrompts] = useState(false);

  function patch(next: Partial<BuilderFields>) {
    setFields((prev) => ({ ...prev, ...next }));
  }

  const onelinerPreview = useMemo(() => {
    const parts = [fields.oneliner_problem, fields.oneliner_solution, fields.oneliner_success]
      .map((p) => p?.trim())
      .filter(Boolean);
    return parts.join(" ");
  }, [fields.oneliner_problem, fields.oneliner_solution, fields.oneliner_success]);

  const collateralScore = useMemo(() => {
    const statuses: Record<string, CollateralStatus> = {};
    for (const k in collateral) {
      const v = collateral[k as CollateralItemKey];
      if (v.status) statuses[k] = v.status;
    }
    return collateralReadinessScore(statuses);
  }, [collateral]);

  async function persist() {
    const res = await fetch(`/api/messaging-proof-checklist/${checklistId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        collateral: Object.entries(collateral)
          .filter(([, v]) => v.status)
          .map(([k, v]) => ({
            item_key: k as CollateralItemKey,
            status: v.status as CollateralStatus,
            notes: v.notes || null,
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
      if (step < 6) {
        setStep((step + 1) as typeof step);
      } else {
        const saveRes = await fetch(
          `/api/messaging-proof-checklist/${checklistId}/save`,
          { method: "POST" }
        );
        if (!saveRes.ok) {
          const body = await saveRes.json().catch(() => ({}));
          throw new Error(body.error ?? "Could not save your checklist.");
        }
        router.push(`/messaging-proof-checklist/saved/${checklistId}`);
        return;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (step > 1) setStep((step - 1) as typeof step);
  }

  async function copyPrompts() {
    try {
      const text = TESTIMONIAL_PROMPTS.map((p, i) => `${i + 1}. ${p}`).join("\n\n");
      await navigator.clipboard.writeText(text);
      setCopiedPrompts(true);
      setTimeout(() => setCopiedPrompts(false), 2000);
    } catch {
      // ignore
    }
  }

  const canNext =
    step === 1
      ? (fields.oneliner_final ?? "").trim().length > 0
      : true;

  return (
    <div className="space-y-10">
      <ol className="flex items-center gap-2 text-[0.65rem] font-heading uppercase tracking-widest">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <li
            key={n}
            className={cn(
              "flex-1 rounded-full h-1.5",
              n <= step ? "bg-accent" : "bg-border"
            )}
          />
        ))}
      </ol>

      {step === 1 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 1 of 6 · One-liner
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Write the one-liner that anchors everything else.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Clay teaches that messaging that drives Velocity is short, succinct,
            unchanging, and relevant. Your one-liner is the foundation —
            everything else in this checklist builds on it. The formula is
            problem → solution → success.
          </p>

          <details className="mt-6 rounded-xl border border-border bg-card p-5">
            <summary className="font-heading text-xs uppercase tracking-widest text-accent-dark cursor-pointer">
              Examples from the book
            </summary>
            <ul className="mt-4 space-y-4">
              {ONELINER_EXAMPLES.map((ex) => (
                <li key={ex.name} className="text-sm">
                  <p className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    {ex.name}
                  </p>
                  <p className="mt-1 text-foreground">
                    {ex.problem} {ex.solution} {ex.success}
                  </p>
                </li>
              ))}
            </ul>
          </details>

          <div className="mt-8 space-y-5">
            <Field label="1. The problem your customer is trying to solve">
              <textarea
                rows={2}
                value={fields.oneliner_problem ?? ""}
                onChange={(e) => patch({ oneliner_problem: e.target.value })}
                placeholder="External + emotional. 'It can be hard to find a paving contractor you can trust.'"
                className={inputClass}
              />
            </Field>
            <Field label="2. Your solution — how you solve it, with credibility">
              <textarea
                rows={2}
                value={fields.oneliner_solution ?? ""}
                onChange={(e) => patch({ oneliner_solution: e.target.value })}
                placeholder="'For over 50 years, AAA Paving has delivered quality work on time and on budget,'"
                className={inputClass}
              />
            </Field>
            <Field label="3. The success they'll experience">
              <textarea
                rows={2}
                value={fields.oneliner_success ?? ""}
                onChange={(e) => patch({ oneliner_success: e.target.value })}
                placeholder="The outcome. 'so you know your project will be done right the first time.'"
                className={inputClass}
              />
            </Field>

            {onelinerPreview ? (
              <div className="rounded-xl border-2 border-accent/40 bg-accent/5 p-5">
                <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                  Your one-liner so far
                </p>
                <p className="mt-2 text-base text-foreground">{onelinerPreview}</p>
              </div>
            ) : null}

            <div className="rounded-lg bg-secondary/60 p-4 space-y-2 text-xs text-muted-foreground">
              <p>• Read it out loud. If you stumble, simplify.</p>
              <p>
                • Share it with one sales rep and one marketer. Ask: &ldquo;Where
                would this break in the wild?&rdquo; Fix one word.
              </p>
            </div>

            <Field label="Your locked one-liner" required>
              <textarea
                rows={3}
                value={fields.oneliner_final ?? ""}
                onChange={(e) => patch({ oneliner_final: e.target.value })}
                placeholder="Paste your final polished version here."
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 2 of 6 · Message Map
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Map your message across the buyer journey.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Your one-liner is the anchor. But different customers meet your
            brand at different stages. The Message Map ensures your team uses
            the same story everywhere — from the first ad to the final
            handoff.
          </p>
          <div className="mt-8 space-y-5">
            <Field label="Top of funnel — stranger becomes aware">
              <textarea
                rows={3}
                value={fields.message_top_of_funnel ?? ""}
                onChange={(e) => patch({ message_top_of_funnel: e.target.value })}
                placeholder="What's the single message that stops a stranger from scrolling? Problem-focused. No product pitch yet."
                className={inputClass}
              />
            </Field>
            <Field label="Middle of funnel — aware becomes interested">
              <textarea
                rows={3}
                value={fields.message_middle_of_funnel ?? ""}
                onChange={(e) => patch({ message_middle_of_funnel: e.target.value })}
                placeholder="They know the problem. Now what's the story that makes them trust your solution specifically?"
                className={inputClass}
              />
            </Field>
            <Field label="Bottom of funnel — interested becomes buyer">
              <textarea
                rows={3}
                value={fields.message_bottom_of_funnel ?? ""}
                onChange={(e) => patch({ message_bottom_of_funnel: e.target.value })}
                placeholder="They're evaluating. What proof, vision, and path do they need to say yes?"
                className={inputClass}
              />
            </Field>
            <Field label="Post-purchase — buyer becomes advocate">
              <textarea
                rows={3}
                value={fields.message_post_purchase ?? ""}
                onChange={(e) => patch({ message_post_purchase: e.target.value })}
                placeholder="They bought. What message reinforces the story and turns them into a referrer?"
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 3 of 6 · Case Study
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Build a case study that actually sells.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Chapter 10 shows how a pool builder went from 0.5% to 12%
            conversion by rewriting his messaging. Case studies like that
            don&rsquo;t happen by accident — they follow a specific structure.
            Fill this out once, then reuse the structure for every future case
            study.
          </p>
          <div className="mt-8 space-y-5">
            <Field label="Customer name + industry">
              <input
                type="text"
                value={fields.case_customer ?? ""}
                onChange={(e) => patch({ case_customer: e.target.value })}
                placeholder="Acme Paving, commercial construction"
                className={inputClass}
              />
            </Field>
            <Field label="Their problem before working with you">
              <textarea
                rows={3}
                value={fields.case_problem ?? ""}
                onChange={(e) => patch({ case_problem: e.target.value })}
                placeholder="What was the external pain, and what was the emotional cost?"
                className={inputClass}
              />
            </Field>
            <Field label="Why they chose you">
              <textarea
                rows={3}
                value={fields.case_why_chose_you ?? ""}
                onChange={(e) => patch({ case_why_chose_you: e.target.value })}
                placeholder="What made you the trusted option over alternatives?"
                className={inputClass}
              />
            </Field>
            <Field label="What you did">
              <textarea
                rows={3}
                value={fields.case_what_you_did ?? ""}
                onChange={(e) => patch({ case_what_you_did: e.target.value })}
                placeholder="Short, concrete — what actions, what framework, what changed?"
                className={inputClass}
              />
            </Field>
            <Field label="The result">
              <textarea
                rows={3}
                value={fields.case_result ?? ""}
                onChange={(e) => patch({ case_result: e.target.value })}
                placeholder="Specific, numerical where possible — '0.5% to 12% conversion, 5x industry average'"
                className={inputClass}
              />
            </Field>
            <Field label="What they'd tell a friend">
              <textarea
                rows={3}
                value={fields.case_friend_quote ?? ""}
                onChange={(e) => patch({ case_friend_quote: e.target.value })}
                placeholder="In their own words if you have the quote; paraphrased if not."
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 4 of 6 · Testimonial Prompts
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Get testimonials that tell a story — not just praise.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Generic testimonials (&ldquo;Great service!&rdquo;) don&rsquo;t
            move prospects. Story-shaped testimonials do. Here are the exact
            prompts to send your best customers to pull stories instead of
            compliments.
          </p>
          <ol className="mt-8 space-y-3">
            {TESTIMONIAL_PROMPTS.map((p, i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-card p-4 text-sm text-foreground"
              >
                <span className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                  Prompt {i + 1}
                </span>
                <p className="mt-1">{p}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <Button type="button" variant="outline" size="md" onClick={copyPrompts}>
              {copiedPrompts ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedPrompts ? "Copied" : "Copy these prompts"}
            </Button>
          </div>
          <div className="mt-8">
            <Field label="Notes on who you'll send these to and when">
              <textarea
                rows={4}
                value={fields.testimonial_outreach_notes ?? ""}
                onChange={(e) => patch({ testimonial_outreach_notes: e.target.value })}
                placeholder="Which three customers? Which week? Who on your team owns the follow-up?"
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 5 of 6 · Collateral Audit
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Audit your existing collateral against your one-liner.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            The book&rsquo;s Minimum Collateral Checklist is non-negotiable.
            Every growing business needs these in place. Score your current
            state honestly — gaps become your next 90-day list.
          </p>

          <div className="mt-8 rounded-2xl border-2 border-accent/40 bg-accent/5 p-5">
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
              Collateral readiness — your starting point
            </p>
            <p className="mt-1 font-velocity text-foreground text-5xl tracking-wider">
              {collateralScore}%
            </p>
          </div>

          <ul className="mt-8 space-y-4">
            {COLLATERAL_ITEMS.map((item) => {
              const v = collateral[item.key];
              return (
                <li
                  key={item.key}
                  className="rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <p className="font-heading text-sm uppercase tracking-wide text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {(["yes", "partial", "no"] as const).map((status) => {
                      const active = v.status === status;
                      const baseCls =
                        "rounded-md border-2 py-2 text-center font-heading text-[0.65rem] uppercase tracking-widest transition-smooth";
                      const activeCls =
                        status === "yes"
                          ? "border-success bg-success/10 text-success"
                          : status === "partial"
                          ? "border-warning bg-warning/10 text-warning"
                          : "border-destructive bg-destructive/10 text-destructive";
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            setCollateral((prev) => ({
                              ...prev,
                              [item.key]: { ...prev[item.key], status },
                            }))
                          }
                          aria-pressed={active}
                          className={cn(
                            baseCls,
                            active
                              ? activeCls
                              : "border-border bg-background text-muted-foreground hover:border-accent/60"
                          )}
                        >
                          {status === "partial" ? "Partial" : status === "yes" ? "Yes" : "No"}
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    rows={2}
                    value={v.notes}
                    onChange={(e) =>
                      setCollateral((prev) => ({
                        ...prev,
                        [item.key]: { ...prev[item.key], notes: e.target.value },
                      }))
                    }
                    placeholder="Notes / next step"
                    className={cn(inputClass, "mt-3")}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {step === 6 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 6 of 6 · CTA Map
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Map every CTA your brand uses.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Clay&rsquo;s pool builder had 17 CTAs on his homepage.
            That&rsquo;s why nobody converted. This isn&rsquo;t about having
            more calls-to-action — it&rsquo;s about having fewer, clearer ones.
            One direct CTA and one transitional CTA per surface.
          </p>
          <div className="mt-4 rounded-lg bg-secondary/60 p-4 text-xs text-muted-foreground space-y-1">
            <p>
              <span className="text-foreground font-heading uppercase tracking-widest text-[0.65rem]">Direct CTA</span>
              {" "}— ask for the sale (&ldquo;Book a call,&rdquo; &ldquo;Get a
              quote,&rdquo; &ldquo;Buy now&rdquo;)
            </p>
            <p>
              <span className="text-foreground font-heading uppercase tracking-widest text-[0.65rem]">Transitional CTA</span>
              {" "}— ask for trust (&ldquo;Download the guide,&rdquo; &ldquo;Read
              the case study,&rdquo; &ldquo;Take the quiz&rdquo;)
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {[
              { label: "Homepage", direct: "cta_home_direct", transitional: "cta_home_transitional" },
              { label: "Main product / service page", direct: "cta_product_direct", transitional: "cta_product_transitional" },
              { label: "Email signature + outbound emails", direct: "cta_email_direct", transitional: "cta_email_transitional" },
            ].map((row) => (
              <div key={row.label} className="rounded-xl border border-border bg-card p-5">
                <p className="font-heading text-sm uppercase tracking-wide text-foreground">{row.label}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="Direct CTA">
                    <input
                      type="text"
                      value={(fields as unknown as Record<string, string | null>)[row.direct] ?? ""}
                      onChange={(e) =>
                        patch({ [row.direct]: e.target.value } as Partial<BuilderFields>)
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Transitional CTA">
                    <input
                      type="text"
                      value={(fields as unknown as Record<string, string | null>)[row.transitional] ?? ""}
                      onChange={(e) =>
                        patch({ [row.transitional]: e.target.value } as Partial<BuilderFields>)
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
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
          ) : step === 6 ? (
            <>
              Save my checklist
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

      <p className="text-xs text-muted-foreground text-center">
        Building for {favoriteCustomer}.
      </p>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-heading text-xs uppercase tracking-widest text-foreground">
        {label}
        {required ? <span className="text-accent-dark"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
