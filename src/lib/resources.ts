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
      "If marketing, sales, and RevOps still report to different leaders, you don't have a revenue team — you have three silos.",
    pillar: "heading",
    format: "Fillable PDF, 4–6 pages",
    owner: "Luke (content) · Clay (approve) · Lindsay (design)",
    hubspotWorkflowKey: "resource_unified_revenue_map",
  },
  {
    slug: "dashboard-example",
    number: "04",
    title: "Good Agency Dashboard Example",
    hook:
      "The actual dashboard we use to run a multi-million-dollar marketing consultancy. Steal it.",
    pillar: "heading",
    format: "Multi-page PDF, 4–5 pages",
    owner: "Abby (screenshot) · Clay (narrative)",
    hubspotWorkflowKey: "resource_dashboard_example",
  },
  {
    slug: "fre-job-description",
    number: "05",
    title: "FRE Job Description",
    hook:
      "The full Fractional Revenue Executive role — responsibilities, reporting structure, engagement terms, first 90-day deliverables.",
    pillar: "heading",
    format: "2-page PDF",
    owner: "Luke",
    hubspotWorkflowKey: "resource_fre_job_description",
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
      "The scorecard Good Agency uses to measure team performance. Adapt it, build your own.",
    pillar: "hustle",
    format: "3–4 page PDF",
    owner: "Abby (example) · Clay (narrative)",
    hubspotWorkflowKey: "resource_scorecard_example",
  },
  {
    slug: "messaging-proof-bundle",
    number: "08",
    title: "Messaging & Proof Checklist",
    hook:
      "Three tools to clarify your message and prove your value — one-liner, message map, case study template.",
    pillar: "heading",
    format: "Bundle PDF, 10–12 pages",
    owner: "Clay · Luke · Abby",
    hubspotWorkflowKey: "resource_messaging_proof_bundle",
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
    title: "Trust-Building Script Example",
    hook:
      "An actual trust-building script we've used to open high-stakes sales conversations. Study it, adapt it.",
    pillar: "hustle",
    format: "3–4 page PDF, annotated",
    owner: "Luke",
    hubspotWorkflowKey: "resource_trust_building_script",
  },
  {
    slug: "complete-sales-script",
    number: "12",
    title: "Complete Sales Script",
    hook:
      "The complete end-to-end sales conversation — first hello to signed proposal. Adapt it to your business.",
    pillar: "hustle",
    format: "Fillable PDF, 10–12 pages",
    owner: "Luke",
    hubspotWorkflowKey: "resource_complete_sales_script",
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
