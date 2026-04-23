/**
 * The 8 sections of a Favorite Customer Profile, plus the 6 Scope
 * Guardrail fields. Placeholder copy grounded in the reference examples
 * Clay shared (Good Agency, AAA Paving, Power Ray) — prompts for
 * specificity, not generic filler.
 *
 * `label` renders as the heading above each textarea.
 * `placeholder` renders as the textarea's placeholder text.
 * `companyPlaceholder`, if true, substitutes "[company name]" with the
 * actual company from the intake form.
 */

export type ProfileSectionKey =
  | "profile_name"
  | "who_they_are"
  | "how_they_come_in"
  | "why_great_fit"
  | "what_they_say_yes_to"
  | "what_we_say_yes_to"
  | "when_we_say_no"
  | "examples"
  | "hospitality_cues";

export type ProfileSection = {
  key: ProfileSectionKey;
  label: string;
  /** `{{company}}` in placeholder/label templates is substituted at render. */
  labelTemplate?: string;
  placeholder: string;
  /** If true, this is a short single-line field. Otherwise multi-line textarea. */
  short?: boolean;
};

export const PROFILE_SECTIONS: ProfileSection[] = [
  {
    key: "profile_name",
    label: "Profile name",
    placeholder:
      'Short title — e.g., "Owner-Led Service Businesses" or "Professional General Contractors"',
    short: true,
  },
  {
    key: "who_they_are",
    label: "Who they are",
    placeholder:
      "Describe the specific type of business or leader, not just a demographic. Founder-led? Growth-stage? What industry? What are they known for? Two or three sentences, like you're describing them to a colleague.",
  },
  {
    key: "how_they_come_in",
    label: "How they come in",
    placeholder:
      "Where do they actually find you? Referrals from whom? Which events? Which podcasts? Which search terms? Be specific — this is how you'll reverse-engineer your marketing.",
  },
  {
    key: "why_great_fit",
    label: "Why they are a great fit",
    placeholder:
      "What about working with them makes your team do its best work? What do they respect? What do they value? What makes the engagement feel aligned from the first call?",
  },
  {
    key: "what_they_say_yes_to",
    label: "What they say yes to",
    placeholder:
      "Describe their behaviors — what they agree to, how they treat your team, what they pay for without flinching. This is the pattern of a customer you want more of.",
  },
  {
    key: "what_we_say_yes_to",
    labelTemplate: "What {{company}} says yes to",
    label: "What we say yes to",
    placeholder:
      "Your internal filter. What kinds of engagements do you actively pursue with this profile? Concrete scope, deal size, formats — not aspirations.",
  },
  {
    key: "when_we_say_no",
    labelTemplate: "When {{company}} says no",
    label: "When we say no",
    placeholder:
      "Disqualifiers. The behaviors, expectations, or circumstances that make this profile not worth pursuing. Be specific — vague no's get negotiated around.",
  },
  {
    key: "examples",
    label: "Examples",
    placeholder:
      "Real customer names (if shareable internally) or archetype descriptions. Helps your team quickly pattern-match future opportunities.",
  },
  {
    key: "hospitality_cues",
    label: "Hospitality cues",
    placeholder:
      "How do you treat this customer relationally? What makes them feel valued? This should tie back to the Heart section of Velocity — hospitality is a differentiator for every FCP.",
  },
];

export type ScopeGuardrailKey =
  | "core_focus"
  | "minimum_threshold"
  | "geography"
  | "strategic_priorities"
  | "do_not_pursue"
  | "proceed_with_caution";

export type ScopeGuardrailSection = {
  key: ScopeGuardrailKey;
  label: string;
  placeholder: string;
};

export const SCOPE_GUARDRAILS: ScopeGuardrailSection[] = [
  {
    key: "core_focus",
    label: "Core focus",
    placeholder:
      "What your business actually does. One or two sentences — not the aspirational version, the real one.",
  },
  {
    key: "minimum_threshold",
    label: "Minimum contract / project threshold",
    placeholder:
      "Below what size does an opportunity stop being worth pursuing? Put a dollar number on it.",
  },
  {
    key: "geography",
    label: "Preferred geography",
    placeholder:
      "Where you actually do business well. Radius from your base, regions, or named states/metros. Be honest — travel drag kills margins.",
  },
  {
    key: "strategic_priorities",
    label: "Current strategic priorities",
    placeholder:
      "What's the focus this year? Which service lines are primary, which are supporting, which are being phased out?",
  },
  {
    key: "do_not_pursue",
    label: "Work we do not pursue",
    placeholder:
      "Categorical no-gos. Industries, project types, deal structures you won't take no matter who's asking.",
  },
  {
    key: "proceed_with_caution",
    label: "Proceed with caution",
    placeholder:
      "Exceptions only. The kinds of opportunities that need leadership sign-off before you engage.",
  },
];

export function renderLabelFor(
  section: ProfileSection,
  companyName: string
): string {
  if (section.labelTemplate && companyName) {
    return section.labelTemplate.replace("{{company}}", companyName);
  }
  return section.label;
}
