/**
 * Favorite Customer Profile — multi-page PDF report.
 *
 * Structure:
 *   1. Cover
 *   2. Summary table (1 row per completed FCP)
 *   3. (conditional) Scope Guardrails
 *   4..N. One page per completed FCP (full 8-section deep dive)
 *   Final: Closing page ("Define your next move.")
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";
import type { ScopeGuardrails } from "@/lib/fcp/storage";

registerFonts();

export type FCPResolvedProfile = {
  position: 1 | 2 | 3;
  profile_name: string;
  who_they_are: string;
  how_they_come_in: string;
  why_great_fit: string;
  what_they_say_yes_to: string;
  what_we_say_yes_to: string;
  when_we_say_no: string;
  examples: string;
  hospitality_cues: string;
};

type Props = {
  firstName: string;
  companyName: string;
  scopeGuardrails: ScopeGuardrails | null;
  hasScopeFilters: boolean;
  profiles: FCPResolvedProfile[];
  completedAt: Date;
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
  guardrailBlock: {
    marginBottom: 14,
    padding: 12,
    borderLeftWidth: 2,
    borderLeftColor: COLOR.gold,
    backgroundColor: "#FFFFFF",
  },
  guardrailLabel: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  guardrailBody: { ...pdfStyles.body, fontSize: 10, marginTop: 4 },
  section: {
    marginBottom: 10,
    paddingBottom: 10,
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
  sectionBody: { ...pdfStyles.body, fontSize: 10, marginTop: 4 },
  closingHeadline: {
    ...pdfStyles.display,
    fontSize: 48,
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
      <Text style={pdfStyles.eyebrow}>Favorite Customer Profile</Text>
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

export function FCPReport({
  firstName,
  companyName,
  scopeGuardrails,
  hasScopeFilters,
  profiles,
  completedAt,
}: Props) {
  const dateStr = completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Page numbering depends on whether scope guardrails are rendered.
  const hasGuardrails =
    hasScopeFilters &&
    scopeGuardrails &&
    Object.values(scopeGuardrails).some((v) => v && v.trim().length > 0);

  const totalPages = 2 + (hasGuardrails ? 1 : 0) + profiles.length + 1;
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
          <Text style={pdfStyles.eyebrow}>Velocity Framework · Heading Pillar</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.coverHero}>
          <Text style={pdfStyles.eyebrow}>Favorite Customer Profile</Text>
          <Text style={[s.coverTitle, { marginTop: 14 }]}>
            {companyName}
          </Text>
          <Text style={s.coverSub}>
            {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
            {hasGuardrails ? " · with scope guardrails" : ""}
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: 24 }]}>
            Completed by {firstName} · {dateStr}
          </Text>
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 2 — Summary table ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>At a glance</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>Your FCPs, summarized</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={s.tableHeaderRow}>
            <Text style={[s.tableHeaderCell, { width: 30 }]}>#</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.3 }]}>Profile</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.5 }]}>Why they&rsquo;re ideal</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.3 }]}>How they come in</Text>
            <Text style={[s.tableHeaderCell, { flex: 1.5 }]}>What we say yes to</Text>
          </View>
          {profiles.map((p) => (
            <View key={p.position} style={s.tableRow}>
              <Text style={[s.tableCell, { width: 30 }]}>{p.position}</Text>
              <Text style={[s.tableCell, { flex: 1.3, fontFamily: FONT.heading }]}>
                {p.profile_name}
              </Text>
              <Text style={[s.tableCell, { flex: 1.5 }]}>{p.why_great_fit}</Text>
              <Text style={[s.tableCell, { flex: 1.3 }]}>{p.how_they_come_in}</Text>
              <Text style={[s.tableCell, { flex: 1.5 }]}>{p.what_we_say_yes_to}</Text>
            </View>
          ))}
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Optional Page — Scope Guardrails ---------- */}
      {hasGuardrails && scopeGuardrails ? (
        <Page size="LETTER" style={pdfStyles.page}>
          <Header />
          <View style={{ marginTop: 28 }}>
            <Text style={pdfStyles.eyebrow}>Scope guardrails</Text>
            <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
              Company-wide sales filters
            </Text>
            <View style={pdfStyles.goldRule} />
          </View>
          <View style={{ marginTop: 20 }}>
            {[
              { label: "Core focus", value: scopeGuardrails.core_focus },
              { label: "Minimum threshold", value: scopeGuardrails.minimum_threshold },
              { label: "Preferred geography", value: scopeGuardrails.geography },
              { label: "Strategic priorities", value: scopeGuardrails.strategic_priorities },
              { label: "Do not pursue", value: scopeGuardrails.do_not_pursue },
              { label: "Proceed with caution", value: scopeGuardrails.proceed_with_caution },
            ]
              .filter((g) => g.value && g.value.trim().length > 0)
              .map((g, i) => (
                <View key={i} style={s.guardrailBlock}>
                  <Text style={s.guardrailLabel}>{g.label}</Text>
                  <Text style={s.guardrailBody}>{g.value}</Text>
                </View>
              ))}
          </View>
          <Footer label={nextLabel()} />
        </Page>
      ) : null}

      {/* ---------- One page per profile ---------- */}
      {profiles.map((p) => (
        <Page key={p.position} size="LETTER" style={pdfStyles.page}>
          <Header />
          <View style={{ marginTop: 28 }}>
            <Text style={pdfStyles.eyebrow}>
              FCP #{p.position}
            </Text>
            <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 22 }]}>
              {p.profile_name}
            </Text>
            <View style={pdfStyles.goldRule} />
          </View>
          <View style={{ marginTop: 20 }}>
            <DeepSection label="Who they are" body={p.who_they_are} />
            <DeepSection label="How they come in" body={p.how_they_come_in} />
            <DeepSection label="Why they are a great fit" body={p.why_great_fit} />
            <DeepSection label="What they say yes to" body={p.what_they_say_yes_to} />
            <DeepSection
              label={`What ${companyName} says yes to`}
              body={p.what_we_say_yes_to}
            />
            <DeepSection
              label={`When ${companyName} says no`}
              body={p.when_we_say_no}
            />
            {p.examples.trim().length > 0 ? (
              <DeepSection label="Examples" body={p.examples} />
            ) : null}
            <DeepSection label="Hospitality cues" body={p.hospitality_cues} />
          </View>
          <Footer label={nextLabel()} />
        </Page>
      ))}

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
          <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold }}>Next steps</Text>
        </View>
        <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold, marginTop: 70 }}>
          Go deeper
        </Text>
        <Text style={s.closingHeadline}>
          Define your next{"\n"}move.
        </Text>
        <View style={{ ...pdfStyles.goldRule, marginTop: 18 }} />
        <Text style={s.closingSub}>
          Clarity at the customer level is where every winning growth strategy
          starts. You have it now. The next three moves compound the work.
        </Text>
        <View style={s.ctaRow}>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>01</Text>
            <Text style={s.ctaTitle}>Build your messaging on top of this</Text>
            <Text style={s.ctaBody}>
              The Messaging &amp; Proof Checklist translates these FCPs into
              one-liners, case studies, and collateral you can actually ship.
            </Text>
            <Text style={s.ctaUrl}>
              velocityframework.com/messaging-proof-checklist
            </Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>02</Text>
            <Text style={s.ctaTitle}>Pull more tools from the Toolbox</Text>
            <Text style={s.ctaBody}>
              Every tool referenced in Velocity is free. Start with the ones
              that depend on a clear customer definition — sales script,
              accountability map, scorecard.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/toolbox</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>03</Text>
            <Text style={s.ctaTitle}>Apply for FRE Certification</Text>
            <Text style={s.ctaBody}>
              Two days in Austin with Clay Vaughan. Twelve seats. Learn the
              framework that turns these definitions into measurable client
              growth.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/workshop</Text>
          </View>
        </View>
        <Text style={s.closingLine}>
          Clarity at the customer level is where every winning growth strategy starts.
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

function DeepSection({ label, body }: { label: string; body: string }) {
  if (!body || !body.trim()) return null;
  return (
    <View style={s.section}>
      <Text style={s.sectionLabel}>{label}</Text>
      <Text style={s.sectionBody}>{body}</Text>
    </View>
  );
}
