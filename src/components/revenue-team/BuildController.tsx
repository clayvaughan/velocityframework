"use client";

import { useState } from "react";
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
  DEFAULT_MEETING_AGENDA,
  DEFAULT_MEETING_DAY,
  DEFAULT_MEETING_DURATION,
  DEFAULT_MEETING_TIME,
  DEFAULT_REFLECTION_QUESTION,
  MAX_REVENUE_CUSTOM_ROLES,
  MAX_REVENUE_ROLES,
  MEETING_DAY_OPTIONS,
  MEETING_DURATION_OPTIONS,
  REVENUE_ROLE_DEFAULTS,
  REVENUE_ROLE_DEFAULTS_BY_TYPE,
  type RevenueRoleType,
} from "@/lib/revenue-team/constants";
import type { RevenueRoleInput } from "@/lib/revenue-team/storage";

type DraftRole = Omit<RevenueRoleInput, "map_id"> & { include: boolean };

type Props = {
  mapId: string;
  initialRoles: DraftRole[];
  initialMeta: {
    weekly_meeting_day: string | null;
    weekly_meeting_time: string | null;
    weekly_meeting_duration: string | null;
    weekly_meeting_agenda: string | null;
    reflection_date_1: string | null;
    reflection_date_2: string | null;
    reflection_date_3: string | null;
    reflection_question: string | null;
  };
  firstName: string;
  companyName: string;
};

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
  return REVENUE_ROLE_DEFAULTS.map((def, idx) => ({
    include: true, // Director of Revenue always included; others default to true too
    position: idx + 1,
    role_type: def.roleType,
    role_name: def.roleName,
    owner_name: null,
    mission_statement: def.missionStatement,
    metric_1: def.metrics[0],
    metric_2: def.metrics[1],
    metric_3: def.metrics[2],
    responsibility_1: def.responsibilities[0],
    responsibility_2: def.responsibilities[1],
    responsibility_3: def.responsibilities[2],
    responsibility_4: def.responsibilities[3],
    responsibility_5: def.responsibilities[4],
    accountable_to: def.defaultAccountableTo,
    is_custom: false,
  }));
}

function seedRoles(stored: DraftRole[]): DraftRole[] {
  const defaults = buildInitialDefaults();
  if (stored.length === 0) return defaults;
  const storedTypes = new Set<string>();
  const kept: DraftRole[] = [];
  for (const row of stored) {
    storedTypes.add(row.role_type);
    kept.push({ ...row, include: true });
  }
  for (const d of defaults) {
    if (!storedTypes.has(d.role_type)) kept.push({ ...d, include: false });
  }
  const included = kept.filter((r) => r.include);
  const excluded = kept.filter((r) => !r.include);
  return [
    ...included.map((r, i) => ({ ...r, position: i + 1 })),
    ...excluded,
  ];
}

export function BuildController({
  mapId,
  initialRoles,
  initialMeta,
  firstName,
  companyName,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [roles, setRoles] = useState<DraftRole[]>(seedRoles(initialRoles));
  const [meta, setMeta] = useState({
    weekly_meeting_day: initialMeta.weekly_meeting_day ?? DEFAULT_MEETING_DAY,
    weekly_meeting_time: initialMeta.weekly_meeting_time ?? DEFAULT_MEETING_TIME,
    weekly_meeting_duration:
      initialMeta.weekly_meeting_duration ?? DEFAULT_MEETING_DURATION,
    weekly_meeting_agenda:
      initialMeta.weekly_meeting_agenda ?? DEFAULT_MEETING_AGENDA,
    reflection_date_1: initialMeta.reflection_date_1 ?? daysFromNowISO(90),
    reflection_date_2: initialMeta.reflection_date_2 ?? daysFromNowISO(180),
    reflection_date_3: initialMeta.reflection_date_3 ?? daysFromNowISO(270),
    reflection_question:
      initialMeta.reflection_question ?? DEFAULT_REFLECTION_QUESTION,
  });
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const included = roles.filter((r) => r.include);
  const customCount = included.filter((r) => r.is_custom).length;
  const attendeeNames = included
    .map((r) => r.owner_name)
    .filter((n): n is string => !!(n && n.trim().length > 0));

  async function persist(payload: {
    fields?: typeof meta;
    roles?: Omit<RevenueRoleInput, "map_id">[];
  }) {
    const res = await fetch(
      `/api/revenue-team-accountability-map/${mapId}/update`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Could not save progress.");
    }
  }

  function rolesForPersist(): Omit<RevenueRoleInput, "map_id">[] {
    return included.map((r, idx) => {
      const { include: _include, ...rest } = r;
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
        await persist({ fields: meta, roles: rolesForPersist() });
      }
      if (step < 4) {
        setStep((step + 1) as typeof step);
      } else {
        const saveRes = await fetch(
          `/api/revenue-team-accountability-map/${mapId}/save`,
          { method: "POST" }
        );
        if (!saveRes.ok) {
          const body = await saveRes.json().catch(() => ({}));
          throw new Error(body.error ?? "Could not save your map.");
        }
        router.push(`/revenue-team-accountability-map/saved/${mapId}`);
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

  function toggleInclude(position: number) {
    setRoles((prev) => {
      const next = prev.map((r) => {
        // Director of Revenue can't be unchecked
        if (r.role_type === "director_of_revenue") return r;
        return r.position === position ? { ...r, include: !r.include } : r;
      });
      const included = next.filter((r) => r.include);
      const excluded = next.filter((r) => !r.include);
      return [
        ...included.map((r, i) => ({ ...r, position: i + 1 })),
        ...excluded.map((r, i) => ({ ...r, position: included.length + i + 1 })),
      ];
    });
  }

  function addCustomRole() {
    if (customCount >= MAX_REVENUE_CUSTOM_ROLES) return;
    if (included.length >= MAX_REVENUE_ROLES) return;
    setRoles((prev) => {
      const included2 = prev.filter((r) => r.include);
      const excluded2 = prev.filter((r) => !r.include);
      const newRole: DraftRole = {
        include: true,
        position: included2.length + 1,
        role_type: "custom" as RevenueRoleType,
        role_name: "",
        owner_name: null,
        mission_statement: "",
        metric_1: null,
        metric_2: null,
        metric_3: null,
        responsibility_1: null,
        responsibility_2: null,
        responsibility_3: null,
        responsibility_4: null,
        responsibility_5: null,
        accountable_to: "Director of Revenue",
        is_custom: true,
      };
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
      const inc = filtered.filter((r) => r.include);
      const exc = filtered.filter((r) => !r.include);
      return [
        ...inc.map((r, i) => ({ ...r, position: i + 1 })),
        ...exc.map((r, i) => ({ ...r, position: inc.length + i + 1 })),
      ];
    });
  }

  function patchRole(position: number, patch: Partial<DraftRole>) {
    setRoles((prev) =>
      prev.map((r) => (r.position === position ? { ...r, ...patch } : r))
    );
  }

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
            Build the revenue team that unifies marketing, sales, and retention.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Clay writes in <em>Velocity</em> that most businesses fail at
            growth because marketing and sales operate as separate departments
            — competing for credit, working from different customer
            definitions, measuring different things. The unified revenue team
            is the fix. One leader, one set of goals, one story. The five
            seats below cover what every growing revenue team needs. Start
            with what fits your stage, add custom roles for your structure.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {defaultRolesUI.map((r) => {
              const locked = r.role_type === "director_of_revenue";
              return (
                <label
                  key={r.role_type}
                  className={cn(
                    "flex gap-4 rounded-xl border-2 p-5 shadow-card transition-smooth",
                    r.include
                      ? "border-accent bg-accent/5"
                      : "border-border bg-card hover:border-accent/60",
                    locked ? "cursor-default" : "cursor-pointer"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={r.include}
                    disabled={locked}
                    onChange={() => toggleInclude(r.position)}
                    className="mt-1 h-4 w-4 accent-accent"
                  />
                  <div>
                    <p className="font-heading text-sm uppercase tracking-wide text-foreground">
                      {r.role_name}
                      {locked ? (
                        <span className="ml-2 text-[0.6rem] tracking-widest text-accent-dark">
                          Required
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {REVENUE_ROLE_DEFAULTS_BY_TYPE[
                        r.role_type as Exclude<RevenueRoleType, "custom">
                      ].shortDescription}
                    </p>
                  </div>
                </label>
              );
            })}
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
                customCount >= MAX_REVENUE_CUSTOM_ROLES ||
                included.length >= MAX_REVENUE_ROLES
              }
            >
              <Plus className="h-4 w-4" />
              Add custom role
              {customCount > 0 ? ` (${customCount}/${MAX_REVENUE_CUSTOM_ROLES})` : null}
            </Button>
          </div>

          <div className="mt-8 rounded-xl border border-accent/40 bg-accent/5 p-5">
            <p className="font-heading text-xs uppercase tracking-widest text-accent-dark">
              Don&rsquo;t have a Director of Revenue yet?
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              That&rsquo;s who the book is written for. Reading Velocity,
              building this map, and hiring (or certifying) a Fractional
              Revenue Executive is the path.
            </p>
            <a
              href="/workshop"
              className="mt-3 inline-flex items-center gap-1 font-heading text-xs uppercase tracking-widest text-accent-dark hover:text-accent-dark/80"
            >
              Learn about FRE Certification →
            </a>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 2 of 4 · Define each role
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Name the owner. Write the mission. Set the metrics.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            Each role on your revenue team needs three things: a clear owner,
            a one-sentence mission, and the specific metrics they&rsquo;re
            accountable for. These aren&rsquo;t vanity metrics — they&rsquo;re
            the numbers that determine whether the revenue engine is working.
          </p>

          <div className="mt-6 space-y-4">
            {included.map((r) => {
              const isExpanded = expandedPosition === r.position;
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
                        {r.owner_name && r.owner_name.trim().length > 0
                          ? r.owner_name
                          : "Owner not yet named"}
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
                              patchRole(r.position, { role_name: e.target.value })
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
                          placeholder="Name, or 'Vacant' / name of person you're recruiting"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Job Mission Statement">
                        <textarea
                          rows={3}
                          value={r.mission_statement ?? ""}
                          onChange={(e) =>
                            patchRole(r.position, {
                              mission_statement: e.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      </Field>
                      <div>
                        <p className="font-heading text-xs uppercase tracking-widest text-foreground">
                          Key metrics (three numbers reviewed weekly)
                        </p>
                        <div className="mt-3 space-y-2">
                          {[1, 2, 3].map((i) => {
                            const key =
                              `metric_${i}` as `metric_${1 | 2 | 3}`;
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
                                placeholder={`Metric ${i}`}
                                className={inputClass}
                              />
                            );
                          })}
                        </div>
                      </div>
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
            Step 3 of 4 · Weekly rhythm
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Lock in the meeting rhythm that keeps the team aligned.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
            A unified revenue team needs one thing a siloed marketing and
            sales organization doesn&rsquo;t have: a weekly meeting where all
            four functions look at the same numbers and solve problems
            together. The book calls this the Revenue Department rhythm. Set
            yours below.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Field label="Meeting day">
              <select
                value={meta.weekly_meeting_day}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    weekly_meeting_day: e.target.value,
                  }))
                }
                className={inputClass}
              >
                {MEETING_DAY_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="Time">
              <input
                type="time"
                value={meta.weekly_meeting_time}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    weekly_meeting_time: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Duration">
              <select
                value={meta.weekly_meeting_duration}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    weekly_meeting_duration: e.target.value,
                  }))
                }
                className={inputClass}
              >
                {MEETING_DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <p className="font-heading text-xs uppercase tracking-widest text-foreground">
              Attendees (pulled from the role owners you named)
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {attendeeNames.length > 0
                ? attendeeNames.join(", ")
                : "No owners named yet — go back to Step 2 to add them."}
            </p>
          </div>

          <div className="mt-6">
            <Field label="Standing agenda">
              <textarea
                rows={8}
                value={meta.weekly_meeting_agenda}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    weekly_meeting_agenda: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <p className="font-heading text-xs uppercase tracking-widest text-foreground">
              Reflection rhythm
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Three quarterly dates where your leadership team reviews the
              whole accountability map — is the right person in each seat,
              are the metrics still right, what would make each role
              stronger in the next 90 days.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Field label="First reflection">
                <input
                  type="date"
                  value={meta.reflection_date_1 ?? ""}
                  onChange={(e) =>
                    setMeta((prev) => ({
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
                  value={meta.reflection_date_2 ?? ""}
                  onChange={(e) =>
                    setMeta((prev) => ({
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
                  value={meta.reflection_date_3 ?? ""}
                  onChange={(e) =>
                    setMeta((prev) => ({
                      ...prev,
                      reflection_date_3: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Reflection question">
                <textarea
                  rows={3}
                  value={meta.reflection_question ?? ""}
                  onChange={(e) =>
                    setMeta((prev) => ({
                      ...prev,
                      reflection_question: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            Step 4 of 4 · Review
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            Your Unified Revenue Team Accountability Map.
          </h2>

          <div className="mt-8 rounded-xl border-2 border-border bg-card overflow-hidden">
            <div className="grid grid-cols-[1.3fr_1fr_1.6fr_1.3fr_1fr] gap-4 px-5 py-3 border-b border-border bg-secondary/40">
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Role
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Owner
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Mission (1st sentence)
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Key metric #1
              </span>
              <span className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Reports to
              </span>
            </div>
            {included.map((r) => {
              const mission = (r.mission_statement ?? "").trim();
              const firstSentence = mission.match(/^[^.!?]+[.!?]/);
              return (
                <div
                  key={r.position}
                  className="grid grid-cols-[1.3fr_1fr_1.6fr_1.3fr_1fr] gap-4 px-5 py-4 border-b border-border last:border-b-0 text-sm"
                >
                  <span className="font-heading text-foreground">
                    {r.role_name || "(Unnamed role)"}
                  </span>
                  <span className="text-muted-foreground">
                    {r.owner_name && r.owner_name.trim().length > 0
                      ? r.owner_name
                      : "(Vacant)"}
                  </span>
                  <span className="text-muted-foreground">
                    {firstSentence?.[0] ?? mission ?? "—"}
                  </span>
                  <span className="text-muted-foreground">
                    {r.metric_1 ?? "—"}
                  </span>
                  <span className="text-muted-foreground">
                    {r.accountable_to ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl border-2 border-border bg-card p-5">
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
              Weekly Revenue Team Meeting
            </p>
            <p className="mt-2 font-heading text-base text-foreground">
              {meta.weekly_meeting_day}s at {meta.weekly_meeting_time} ·{" "}
              {meta.weekly_meeting_duration}
            </p>
            {attendeeNames.length > 0 ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Attendees: {attendeeNames.join(", ")}
              </p>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetaCard label="First reflection" value={formatDisplayDate(meta.reflection_date_1)} />
            <MetaCard label="Second reflection" value={formatDisplayDate(meta.reflection_date_2)} />
            <MetaCard label="Third reflection" value={formatDisplayDate(meta.reflection_date_3)} />
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
              Save my Revenue Team Map
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
