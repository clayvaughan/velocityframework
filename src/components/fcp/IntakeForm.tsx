"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoleSelect } from "@/components/forms/RoleSelect";

/**
 * FCP intake. Same visual pattern as the Action Plan intake form.
 * Captures name, email, company, role, industry, and a yes/no toggle for
 * scope guardrails (which unlocks an extra screen in the build flow).
 */

const inputClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-base text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

export function IntakeForm() {
  const router = useRouter();
  const [hasScopeFilters, setHasScopeFilters] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      first_name: (fd.get("first_name") as string)?.trim(),
      email: (fd.get("email") as string)?.trim().toLowerCase(),
      company_name: (fd.get("company_name") as string)?.trim(),
      role: (fd.get("role") as string)?.trim(),
      industry: (fd.get("industry") as string)?.trim(),
      has_scope_filters: hasScopeFilters,
    };

    try {
      const res = await fetch("/api/favorite-customer-profile/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !json.id) {
        setError(json.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.push(`/favorite-customer-profile/build/${json.id}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="First name" required>
        <input name="first_name" type="text" required autoComplete="given-name" className={inputClass} />
      </Field>
      <Field label="Email" required>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </Field>
      <Field label="Company name" required>
        <input name="company_name" type="text" required autoComplete="organization" className={inputClass} />
      </Field>
      <Field label="Your role" required>
        <RoleSelect required />
      </Field>
      <Field label="Industry" required>
        <input
          name="industry"
          type="text"
          required
          placeholder="What industry are you in? Consulting, construction, SaaS, senior living…"
          className={inputClass}
        />
      </Field>

      <div className="space-y-3">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground">
          Does your business need company-wide scope filters before defining FCPs?
        </span>
        <p className="text-xs text-muted-foreground -mt-2">
          Most businesses skip this. Choose &ldquo;yes&rdquo; only if you need
          scope guardrails — geography, deal size, no-go work — at the company
          level before you get to individual customer profiles.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setHasScopeFilters(false)}
            aria-pressed={!hasScopeFilters}
            className={cn(
              "rounded-lg border-2 p-3 text-sm text-left transition-smooth",
              !hasScopeFilters
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent/60"
            )}
          >
            No — skip straight to FCP #1.
          </button>
          <button
            type="button"
            onClick={() => setHasScopeFilters(true)}
            aria-pressed={hasScopeFilters}
            className={cn(
              "rounded-lg border-2 p-3 text-sm text-left transition-smooth",
              hasScopeFilters
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent/60"
            )}
          >
            Yes — include scope guardrails first.
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        We&rsquo;ll save your worksheet to this email so you can share it with
        your team and revisit in 90 days.
      </p>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="cta" size="lg" disabled={submitting}>
        {submitting ? "Starting…" : "Start building my FCPs"}
      </Button>
    </form>
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
