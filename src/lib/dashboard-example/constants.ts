/**
 * Good Agency Dashboard Example — static reference data for the PDF.
 * Four dashboards, each with named metrics and targets. Pulled directly
 * from the prompt spec; names and numbers are illustrative but the
 * structure is real.
 */

export type LeadershipMetricRow = {
  owner: string;
  metric: string;
  target: string;
};

export type DepartmentMetricRow = {
  metric: string;
  target: string;
  whyItMatters: string;
};

export const LEADERSHIP_DASHBOARD: {
  owner: string;
  cadence: string;
  rows: LeadershipMetricRow[];
  callout: string;
} = {
  owner: "Integrator",
  cadence: "Cross-functional · Reviewed every Wednesday",
  rows: [
    {
      owner: "Dir. Revenue",
      metric: "New Revenue Booked (weekly $ of contracts closed)",
      target: "$25,000",
    },
    {
      owner: "Dir. Revenue",
      metric: "Pipeline Value ($ of all active deals in CRM)",
      target: "$250,000",
    },
    {
      owner: "Dir. Operations",
      metric: "Customer Satisfaction (CSAT/NPS rolling 30-day)",
      target: "80",
    },
    {
      owner: "Dir. Business Admin",
      metric: "Operating Cash Flow (net cash this week)",
      target: "$50,000",
    },
  ],
  callout:
    "Why these four? Each one represents the health of a different system. Revenue = acquisition engine. Pipeline = future revenue. CSAT = delivery quality. Cash flow = financial durability. Miss any one of these for three weeks in a row and the business has a real problem.",
};

export const REVENUE_DASHBOARD: {
  owner: string;
  cadence: string;
  rows: DepartmentMetricRow[];
  callout: string;
} = {
  owner: "Director of Revenue",
  cadence: "Reviewed every Wednesday",
  rows: [
    {
      metric: "MQLs Generated (#/week)",
      target: "20",
      whyItMatters:
        "Leading indicator — if this drops, revenue will drop in 60 days.",
    },
    {
      metric: "Pipeline Value ($)",
      target: "$250,000",
      whyItMatters: "Middle indicator — enough in-flight to hit targets.",
    },
    {
      metric: "Close Rate (%)",
      target: "48%",
      whyItMatters: "Tells you whether the process is working.",
    },
    {
      metric: "Average Deal Size ($)",
      target: "$35,000",
      whyItMatters: "Reveals whether you're selling up or down market.",
    },
    {
      metric: "New Revenue Booked ($/week)",
      target: "$25,000",
      whyItMatters: "The number — did we actually grow this week.",
    },
  ],
  callout:
    "The Director of Revenue reviews these with the Marketing Lead, Sales Lead, and RevOps Lead every Wednesday. When a metric goes red, the responsible lead brings a one-page recovery plan to the next meeting. That's the rhythm.",
};

export const OPERATIONS_DASHBOARD: {
  owner: string;
  cadence: string;
  rows: DepartmentMetricRow[];
  callout: string;
} = {
  owner: "Director of Operations",
  cadence: "Reviewed every Wednesday",
  rows: [
    {
      metric: "On-Time Delivery %",
      target: "100%",
      whyItMatters: "Trust with customers starts here.",
    },
    {
      metric: "Customer Retention Rate %",
      target: "100%",
      whyItMatters: "Losing a customer costs 5–10x more than keeping one.",
    },
    {
      metric: "CSAT/NPS",
      target: "80",
      whyItMatters: "Leading indicator for retention and referrals.",
    },
    {
      metric: "Error/Defect Rate",
      target: "Under 5%",
      whyItMatters: "Reveals process health.",
    },
    {
      metric: "Project Margin %",
      target: "Tracked per project",
      whyItMatters: "Profit, not just revenue.",
    },
  ],
  callout:
    "Operations is where most growing businesses break. Revenue outpaces delivery, quality slips, and customers stop referring. These five metrics catch that slide early — before it costs you the business you spent years building.",
};

export const ADMINISTRATION_DASHBOARD: {
  owner: string;
  cadence: string;
  rows: DepartmentMetricRow[];
  callout: string;
} = {
  owner: "Director of Business Administration",
  cadence: "Reviewed every Wednesday",
  rows: [
    {
      metric: "Gross Profit Margin %",
      target: "40%",
      whyItMatters: "The real profitability of the work you're selling.",
    },
    {
      metric: "Operating Cash Flow ($)",
      target: "$50,000/week",
      whyItMatters: "Can the business survive a bad month?",
    },
    {
      metric: "Overhead Ratio %",
      target: "Under 20%",
      whyItMatters: "Efficiency of the behind-the-scenes cost structure.",
    },
    {
      metric: "Employee Satisfaction Score",
      target: "5 / 5",
      whyItMatters: "Leading indicator for turnover and hiring costs.",
    },
    {
      metric: "Turnover Rate %",
      target: "0%",
      whyItMatters: "Every departure is cost, culture hit, and client risk.",
    },
  ],
  callout:
    "Administration is the seat most owners underestimate. Finance, HR, and operational backbone. When this dashboard is green, everything else runs smoother. When it's red, the cracks show up everywhere else in the business within 90 days.",
};
