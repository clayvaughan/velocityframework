/**
 * Culture Health Check — individual-mode PDF report.
 * 6 pages:
 *   1. Cover
 *   2. Overall score
 *   3. Five-dimension breakdown
 *   4. Recommended next steps
 *   5. Facilitator guide (using this with your leadership team)
 *   6. Toolbox + workshop CTA
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { DIMENSION_LABEL, DIMENSION_TAGLINE } from "../quiz/questions";
import { DIMENSION_COPY, TIER_LABEL, TIER_OVERALL, type Tier } from "../quiz/copy";
import type { DimensionScore } from "../quiz/scoring";
import type { DimensionRecommendation } from "../quiz/recommendations";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";
import { FACILITATOR_GUIDE } from "../quiz/facilitator-guide";
import { ClosingPage } from "./ClosingPage";

registerFonts();

const s = StyleSheet.create({
  coverWrap: {
    flex: 1,
    justifyContent: "space-between",
  },
  coverTop: {
    marginTop: 40,
  },
  coverHero: {
    marginTop: 120,
  },
  coverTitle: {
    ...pdfStyles.display,
    fontSize: 52,
    lineHeight: 0.95,
  },
  coverSub: {
    ...pdfStyles.h2,
    color: COLOR.goldDark,
    marginTop: 18,
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
  score: {
    ...pdfStyles.display,
    fontSize: 84,
    lineHeight: 0.9,
  },
  dimRow: {
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  dimHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dimName: {
    ...pdfStyles.h3,
    flex: 1,
  },
  dimScore: {
    fontFamily: FONT.display,
    fontSize: 22,
    letterSpacing: 1.5,
    color: COLOR.slate,
  },
  dimBarTrack: {
    height: 4,
    backgroundColor: COLOR.border,
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 10,
  },
  dimBarFill: {
    height: 4,
    borderRadius: 2,
  },
  dimTagline: {
    ...pdfStyles.muted,
    marginTop: 2,
  },
  nextStep: {
    marginTop: 8,
    padding: 10,
    backgroundColor: COLOR.creamSoft,
    borderRadius: 4,
  },
});

const TIER_FILL_COLOR: Record<Tier, string> = {
  healthy: COLOR.success,
  at_risk: COLOR.warning,
  critical: COLOR.gold,
};

type Props = {
  firstName: string;
  completedAt: Date;
  overall_score: number;
  overall_tier: Tier;
  dimension_scores: DimensionScore[];
  recommendations: DimensionRecommendation[];
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
      <Text style={pdfStyles.eyebrow}>Culture Health Check</Text>
    </View>
  );
}

function Footer({ pageLabel }: { pageLabel: string }) {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text>© 2026 Clayton Vaughan Strategies</Text>
      <Text>{pageLabel}</Text>
      <Text>velocityframework.com</Text>
    </View>
  );
}

export function IndividualReport({
  firstName,
  completedAt,
  overall_score,
  overall_tier,
  dimension_scores,
  recommendations,
}: Props) {
  const tierOverall = TIER_OVERALL[overall_tier];
  const dateStr = completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      {/* ---------- Page 1 — Cover ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <View style={s.coverWrap}>
          <View>
            <Text style={pdfStyles.eyebrow}>Velocity Framework</Text>
            <View style={pdfStyles.goldRule} />
          </View>
          <View style={s.coverHero}>
            <Text style={pdfStyles.eyebrow}>Culture Health Check</Text>
            <Text style={[s.coverTitle, { marginTop: 14 }]}>
              Results for {firstName}
            </Text>
            <Text style={s.coverSub}>
              {TIER_LABEL[overall_tier]} · {overall_score} / 100
            </Text>
            <Text style={[pdfStyles.muted, { marginTop: 30 }]}>
              Completed {dateStr}
            </Text>
          </View>
          <Text style={pdfStyles.muted}>
            velocityframework.com/health-survey
          </Text>
        </View>
        <Footer pageLabel="Page 1 of 6" />
      </Page>

      {/* ---------- Page 2 — Overall score ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 48 }}>
          <Text style={pdfStyles.eyebrow}>Overall score</Text>
          <View
            style={[
              s.tierBadge,
              { backgroundColor: TIER_FILL_COLOR[overall_tier], marginTop: 10 },
            ]}
          >
            <Text>{TIER_LABEL[overall_tier]}</Text>
          </View>
          <Text style={[s.score, { marginTop: 16 }]}>{overall_score}</Text>
          <Text style={[pdfStyles.muted, { marginTop: -4 }]}>
            / 100 overall culture score
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
        <Footer pageLabel="Page 2 of 6" />
      </Page>

      {/* ---------- Page 3 — Five-dimension breakdown ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 32 }}>
          <Text style={pdfStyles.eyebrow}>Five dimensions</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            Where culture is strong, where it's at risk
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          {dimension_scores.map((d) => {
            const copy = DIMENSION_COPY[d.dimension][d.tier];
            return (
              <View key={d.dimension} style={s.dimRow}>
                <View style={s.dimHeader}>
                  <Text style={s.dimName}>
                    {DIMENSION_LABEL[d.dimension]} · {TIER_LABEL[d.tier]}
                  </Text>
                  <Text style={s.dimScore}>{d.subscore}</Text>
                </View>
                <Text style={s.dimTagline}>
                  {DIMENSION_TAGLINE[d.dimension]}
                </Text>
                <View style={s.dimBarTrack}>
                  <View
                    style={[
                      s.dimBarFill,
                      {
                        width: `${d.subscore}%`,
                        backgroundColor: TIER_FILL_COLOR[d.tier],
                      },
                    ]}
                  />
                </View>
                <Text style={[pdfStyles.body, { fontSize: 9.5 }]}>
                  {copy.interpretation}
                </Text>
              </View>
            );
          })}
        </View>
        <Footer pageLabel="Page 3 of 6" />
      </Page>

      {/* ---------- Page 4 — Recommended next steps ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 32 }}>
          <Text style={pdfStyles.eyebrow}>Recommended next steps</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            What to do in the next 30 days
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          {dimension_scores.map((d) => {
            const copy = DIMENSION_COPY[d.dimension][d.tier];
            return (
              <View
                key={d.dimension}
                style={{
                  marginBottom: 16,
                  padding: 14,
                  backgroundColor: "#FFFFFF",
                  borderLeftWidth: 3,
                  borderLeftColor: TIER_FILL_COLOR[d.tier],
                }}
              >
                <Text style={pdfStyles.h3}>
                  {DIMENSION_LABEL[d.dimension]}
                </Text>
                <Text style={[pdfStyles.body, { marginTop: 6 }]}>
                  {copy.nextStep}
                </Text>
              </View>
            );
          })}
        </View>
        {recommendations.length > 0 ? (
          <View style={{ marginTop: 16 }}>
            <Text style={pdfStyles.eyebrow}>Recommended downloads</Text>
            {recommendations.map(({ resource }) => (
              <Text
                key={resource.slug}
                style={[pdfStyles.body, { marginTop: 4 }]}
              >
                • {resource.title} —
                velocityframework.com/toolbox/{resource.slug}
              </Text>
            ))}
          </View>
        ) : null}
        <Footer pageLabel="Page 4 of 6" />
      </Page>

      {/* ---------- Page 5 — Facilitator guide ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 32 }}>
          <Text style={pdfStyles.eyebrow}>Facilitator guide</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            How to use this with your leadership team
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
        <Footer pageLabel="Page 5 of 6" />
      </Page>

      {/* ---------- Page 6 — Close: "You've named it. Now move." ---------- */}
      <ClosingPage pageLabel="Page 6 of 6" />
    </Document>
  );
}
