"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoleSelect } from "@/components/forms/RoleSelect";
import { TEAM_SIZE_OPTIONS } from "@/lib/accountability/constants";

const inputClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-base text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

export function IntakeForm() {
  const router = useRouter();
  const [healthCheckDone, setHealthCheckDone] = useState(false);
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
      team_size: (fd.get("team_size") as string)?.trim(),
      health_check_completed: healthCheckDone,
      health_check_url: healthCheckDone
        ? (fd.get("health_check_url") as string)?.trim()
        : undefined,
    };
    try {
      const res = await fetch("/api/leadership-accountability-map/intake", {
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
      router.push(`/leadership-accountability-map/build/${json.id}`);
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
      <Field label="Team size" required>
        <select name="team_size" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select your team size
          </option>
          {TEAM_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </Field>

      <div className="space-y-3">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground">
          Have you completed the Culture Health Check?
        </span>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setHealthCheckDone(false)}
            aria-pressed={!healthCheckDone}
            className={cn(
              "rounded-lg border-2 p-3 text-sm text-left transition-smooth",
              !healthCheckDone
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent/60"
            )}
          >
            No — skip this.
          </button>
          <button
            type="button"
            onClick={() => setHealthCheckDone(true)}
            aria-pressed={healthCheckDone}
            className={cn(
              "rounded-lg border-2 p-3 text-sm text-left transition-smooth",
              healthCheckDone
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent/60"
            )}
          >
            Yes — paste the link.
          </button>
        </div>
        {healthCheckDone ? (
          <input
            name="health_check_url"
            type="url"
            placeholder="https://velocityframework.com/health-survey/results/…"
            className={inputClass}
          />
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        We&rsquo;ll save your map to this email so you can share it with your
        leadership team and revisit at your 90-day reflection.
      </p>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="cta" size="lg" disabled={submitting}>
        {submitting ? "Starting…" : "Start my Accountability Map"}
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
