/**
 * The three Velocity virtues. Every Culture Action Plan focus area tags
 * itself to one of these — it's how the change gets measured and
 * reinforced later.
 */

export type VirtueId = "hospitality" | "humility" | "grit";

export type Virtue = {
  id: VirtueId;
  title: string;
  tagline: string;
  description: string;
};

export const VIRTUES: Virtue[] = [
  {
    id: "hospitality",
    title: "Hospitality",
    tagline: "People feel cared for.",
    description:
      "This focus area is about warmth, welcome, and genuine care — how people feel when they walk in, work through, and walk out of your organization.",
  },
  {
    id: "humility",
    title: "Humility",
    tagline: "People feel heard.",
    description:
      "This focus area is about listening, admitting mistakes, and leading with vulnerability — the posture that makes honest conversations possible.",
  },
  {
    id: "grit",
    title: "Grit",
    tagline: "People take action.",
    description:
      "This focus area is about discipline, follow-through, and doing the hard thing — the muscle that turns stated values into lived behavior.",
  },
];

export const VIRTUES_BY_ID: Record<VirtueId, Virtue> = Object.fromEntries(
  VIRTUES.map((v) => [v.id, v])
) as Record<VirtueId, Virtue>;
