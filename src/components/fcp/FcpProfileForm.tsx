"use client";

import { cn } from "@/lib/utils";
import {
  PROFILE_SECTIONS,
  renderLabelFor,
  type ProfileSectionKey,
} from "@/lib/fcp/profile-sections";

export type ProfileDraft = Record<ProfileSectionKey, string>;

type Props = {
  position: 1 | 2 | 3;
  companyName: string;
  value: ProfileDraft;
  onChange: (v: ProfileDraft) => void;
  /** When true, the "Remove this FCP" button is enabled (only for positions 2 and 3). */
  removable?: boolean;
  onRemove?: () => void;
};

const inputClass = cn(
  "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-sm text-foreground",
  "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
);

export function FcpProfileForm({
  position,
  companyName,
  value,
  onChange,
  removable,
  onRemove,
}: Props) {
  const stepLabel = `Screen ${position} · FCP #${position}`;
  const headline = value.profile_name?.trim()
    ? value.profile_name
    : `Your ${position}${ordinalSuffix(position)} Favorite Customer Profile`;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
            {stepLabel}
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-tight">
            {headline}
          </h2>
        </div>
        {removable && onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-smooth"
          >
            Remove this FCP
          </button>
        ) : null}
      </div>

      <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
        All fields are optional except the profile name. Fill in what you
        know; come back to the rest.
      </p>

      <div className="mt-8 space-y-6">
        {PROFILE_SECTIONS.map((section) => {
          const label = renderLabelFor(section, companyName);
          const required = section.key === "profile_name" && position === 1;
          return (
            <label key={section.key} className="block space-y-2">
              <span className="font-heading text-xs uppercase tracking-widest text-foreground">
                {label}
                {required ? <span className="text-accent-dark"> *</span> : null}
              </span>
              {section.short ? (
                <input
                  type="text"
                  value={value[section.key] ?? ""}
                  onChange={(e) =>
                    onChange({ ...value, [section.key]: e.target.value })
                  }
                  placeholder={section.placeholder}
                  required={required}
                  className={inputClass}
                />
              ) : (
                <textarea
                  rows={4}
                  value={value[section.key] ?? ""}
                  onChange={(e) =>
                    onChange({ ...value, [section.key]: e.target.value })
                  }
                  placeholder={section.placeholder}
                  className={inputClass}
                />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ordinalSuffix(n: number): string {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}
