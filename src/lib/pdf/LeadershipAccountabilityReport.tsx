/**
 * Leadership Accountability Map — multi-page PDF report.
 *
 * Structure:
 *   1. Cover
 *   2. Summary table (1 row per role)
 *   3..N. One page per role (mission, responsibilities, accountable to)
 *   Second-to-last: Reflection rhythm
 *   Final: Closing page
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";

registerFonts();

export type AccountabilityRoleForPdf = {
  position: number;
  roleName: string;
  ownerName: string | null;
  missionStatement: string | null;
  responsibilities: (string | null)[];
  accountableTo: string | null;
  isCustom: boolean;
};

type Props = {
  firstName: string;
  companyName: string;
  completedAt: Date;
  roles: AccountabilityRoleForPdf[];
  reflectionDate1: string | null;
  reflectionDate2: string | null;
  reflectionDate3: string | null;
  reflectionQuestion: string;
};

const s = StyleSheet.create({
  coverHero: { marginTop: 120 },
  coverTitle: { ...pdfStyles.display, fontSize: 44, lineHeight: 0.95 },
  coverSub: { ...pdfStyles.h2, color: COLOR.goldDark, marginTop: 18 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLOR.slate,
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableHeaderCell: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  tableCell: {
    fontFamily: FONT.body,
    fontSize: 9,
    lineHeight: 1.45,
    color: COLOR.slate,
    paddingRight: 8,
  },
  missionBlock: {
    marginTop: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
    backgroundColor: "#FFFFFF",
  },
  missionLabel: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  missionBody: {
    fontFamily: FONT.body,
    fontStyle: "italic",
    fontSize: 12,
    lineHeight: 1.5,
    color: COLOR.slate,
    marginTop: 8,
  },
  roleMetaRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 16,
  },
  roleMetaCell: { flex: 1 },
  roleMetaLabel: {
    fontFamily: FONT.heading,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  roleMetaBody: {
    fontFamily: FONT.body,
    fontSize: 11,
    color: COLOR.slate,
    marginTop: 4,
  },
  responsibilityRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 10,
  },
  responsibilityNum: {
    fontFamily: FONT.heading,
    fontSize: 9,
    color: COLOR.goldDark,
    width: 16,
  },
  responsibilityText: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.5,
    color: COLOR.slate,
    flex: 1,
  },
  reflectionCard: {
    marginTop: 14,
    padding: 16,
    borderLeftWidth: 2,
    borderLeftColor: COLOR.gold,
    backgroundColor: "#FFFFFF",
  },
  reflectionDateLabel: {
    fontFamily: FONT.heading,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  reflectionDate: {
    fontFamily: FONT.display,
    fontSize: 22,
    letterSpacing: 1.5,
    color: COLOR.slate,
    marginTop: 4,
  },
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
  ctaNumber: { fontFamily: FONT.heading, fontSize: 9, letterSpacing: 2, color: COLOR.gold },
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
      <Text style={pdfStyles.eyebrow}>Leadership Accountability Map</Text>
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

function firstSentence(text: string | null): string {
  if (!text) return "";
  const m = text.trim().match(/^[^.!?]+[.!?]/);
  return (m?.[0] ?? text).trim();
}

function formatDate(iso: string | null): string {
  if (!iso) return "Not yet set";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Not yet set";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function LeadershipAccountabilityReport({
  firstName,
  companyName,
  completedAt,
  roles,
  reflectionDate1,
  reflectionDate2,
  reflectionDate3,
  reflectionQuestion,
}: Props) {
  const dateStr = completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalPages = 2 + roles.length + 1 + 1; // cover + summary + N roles + rhythm + closing
  let pageNum = 0;
  const nextLabel = () => {
    pageNum += 1;
    return `Page ${pageNum} of ${totalPages}`;
  };

  return (
    <Document>
      {/* ---------- Page 1 — Cover ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.eyebrow}>Velocity Framework · Heart Pillar</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.coverHero}>
          <Text style={pdfStyles.eyebrow}>Leadership Accountability Map</Text>
          <Text style={[s.coverTitle, { marginTop: 14 }]}>{companyName}</Text>
          <Text style={s.coverSub}>
            {roles.length} {roles.length === 1 ? "seat" : "seats"} defined
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: 24 }]}>
            Prepared by {firstName} · {dateStr}
          </Text>
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 2 — Summary table ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>At a glance</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            Every seat on your map
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={s.tableHeaderRow}>
            <Text style={[s.tableHeaderCell, { flex: 1.3 }]}>Role</Text>
            <Text style={[s.tableHeaderCell, { flex: 1 }]}>Owner</Text>
            <Text style={[s.tableHeaderCell, { flex: 2 }]}>Mission</Text>
            <Text style={[s.tableHeaderCell, { flex: 1 }]}>Accountable to</Text>
          </View>
          {roles.map((r) => (
            <View key={r.position} style={s.tableRow}>
              <Text style={[s.tableCell, { flex: 1.3, fontFamily: FONT.heading }]}>
                {r.roleName}
              </Text>
              <Text style={[s.tableCell, { flex: 1 }]}>
                {r.ownerName && r.ownerName.trim().length > 0
                  ? r.ownerName
                  : "—"}
              </Text>
              <Text style={[s.tableCell, { flex: 2 }]}>
                {firstSentence(r.missionStatement) || "—"}
              </Text>
              <Text style={[s.tableCell, { flex: 1 }]}>
                {r.accountableTo && r.accountableTo.trim().length > 0
                  ? r.accountableTo
                  : "—"}
              </Text>
            </View>
          ))}
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- One page per role ---------- */}
      {roles.map((r) => (
        <Page key={r.position} size="LETTER" style={pdfStyles.page}>
          <Header />
          <View style={{ marginTop: 28 }}>
            <Text style={pdfStyles.eyebrow}>
              Seat #{r.position}
              {r.isCustom ? " · Custom" : ""}
            </Text>
            <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 26 }]}>
              {r.roleName}
            </Text>
            <View style={pdfStyles.goldRule} />
          </View>

          <View style={s.missionBlock}>
            <Text style={s.missionLabel}>Job Mission Statement</Text>
            <Text style={s.missionBody}>
              {r.missionStatement && r.missionStatement.trim().length > 0
                ? `"${r.missionStatement}"`
                : "Mission not yet defined."}
            </Text>
          </View>

          <View style={s.roleMetaRow}>
            <View style={s.roleMetaCell}>
              <Text style={s.roleMetaLabel}>Owner</Text>
              <Text style={s.roleMetaBody}>
                {r.ownerName && r.ownerName.trim().length > 0
                  ? r.ownerName
                  : "(Open seat)"}
              </Text>
            </View>
            <View style={s.roleMetaCell}>
              <Text style={s.roleMetaLabel}>Accountable to</Text>
              <Text style={s.roleMetaBody}>
                {r.accountableTo && r.accountableTo.trim().length > 0
                  ? r.accountableTo
                  : "—"}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <Text style={pdfStyles.eyebrow}>Key responsibilities</Text>
            <View style={{ marginTop: 10 }}>
              {r.responsibilities
                .map((text, i) => ({ text, i }))
                .filter((x) => x.text && x.text.trim().length > 0)
                .map((x) => (
                  <View key={x.i} style={s.responsibilityRow}>
                    <Text style={s.responsibilityNum}>
                      {String(x.i + 1).padStart(2, "0")}
                    </Text>
                    <Text style={s.responsibilityText}>{x.text}</Text>
                  </View>
                ))}
            </View>
          </View>

          <View style={{ marginTop: 18 }}>
            <Text style={pdfStyles.eyebrow}>Reflection question</Text>
            <Text style={[pdfStyles.muted, { marginTop: 6, fontStyle: "italic" }]}>
              {reflectionQuestion}
            </Text>
          </View>

          <Footer label={nextLabel()} />
        </Page>
      ))}

      {/* ---------- Reflection rhythm page ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Reflection Rhythm</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            Every 90 days, revisit the map
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <Text
          style={[pdfStyles.body, { marginTop: 18, maxWidth: 460 }]}
        >
          An accountability map that never gets reviewed is just an org chart.
          At each reflection date, your leadership team reviews this map
          together. Ask the reflection question for every seat. Update the map
          if anything has changed. The map is a living document — not a file.
        </Text>
        <View style={s.reflectionCard}>
          <Text style={s.reflectionDateLabel}>First reflection</Text>
          <Text style={s.reflectionDate}>{formatDate(reflectionDate1)}</Text>
        </View>
        <View style={s.reflectionCard}>
          <Text style={s.reflectionDateLabel}>Second reflection</Text>
          <Text style={s.reflectionDate}>{formatDate(reflectionDate2)}</Text>
        </View>
        <View style={s.reflectionCard}>
          <Text style={s.reflectionDateLabel}>Third reflection</Text>
          <Text style={s.reflectionDate}>{formatDate(reflectionDate3)}</Text>
        </View>
        <View style={{ marginTop: 18 }}>
          <Text style={pdfStyles.eyebrow}>Your reflection question</Text>
          <Text
            style={[
              pdfStyles.body,
              { fontStyle: "italic", marginTop: 6, maxWidth: 460 },
            ]}
          >
            &ldquo;{reflectionQuestion}&rdquo;
          </Text>
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Final — Closing page ---------- */}
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
            Go deeper
          </Text>
        </View>
        <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold, marginTop: 70 }}>
          Go deeper
        </Text>
        <Text style={s.closingHeadline}>
          Clarity is the first{"\n"}act of leadership.
        </Text>
        <View style={{ ...pdfStyles.goldRule, marginTop: 18 }} />
        <Text style={s.closingSub}>
          The map is the tool. The rhythm is the discipline. Keep both, and
          ownership stops falling through the cracks.
        </Text>
        <View style={s.ctaRow}>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>01</Text>
            <Text style={s.ctaTitle}>Take the Culture Health Check</Text>
            <Text style={s.ctaBody}>
              See how ownership actually scores with your team — solo or
              anonymous aggregate across the whole leadership group.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/health-survey</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>02</Text>
            <Text style={s.ctaTitle}>Build your Culture Action Plan</Text>
            <Text style={s.ctaBody}>
              Address the ownership toxins directly with a 30/60/90-day plan,
              calendar events, and an accountability partner.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/action-plan</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>03</Text>
            <Text style={s.ctaTitle}>Apply for FRE Certification</Text>
            <Text style={s.ctaBody}>
              Two days in Austin with Clay Vaughan. Twelve seats. Learn the
              framework that turns clear accountability into measurable client
              growth.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/workshop</Text>
          </View>
        </View>
        <Text style={s.closingLine}>
          Heart has to come first. Without it, the rest won&rsquo;t last.
        </Text>
        <View
          style={[pdfStyles.footer, { color: COLOR.cream, opacity: 0.6 }]}
          fixed
        >
          <Text>© 2026 Clayton Vaughan Strategies</Text>
          <Text>{nextLabel()}</Text>
          <Text>velocityframework.com</Text>
        </View>
      </Page>
    </Document>
  );
}
