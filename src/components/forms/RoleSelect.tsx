"use client";

import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/forms/roles";

type Props = {
  name?: string;
  id?: string;
  required?: boolean;
  defaultValue?: string;
  /** Override the default class if a form needs something custom; most callers should pass nothing. */
  className?: string;
};

/**
 * Standard role dropdown — renders the 5 canonical options used across every
 * toolbox intake form. Matches the Culture Health Check pattern: uncontrolled
 * `<select>` with a disabled placeholder, same visual styling as the other
 * input fields via the shared input class.
 */
export function RoleSelect({
  name = "role",
  id,
  required,
  defaultValue = "",
  className,
}: Props) {
  return (
    <select
      name={name}
      id={id}
      required={required}
      defaultValue={defaultValue}
      className={cn(
        "w-full rounded-lg border-2 border-border bg-card px-4 py-3 text-base text-foreground",
        "transition-smooth focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30",
        className
      )}
    >
      <option value="" disabled>
        Select your role
      </option>
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}
