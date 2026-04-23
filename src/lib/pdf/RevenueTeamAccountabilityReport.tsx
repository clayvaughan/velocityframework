/**
 * Unified Revenue Team Accountability Map — multi-page PDF report.
 *
 * Structure:
 *   1. Cover
 *   2. Org snapshot — Director of Revenue at top with 4 direct reports
 *   3. Summary table (1 row per role with key metric)
 *   4..N. One page per role (mission, 3 metrics, 5 responsibilities)
 *   Second-to-last: Weekly meeting agenda + reflection rhythm
 *   Final: Closing page ("One team, one story, one number.")
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

export type RevenueRoleForPdf = {
  position: number;
  roleName: string;
  ownerName: string | null;
  missionStatement: string | null;
  metrics: (string | null)[];
  responsibilities: (string | null)[];
  accountableTo: string | null;
  isCustom: boolean;
  /** Whether this is the Director of Revenue seat (for the org snapshot). */
  isDirectorOfRevenue: boolean;
};

type Props = {
  firstName: string;
  companyName: string;
  completedAt: Date;
  roles: RevenueRoleForPdf[];
  weeklyMeetingDay: string | null;
  weeklyMeetingTime: string | null;
  weeklyMeetingDuration: string | null;
  weeklyMeetingAgenda: string | null;
  reflectionDate1: string | null;
  reflectionDate2: string | null;
  reflectionDate3: string | null;
  reflectionQuestion: string;
};

const s = StyleSheet.create({
  coverHero: { marginTop: 120 },
  coverTitle: { ...pdfStyles.display, fontSize: 40, lineHeight: 0.95 },
  coverSub: { ...pdfStyles.h2, color: COLOR.goldDark, marginTop: 18 },

  // Org snapshot
  orgTopNode: {
    alignSelf: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: COLOR.gold,
    backgroundColor: "#FFFFFF",
    minWidth: 240,
  },
  orgNodeLabel: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  orgNodeTitle: {
    fontFamily: FONT.display,
    fontSize: 18,
    letterSpacing: 1,
    color: COLOR.slate,
    marginTop: 6,
    lineHeight: 1.1,
  },
  orgNodeOwner: {
    fontFamily: FONT.body,
    fontSize: 9.5,
    color: COLOR.slate,
    marginTop: 4,
  },
  orgConnector: {
    alignSelf: "center",
    width: 1.5,
    height: 24,
    backgroundColor: COLOR.gold,
    marginVertical: 6,
  },
  orgReportRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  orgReportNode: {
    width: "23%",
    padding: 10,
    borderWidth: 1,
    borderColor: COLOR.border,
    backgroundColor: "#FFFFFF",
  },
  orgReportTitle: {
    fontFamily: FONT.heading,
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COLOR.slate,
    lineHeight: 1.2,
  },
  orgReportOwner: {
    fontFamily: FONT.body,
    fontSize: 8.5,
    color: COLOR.mutedText,
    marginTop: 4,
  },

  // Summary table
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

  // Per-role page
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
  metaRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 16,
  },
  metaCell: { flex: 1 },
  metaLabel: {
    fontFamily: FONT.heading,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  metaBody: {
    fontFamily: FONT.body,
    fontSize: 11,
    color: COLOR.slate,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: COLOR.border,
    backgroundColor: COLOR.creamSoft,
  },
  metricNum: {
    fontFamily: FONT.display,
    fontSize: 18,
    letterSpacing: 1.5,
    color: COLOR.goldDark,
  },
  metricText: {
    fontFamily: FONT.body,
    fontSize: 9.5,
    lineHeight: 1.4,
    color: COLOR.slate,
    marginTop: 6,
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

  // Meeting + reflection rhythm page
  meetingCard: {
    marginTop: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
    backgroundColor: "#FFFFFF",
  },
  meetingHeader: {
    fontFamily: FONT.heading,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLOR.slate,
  },
  meetingMeta: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLOR.slate,
    marginTop: 6,
  },
  meetingAgenda: {
    fontFamily: FONT.body,
    fontSize: 9.5,
    lineHeight: 1.55,
    color: COLOR.slate,
    marginTop: 10,
  },
  reflectionCard: {
    marginTop: 12,
    padding: 14,
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
    fontSize: 18,
    letterSpacing: 1.2,
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
      <Text style={pdfStyles.eyebrow}>Unified Revenue Team</Text>
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

export function RevenueTeamAccountabilityReport({
  firstName,
  companyName,
  completedAt,
  roles,
  weeklyMeetingDay,
  weeklyMeetingTime,
  weeklyMeetingDuration,
  weeklyMeetingAgenda,
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

  const dor = roles.find((r) => r.isDirectorOfRevenue);
  const reports = roles.filter((r) => !r.isDirectorOfRevenue);

  // Pages: cover + org snapshot + summary table + N role pages + rhythm + closing
  const totalPages = 3 + roles.length + 1 + 1;
  let pageNum = 0;
  const nextLabel = () => {
    pageNum += 1;
    return `Page ${pageNum} of ${totalPages}`;
  };

  const meetingTimeDisplay =
    weeklyMeetingDay && weeklyMeetingTime
      ? `${weeklyMeetingDay}s at ${weeklyMeetingTime}${weeklyMeetingDuration ? ` · ${weeklyMeetingDuration}` : ""}`
      : "Not yet scheduled";

  return (
    <Document>
      {/* ---------- Page 1 — Cover ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.eyebrow}>Velocity Framework · Heading Pillar</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.coverHero}>
          <Text style={pdfStyles.eyebrow}>Unified Revenue Team Accountability Map</Text>
          <Text style={[s.coverTitle, { marginTop: 14 }]}>{companyName}</Text>
          <Text style={s.coverSub}>
            {roles.length} {roles.length === 1 ? "seat" : "seats"} defined
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: 24 }]}>
            Prepared by {firstName} · {dateStr}
          </Text>
          {dor?.ownerName && dor.ownerName.trim().length > 0 ? (
            <Text style={[pdfStyles.muted, { marginTop: 6 }]}>
              Director of Revenue: {dor.ownerName}
            </Text>
          ) : null}
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 2 — Org snapshot ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Org snapshot</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            One leader. Four functions. One team.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <Text style={[pdfStyles.body, { marginTop: 18, maxWidth: 480 }]}>
          The Director of Revenue (or Fractional Revenue Executive) unifies
          marketing, sales, revenue operations, and account management under
          one strategy. Not four departments competing for credit — one
          revenue team with one scoreboard.
        </Text>

        <View style={{ marginTop: 28 }}>
          {dor ? (
            <View style={s.orgTopNode}>
              <Text style={s.orgNodeLabel}>Director of Revenue</Text>
              <Text style={s.orgNodeTitle}>{dor.roleName}</Text>
              <Text style={s.orgNodeOwner}>
                {dor.ownerName && dor.ownerName.trim().length > 0
                  ? dor.ownerName
                  : "(Vacant — or to be hired)"}
              </Text>
            </View>
          ) : null}
          {dor && reports.length > 0 ? (
            <>
              <View style={s.orgConnector} />
              <View style={s.orgReportRow}>
                {reports.map((r) => (
                  <View key={r.position} style={s.orgReportNode}>
                    <Text style={s.orgReportTitle}>{r.roleName}</Text>
                    <Text style={s.orgReportOwner}>
                      {r.ownerName && r.ownerName.trim().length > 0
                        ? r.ownerName
                        : "(Open seat)"}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 3 — Summary table ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>At a glance</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>Every seat on your map</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={s.tableHeaderRow}>
            <Text style={[s.tableHeaderCell, { flex: 1.4 }]}>Role</Text>
            <Text style={[s.tableHeaderCell, { flex: 1 }]}>Owner</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.3 }]}>Mission</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.3 }]}>Key metric</Text>
            <Text style={[s.tableHeaderCell, { flex: 0.9 }]}>Reports to</Text>
          </View>
          {roles.map((r) => (
            <View key={r.position} style={s.tableRow}>
              <Text style={[s.tableCell, { flex: 1.4, fontFamily: FONT.heading }]}>
                {r.roleName}
              </Text>
              <Text style={[s.tableCell, { flex: 1 }]}>
                {r.ownerName && r.ownerName.trim().length > 0
                  ? r.ownerName
                  : "—"}
              </Text>
              <Text style={[s.tableCell, { flex: 1.3 }]}>
                {firstSentence(r.missionStatement) || "—"}
              </Text>
              <Text style={[s.tableCell, { flex: 1.3 }]}>
                {r.metrics[0] ?? "—"}
              </Text>
              <Text style={[s.tableCell, { flex: 0.9 }]}>
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
            <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 22 }]}>
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

          <View style={s.metaRow}>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Owner</Text>
              <Text style={s.metaBody}>
                {r.ownerName && r.ownerName.trim().length > 0
                  ? r.ownerName
                  : "(Vacant)"}
              </Text>
            </View>
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Accountable to</Text>
              <Text style={s.metaBody}>
                {r.accountableTo && r.accountableTo.trim().length > 0
                  ? r.accountableTo
                  : "—"}
              </Text>
            </View>
          </View>

          <View style={s.metricsRow}>
            {[0, 1, 2].map((i) => {
              const m = r.metrics[i];
              if (!m || m.trim().length === 0) return null;
              return (
                <View key={i} style={s.metricCard}>
                  <Text style={s.metricNum}>0{i + 1}</Text>
                  <Text style={s.metricText}>{m}</Text>
                </View>
              );
            })}
          </View>

          <View style={{ marginTop: 22 }}>
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

          <Footer label={nextLabel()} />
        </Page>
      ))}

      {/* ---------- Meeting + Reflection Rhythm page ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Rhythm</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            Weekly meeting. Quarterly reflection.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>

        <View style={s.meetingCard}>
          <Text style={s.meetingHeader}>Weekly Revenue Team Meeting</Text>
          <Text style={s.meetingMeta}>{meetingTimeDisplay}</Text>
          {weeklyMeetingAgenda && weeklyMeetingAgenda.trim().length > 0 ? (
            <Text style={s.meetingAgenda}>{weeklyMeetingAgenda}</Text>
          ) : (
            <Text style={[s.meetingAgenda, { fontStyle: "italic", color: COLOR.mutedText }]}>
              Agenda not yet set.
            </Text>
          )}
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={pdfStyles.eyebrow}>Reflection Rhythm</Text>
          <Text style={[pdfStyles.muted, { marginTop: 6, maxWidth: 460 }]}>
            Every 90 days, revisit the map. Is the right person in each seat?
            Are the metrics still the right ones for this stage? What would
            make each role stronger in the next quarter?
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
          <View style={{ marginTop: 12 }}>
            <Text style={pdfStyles.eyebrow}>Reflection question</Text>
            <Text
              style={[
                pdfStyles.body,
                { fontStyle: "italic", marginTop: 6, maxWidth: 460 },
              ]}
            >
              &ldquo;{reflectionQuestion}&rdquo;
            </Text>
          </View>
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Closing ---------- */}
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
          <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold }}>Next steps</Text>
        </View>
        <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold, marginTop: 70 }}>
          Go deeper
        </Text>
        <Text style={s.closingHeadline}>
          One team, one story,{"\n"}one number.
        </Text>
        <View style={{ ...pdfStyles.goldRule, marginTop: 18 }} />
        <Text style={s.closingSub}>
          Marketing and sales as one department is how growing businesses
          escape the silos trap. The map is the document. The weekly rhythm
          is the discipline. Keep both.
        </Text>
        <View style={s.ctaRow}>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>01</Text>
            <Text style={s.ctaTitle}>Pair with your Leadership Accountability Map</Text>
            <Text style={s.ctaBody}>
              Revenue unifies under Heading; leadership seats unify under
              Heart. Together, they describe every seat that runs the
              business.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/leadership-accountability-map</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>02</Text>
            <Text style={s.ctaTitle}>Build your Messaging &amp; Proof Checklist</Text>
            <Text style={s.ctaBody}>
              One revenue team needs one story. Lock the one-liner, message
              map, and collateral audit so marketing and sales speak the
              same language.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/messaging-proof-checklist</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>03</Text>
            <Text style={s.ctaTitle}>Apply for FRE Certification</Text>
            <Text style={s.ctaBody}>
              Two days in Austin with Clay and Luke. Learn to install the
              Fractional Revenue Executive role inside client businesses.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/workshop</Text>
          </View>
        </View>
        <Text style={s.closingLine}>
          Marketing and sales as one department is how growing businesses escape the silos trap.
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
