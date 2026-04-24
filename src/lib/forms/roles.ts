/**
 * Single source of truth for the 5 standard role options used across every
 * toolbox intake form. Matches the existing HubSpot "Role" dropdown options
 * Abby configured, so values land cleanly without transformation.
 */

export const ROLES = [
  "Business Owner",
  "Fractional Revenue Executive",
  "Leader / Executive",
  "Coach / Consultant",
  "Reader",
] as const;

export type Role = (typeof ROLES)[number];
