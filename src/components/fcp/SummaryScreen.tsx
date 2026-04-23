"use client";

import {
  PROFILE_SECTIONS,
  SCOPE_GUARDRAILS,
  renderLabelFor,
} from "@/lib/fcp/profile-sections";
import type { ProfileDraft } from "./FcpProfileForm";
import type { ScopeGuardrails } from "@/lib/fcp/storage";

type Props = {
  companyName: string;
  hasScopeFilters: boolean;
  scopeGuardrails: ScopeGuardrails;
  profiles: ProfileDraft[];
};

export function SummaryScreen({
  companyName,
  hasScopeFilters,
  scopeGuardrails,
  profiles,
}: Props) {
  const populatedScope = hasScopeFilters
    ? SCOPE_GUARDRAILS.filter((g) => (scopeGuardrails[g.key] ?? "").trim().length > 0)
    : [];
  const populatedProfiles = profiles
    .map((p, i) => ({ ...p, position: (i + 1) as 1 | 2 | 3 }))
    .filter((p) => p.profile_name?.trim().length > 0);

  return (
    <div>
      <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
        Screen {hasScopeFilters ? "5" : "4"} · Summary
      </p>
      <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
        Final look before you save.
      </h2>
      <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
        Everything below is what goes into your saved worksheet and PDF.
        Jump back to any screen to edit. Save when ready.
      </p>

      {populatedScope.length > 0 ? (
        <section className="mt-10">
          <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
            Scope guardrails
          </p>
          <div className="mt-3 rounded-2xl border border-border bg-card p-6 shadow-card">
            <dl className="grid gap-4 md:grid-cols-2">
              {populatedScope.map((g) => (
                <div key={g.key}>
                  <dt className="font-heading text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    {g.label}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    {scopeGuardrails[g.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
          Favorite Customer Profiles · {populatedProfiles.length} defined
        </p>
        {populatedProfiles.length === 0 ? (
          <p className="mt-4 text-sm text-destructive">
            You haven&rsquo;t named any profiles yet. Go back to FCP #1 and add
            at least a profile name before saving.
          </p>
        ) : null}
        <div className="mt-4 space-y-4">
          {populatedProfiles.map((p) => (
            <div
              key={p.position}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-heading text-lg md:text-xl uppercase tracking-wide text-foreground">
                  FCP #{p.position} — {p.profile_name}
                </h3>
              </div>
              <dl className="mt-4 grid gap-4 md:grid-cols-2">
                {PROFILE_SECTIONS.filter((s) => s.key !== "profile_name").map((s) => {
                  const val = p[s.key];
                  if (!val || !val.trim()) return null;
                  return (
                    <div key={s.key}>
                      <dt className="font-heading text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                        {renderLabelFor(s, companyName)}
                      </dt>
                      <dd className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                        {val}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
