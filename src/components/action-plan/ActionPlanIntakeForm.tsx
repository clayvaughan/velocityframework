"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ROLES = [
  "Business Owner",
  "Fractional Revenue Executive",
  "Leader / Executive",
  "Coach / Consultant",
  "Reader",
];
const TEAM_SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

/**
 * Action Plan intake. Matches the Culture Health Check intake visually for
 * brand consistency. Offers an optional "Paste your Health Check results
 * link" path — if the user provides a valid link, the form extracts the
 * nanoid and POSTs it alongside the other fields so the backend can
 * pre-populate focus areas from the three lowest dimensions.
 */
export function ActionPlanIntakeForm() {
  const router = useRouter();
  const [takenHealthCheck, setTakenHealthCheck] = useState<"no" | "yes">("no");
  const [healthCheckUrl, setHealthCheckUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string | null> = {
      first_name: (fd.get("first_name") as string)?.trim(),
      email: (fd.get("email") as string)?.trim().toLowerCase(),
      role: fd.get("role") as string,
      team_size: (fd.get("team_size") as string) || null,
    };
    if (takenHealthCheck === "yes" && healthCheckUrl.trim()) {
      // Extract nanoid from URL (last path segment) — tolerates absolute or relative.
      const match = healthCheckUrl
        .trim()
        .match(/\/health-survey\/results\/([A-Za-z0-9_-]{16,})/);
      if (match) payload.health_check_id = match[1];
    }

    try {
      const res = await fetch("/api/action-plan/intake", {
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
      router.push(`/action-plan/build/${json.id}`);
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
      <Field label="Role" required>
        <select name="role" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select your role
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Team size" required>
        <select name="team_size" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select team size
          </option>
          {TEAM_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <div className="space-y-3">
        <span className="font-heading text-xs uppercase tracking-widest text-foreground">
          Have you taken the Culture Health Check?
        </span>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTakenHealthCheck("no")}
            aria-pressed={takenHealthCheck === "no"}
            className={cn(
              "rounded-lg border-2 p-3 text-sm text-left transition-smooth",
              takenHealthCheck === "no"
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent/60"
            )}
          >
            No — I&rsquo;ll start cold.
          </button>
          <button
            type="button"
            onClick={() => setTakenHealthCheck("yes")}
            aria-pressed={takenHealthCheck === "yes"}
            className={cn(
              "rounded-lg border-2 p-3 text-sm text-left transition-smooth",
              takenHealthCheck === "yes"
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent/60"
            )}
          >
            Yes — I&rsquo;ll paste my results link.
          </button>
        </div>
        {takenHealthCheck === "yes" ? (
          <input
            value={healthCheckUrl}
            onChange={(e) => setHealthCheckUrl(e.target.value)}
            type="url"
            placeholder="https://velocityframework.com/health-survey/results/…"
            className={inputClass}
          />
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        We&rsquo;ll save your plan to this email and send a reassessment
        reminder later.
      </p>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="cta" size="lg" disabled={submitting}>
        {submitting ? "Starting…" : "Start building my plan"}
      </Button>
    </form>
  );
}

const inputClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-base text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

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
