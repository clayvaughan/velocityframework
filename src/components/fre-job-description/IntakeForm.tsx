"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoleSelect } from "@/components/forms/RoleSelect";

const inputClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-base text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

export function IntakeForm() {
  const router = useRouter();
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
      download_reason: (fd.get("download_reason") as string)?.trim() || undefined,
    };
    try {
      const res = await fetch("/api/fre-job-description/intake", {
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
      router.push(`/fre-job-description/thanks/${json.id}`);
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
      <Field label="Why are you downloading this? (optional)">
        <textarea
          name="download_reason"
          rows={3}
          placeholder="Hiring an FRE, considering becoming one, or just curious — whatever's true for you."
          className={inputClass}
        />
      </Field>

      <p className="text-xs text-muted-foreground">
        We&rsquo;ll send the PDF to your inbox and email you when we release
        new toolbox resources.
      </p>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="cta" size="lg" disabled={submitting}>
        {submitting ? "Preparing your download…" : "Download the FRE Job Description"}
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
