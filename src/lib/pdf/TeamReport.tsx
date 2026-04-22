/**
 * Culture Health Check — team-mode PDF report.
 * 7 pages: cover, aggregate score, five-dimension averages, variance, next
 * steps, facilitator guide, CTA.
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { DIMENSION_LABEL } from "../quiz/questions";
import { DIMENSION_COPY, TIER_LABEL, TIER_OVERALL, type Tier } from "../quiz/copy";
import type { TeamAggregate } from "../quiz/scoring";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";
import { FACILITATOR_GUIDE } from "../quiz/facilitator-guide";
import { ClosingPage } from "./ClosingPage";

registerFonts();

const s = StyleSheet.create({
  coverHero: { marginTop: 120 },
  coverTitle: {
    ...pdfStyles.display,
    fontSize: 48,
    lineHeight: 0.95,
  },
  tierBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    fontFamily: FONT.heading,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  score: { ...pdfStyles.display, fontSize: 84, lineHeight: 0.9 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  varianceCard: {
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
});

const TIER_FILL_COLOR: Record<Tier, string> = {
  healthy: COLOR.success,
  at_risk: COLOR.warning,
  critical: COLOR.gold,
};

type Props = {
  teamName?: string | null;
  ownerFirstName: string;
  completedAt: Date;
  aggregate: TeamAggregate;
};

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
      <Text style={pdfStyles.eyebrow}>Team Culture Health Check</Text>
    </View>
  );
}

function Footer({ label }: { label: string }) {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text>© 2026 Clayton Vaughan Strategies</Text>
      <Text>{label}</Text>
      <Text>velocityframework.com</Text>
    </View>
  );
}

export function TeamReport({
  teamName,
  ownerFirstName,
  completedAt,
  aggregate,
}: Props) {
  const tier = aggregate.meanOverallTier;
  const tierOverall = TIER_OVERALL[tier];
  const dateStr = completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const topVariance = aggregate.highVarianceDimensions.slice(0, 3);

  return (
    <Document>
      {/* ---------- Page 1 — Cover ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.eyebrow}>Velocity Framework</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.coverHero}>
          <Text style={pdfStyles.eyebrow}>Team Culture Health Check</Text>
          <Text style={[s.coverTitle, { marginTop: 14 }]}>
            {teamName ?? `${ownerFirstName}'s team`}
          </Text>
          <Text style={{ ...pdfStyles.h2, color: COLOR.goldDark, marginTop: 16 }}>
            {TIER_LABEL[tier]} · {aggregate.meanOverallScore} / 100
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: 24 }]}>
            {aggregate.respondentCount} anonymous responses · completed {dateStr}
          </Text>
        </View>
        <Footer label="Page 1 of 7" />
      </Page>

      {/* ---------- Page 2 — Aggregate score ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 48 }}>
          <Text style={pdfStyles.eyebrow}>Team aggregate</Text>
          <View
            style={[
              s.tierBadge,
              { backgroundColor: TIER_FILL_COLOR[tier], marginTop: 10 },
            ]}
          >
            <Text>{TIER_LABEL[tier]}</Text>
          </View>
          <Text style={[s.score, { marginTop: 16 }]}>
            {aggregate.meanOverallScore}
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: -4 }]}>
            / 100 mean overall score · {aggregate.respondentCount} responses
          </Text>
        </View>
        <View style={{ marginTop: 40, maxWidth: 440 }}>
          <Text style={[pdfStyles.h2, { fontSize: 20 }]}>
            {tierOverall.headline}
          </Text>
          <View style={pdfStyles.goldRule} />
          <Text style={[pdfStyles.body, { marginTop: 20 }]}>
            {tierOverall.body}
          </Text>
        </View>
        <Footer label="Page 2 of 7" />
      </Page>

      {/* ---------- Page 3 — Five-dimension averages ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 32 }}>
          <Text style={pdfStyles.eyebrow}>Five dimensions</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>Team averages</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          {aggregate.dimensionAggregates.map((d) => (
            <View key={d.dimension} style={s.row}>
              <Text style={{ ...pdfStyles.h3, flex: 1 }}>
                {DIMENSION_LABEL[d.dimension]}
              </Text>
              <Text
                style={{
                  fontFamily: FONT.heading,
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: TIER_FILL_COLOR[d.tier],
                  marginRight: 18,
                }}
              >
                {TIER_LABEL[d.tier]}
              </Text>
              <Text
                style={{
                  fontFamily: FONT.display,
                  fontSize: 22,
                  letterSpacing: 1.5,
                  color: COLOR.slate,
                  width: 50,
                  textAlign: "right",
                }}
              >
                {d.meanSubscore}
              </Text>
            </View>
          ))}
        </View>
        <Footer label="Page 3 of 7" />
      </Page>

      {/* ---------- Page 4 — Variance (where the team disagrees most) ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 32 }}>
          <Text style={pdfStyles.eyebrow}>Variance — where your team disagrees most</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            The conversation worth having
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <Text style={[pdfStyles.body, { marginTop: 18, maxWidth: 480 }]}>
          When a team agrees strongly on a dimension, it means they share a
          view of how culture works there — good or bad. When variance is
          high, they don't. High-variance dimensions are where the most
          important leadership conversation lives.
        </Text>
        <View style={{ marginTop: 18 }}>
          {topVariance.map((d, i) => (
            <View key={d.dimension} style={s.varianceCard}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={pdfStyles.h3}>
                  #{i + 1}. {DIMENSION_LABEL[d.dimension]}
                </Text>
                <Text style={{ ...pdfStyles.muted, fontSize: 9 }}>
                  SD {d.answerStdDev}
                </Text>
              </View>
              <Text style={[pdfStyles.body, { fontSize: 9.5, marginTop: 8 }]}>
                Mean subscore {d.meanSubscore} · team tier {TIER_LABEL[d.tier]}.
                High answer variance here means your people don't agree on
                whether this dimension is working — the gap itself is the
                diagnostic signal.
              </Text>
            </View>
          ))}
        </View>
        <Footer label="Page 4 of 7" />
      </Page>

      {/* ---------- Page 5 — Recommended next steps ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 32 }}>
          <Text style={pdfStyles.eyebrow}>Recommended next steps</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            Where to put your next 30 days
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          {aggregate.dimensionAggregates.map((d) => {
            const copy = DIMENSION_COPY[d.dimension][d.tier];
            return (
              <View
                key={d.dimension}
                style={{
                  marginBottom: 14,
                  padding: 12,
                  backgroundColor: "#FFFFFF",
                  borderLeftWidth: 3,
                  borderLeftColor: TIER_FILL_COLOR[d.tier],
                }}
              >
                <Text style={pdfStyles.h3}>{DIMENSION_LABEL[d.dimension]}</Text>
                <Text style={[pdfStyles.body, { marginTop: 6, fontSize: 9.5 }]}>
                  {copy.nextStep}
                </Text>
              </View>
            );
          })}
        </View>
        <Footer label="Page 5 of 7" />
      </Page>

      {/* ---------- Page 6 — Team facilitator guide ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 32 }}>
          <Text style={pdfStyles.eyebrow}>Facilitator guide</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            Running the conversation with your team
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <Text style={[pdfStyles.body, { marginTop: 18 }]}>
          {FACILITATOR_GUIDE.intro}
        </Text>
        {FACILITATOR_GUIDE.sections.map((section) => (
          <View key={section.heading} style={{ marginTop: 18 }}>
            <Text style={pdfStyles.h3}>{section.heading}</Text>
            <Text style={[pdfStyles.body, { marginTop: 6 }]}>
              {section.body}
            </Text>
            {"questions" in section && section.questions ? (
              <View style={{ marginTop: 8 }}>
                {section.questions.map((q, i) => (
                  <Text
                    key={i}
                    style={[pdfStyles.body, { fontSize: 9.5, marginTop: 3 }]}
                  >
                    {i + 1}. {q}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        ))}
        <Footer label="Page 6 of 7" />
      </Page>

      {/* ---------- Page 7 — Close: "You've named it. Now move." ---------- */}
      <ClosingPage pageLabel="Page 7 of 7" />
    </Document>
  );
}
