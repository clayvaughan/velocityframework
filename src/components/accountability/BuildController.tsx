"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_REFLECTION_QUESTION,
  MAX_CUSTOM_ROLES,
  MAX_ROLES,
  ROLE_DEFAULTS,
  ROLE_DEFAULTS_BY_TYPE,
  type RoleType,
} from "@/lib/accountability/constants";
import type { RoleInput } from "@/lib/accountability/storage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DraftRole = Omit<RoleInput, "map_id"> & {
  /** Client-only flag for selection on Screen 1. Defaults on each default role are true. */
  include: boolean;
};

type Props = {
  mapId: string;
  initialRoles: DraftRole[];
  initialReflection: {
    reflection_date_1: string | null;
    reflection_date_2: string | null;
    reflection_date_3: string | null;
    reflection_question: string | null;
  };
  firstName: string;
  companyName: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const inputClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

function daysFromNowISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildInitialDefaults(): DraftRole[] {
  return ROLE_DEFAULTS.map((def, idx) => ({
    include: true,
    position: idx + 1,
    role_type: def.roleType,
    role_name: def.roleName,
    owner_name: null,
    mission_statement: def.missionStatement,
    responsibility_1: def.responsibilities[0],
    responsibility_2: def.responsibilities[1],
    responsibility_3: def.responsibilities[2],
    responsibility_4: def.responsibilities[3],
    responsibility_5: def.responsibilities[4],
    accountable_to: def.defaultAccountableTo,
    is_custom: false,
  }));
}

/**
 * Merge stored roles (from the DB) with the default template. A stored role
 * overrides the matching default by `role_type` (for non-custom roles) or by
 * `position` (for custom roles). Missing defaults get re-added so the user
 * can re-check them.
 */
function seedRoles(stored: DraftRole[]): DraftRole[] {
  const defaults = buildInitialDefaults();
  if (stored.length === 0) return defaults;

  // Map defaults by role_type
  const byType = new Map<string, DraftRole>();
  for (const d of defaults) byType.set(d.role_type, d);

  const kept: DraftRole[] = [];
  const storedTypes = new Set<string>();
  for (const row of stored) {
    storedTypes.add(row.role_type);
    kept.push({ ...row, include: true });
  }
  // Add back any defaults the user previously unchecked so they can re-pick
  for (const d of defaults) {
    if (!storedTypes.has(d.role_type)) {
      kept.push({ ...d, include: false });
    }
  }
  // Re-number positions in order: included first, then excluded defaults
  const included = kept.filter((r) => r.include);
  const excluded = kept.filter((r) => !r.include);
  return [
    ...included.map((r, i) => ({ ...r, position: i + 1 })),
    ...excluded,
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BuildController({
  mapId,
  initialRoles,
  initialReflection,
  firstName,
  companyName,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [roles, setRoles] = useState<DraftRole[]>(seedRoles(initialRoles));

  const [reflection, setReflection] = useState({
    reflection_date_1:
      initialReflection.reflection_date_1 ?? daysFromNowISO(90),
    reflection_date_2:
      initialReflection.reflection_date_2 ?? daysFromNowISO(180),
    reflection_date_3:
      initialReflection.reflection_date_3 ?? daysFromNowISO(270),
    reflection_question:
      initialReflection.reflection_question ?? DEFAULT_REFLECTION_QUESTION,
  });

  const [expandedPosition, setExpandedPosition] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const included = roles.filter((r) => r.include);
  const customCount = included.filter((r) => r.is_custom).length;
  const definedCount = included.filter(
    (r) =>
      (r.owner_name && r.owner_name.trim().length > 0) ||
      (r.mission_statement && r.mission_statement.trim().length > 0)
  ).length;

  // -------------------------------------------------------------------------
  // Persistence
  // -------------------------------------------------------------------------

  async function persist(payload: {
    fields?: {
      reflection_date_1?: string | null;
      reflection_date_2?: string | null;
      reflection_date_3?: string | null;
      reflection_question?: string | null;
    };
    roles?: Omit<RoleInput, "map_id">[];
  }) {
    const res = await fetch(`/api/leadership-accountability-map/${mapId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Could not save progress.");
    }
  }

  function rolesForPersist(): Omit<RoleInput, "map_id">[] {
    // Strip the client-only `include` flag and re-index positions.
    return included.map((r, idx) => {
      const {
        include: _include,
        ...rest
      } = r;
      return { ...rest, position: idx + 1 };
    });
  }

  async function handleNext() {
    setSaving(true);
    setError(null);
    try {
      if (step === 1 || step === 2) {
        await persist({ roles: rolesForPersist() });
      } else if (step === 3) {
        await persist({ fields: reflection, roles: rolesForPersist() });
      }

      if (step < 4) {
        setStep((step + 1) as typeof step);
      } else {
        const saveRes = await fetch(
          `/api/leadership-accountability-map/${mapId}/save`,
          { method: "POST" }
        );
        if (!saveRes.ok) {
          const body = await saveRes.json().catch(() => ({}));
          throw new Error(body.error ?? "Could not save your map.");
        }
        router.push(`/leadership-accountability-map/saved/${mapId}`);
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

  // -------------------------------------------------------------------------
  // Role editing
  // -------------------------------------------------------------------------

  function toggleInclude(position: number) {
    setRoles((prev) => {
      const next = prev.map((r) =>
        r.position === position ? { ...r, include: !r.include } : r
      );
      // Re-number only the included roles so positions stay 1..N
      const included = next.filter((r) => r.include);
      const excluded = next.filter((r) => !r.include);
      return [
        ...included.map((r, i) => ({ ...r, position: i + 1 })),
        ...excluded.map((r, i) => ({
          ...r,
          position: included.length + i + 1,
        })),
      ];
    });
  }

  function addCustomRole() {
    if (customCount >= MAX_CUSTOM_ROLES) return;
    if (included.length >= MAX_ROLES) return;
    setRoles((prev) => {
      const newPosition = included.length + 1;
      const newRole: DraftRole = {
        include: true,
        position: newPosition,
        role_type: "custom" as RoleType,
        role_name: "",
        owner_name: null,
        mission_statement: "",
        responsibility_1: null,
        responsibility_2: null,
        responsibility_3: null,
        responsibility_4: null,
        responsibility_5: null,
        accountable_to: "Integrator",
        is_custom: true,
      };
      const included2 = prev.filter((r) => r.include);
      const excluded2 = prev.filter((r) => !r.include);
      return [
        ...included2.map((r, i) => ({ ...r, position: i + 1 })),
        newRole,
        ...excluded2.map((r, i) => ({
          ...r,
          position: included2.length + 2 + i,
        })),
      ];
    });
  }

  function removeCustomRole(position: number) {
    setRoles((prev) => {
      const filtered = prev.filter(
        (r) => !(r.is_custom && r.position === position)
      );
      const included3 = filtered.filter((r) => r.include);
      const excluded3 = filtered.filter((r) => !r.include);
      return [
        ...included3.map((r, i) => ({ ...r, position: i + 1 })),
        ...excluded3.map((r, i) => ({
          ...r,
          position: included3.length + i + 1,
        })),
      ];
    });
  }

  function patchRole(position: number, patch: Partial<DraftRole>) {
    setRoles((prev) =>
      prev.map((r) => (r.position === position ? { ...r, ...patch } : r))
    );
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const defaultRolesUI = roles.filter((r) => !r.is_custom);
  const customRolesUI = roles.filter((r) => r.is_custom);

  return (
    <div className="space-y-10">
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

      {step === 1 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 1 of 4 · Structure
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Start with the five seats that run every growing company.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Clay writes in <em>Velocity</em> that &ldquo;no ownership&rdquo; is
            one of the cultural toxins that quietly kills growth. The fix
            isn&rsquo;t more meetings — it&rsquo;s clarity on who owns what.
            Every business Clay has scaled uses some version of the same
            five-seat structure. You can start with all five, pick the ones
            that fit your stage, or add custom roles for your specific
            business.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {defaultRolesUI.map((r) => (
              <label
                key={r.role_type}
                className={cn(
                  "flex gap-4 rounded-xl border-2 p-5 shadow-card transition-smooth cursor-pointer",
                  r.include
                    ? "border-accent bg-accent/5"
                    : "border-border bg-card hover:border-accent/60"
                )}
              >
                <input
                  type="checkbox"
                  checked={r.include}
                  onChange={() => toggleInclude(r.position)}
                  className="mt-1 h-4 w-4 accent-accent"
                />
                <div>
                  <p className="font-heading text-sm uppercase tracking-wide text-foreground">
                    {r.role_name}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {ROLE_DEFAULTS_BY_TYPE[
                      r.role_type as Exclude<RoleType, "custom">
                    ].shortDescription}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {customRolesUI.length > 0 ? (
            <div className="mt-8 space-y-3">
              <p className="font-heading text-xs uppercase tracking-widest text-foreground">
                Custom roles
              </p>
              {customRolesUI.map((r) => (
                <div
                  key={r.position}
                  className="rounded-xl border-2 border-accent/40 bg-accent/5 p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <input
                      type="text"
                      value={r.role_name}
                      onChange={(e) =>
                        patchRole(r.position, { role_name: e.target.value })
                      }
                      placeholder="Role name"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomRole(r.position)}
                      className="mt-2 text-muted-foreground hover:text-destructive transition-smooth"
                      aria-label="Remove custom role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={r.mission_statement ?? ""}
                    onChange={(e) =>
                      patchRole(r.position, { mission_statement: e.target.value })
                    }
                    placeholder="One-sentence description of what this seat owns."
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={addCustomRole}
              disabled={
                customCount >= MAX_CUSTOM_ROLES || included.length >= MAX_ROLES
              }
            >
              <Plus className="h-4 w-4" />
              Add custom role
              {customCount > 0 ? ` (${customCount}/${MAX_CUSTOM_ROLES})` : null}
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            You can include up to {MAX_ROLES} roles total on one map.
            You&rsquo;ve selected {included.length}.
          </p>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 2 of 4 · Define each role
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Name the owner. Write the mission. List the responsibilities.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            For each role you kept, fill in who owns it today, what their job
            mission is, the top 5 responsibilities they carry, and who
            they&rsquo;re accountable to. Don&rsquo;t overthink this — clarity
            is more important than perfection. You can refine it at your
            90-day review.
          </p>

          <p className="mt-6 font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            {definedCount} of {included.length} role
            {included.length === 1 ? "" : "s"} defined
          </p>

          <div className="mt-6 space-y-4">
            {included.map((r) => {
              const isExpanded = expandedPosition === r.position;
              const hasOwner =
                r.owner_name && r.owner_name.trim().length > 0;
              return (
                <div
                  key={r.position}
                  className={cn(
                    "rounded-xl border-2 shadow-card transition-smooth",
                    isExpanded
                      ? "border-accent bg-accent/5"
                      : "border-border bg-card"
                  )}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPosition(isExpanded ? null : r.position)
                    }
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <div>
                      <p className="font-heading text-sm uppercase tracking-wide text-foreground">
                        {r.role_name || "(Unnamed role)"}
                        {r.is_custom ? (
                          <span className="ml-2 text-[0.6rem] tracking-widest text-accent-dark">
                            Custom
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {hasOwner ? r.owner_name : "Owner not yet named"}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded ? (
                    <div className="border-t border-border p-5 space-y-4">
                      {r.is_custom ? (
                        <Field label="Role name">
                          <input
                            type="text"
                            value={r.role_name}
                            onChange={(e) =>
                              patchRole(r.position, {
                                role_name: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </Field>
                      ) : null}
                      <Field label="Who owns this seat today?">
                        <input
                          type="text"
                          value={r.owner_name ?? ""}
                          onChange={(e) =>
                            patchRole(r.position, {
                              owner_name: e.target.value || null,
                            })
                          }
                          placeholder="Name, or leave blank for open seat"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Job Mission Statement (1–3 sentences)">
                        <textarea
                          rows={3}
                          value={r.mission_statement ?? ""}
                          onChange={(e) =>
                            patchRole(r.position, {
                              mission_statement: e.target.value,
                            })
                          }
                          placeholder="What is this seat responsible for, at its highest level?"
                          className={inputClass}
                        />
                      </Field>
                      <div>
                        <p className="font-heading text-xs uppercase tracking-widest text-foreground">
                          Key responsibilities (top 5)
                        </p>
                        <div className="mt-3 space-y-2">
                          {[1, 2, 3, 4, 5].map((i) => {
                            const key =
                              `responsibility_${i}` as `responsibility_${1 | 2 | 3 | 4 | 5}`;
                            return (
                              <input
                                key={i}
                                type="text"
                                value={r[key] ?? ""}
                                onChange={(e) =>
                                  patchRole(r.position, {
                                    [key]: e.target.value || null,
                                  } as Partial<DraftRole>)
                                }
                                placeholder={`Responsibility ${i}`}
                                className={inputClass}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <Field label="Accountable to">
                        <input
                          type="text"
                          value={r.accountable_to ?? ""}
                          onChange={(e) =>
                            patchRole(r.position, {
                              accountable_to: e.target.value || null,
                            })
                          }
                          placeholder="Who does this person report to for this work?"
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 3 of 4 · Reflection rhythm
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Lock in the dates where you&rsquo;ll revisit this map.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            An accountability map that never gets reviewed is just an org
            chart. The book&rsquo;s rhythm is a reflection date every 90 days
            — that&rsquo;s when you look at each seat and ask: Is the right
            person in it? Is the mission still right? Are the responsibilities
            still aligned with the business? Three quarterly dates lock you
            into the rhythm.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Field label="First reflection">
              <input
                type="date"
                value={reflection.reflection_date_1 ?? ""}
                onChange={(e) =>
                  setReflection((prev) => ({
                    ...prev,
                    reflection_date_1: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Second reflection">
              <input
                type="date"
                value={reflection.reflection_date_2 ?? ""}
                onChange={(e) =>
                  setReflection((prev) => ({
                    ...prev,
                    reflection_date_2: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Third reflection">
              <input
                type="date"
                value={reflection.reflection_date_3 ?? ""}
                onChange={(e) =>
                  setReflection((prev) => ({
                    ...prev,
                    reflection_date_3: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="What question will you ask at each reflection? (optional)">
              <textarea
                rows={3}
                value={reflection.reflection_question ?? ""}
                onChange={(e) =>
                  setReflection((prev) => ({
                    ...prev,
                    reflection_question: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 4 of 4 · Review
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Your Leadership Accountability Map.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Review what you&rsquo;ve built. Once you save, you can download a
            PDF, email it to your leadership team, and get calendar reminders
            for each reflection date.
          </p>

          <div className="mt-8 rounded-xl border-2 border-border bg-card overflow-hidden">
            <div className="grid grid-cols-[1.3fr_1fr_2fr_1fr] gap-4 px-5 py-3 border-b border-border bg-secondary/40">
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Role
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Owner
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Mission
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Accountable to
              </span>
            </div>
            {included.map((r) => {
              const mission = (r.mission_statement ?? "").trim();
              const firstSentence = mission.match(/^[^.!?]+[.!?]/);
              return (
                <div
                  key={r.position}
                  className="grid grid-cols-[1.3fr_1fr_2fr_1fr] gap-4 px-5 py-4 border-b border-border last:border-b-0 text-sm"
                >
                  <span className="font-heading text-foreground">
                    {r.role_name || "(Unnamed role)"}
                  </span>
                  <span className="text-muted-foreground">
                    {r.owner_name && r.owner_name.trim().length > 0
                      ? r.owner_name
                      : "(Open seat)"}
                  </span>
                  <span className="text-muted-foreground">
                    {firstSentence?.[0] ?? mission ?? "—"}
                  </span>
                  <span className="text-muted-foreground">
                    {r.accountable_to && r.accountable_to.trim().length > 0
                      ? r.accountable_to
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetaCard label="First reflection" value={formatDisplayDate(reflection.reflection_date_1)} />
            <MetaCard label="Second reflection" value={formatDisplayDate(reflection.reflection_date_2)} />
            <MetaCard label="Third reflection" value={formatDisplayDate(reflection.reflection_date_3)} />
          </div>

          <div className="mt-6 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground italic">
            &ldquo;{reflection.reflection_question}&rdquo;
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Building for {firstName} at {companyName}.
          </p>
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
          disabled={saving || included.length === 0}
          onClick={handleNext}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : step === 4 ? (
            <>
              Save my Accountability Map
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-heading text-xs uppercase tracking-widest text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        {label}
      </p>
      <p className="mt-2 font-heading text-base text-foreground">{value}</p>
    </div>
  );
}
