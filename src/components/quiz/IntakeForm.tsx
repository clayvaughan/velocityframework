"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoleSelect } from "@/components/forms/RoleSelect";

/**
 * Shared email-capture form for both individual and team-owner flows.
 * Server-persisted through the `action` endpoint (an API route). On
 * success the server returns { id } and we redirect to `nextPathForId(id)`.
 */

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

export type IntakeFormMode = "individual" | "team";

type Props = {
  mode: IntakeFormMode;
  /** API endpoint that accepts the form payload. */
  action: string;
  /**
   * Template for the redirect URL after success. Must contain literal
   * `{id}` which gets replaced with the server-returned nanoid. Passed as
   * a string (not a function) so this client component can receive it
   * from a server page.
   */
  nextPathTemplate: string;
  /** Extra hidden input (e.g. taking_for flag). */
  extraFields?: Record<string, string>;
  /** Submit button label. */
  submitLabel?: string;
  /**
   * If set, the returned id is persisted to localStorage under this key
   * so the quiz-flow can find it. Used by the individual flow to seed
   * `{ id, answers: {} }` before the first question screen mounts.
   */
  sessionStorageKey?: string;
};

export function IntakeForm({
  mode,
  action,
  nextPathTemplate,
  extraFields,
  submitLabel,
  sessionStorageKey,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") payload[k] = v;
    });
    if (extraFields) Object.assign(payload, extraFields);

    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !json.id) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      if (sessionStorageKey && typeof window !== "undefined") {
        window.localStorage.setItem(
          sessionStorageKey,
          JSON.stringify({ id: json.id, answers: {} })
        );
      }
      router.push(nextPathTemplate.replace("{id}", json.id));
    } catch (err) {
      console.error("IntakeForm error", err);
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="First name" required>
        <input
          name="first_name"
          type="text"
          required
          autoComplete="given-name"
          className={inputClass}
        />
      </Field>

      <Field label="Email" required>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </Field>

      <Field label="Role" required>
        <RoleSelect required />
      </Field>

      <Field label="Company name (optional)">
        <input
          name="company"
          type="text"
          autoComplete="organization"
          className={inputClass}
        />
      </Field>

      <Field label="Company size">
        <select name="company_size" defaultValue="" className={inputClass}>
          <option value="">Select company size</option>
          {COMPANY_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      {mode === "team" ? (
        <Field label="Team name (optional)">
          <input name="team_name" type="text" className={inputClass} />
        </Field>
      ) : null}

      <p className="text-xs text-muted-foreground">
        We&rsquo;ll send your results and a shareable PDF to your inbox. No
        spam. Unsubscribe anytime.
      </p>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="cta" size="lg" disabled={submitting}>
        {submitting
          ? "Starting…"
          : submitLabel ?? (mode === "team" ? "Create team link" : "Start the Health Check")}
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
