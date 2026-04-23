/**
 * Good Agency Dashboard Example — 8-page designed reference PDF.
 *
 * Structure:
 *   1. Cover
 *   2. The Framework ("Why most dashboards fail")
 *   3. Leadership Dashboard (4 metrics, cross-functional)
 *   4. Revenue Dashboard (5 metrics)
 *   5. Operations Dashboard (5 metrics)
 *   6. Administration Dashboard (5 metrics)
 *   7. How to Build Your Own
 *   8. Closing ("Metrics that matter are metrics that move.")
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";
import {
  ADMINISTRATION_DASHBOARD,
  LEADERSHIP_DASHBOARD,
  OPERATIONS_DASHBOARD,
  REVENUE_DASHBOARD,
  type DepartmentMetricRow,
  type LeadershipMetricRow,
} from "@/lib/dashboard-example/constants";

registerFonts();

const TOTAL_PAGES = 8;

const s = StyleSheet.create({
  coverHero: { marginTop: 120 },
  coverTitle: { ...pdfStyles.display, fontSize: 44, lineHeight: 0.95 },
  coverSub: { ...pdfStyles.h2, color: COLOR.goldDark, marginTop: 18 },

  bodyPara: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLOR.slate,
    marginTop: 10,
  },
  bodyParaFirst: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLOR.slate,
    marginTop: 18,
  },

  // Callout card (cream body, gold left border)
  callout: {
    marginTop: 22,
    padding: 14,
    backgroundColor: COLOR.creamSoft,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
  },
  calloutBody: {
    fontFamily: FONT.body,
    fontSize: 10,
    lineHeight: 1.55,
    color: COLOR.slate,
    fontStyle: "italic",
  },

  // Dashboard page eyebrow meta row
  metaRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
  },
  metaCell: {
    fontFamily: FONT.heading,
    fontSize: 7.5,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },

  // Leadership Dashboard table (4 cols: Owner, Metric, Target, Trend)
  leadershipHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLOR.slate,
    paddingBottom: 6,
    marginBottom: 6,
  },
  leadershipHeaderCell: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
    paddingRight: 8,
  },
  leadershipRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  leadershipCell: {
    fontFamily: FONT.body,
    fontSize: 9.5,
    lineHeight: 1.45,
    color: COLOR.slate,
    paddingRight: 8,
  },
  trendCell: {
    fontFamily: FONT.heading,
    fontSize: 14,
    color: COLOR.success,
    width: 28,
    textAlign: "right",
  },

  // Department dashboard tables (3 cols: Metric, Target, Why It Matters)
  deptHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLOR.slate,
    paddingBottom: 6,
    marginBottom: 6,
  },
  deptRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  deptCell: {
    fontFamily: FONT.body,
    fontSize: 9.5,
    lineHeight: 1.45,
    color: COLOR.slate,
    paddingRight: 8,
  },
  deptCellMetric: {
    fontFamily: FONT.heading,
    fontSize: 9,
    letterSpacing: 0.3,
    color: COLOR.slate,
  },
  targetCell: {
    fontFamily: FONT.display,
    fontSize: 16,
    letterSpacing: 1.2,
    color: COLOR.slate,
    paddingRight: 8,
  },

  // Numbered steps for pages 2 + 7
  numberedStep: {
    flexDirection: "row",
    marginTop: 14,
    gap: 12,
  },
  numberedNum: {
    fontFamily: FONT.display,
    fontSize: 30,
    letterSpacing: 2,
    color: COLOR.goldDark,
    width: 36,
    lineHeight: 1,
  },
  numberedBody: { flex: 1 },
  numberedHeading: {
    fontFamily: FONT.heading,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLOR.slate,
    marginTop: 2,
  },
  numberedPara: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLOR.slate,
    marginTop: 4,
  },

  // Closing page (dark)
  closingHeadline: {
    ...pdfStyles.display,
    fontSize: 42,
    color: COLOR.cream,
    lineHeight: 0.95,
    marginTop: 14,
  },
  closingSub: {
    fontFamily: FONT.body,
    fontSize: 11,
    lineHeight: 1.5,
    color: COLOR.cream,
    opacity: 0.85,
    marginTop: 20,
    maxWidth: 460,
  },
  ctaRow: { flexDirection: "row", gap: 12, marginTop: 36 },
  ctaCard: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: COLOR.gold,
    paddingLeft: 12,
    paddingRight: 4,
  },
  ctaNumber: {
    fontFamily: FONT.heading,
    fontSize: 9,
    letterSpacing: 2,
    color: COLOR.gold,
  },
  ctaTitle: {
    fontFamily: FONT.heading,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLOR.cream,
    marginTop: 8,
    lineHeight: 1.25,
  },
  ctaBody: {
    fontFamily: FONT.body,
    fontSize: 9,
    lineHeight: 1.5,
    color: COLOR.cream,
    opacity: 0.82,
    marginTop: 10,
  },
  ctaUrl: { fontFamily: FONT.body, fontSize: 8, color: COLOR.gold, marginTop: 14 },
  closingLine: {
    position: "absolute",
    bottom: 64,
    left: 48,
    right: 48,
    textAlign: "center",
    fontFamily: FONT.body,
    fontStyle: "italic",
    fontSize: 10,
    color: COLOR.cream,
    opacity: 0.6,
  },
});

function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <Text style={{ ...pdfStyles.display, fontSize: 14 }}>Velocity</Text>
      <Text style={pdfStyles.eyebrow}>Good Agency Dashboard Example</Text>
    </View>
  );
}

function Footer({ pageNumber }: { pageNumber: number }) {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text>© 2026 Clayton Vaughan Strategies</Text>
      <Text>{`Page ${pageNumber} of ${TOTAL_PAGES}`}</Text>
      <Text>velocityframework.com</Text>
    </View>
  );
}

export function DashboardExampleReport() {
  return (
    <Document>
      {/* ---------- Page 1 — Cover ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.eyebrow}>Velocity Framework · Toolbox resource</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.coverHero}>
          <Text style={pdfStyles.eyebrow}>Heading pillar</Text>
          <Text style={[s.coverTitle, { marginTop: 14 }]}>
            Good Agency{"\n"}Dashboard Example
          </Text>
          <Text style={s.coverSub}>
            Four real dashboards from the weekly operating rhythm of a growing
            service business.
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: 30 }]}>
            © 2026 Clayton Vaughan Strategies · velocityframework.com
          </Text>
        </View>
        <Footer pageNumber={1} />
      </Page>

      {/* ---------- Page 2 — The Framework ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Framework</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 24 }]}>
            Why most dashboards fail.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <Text style={s.bodyParaFirst}>
          Clay writes in <Text style={{ fontStyle: "italic" }}>Velocity</Text>{" "}
          that most businesses have two kinds of metrics: vanity metrics that
          look good on paper but don&rsquo;t predict outcomes, and survival
          metrics that matter but never get reviewed until something breaks. A
          dashboard that drives Velocity does three things every other
          dashboard doesn&rsquo;t.
        </Text>
        <Text style={s.bodyPara}>
          First, every metric has a named owner. Not a department — a person.
          When a number goes red, everyone on the team knows who makes the
          next move.
        </Text>
        <Text style={s.bodyPara}>
          Second, every metric has a target. Not &ldquo;do your best.&rdquo; A
          specific number that determines whether the business is on track.
        </Text>
        <Text style={s.bodyPara}>
          Third, every metric has a weekly cadence. Not monthly. Not
          quarterly. Weekly. Because by the time a monthly number comes in
          bad, the month is already gone.
        </Text>
        <View style={s.callout}>
          <Text style={s.calloutBody}>
            The four dashboards that follow are the actual structure Good
            Agency uses. Names and numbers are illustrative — the structure
            is the point.
          </Text>
        </View>
        <Footer pageNumber={2} />
      </Page>

      {/* ---------- Page 3 — Leadership Dashboard ---------- */}
      <DashboardLeadershipPage />

      {/* ---------- Page 4 — Revenue Dashboard ---------- */}
      <DepartmentDashboardPage
        pageNumber={4}
        title="Revenue Dashboard"
        subhead="Five metrics that tell a Director of Revenue whether the revenue engine is producing predictable growth."
        data={REVENUE_DASHBOARD}
      />

      {/* ---------- Page 5 — Operations Dashboard ---------- */}
      <DepartmentDashboardPage
        pageNumber={5}
        title="Operations Dashboard"
        subhead="Five metrics that tell a Director of Operations whether the business is delivering excellence without breaking itself."
        data={OPERATIONS_DASHBOARD}
      />

      {/* ---------- Page 6 — Administration Dashboard ---------- */}
      <DepartmentDashboardPage
        pageNumber={6}
        title="Administration Dashboard"
        subhead="Five metrics that tell a Director of Business Administration whether the business is financially durable and its people are thriving."
        data={ADMINISTRATION_DASHBOARD}
      />

      {/* ---------- Page 7 — How to Build Your Own ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Your turn</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 26 }]}>
            How to build your own.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>

        <View style={{ marginTop: 14 }}>
          <NumberedStep
            number="01"
            heading="Start with your Revenue Team Accountability Map"
            body="Every metric on your dashboard has an owner. If you don't have an accountability map yet, build one first at velocityframework.com/revenue-team-accountability-map. Don't skip this step."
          />
          <NumberedStep
            number="02"
            heading="Pick 4–5 metrics per dashboard"
            body="Not more. The instinct is to track everything. Resist it. Four or five metrics per department is the sweet spot — enough to see the whole picture, few enough that every owner stays focused. When everything is important, nothing is."
          />
          <NumberedStep
            number="03"
            heading="Set a target for every metric, or don't include it"
            body="A metric without a target is information, not accountability. Targets turn a dashboard into a decision-making tool. If you can't set a target, you don't understand the metric well enough to track it yet."
          />
        </View>

        <View style={s.callout}>
          <Text style={s.calloutBody}>
            Your first dashboard will be wrong. That&rsquo;s fine. The second
            one will be better. The third one will be the real thing. Start
            now.
          </Text>
        </View>

        <Footer pageNumber={7} />
      </Page>

      {/* ---------- Page 8 — Closing ---------- */}
      <Page size="LETTER" style={pdfStyles.pageDark}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Text style={{ ...pdfStyles.display, fontSize: 14, color: COLOR.cream }}>
            Velocity
          </Text>
          <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold }}>
            Next steps
          </Text>
        </View>
        <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold, marginTop: 70 }}>
          Go deeper
        </Text>
        <Text style={s.closingHeadline}>
          Metrics that matter{"\n"}are metrics that move.
        </Text>
        <View style={{ ...pdfStyles.goldRule, marginTop: 18 }} />
        <Text style={s.closingSub}>
          A dashboard is a scoreboard. The weekly rhythm is what makes the
          game real. Keep both, and the numbers become decisions instead of
          reports.
        </Text>

        <View style={s.ctaRow}>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>01</Text>
            <Text style={s.ctaTitle}>
              Build your Revenue Team Accountability Map
            </Text>
            <Text style={s.ctaBody}>
              Make sure every metric on your dashboard has a name next to it.
              Marketing, sales, RevOps, and account management — one revenue
              team, one set of owners.
            </Text>
            <Text style={s.ctaUrl}>
              velocityframework.com/revenue-team-accountability-map
            </Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>02</Text>
            <Text style={s.ctaTitle}>Pull more tools from the Toolbox</Text>
            <Text style={s.ctaBody}>
              Every resource from Velocity is free. Pull the scorecard,
              messaging checklist, and accountability map to complete the
              rhythm.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/toolbox</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>03</Text>
            <Text style={s.ctaTitle}>Apply for FRE Certification</Text>
            <Text style={s.ctaBody}>
              Two days in Austin with Clay and Luke. Twelve seats. Learn to
              install these systems inside client businesses.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/workshop</Text>
          </View>
        </View>

        <Text style={s.closingLine}>
          The rhythm is what makes it real. The dashboard is just the scoreboard.
        </Text>

        <View
          style={[pdfStyles.footer, { color: COLOR.cream, opacity: 0.6 }]}
          fixed
        >
          <Text>© 2026 Clayton Vaughan Strategies</Text>
          <Text>{`Page 8 of ${TOTAL_PAGES}`}</Text>
          <Text>velocityframework.com</Text>
        </View>
      </Page>
    </Document>
  );
}

// ---------------------------------------------------------------------------
// Page components
// ---------------------------------------------------------------------------

function DashboardLeadershipPage() {
  const d = LEADERSHIP_DASHBOARD;
  return (
    <Page size="LETTER" style={pdfStyles.page}>
      <Header />
      <View style={{ marginTop: 28 }}>
        <Text style={pdfStyles.eyebrow}>Dashboard 1 of 4</Text>
        <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 26 }]}>
          Leadership Dashboard
        </Text>
        <View style={pdfStyles.goldRule} />
        <View style={s.metaRow}>
          <Text style={s.metaCell}>{d.cadence}</Text>
          <Text style={s.metaCell}>· Owner: {d.owner}</Text>
        </View>
      </View>

      <Text style={[pdfStyles.body, { marginTop: 18, maxWidth: 480 }]}>
        Four metrics. One per department. The numbers that tell the executive
        team whether the business is healthy this week.
      </Text>

      <View style={{ marginTop: 22 }}>
        <View style={s.leadershipHeader}>
          <Text style={[s.leadershipHeaderCell, { flex: 1.2 }]}>Owner</Text>
          <Text style={[s.leadershipHeaderCell, { flex: 2.6 }]}>Metric</Text>
          <Text style={[s.leadershipHeaderCell, { flex: 1 }]}>Target</Text>
          <Text style={[s.leadershipHeaderCell, { width: 40, textAlign: "right" }]}>
            Trend
          </Text>
        </View>
        {d.rows.map((row: LeadershipMetricRow, i) => (
          <View key={i} style={s.leadershipRow}>
            <Text style={[s.leadershipCell, { flex: 1.2, fontFamily: FONT.heading, fontSize: 9 }]}>
              {row.owner}
            </Text>
            <Text style={[s.leadershipCell, { flex: 2.6 }]}>{row.metric}</Text>
            <Text style={[s.leadershipCell, { flex: 1, fontFamily: FONT.display, fontSize: 14, letterSpacing: 1 }]}>
              {row.target}
            </Text>
            <Text style={s.trendCell}>↑</Text>
          </View>
        ))}
      </View>

      <View style={s.callout}>
        <Text style={s.calloutBody}>{d.callout}</Text>
      </View>

      <Footer pageNumber={3} />
    </Page>
  );
}

function DepartmentDashboardPage({
  pageNumber,
  title,
  subhead,
  data,
}: {
  pageNumber: number;
  title: string;
  subhead: string;
  data: {
    owner: string;
    cadence: string;
    rows: DepartmentMetricRow[];
    callout: string;
  };
}) {
  return (
    <Page size="LETTER" style={pdfStyles.page}>
      <Header />
      <View style={{ marginTop: 28 }}>
        <Text style={pdfStyles.eyebrow}>Dashboard {pageNumber - 2} of 4</Text>
        <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 26 }]}>
          {title}
        </Text>
        <View style={pdfStyles.goldRule} />
        <View style={s.metaRow}>
          <Text style={s.metaCell}>{data.cadence}</Text>
          <Text style={s.metaCell}>· Owner: {data.owner}</Text>
        </View>
      </View>

      <Text style={[pdfStyles.body, { marginTop: 18, maxWidth: 480 }]}>
        {subhead}
      </Text>

      <View style={{ marginTop: 22 }}>
        <View style={s.deptHeader}>
          <Text style={[s.leadershipHeaderCell, { flex: 1.6 }]}>Metric</Text>
          <Text style={[s.leadershipHeaderCell, { flex: 1 }]}>Target</Text>
          <Text style={[s.leadershipHeaderCell, { flex: 2.4 }]}>
            Why It Matters
          </Text>
        </View>
        {data.rows.map((row, i) => (
          <View key={i} style={s.deptRow}>
            <Text style={[s.deptCell, s.deptCellMetric, { flex: 1.6 }]}>
              {row.metric}
            </Text>
            <Text style={[s.targetCell, { flex: 1 }]}>{row.target}</Text>
            <Text style={[s.deptCell, { flex: 2.4 }]}>{row.whyItMatters}</Text>
          </View>
        ))}
      </View>

      <View style={s.callout}>
        <Text style={s.calloutBody}>{data.callout}</Text>
      </View>

      <Footer pageNumber={pageNumber} />
    </Page>
  );
}

function NumberedStep({
  number,
  heading,
  body,
}: {
  number: string;
  heading: string;
  body: string;
}) {
  return (
    <View style={s.numberedStep}>
      <Text style={s.numberedNum}>{number}</Text>
      <View style={s.numberedBody}>
        <Text style={s.numberedHeading}>{heading}</Text>
        <Text style={s.numberedPara}>{body}</Text>
      </View>
    </View>
  );
}
