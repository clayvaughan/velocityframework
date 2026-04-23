/**
 * Unified Revenue Team Accountability Map — static defaults.
 *
 * The five default roles come from Chapter 7 of Velocity (the unified
 * revenue team). Job Mission Statements, three key metrics, and five
 * responsibilities per role are book-grounded. Do not edit without
 * approval.
 */

export type RevenueRoleType =
  | "director_of_revenue"
  | "marketing_lead"
  | "sales_lead"
  | "revops_lead"
  | "account_management_lead"
  | "custom";

export type RevenueRoleDefault = {
  roleType: Exclude<RevenueRoleType, "custom">;
  roleName: string;
  shortDescription: string;
  missionStatement: string;
  metrics: [string, string, string];
  responsibilities: [string, string, string, string, string];
  defaultAccountableTo: string;
  /** Director of Revenue is always included; others can be unchecked. */
  alwaysIncluded?: boolean;
};

export const REVENUE_ROLE_DEFAULTS: RevenueRoleDefault[] = [
  {
    roleType: "director_of_revenue",
    roleName: "Director of Revenue (or Fractional Revenue Executive)",
    shortDescription:
      "The unifier. Owns revenue strategy, aligns marketing with sales, and builds rhythms that turn activity into pipeline into closed business. This seat cannot be empty if you're serious about growth.",
    missionStatement:
      "I am responsible for unifying sales and marketing under one revenue strategy, building disciplined rhythms that turn activity into pipeline into closed business, and delivering predictable growth the business can count on.",
    metrics: [
      "New revenue booked (weekly $)",
      "Pipeline value ($ of active deals)",
      "Close rate %",
    ],
    responsibilities: [
      "Own sales and marketing alignment under one strategy.",
      "Set revenue targets and track weekly performance.",
      "Build and manage the sales pipeline with clear stages.",
      "Coach sales and marketing leads through weekly rhythms.",
      "Deliver consistent revenue reporting to the leadership team.",
    ],
    defaultAccountableTo: "Integrator (or CEO if no Integrator)",
    alwaysIncluded: true,
  },
  {
    roleType: "marketing_lead",
    roleName: "Marketing Lead",
    shortDescription:
      "Owns brand, content, and demand generation. Turns your story into qualified leads that match your Favorite Customer Profile.",
    missionStatement:
      "I am responsible for turning our brand story into qualified leads that match our Favorite Customer Profile, creating a cohesive experience across every touchpoint the customer has with us.",
    metrics: [
      "Marketing Qualified Leads generated (weekly #)",
      "Cost per lead (CPL)",
      "Website conversion rate %",
    ],
    responsibilities: [
      "Execute the brand messaging strategy across all marketing channels.",
      "Run demand generation campaigns that produce qualified leads.",
      "Build and maintain brand assets (website, collateral, content).",
      "Track marketing attribution and report ROI weekly.",
      "Collaborate with Sales to ensure lead quality and message consistency.",
    ],
    defaultAccountableTo: "Director of Revenue",
  },
  {
    roleType: "sales_lead",
    roleName: "Sales Lead",
    shortDescription:
      "Owns pipeline and close. Runs the trust-building sales process, coaches reps, and converts qualified leads into closed revenue.",
    missionStatement:
      "I am responsible for converting qualified leads into closed revenue through a trust-building sales process, coaching our reps to higher close rates, and protecting the margin on every deal.",
    metrics: [
      "Deal conversion rate (proposals sent → closed)",
      "Average deal size",
      "Sales cycle length (days from MQL → close)",
    ],
    responsibilities: [
      "Run the sales process end-to-end using the Velocity trust-building framework.",
      "Coach sales reps weekly on pipeline, scripts, and close techniques.",
      "Maintain CRM hygiene and pipeline accuracy.",
      "Own the forecast and report weekly to the Director of Revenue.",
      "Partner with Marketing on message consistency in sales conversations.",
    ],
    defaultAccountableTo: "Director of Revenue",
  },
  {
    roleType: "revops_lead",
    roleName: "Revenue Operations Lead",
    shortDescription:
      "Owns CRM, data, forecasting, and process. Makes the machine run — so marketing and sales can focus on their craft instead of spreadsheets.",
    missionStatement:
      "I am responsible for the systems, data, and processes that let marketing and sales focus on their craft — ensuring the revenue machine runs smoothly and every number we report is trustworthy.",
    metrics: [
      "CRM data completeness % (required fields filled on active deals)",
      "Report delivery on-time % (weekly reports landing on schedule)",
      "Process adoption score (team compliance with documented SOPs)",
    ],
    responsibilities: [
      "Own CRM design, configuration, and data integrity.",
      "Build and maintain weekly revenue dashboards and reports.",
      "Document sales and marketing SOPs and train the team on them.",
      "Integrate marketing automation, sales tools, and analytics platforms.",
      "Support the Director of Revenue with forecasting and pipeline analysis.",
    ],
    defaultAccountableTo: "Director of Revenue",
  },
  {
    roleType: "account_management_lead",
    roleName: "Account Management Lead",
    shortDescription:
      "Owns retention, expansion, and renewals. Most growth doesn't come from new logos — it comes from customers who love you. This seat protects that.",
    missionStatement:
      "I am responsible for retaining the customers we've earned, expanding relationships through genuine hospitality and business value, and turning happy clients into a referral engine for future growth.",
    metrics: [
      "Customer retention rate %",
      "Net revenue retention (expansion + retention)",
      "Customer satisfaction score (CSAT or NPS)",
    ],
    responsibilities: [
      "Own the post-sale customer relationship from onboarding through renewal.",
      "Drive expansion conversations based on customer success milestones.",
      "Capture testimonials, case studies, and referrals from happy clients.",
      "Flag at-risk accounts early and coordinate save motions with Sales.",
      "Feed customer insights back to Marketing and Product for continuous improvement.",
    ],
    defaultAccountableTo: "Director of Revenue",
  },
];

export const REVENUE_ROLE_DEFAULTS_BY_TYPE: Record<
  Exclude<RevenueRoleType, "custom">,
  RevenueRoleDefault
> = {
  director_of_revenue: REVENUE_ROLE_DEFAULTS[0],
  marketing_lead: REVENUE_ROLE_DEFAULTS[1],
  sales_lead: REVENUE_ROLE_DEFAULTS[2],
  revops_lead: REVENUE_ROLE_DEFAULTS[3],
  account_management_lead: REVENUE_ROLE_DEFAULTS[4],
};

export const MAX_REVENUE_ROLES = 10;
export const MAX_REVENUE_CUSTOM_ROLES = 5;

export const DEFAULT_REFLECTION_QUESTION =
  "Is the right person in this seat? Are the metrics still the right ones for the stage we're in? What would make this role stronger in the next 90 days?";

export const TEAM_SIZE_OPTIONS = [
  "Just me — I wear all the hats",
  "2-3 people",
  "4-7 people",
  "8-15 people",
  "16+ people",
] as const;

export type TeamSize = (typeof TEAM_SIZE_OPTIONS)[number];

export const ANNUAL_REVENUE_OPTIONS = [
  "Under $500K",
  "$500K-$1M",
  "$1M-$3M",
  "$3M-$10M",
  "$10M-$25M",
  "$25M+",
] as const;

export type AnnualRevenue = (typeof ANNUAL_REVENUE_OPTIONS)[number];

export const DIRECTOR_OF_REVENUE_OPTIONS = [
  { value: "yes", label: "Yes, we have one" },
  { value: "no", label: "No, not yet" },
  { value: "planning", label: "Planning to hire one" },
] as const;

export type DirectorOfRevenueStatus =
  (typeof DIRECTOR_OF_REVENUE_OPTIONS)[number]["value"];

// ---------------------------------------------------------------------------
// Weekly meeting defaults
// ---------------------------------------------------------------------------

export const MEETING_DAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export type MeetingDay = (typeof MEETING_DAY_OPTIONS)[number];

export const MEETING_DURATION_OPTIONS = [
  "30 min",
  "60 min",
  "90 min",
  "120 min",
] as const;

export type MeetingDuration = (typeof MEETING_DURATION_OPTIONS)[number];

export const DEFAULT_MEETING_DAY: MeetingDay = "Wednesday";
export const DEFAULT_MEETING_TIME = "09:00";
export const DEFAULT_MEETING_DURATION: MeetingDuration = "60 min";

export const DEFAULT_MEETING_AGENDA =
  "1. Weekly numbers review (5 min) — pipeline, new revenue booked, MQLs, close rate.\n" +
  "2. Wins and losses (10 min) — what closed and why, what we lost and why.\n" +
  "3. Marketing → Sales handoff (10 min) — lead quality, message consistency, any drift.\n" +
  "4. Sales → Account Management handoff (10 min) — new customer context, expansion opportunities, at-risk flags.\n" +
  "5. Roadblocks (10 min) — what's preventing the team from hitting the number.\n" +
  "6. Commitments for next week (15 min) — what each person will do, with deadlines.";
