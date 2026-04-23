/**
 * Leadership Accountability Map — static content.
 *
 * The five default role templates come directly from Clay's H1 Accountability
 * Map sheet in the Velocity Framework spreadsheet. Job Mission Statements and
 * responsibilities are verbatim from that source.
 */

export type RoleType =
  | "visionary"
  | "integrator"
  | "director_revenue"
  | "director_operations"
  | "director_business_admin"
  | "custom";

export type RoleDefault = {
  roleType: Exclude<RoleType, "custom">;
  roleName: string;
  shortDescription: string;
  missionStatement: string;
  responsibilities: [string, string, string, string, string];
  defaultAccountableTo: string;
};

export const ROLE_DEFAULTS: RoleDefault[] = [
  {
    roleType: "visionary",
    roleName: "Visionary",
    shortDescription:
      "Keeps eyes on the future, spots big opportunities, inspires the team to believe in where you're headed.",
    missionStatement:
      "I am responsible for keeping our eyes on the future, spotting big opportunities, and inspiring the team to believe in where we're headed.",
    responsibilities: [
      "Cast and protect the long-term vision.",
      "Identify big opportunities and partnerships.",
      "Inspire and rally the leadership team.",
      "Maintain external relationships and brand presence.",
      "Guard company culture and core values.",
    ],
    defaultAccountableTo: "Owner",
  },
  {
    roleType: "integrator",
    roleName: "Integrator",
    shortDescription:
      "Turns vision into action, keeps the team aligned, ensures what you promise actually gets done.",
    missionStatement:
      "I am responsible for turning vision into action, keeping the team aligned, and making sure what we promise actually gets done.",
    responsibilities: [
      "Translate vision into executable plans.",
      "Align departments and resolve cross-functional conflicts.",
      "Drive accountability across leadership team.",
      "Manage company dashboard and rhythms.",
      "Ensure consistent execution of goals.",
    ],
    defaultAccountableTo: "Visionary",
  },
  {
    roleType: "director_revenue",
    roleName: "Director of Revenue",
    shortDescription:
      "Unites sales and marketing, builds pipelines, helps customers say yes with confidence.",
    missionStatement:
      "I am responsible for growing our business by uniting sales and marketing, building strong pipelines, and helping customers say 'yes' with confidence.",
    responsibilities: [
      "Own sales and marketing alignment.",
      "Set revenue targets and track performance.",
      "Build and manage sales pipeline.",
      "Oversee customer acquisition strategies.",
      "Drive profitability through revenue growth.",
    ],
    defaultAccountableTo: "Integrator",
  },
  {
    roleType: "director_operations",
    roleName: "Director of Operations",
    shortDescription:
      "Ensures work gets delivered with excellence, streamlines operations, builds systems that scale.",
    missionStatement:
      "I am responsible for making sure the work gets delivered with excellence, streamlining how we operate, and building systems that scale as we grow.",
    responsibilities: [
      "Oversee delivery of products and services.",
      "Improve systems and operational efficiency.",
      "Manage resources and project execution.",
      "Ensure quality control and consistency.",
      "Support scalability through process improvements.",
    ],
    defaultAccountableTo: "Integrator",
  },
  {
    roleType: "director_business_admin",
    roleName: "Director of Business Administration",
    shortDescription:
      "Keeps finances healthy, supports people operations, runs the behind-the-scenes systems.",
    missionStatement:
      "I am responsible for keeping our finances healthy, supporting our people, and running the behind-the-scenes systems that keep the business moving smoothly.",
    responsibilities: [
      "Manage finance, budgets, and forecasting.",
      "Oversee HR and people operations.",
      "Maintain legal and compliance requirements.",
      "Streamline administrative systems and processes.",
      "Support leadership with reporting and insights.",
    ],
    defaultAccountableTo: "Integrator",
  },
];

export const ROLE_DEFAULTS_BY_TYPE: Record<
  Exclude<RoleType, "custom">,
  RoleDefault
> = {
  visionary: ROLE_DEFAULTS[0],
  integrator: ROLE_DEFAULTS[1],
  director_revenue: ROLE_DEFAULTS[2],
  director_operations: ROLE_DEFAULTS[3],
  director_business_admin: ROLE_DEFAULTS[4],
};

export const MAX_ROLES = 10;
export const MAX_CUSTOM_ROLES = 5;

export const DEFAULT_REFLECTION_QUESTION =
  "Is the right person in this seat? Are they getting it, wanting it, and capable of doing it? What would make this seat stronger in the next 90 days?";

export const TEAM_SIZE_OPTIONS = [
  "1-10",
  "11-25",
  "26-50",
  "51-100",
  "100+",
] as const;

export type TeamSize = (typeof TEAM_SIZE_OPTIONS)[number];
