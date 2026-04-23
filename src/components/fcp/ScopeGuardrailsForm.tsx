"use client";

import { cn } from "@/lib/utils";
import { SCOPE_GUARDRAILS } from "@/lib/fcp/profile-sections";
import type { ScopeGuardrails } from "@/lib/fcp/storage";

type Props = {
  value: ScopeGuardrails;
  onChange: (v: ScopeGuardrails) => void;
};

const textareaClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

export function ScopeGuardrailsForm({ value, onChange }: Props) {
  return (
    <div>
      <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
        Screen 0 · Scope guardrails
      </p>
      <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
        Set your company-wide filters first.
      </h2>
      <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
        Before you define individual customer profiles, name the filters every
        sales conversation runs through. Skip any field that doesn&rsquo;t
        apply — this screen is optional. You can move to FCP #1 when
        you&rsquo;re ready.
      </p>

      <div className="mt-8 space-y-5">
        {SCOPE_GUARDRAILS.map((g) => (
          <label key={g.key} className="block space-y-2">
            <span className="font-heading text-xs uppercase tracking-widest text-foreground">
              {g.label}
            </span>
            <textarea
              rows={3}
              value={value[g.key] ?? ""}
              onChange={(e) =>
                onChange({ ...value, [g.key]: e.target.value || null })
              }
              placeholder={g.placeholder}
              className={textareaClass}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
