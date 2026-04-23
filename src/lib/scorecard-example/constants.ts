/**
 * Good Agency Scorecard Example — the Jane Doe / Director of Operations
 * example scorecard, transcribed verbatim from Clay's real spreadsheet.
 *
 * Names are illustrative; the structure is real.
 */

export type ScoreSymbol = "+" | "+-" | "-";

export const CORE_VALUES_LABELS = ["Hospitable", "Humble", "Grit"] as const;
export const GWC_LABELS = ["Get It", "Want It", "Capacity to Do It"] as const;

export const JANE_DOE_SCORECARD = {
  teamMemberName: "Jane Doe",
  date: "January 1, 2026",
  jobTitle: "Director of Operations",
  jobMissionStatement:
    "I am responsible for making sure the work gets delivered with excellence, streamlining how we operate, and building systems that scale as we grow.",

  // Team member self-scoring ("FOR TEAM MEMBER USE ONLY")
  selfCoreValues: {
    Hospitable: "+" as ScoreSymbol,
    Humble: "+" as ScoreSymbol,
    Grit: "+" as ScoreSymbol,
  },
  selfGwc: {
    "Get It": "+" as ScoreSymbol,
    "Want It": "+" as ScoreSymbol,
    "Capacity to Do It": "+" as ScoreSymbol,
  },

  // Supervisor scoring ("FOR SUPERVISOR USE ONLY")
  supervisorCoreValues: {
    Hospitable: "+" as ScoreSymbol,
    Humble: "+" as ScoreSymbol,
    Grit: "+" as ScoreSymbol,
  },
  supervisorGwc: {
    "Get It": "+" as ScoreSymbol,
    "Want It": "+" as ScoreSymbol,
    "Capacity to Do It": "+" as ScoreSymbol,
  },

  // Page 4 — OKRs and KPIs
  okrDueDate: "03/31/2026",
  okrs: ["", "", ""] as [string, string, string], // blank template rows

  kpis: [
    {
      desiredResult: "On-Time Delivery",
      kpi: "% deliverables hit promised due date",
      green: "95-100%",
      yellow: "85-94%",
      red: "Below 85%",
    },
    {
      desiredResult: "Budget Within Scope",
      kpi: "% projects within ±10% of budgeted hours/$",
      green: "90-100%",
      yellow: "75-89%",
      red: "Below 75%",
    },
    {
      desiredResult: "Median Foundations Project Timeline",
      kpi: "Months kickoff → final approval",
      green: "Under 4 months",
      yellow: "4-6 months",
      red: "Over 6 months",
    },
    {
      desiredResult: "Process Adoption",
      kpi: "Steps passed / steps audited",
      green: "90-100%",
      yellow: "75-89%",
      red: "Below 75%",
    },
  ],

  // Page 5 — Responsibilities (scored 1-5)
  responsibilities: [
    { name: "Review All Scorecards and Flag Concerns", score: 4 },
    { name: "Capacity and Resource Planning (8 weeks out)", score: 3 },
    { name: "Process Architecture and Compliance", score: 4 },
    { name: "Project Success", score: 4 },
    { name: "Continuous Company Improvement", score: 5 },
    { name: "Financial Responsibility", score: 3 },
  ],

  // Page 5 — Competencies (scored 1-5)
  competencies: [
    { name: "Systems Thinking", score: 5 },
    { name: "Data Fluency", score: 4 },
    { name: "Change Management", score: 4 },
    { name: "Meeting Facilitation", score: 4 },
    { name: "EOS Mastery", score: 4 },
    { name: "Leadership", score: 4 },
    { name: "Persuasive / Influence", score: 4 },
    { name: "Understanding of Service Delivery", score: 4 },
  ],
};
