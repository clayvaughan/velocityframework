/**
 * Culture Action Plan — 5-page PDF report.
 *   1. Cover
 *   2. Plan at a glance
 *   3. Focus area deep dives (multiple focus areas share this page or spill)
 *   4. Accountability & cadence
 *   5. Next steps & resources
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";
import { TOXINS_BY_ID } from "@/lib/action-plan/toxins";
import { VIRTUES_BY_ID } from "@/lib/action-plan/virtues";
import type { ResolvedFocusArea } from "@/lib/action-plan/email-drafts";

registerFonts();

const s = StyleSheet.create({
  coverHero: { marginTop: 120 },
  coverTitle: {
    ...pdfStyles.display,
    fontSize: 48,
    lineHeight: 0.95,
  },
  focusCard: {
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  body: {
    ...pdfStyles.body,
    fontSize: 10,
  },
});

type Props = {
  firstName: string;
  reassessmentDays: 30 | 60 | 90;
  reassessmentDate: Date;
  focusAreas: ResolvedFocusArea[];
  accountabilityPartnerName: string | null;
  weeklyCheckInLabel: string;
  planUrl: string;
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
      <Text style={pdfStyles.eyebrow}>Culture Action Plan</Text>
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

export function ActionPlanReport({
  firstName,
  reassessmentDays,
  reassessmentDate,
  focusAreas,
  accountabilityPartnerName,
  weeklyCheckInLabel,
  planUrl,
}: Props) {
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const reassessmentStr = reassessmentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      {/* ---------- Page 1 — Cover ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.eyebrow}>Velocity Framework</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.coverHero}>
          <Text style={pdfStyles.eyebrow}>Culture Action Plan</Text>
          <Text style={[s.coverTitle, { marginTop: 14 }]}>
            {firstName}'s {reassessmentDays}-day plan
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: 24 }]}>
            Created {dateStr} · Reassessment {reassessmentStr}
          </Text>
        </View>
        <Footer label="Page 1 of 5" />
      </Page>

      {/* ---------- Page 2 — Plan at a glance ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>At a glance</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            The next {reassessmentDays} days
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 18 }}>
          {focusAreas.map((f, i) => {
            const toxin = TOXINS_BY_ID[f.toxinId];
            const virtue = f.virtueId ? VIRTUES_BY_ID[f.virtueId] : null;
            return (
              <View key={i} style={s.focusCard}>
                <View style={s.row}>
                  <Text style={s.label}>Focus area {i + 1}</Text>
                  {virtue ? (
                    <Text style={s.label}>Building {virtue.title}</Text>
                  ) : null}
                </View>
                <Text
                  style={{
                    ...pdfStyles.h3,
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {toxin.title}
                </Text>
                <Text style={[s.body, { marginTop: 4, color: COLOR.mutedText }]}>
                  {toxin.description}
                </Text>
                <View
                  style={{ marginTop: 10, borderTopWidth: 0.5, borderTopColor: COLOR.border, paddingTop: 8 }}
                >
                  <Text style={s.label}>7-day action</Text>
                  <Text style={[s.body, { marginTop: 2 }]}>
                    {f.sevenDayAction}
                  </Text>
                  <Text style={[s.label, { marginTop: 8 }]}>Weekly rhythm</Text>
                  <Text style={[s.body, { marginTop: 2 }]}>
                    {f.weeklyRhythmLabel}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <Footer label="Page 2 of 5" />
      </Page>

      {/* ---------- Page 3 — Focus-area deep dives ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Focus area deep dives</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            The counter-move for each toxin
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 18 }}>
          {focusAreas.map((f, i) => {
            const toxin = TOXINS_BY_ID[f.toxinId];
            return (
              <View
                key={i}
                style={{
                  marginBottom: 14,
                  padding: 14,
                  backgroundColor: "#FFFFFF",
                  borderLeftWidth: 3,
                  borderLeftColor: COLOR.gold,
                }}
              >
                <Text style={s.label}>
                  Focus area {i + 1} · {toxin.title}
                </Text>
                <Text style={[pdfStyles.h3, { fontSize: 12, marginTop: 4 }]}>
                  Counter-move
                </Text>
                <Text style={[s.body, { marginTop: 2 }]}>
                  {f.counterMoveText}
                </Text>
                <Text style={[s.label, { marginTop: 8 }]}>
                  What success looks like
                </Text>
                <Text
                  style={[s.body, { marginTop: 2, color: COLOR.mutedText }]}
                >
                  This is the behavioral definition you'll track against over
                  the next {reassessmentDays} days.
                </Text>
              </View>
            );
          })}
        </View>
        <Footer label="Page 3 of 5" />
      </Page>

      {/* ---------- Page 4 — Accountability & cadence ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Accountability &amp; cadence</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            How you'll stay on this
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 18 }}>
          <View style={s.focusCard}>
            <Text style={s.label}>Accountability partner</Text>
            <Text style={[pdfStyles.h3, { fontSize: 12, marginTop: 4 }]}>
              {accountabilityPartnerName ?? "Not yet named"}
            </Text>
            <Text style={[s.body, { marginTop: 6, color: COLOR.mutedText }]}>
              Someone outside your organization who will ask if you did the
              thing you said you'd do. The relationship only works if they are
              empowered to tell you hard truths.
            </Text>
          </View>
          <View style={s.focusCard}>
            <Text style={s.label}>Weekly check-in</Text>
            <Text style={[pdfStyles.h3, { fontSize: 12, marginTop: 4 }]}>
              {weeklyCheckInLabel}
            </Text>
            <Text style={[s.body, { marginTop: 6, color: COLOR.mutedText }]}>
              Set this on your calendar. Do not let it slip. Week 2 of this plan
              is where most culture work dies.
            </Text>
          </View>
          <View style={s.focusCard}>
            <Text style={s.label}>Reassessment</Text>
            <Text style={[pdfStyles.h3, { fontSize: 12, marginTop: 4 }]}>
              {reassessmentStr} ({reassessmentDays}-day)
            </Text>
            <Text style={[s.body, { marginTop: 6, color: COLOR.mutedText }]}>
              Open your review page that day: {planUrl.replace("/saved/", "/review/")}.
              Mark each commitment honestly — yes, partially, no, or not yet —
              then plan the next cycle.
            </Text>
          </View>
        </View>
        <Footer label="Page 4 of 5" />
      </Page>

      {/* ---------- Page 5 — Next steps & CTAs ---------- */}
      <Page size="LETTER" style={pdfStyles.pageDark}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Text
            style={{ ...pdfStyles.display, fontSize: 14, color: COLOR.cream }}
          >
            Velocity
          </Text>
          <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold }}>
            Next steps
          </Text>
        </View>
        <View style={{ marginTop: 80 }}>
          <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold }}>
            Go deeper
          </Text>
          <Text
            style={[
              pdfStyles.display,
              { fontSize: 40, color: COLOR.cream, marginTop: 12 },
            ]}
          >
            Tools for the{"\n"}next {reassessmentDays} days.
          </Text>
          <View style={{ ...pdfStyles.goldRule, marginTop: 16 }} />
          <Text
            style={{
              ...pdfStyles.body,
              color: COLOR.cream,
              opacity: 0.85,
              marginTop: 20,
              maxWidth: 440,
            }}
          >
            Every resource referenced in the Heart section of Velocity is free
            on velocityframework.com/toolbox. The ones most relevant to this
            plan are surfaced in your web results — open them alongside your
            weekly check-in.
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold }}>
            FRE Certification Workshop
          </Text>
          <Text
            style={[
              pdfStyles.h2,
              { color: COLOR.cream, fontSize: 20, marginTop: 8 },
            ]}
          >
            Want help running this inside a client business?
          </Text>
          <Text
            style={{
              ...pdfStyles.body,
              color: COLOR.cream,
              opacity: 0.85,
              marginTop: 12,
              maxWidth: 440,
            }}
          >
            Two days in Austin with Clay Vaughan and Luke Frazier. Twelve seats.
            Apply at velocityframework.com/workshop.
          </Text>
        </View>
        <View
          style={[pdfStyles.footer, { color: COLOR.cream, opacity: 0.6 }]}
          fixed
        >
          <Text>© 2026 Clayton Vaughan Strategies</Text>
          <Text>Page 5 of 5</Text>
          <Text>velocityframework.com</Text>
        </View>
      </Page>
    </Document>
  );
}
