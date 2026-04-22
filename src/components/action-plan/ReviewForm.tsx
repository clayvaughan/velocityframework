"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TOXINS_BY_ID } from "@/lib/action-plan/toxins";
import type { ResolvedFocusArea } from "@/lib/action-plan/email-drafts";

type ReviewResponse = "yes" | "partially" | "no" | "not_yet";

const OPTIONS: { value: ReviewResponse; label: string; className: string }[] = [
  { value: "yes", label: "Yes", className: "border-success text-success" },
  { value: "partially", label: "Partially", className: "border-warning text-warning" },
  { value: "no", label: "No", className: "border-destructive text-destructive" },
  { value: "not_yet", label: "Not yet", className: "border-muted-foreground text-muted-foreground" },
];

type Props = {
  planId: string;
  focusAreas: (ResolvedFocusArea & { focusAreaId: number })[];
};

export function ReviewForm({ planId, focusAreas }: Props) {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, ReviewResponse>>({});
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete = focusAreas.every((f) => responses[String(f.focusAreaId)]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/action-plan/${planId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses,
          overall_reflection: reflection.trim() || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save your review.");
      }
      router.push(`/action-plan/review/${planId}/thanks`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <ul className="space-y-4">
        {focusAreas.map((f) => {
          const toxin = TOXINS_BY_ID[f.toxinId];
          const current = responses[String(f.focusAreaId)];
          return (
            <li
              key={f.focusAreaId}
              className="rounded-2xl border border-border bg-card p-5 md:p-7 shadow-card"
            >
              <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                {toxin.title}
              </p>
              <p className="mt-2 font-heading text-lg uppercase tracking-wide text-foreground">
                {f.sevenDayAction}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Did it happen? Be honest — this is how the next cycle gets
                better.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {OPTIONS.map((opt) => {
                  const isSel = current === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setResponses((prev) => ({
                          ...prev,
                          [String(f.focusAreaId)]: opt.value,
                        }))
                      }
                      aria-pressed={isSel}
                      className={cn(
                        "rounded-lg border-2 py-3 font-heading text-xs uppercase tracking-wider transition-smooth",
                        isSel
                          ? "bg-accent/10 border-accent text-foreground"
                          : `bg-background ${opt.className} border-border hover:border-accent/60`
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <label className="block space-y-2">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground">
          Anything else you want to note? (Optional)
        </span>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={4}
          placeholder="What shifted? What surprised you? What's the next focus area?"
          className="w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </label>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="cta" size="lg" disabled={!complete || submitting}>
        {submitting ? "Saving…" : "Submit review"}
      </Button>
    </form>
  );
}
