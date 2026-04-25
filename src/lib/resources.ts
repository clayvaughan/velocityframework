export type Pillar = "heart" | "heading" | "hustle";

export type Resource = {
  /** URL slug under /toolbox/[slug] */
  slug: string;
  /** Display number from the production brief (01–12) */
  number: string;
  /** Human-readable title */
  title: string;
  /** One-line hook shown on resource cards and hero */
  hook: string;
  /** Which pillar the resource maps to */
  pillar: Pillar;
  /** Format descriptor — e.g., "Fillable PDF, 4–6 pages" */
  format: string;
  /** Who owns content production */
  owner: string;
  /** HubSpot workflow identifier this form submission will trigger.
   *  Used as a data attribute on the HubSpotFormSlot so Abby can wire it. */
  hubspotWorkflowKey: string;
  /**
   * Optional override — when set, the ResourceCard links here instead of
   * `/toolbox/[slug]`, and the generic /toolbox/[slug] detail page
   * redirects to this URL. Used for resources that are live interactive
   * tools (Culture Action Plan) rather than PDF downloads.
   */
  externalHref?: string;
};

/** Master list of the 12 downloadable resources (+ the quiz lives separately at /health-survey). */
export const resources: Resource[] = [
  {
    slug: "leadership-accountability-map",
    number: "02",
    title: "Leadership Accountability Map",
    hook:
      "Name the five seats every growing business needs to fill. Assign owners, missions, and accountability — so ownership stops falling through the cracks.",
    pillar: "heart",
    format: "Interactive tool · ~15 minutes",
    owner: "Clay (content) · Lindsay (design)",
    hubspotWorkflowKey: "resource_leadership_accountability_map",
    externalHref: "/leadership-accountability-map",
  },
  {
    slug: "unified-revenue-map",
    number: "03",
    title: "Unified Revenue Team Accountability Map",
    hook:
      "Map who owns what across your unified revenue team — marketing, sales, RevOps, and retention. Builds on the Director of Revenue / FRE structure from Chapter 7 of Velocity.",
    pillar: "heading",
    format: "Interactive tool · ~15 minutes",
    owner: "Luke (content) · Clay (approve) · Lindsay (design)",
    hubspotWorkflowKey: "resource_unified_revenue_map",
    externalHref: "/revenue-team-accountability-map",
  },
  {
    slug: "dashboard-example",
    number: "04",
    title: "Good Agency Dashboard Example",
    hook:
      "See what a weekly dashboard that actually runs a business looks like. Four real dashboards from Good Agency across Leadership, Revenue, Operations, and Administration.",
    pillar: "heading",
    format: "Reference PDF · 8 pages",
    owner: "Abby (screenshot) · Clay (narrative)",
    hubspotWorkflowKey: "resource_dashboard_example",
    externalHref: "/good-agency-dashboard-example",
  },
  {
    slug: "fre-job-description",
    number: "05",
    title: "FRE Job Description",
    hook:
      "The full role definition for a Fractional Revenue Executive — responsibilities, competencies, character requirements, and what clients should expect. Use it to hire, evaluate, or become one.",
    pillar: "heading",
    format: "Reference PDF · Living document",
    owner: "Luke (definition) · Clay (approve)",
    hubspotWorkflowKey: "resource_fre_job_description",
    externalHref: "/fre-job-description",
  },
  {
    slug: "fcp-worksheet",
    number: "06",
    title: "Favorite Customer Profile Worksheet",
    hook:
      "Define the exact customer your business does its best work for. Used by your entire team for marketing, sales qualification, referrals, and proposals.",
    pillar: "heading",
    format: "Interactive tool · ~15 minutes",
    owner: "Clay (template) · Luke (adapt)",
    hubspotWorkflowKey: "resource_fcp_worksheet",
    externalHref: "/favorite-customer-profile",
  },
  {
    slug: "scorecard-example",
    number: "07",
    title: "Good Agency Scorecard Example",
    hook:
      "See what a scorecard that runs a person looks like. A real Director of Operations scorecard from Good Agency — core values, GWC, OKRs, KPIs, responsibilities, and competencies.",
    pillar: "hustle",
    format: "Reference PDF · 8 pages",
    owner: "Abby (example) · Clay (narrative)",
    hubspotWorkflowKey: "resource_scorecard_example",
    externalHref: "/good-agency-scorecard-example",
  },
  {
    slug: "messaging-proof-bundle",
    number: "08",
    title: "Messaging & Proof Checklist",
    hook:
      "Three tools to clarify your message and prove your value — one-liner, message map, case study template.",
    pillar: "heading",
    format: "Interactive tool · ~15 minutes",
    owner: "Clay · Luke · Abby",
    hubspotWorkflowKey: "resource_messaging_proof_bundle",
    externalHref: "/messaging-proof-checklist",
  },
  {
    slug: "messaging-examples",
    number: "09",
    title: "Messaging Examples Gallery",
    hook:
      "Ten examples of strong revenue messaging, broken down so you can see what works and why.",
    pillar: "heading",
    format: "PDF swipe file, 8–10 pages",
    owner: "Luke (examples) · Clay (commentary)",
    hubspotWorkflowKey: "resource_messaging_examples",
  },
  {
    slug: "sales-script-template",
    number: "10",
    title: "Sales Script Template",
    hook:
      "The structure of a sales conversation that wins. Fill in the blanks with your business.",
    pillar: "hustle",
    format: "Fillable PDF, 6–8 pages",
    owner: "Luke",
    hubspotWorkflowKey: "resource_sales_script_template",
  },
  {
    slug: "trust-building-script",
    number: "11",
    title: "Sample Trust-Building Script",
    hook:
      "The exact sales script Luke Frazier built for a boutique wedding venue — 10 coached sections covering pre-arrival hospitality through final farewell. The living example every FRE Clay certifies studies first.",
    pillar: "hustle",
    format: "Reference PDF · Living document",
    owner: "Luke (script) · Clay (coaching)",
    hubspotWorkflowKey: "resource_trust_building_script",
    externalHref: "/sample-trust-building-script",
  },
  {
    slug: "complete-sales-script",
    number: "12",
    title: "Complete Sales Script",
    hook:
      "The complete end-to-end sales conversation — first hello to signed proposal. Adapt it to your business. Shares the same source as the Sample Trust-Building Script: ten coached sections, live from Luke's Google Doc.",
    pillar: "hustle",
    format: "Reference PDF · Living document",
    owner: "Luke (script) · Clay (coaching)",
    hubspotWorkflowKey: "resource_complete_sales_script",
    externalHref: "/sample-trust-building-script",
  },
  {
    slug: "culture-action-plan",
    number: "01b",
    title: "Culture Action Plan",
    hook:
      "Turn your Culture Health Check results into a 30/60/90-day plan with calendar events, a leadership email, and an accountability partner — grounded in the Heart section of the book.",
    pillar: "heart",
    format: "Interactive plan · ~10 minutes",
    owner: "Clay",
    hubspotWorkflowKey: "resource_culture_action_plan",
    externalHref: "/action-plan",
  },
];

export const resourcesByPillar = (pillar: Pillar) =>
  resources.filter((r) => r.pillar === pillar);

export const resourceBySlug = (slug: string) =>
  resources.find((r) => r.slug === slug);

export const pillarMeta: Record<
  Pillar,
  { label: string; tagline: string; description: string }
> = {
  heart: {
    label: "Heart",
    tagline: "Culture",
    description:
      "Culture isn't a values poster. It's who you hire, how you run meetings, and what you actually reward. Heart is the operating system of your team.",
  },
  heading: {
    label: "Heading",
    tagline: "Strategy",
    description:
      "A clear heading turns marketing, sales, and RevOps into one revenue team. Without it, you have three silos competing for credit.",
  },
  hustle: {
    label: "Hustle",
    tagline: "Execution",
    description:
      "Execution without chaos. Scorecards, scripts, dashboards — the weekly rhythm that turns strategy into shipped results.",
  },
};
