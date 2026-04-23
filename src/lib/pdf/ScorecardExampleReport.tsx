/**
 * Good Agency Scorecard Example — 8-page designed reference PDF.
 *
 * Structure:
 *   1. Cover
 *   2. Why Most Scorecards Fail (framework intro)
 *   3. Scorecard — Identity, Job Mission, Core Values, GWC
 *   4. Scorecard — OKRs and KPIs (red/yellow/green thresholds)
 *   5. Scorecard — Responsibilities and Competencies (scored 1-5) + Supervisor block
 *   6. The Rhythm (monthly 1:1 review — NOT weekly)
 *   7. How to Build Your Own
 *   8. Closing ("Accountability is love at scale.")
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
  JANE_DOE_SCORECARD,
  type ScoreSymbol,
} from "@/lib/scorecard-example/constants";

registerFonts();

const TOTAL_PAGES = 8;

const s = StyleSheet.create({
  // Cover
  coverHero: { marginTop: 120 },
  coverTitle: { ...pdfStyles.display, fontSize: 44, lineHeight: 0.95 },
  coverSub: { ...pdfStyles.h2, color: COLOR.goldDark, marginTop: 18 },

  // Section labeling + bodies
  section: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  sectionLabel: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  sectionBody: { ...pdfStyles.body, fontSize: 10.5, marginTop: 6 },

  // Callout card (cream body, gold border)
  callout: {
    marginTop: 18,
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

  // Page 3 — identity/values two-column
  twoCol: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  colLeft: { flex: 1.1 },
  colRight: { flex: 0.9 },
  idLabel: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
    marginTop: 12,
  },
  idValue: {
    fontFamily: FONT.body,
    fontSize: 11,
    color: COLOR.slate,
    marginTop: 2,
  },
  missionQuote: {
    fontFamily: FONT.body,
    fontStyle: "italic",
    fontSize: 11,
    lineHeight: 1.5,
    color: COLOR.slate,
    marginTop: 4,
  },

  // Scoring block
  scoringBlock: {
    padding: 14,
    borderWidth: 1,
    borderColor: COLOR.border,
    backgroundColor: "#FFFFFF",
  },
  scoringBlockTitle: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  scoringGroupLabel: {
    fontFamily: FONT.heading,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLOR.slate,
    marginTop: 10,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  scoreRowLabel: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLOR.slate,
  },
  scoreRowValue: {
    fontFamily: FONT.heading,
    fontSize: 12,
    color: COLOR.slate,
    width: 30,
    textAlign: "right",
  },
  scoringLegend: {
    marginTop: 10,
    fontFamily: FONT.body,
    fontSize: 8,
    color: COLOR.mutedText,
    fontStyle: "italic",
  },

  // Page 4 — KPI table
  kpiTableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLOR.slate,
    paddingBottom: 6,
    marginBottom: 6,
  },
  kpiTableHeaderCell: {
    fontFamily: FONT.heading,
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  kpiRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  kpiCell: {
    fontFamily: FONT.body,
    fontSize: 9,
    lineHeight: 1.4,
    color: COLOR.slate,
    paddingRight: 6,
  },
  okrRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  okrNum: {
    fontFamily: FONT.heading,
    fontSize: 10,
    color: COLOR.goldDark,
    width: 18,
  },
  okrLine: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
    marginTop: 10,
    height: 0,
  },

  // Page 5 — scored 1-5 tables
  scoredRow: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  scoredLabel: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLOR.slate,
    flex: 1,
  },
  scoredScore: {
    fontFamily: FONT.heading,
    fontSize: 12,
    color: COLOR.slate,
    width: 30,
    textAlign: "right",
  },

  // Page 6 — rhythm numbered list
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
  numberedBody: {
    flex: 1,
  },
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
    fontSize: 46,
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
      <Text style={pdfStyles.eyebrow}>Good Agency Scorecard Example</Text>
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

function scoreSymbolLabel(score: ScoreSymbol): string {
  if (score === "+") return "+";
  if (score === "+-") return "+/−";
  return "−";
}

export function ScorecardExampleReport() {
  const sc = JANE_DOE_SCORECARD;

  return (
    <Document>
      {/* ---------- Page 1 — Cover ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.eyebrow}>Velocity Framework · Toolbox resource</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.coverHero}>
          <Text style={pdfStyles.eyebrow}>Hustle pillar</Text>
          <Text style={[s.coverTitle, { marginTop: 14 }]}>
            Good Agency{"\n"}Scorecard Example
          </Text>
          <Text style={s.coverSub}>
            A real team-member scorecard from the weekly operating rhythm of a
            growing service business.
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: 30 }]}>
            © 2026 Clayton Vaughan Strategies · velocityframework.com
          </Text>
        </View>
        <Footer pageNumber={1} />
      </Page>

      {/* ---------- Page 2 — Why Most Scorecards Fail ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Framework</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 22 }]}>
            Most scorecards fail. Here&rsquo;s why.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <Text style={[pdfStyles.body, { marginTop: 18 }]}>
          Clay writes in Velocity that execution is where most businesses break
          down. They set goals, they hire good people, they build plans — and
          then nothing actually gets measured at the individual level. Or worse,
          they measure the wrong things.
        </Text>
        <Text style={[pdfStyles.body, { marginTop: 10 }]}>
          A scorecard that drives Velocity isn&rsquo;t just a KPI tracker.
          It&rsquo;s a monthly conversation between a leader and a team member
          that answers four questions:
        </Text>

        <View style={{ marginTop: 12 }}>
          <NumberedQuestion
            number="01"
            heading="Are they living our values?"
            body="Hospitality, Humility, Grit. Scored honestly. A top performer who breaks culture isn't actually a top performer."
          />
          <NumberedQuestion
            number="02"
            heading="Are they in the right seat?"
            body="Do they Get It, Want It, and have the Capacity to do it? The GWC framework from EOS. If any one is missing, no amount of coaching will fix it."
          />
          <NumberedQuestion
            number="03"
            heading="Are they hitting their numbers?"
            body="OKRs and KPIs with specific targets. Red, yellow, and green thresholds so there's no ambiguity about what's working."
          />
          <NumberedQuestion
            number="04"
            heading="Are they growing in their craft?"
            body="Key responsibilities and key competencies scored 1-5. Reveals where coaching, training, or a seat change is needed."
          />
        </View>

        <View style={s.callout}>
          <Text style={s.calloutBody}>
            The scorecard on the next page is Jane Doe&rsquo;s — a real Director
            of Operations scorecard. Names are illustrative, the structure is
            real.
          </Text>
        </View>

        <Footer pageNumber={2} />
      </Page>

      {/* ---------- Page 3 — Scorecard Part 1: Identity + Values ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>
            Example · Director of Operations · Q1 2026
          </Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 22 }]}>
            Job Scorecard
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>

        <View style={s.twoCol}>
          <View style={s.colLeft}>
            <Text style={s.idLabel}>Name</Text>
            <Text style={s.idValue}>{sc.teamMemberName}</Text>

            <Text style={s.idLabel}>Date</Text>
            <Text style={s.idValue}>{sc.date}</Text>

            <Text style={s.idLabel}>Job Title</Text>
            <Text style={s.idValue}>{sc.jobTitle}</Text>

            <Text style={s.idLabel}>Job Mission Statement</Text>
            <Text style={s.missionQuote}>
              &ldquo;{sc.jobMissionStatement}&rdquo;
            </Text>
          </View>

          <View style={s.colRight}>
            <View style={s.scoringBlock}>
              <Text style={s.scoringBlockTitle}>
                For team member use only
              </Text>

              <Text style={s.scoringGroupLabel}>Core values</Text>
              {(["Hospitable", "Humble", "Grit"] as const).map((k) => (
                <View key={k} style={s.scoreRow}>
                  <Text style={s.scoreRowLabel}>{k}</Text>
                  <Text style={s.scoreRowValue}>
                    {scoreSymbolLabel(sc.selfCoreValues[k])}
                  </Text>
                </View>
              ))}

              <Text style={s.scoringGroupLabel}>GWC</Text>
              {(["Get It", "Want It", "Capacity to Do It"] as const).map((k) => (
                <View key={k} style={s.scoreRow}>
                  <Text style={s.scoreRowLabel}>{k}</Text>
                  <Text style={s.scoreRowValue}>
                    {scoreSymbolLabel(sc.selfGwc[k])}
                  </Text>
                </View>
              ))}

              <Text style={s.scoringLegend}>
                Key: + = fully lives / has it · +/− = partial · − = doesn&rsquo;t
              </Text>
            </View>
          </View>
        </View>

        <View style={s.callout}>
          <Text style={s.calloutBody}>
            Core values and GWC are scored by the team member first, then
            reviewed by the supervisor. The conversation happens where they
            disagree — that&rsquo;s where the coaching lives.
          </Text>
        </View>

        <Footer pageNumber={3} />
      </Page>

      {/* ---------- Page 4 — Scorecard Part 2: OKRs + KPIs ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>The scorecard, continued</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 22 }]}>
            OKRs and KPIs
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>

        <Text style={[s.sectionLabel, { marginTop: 20 }]}>
          Quarterly OKRs (Due {sc.okrDueDate})
        </Text>
        <View style={{ marginTop: 10 }}>
          {([1, 2, 3] as const).map((n) => (
            <View key={n} style={s.okrRow}>
              <Text style={s.okrNum}>{n}.</Text>
              <View style={{ flex: 1 }}>
                <View style={s.okrLine} />
              </View>
            </View>
          ))}
        </View>

        <Text style={[s.sectionLabel, { marginTop: 24 }]}>
          Key Performance Indicators (KPIs)
        </Text>
        <View style={{ marginTop: 8 }}>
          <View style={s.kpiTableHeaderRow}>
            <Text style={[s.kpiTableHeaderCell, { flex: 1.4 }]}>
              Desired Result
            </Text>
            <Text style={[s.kpiTableHeaderCell, { flex: 2 }]}>KPI</Text>
            <Text style={[s.kpiTableHeaderCell, { flex: 1 }]}>Green</Text>
            <Text style={[s.kpiTableHeaderCell, { flex: 1 }]}>Yellow</Text>
            <Text style={[s.kpiTableHeaderCell, { flex: 1 }]}>Red</Text>
          </View>
          {sc.kpis.map((kpi, i) => (
            <View key={i} style={s.kpiRow}>
              <Text
                style={[
                  s.kpiCell,
                  { flex: 1.4, fontFamily: FONT.heading, fontSize: 9 },
                ]}
              >
                {kpi.desiredResult}
              </Text>
              <Text style={[s.kpiCell, { flex: 2 }]}>{kpi.kpi}</Text>
              <Text style={[s.kpiCell, { flex: 1, color: COLOR.success }]}>
                {kpi.green}
              </Text>
              <Text style={[s.kpiCell, { flex: 1, color: COLOR.warning }]}>
                {kpi.yellow}
              </Text>
              <Text style={[s.kpiCell, { flex: 1, color: "#B23535" }]}>
                {kpi.red}
              </Text>
            </View>
          ))}
        </View>

        <View style={s.callout}>
          <Text style={s.calloutBody}>
            The red/yellow/green thresholds matter more than the KPI itself.
            Without them, &ldquo;good performance&rdquo; is whatever the team
            member decides it is. With them, performance is objective. Every
            month, the supervisor and team member review these together —
            numbers and next moves, no drama.
          </Text>
        </View>

        <Footer pageNumber={4} />
      </Page>

      {/* ---------- Page 5 — Scorecard Part 3: Responsibilities + Competencies + Supervisor block ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>The scorecard, continued</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 22 }]}>
            Responsibilities and Competencies
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>

        <View style={s.twoCol}>
          <View style={s.colLeft}>
            <Text style={[s.sectionLabel, { marginTop: 14 }]}>
              Key Responsibilities (scored 1–5)
            </Text>
            <View style={{ marginTop: 8 }}>
              {sc.responsibilities.map((r) => (
                <View key={r.name} style={s.scoredRow}>
                  <Text style={s.scoredLabel}>{r.name}</Text>
                  <Text style={s.scoredScore}>{r.score}</Text>
                </View>
              ))}
            </View>

            <Text style={[s.sectionLabel, { marginTop: 18 }]}>
              Key Competencies (scored 1–5)
            </Text>
            <View style={{ marginTop: 8 }}>
              {sc.competencies.map((c) => (
                <View key={c.name} style={s.scoredRow}>
                  <Text style={s.scoredLabel}>{c.name}</Text>
                  <Text style={s.scoredScore}>{c.score}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.colRight}>
            <View style={s.scoringBlock}>
              <Text style={s.scoringBlockTitle}>
                For supervisor use only
              </Text>

              <Text style={s.scoringGroupLabel}>
                Supervisor&rsquo;s assessment — Core values
              </Text>
              {(
                [
                  ["Hospitable", sc.supervisorCoreValues.Hospitable],
                  ["Humble", sc.supervisorCoreValues.Humble],
                  ["Hustle (Grit)", sc.supervisorCoreValues.Grit],
                ] as const
              ).map(([label, score]) => (
                <View key={label} style={s.scoreRow}>
                  <Text style={s.scoreRowLabel}>{label}</Text>
                  <Text style={s.scoreRowValue}>{scoreSymbolLabel(score)}</Text>
                </View>
              ))}

              <Text style={s.scoringGroupLabel}>
                Supervisor&rsquo;s assessment — GWC
              </Text>
              {(["Get It", "Want It", "Capacity to Do It"] as const).map((k) => (
                <View key={k} style={s.scoreRow}>
                  <Text style={s.scoreRowLabel}>{k}</Text>
                  <Text style={s.scoreRowValue}>
                    {scoreSymbolLabel(sc.supervisorGwc[k])}
                  </Text>
                </View>
              ))}

              <Text style={s.scoringLegend}>
                Scored after the team member, then reviewed together.
              </Text>
            </View>
          </View>
        </View>

        <View style={s.callout}>
          <Text style={s.calloutBody}>
            The difference between the team member&rsquo;s self-scores and the
            supervisor&rsquo;s scores is the most valuable conversation in the
            whole document. Big gaps reveal blind spots — on either side. Small
            gaps reveal alignment.
          </Text>
        </View>

        <Footer pageNumber={5} />
      </Page>

      {/* ---------- Page 6 — The Rhythm (monthly, NOT weekly) ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Cadence</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 26 }]}>
            The rhythm.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>

        <Text style={[pdfStyles.body, { marginTop: 18, maxWidth: 480 }]}>
          A scorecard that sits in a Google Doc and gets reviewed quarterly is a
          file. A scorecard that drives Velocity is a monthly conversation that
          holds the weekly numbers accountable.
        </Text>

        <View style={{ marginTop: 16 }}>
          <NumberedStep
            number="01"
            heading="Every week — The numbers update (5 minutes, self-serve)"
            body="The team member updates the KPI numbers on their scorecard each week. Red, yellow, or green — no narrative, just the numbers. This takes five minutes and creates the trail the monthly review will read."
          />
          <NumberedStep
            number="02"
            heading="Every month — 1:1 Scorecard Review (45 minutes)"
            body={`The supervisor sits down with the team member. Start with the numbers from the last four weeks — what's trending green, what's slipping yellow, what's gone red. Then GWC and values. Then the two questions that matter most: "What do you need from me this month?" and "What am I missing?"`}
          />
          <NumberedStep
            number="03"
            heading="Every quarter — Full recalibration (90 minutes)"
            body="The whole scorecard gets refreshed. OKRs reset. KPIs re-examined for whether they're still the right metrics. Responsibilities and competencies re-scored. This is where seat changes, role expansions, and succession conversations happen."
          />
        </View>

        <View style={s.callout}>
          <Text style={s.calloutBody}>
            The monthly rhythm is what makes it real. Without it, the scorecard
            becomes a file. With it, it becomes the leadership tool that turns
            expectations into accountability.
          </Text>
        </View>

        <Footer pageNumber={6} />
      </Page>

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
            heading="Start with the Job Mission Statement"
            body={`One sentence. Present tense. "I am responsible for…" Name the outcome, not the activity. If the team member can't recite it from memory by week two, it's too long.`}
          />
          <NumberedStep
            number="02"
            heading="Pick 3–5 KPIs per role"
            body="No more. Same principle as the dashboard: when everything is important, nothing is. Each KPI needs a clear green/yellow/red threshold. If you can't set a threshold, you don't understand the KPI well enough yet."
          />
          <NumberedStep
            number="03"
            heading="Score values and GWC honestly — both directions"
            body="Self-assessment plus supervisor assessment. The point isn't the score, it's the conversation about the gap between them. That's where real coaching happens."
          />
          <NumberedStep
            number="04"
            heading="Update weekly. Review monthly. Recalibrate quarterly. Never skip."
            body="The scorecard without the cadence is just paperwork. The cadence is the product. Every leader is tempted to skip the monthly review when things get busy. That's exactly when skipping costs the most."
          />
        </View>

        <View style={s.callout}>
          <Text style={s.calloutBody}>
            Your first scorecard will be wrong. The metrics will be off, the
            responsibilities will need tightening, the thresholds will need
            recalibration. That&rsquo;s fine. What matters is that you start —
            and then you review it monthly. By quarter three, you&rsquo;ll have
            the scorecard your business actually needed all along.
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
          Accountability is{"\n"}love at scale.
        </Text>
        <View style={{ ...pdfStyles.goldRule, marginTop: 18 }} />
        <Text style={s.closingSub}>
          The scorecard is the tool. The cadence is the discipline. Keep both,
          and expectations turn into accountability — without drama.
        </Text>

        <View style={s.ctaRow}>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>01</Text>
            <Text style={s.ctaTitle}>
              Build your Leadership Accountability Map
            </Text>
            <Text style={s.ctaBody}>
              Every scorecard starts with a seat. Name every seat in your
              business first — who owns what, what each mission is.
            </Text>
            <Text style={s.ctaUrl}>
              velocityframework.com/leadership-accountability-map
            </Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>02</Text>
            <Text style={s.ctaTitle}>Pull more tools from the Toolbox</Text>
            <Text style={s.ctaBody}>
              Every resource from Velocity is free. Pull the ones that fit your
              stage and use them at your next leadership meeting.
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
          You can&rsquo;t scale what you don&rsquo;t measure. And you
          can&rsquo;t measure what you don&rsquo;t name.
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
// Helpers
// ---------------------------------------------------------------------------

function NumberedQuestion({
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
