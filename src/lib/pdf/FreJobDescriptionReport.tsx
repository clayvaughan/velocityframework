/**
 * FRE Job Description — dynamically-sourced PDF.
 *
 * Structure:
 *   1. Cover (with dynamic "last updated" timestamp)
 *   2. Why This Role Exists (static intro)
 *   3..N. Job description content rendered from the live Google Doc, with
 *         a fresh page break at each H1 section
 *   N+1. Closing ("Ready to lead a Revenue Department?")
 *
 * If the Google Doc fetch fails upstream, the caller passes in the error
 * case and the renderer emits a graceful fallback page instead of crashing.
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";
import type { Block, ParsedDoc } from "@/lib/fre-job-description/parser";

registerFonts();

const s = StyleSheet.create({
  // Cover
  coverHero: { marginTop: 110 },
  coverEyebrow: { ...pdfStyles.eyebrow },
  coverTitle: {
    ...pdfStyles.display,
    fontSize: 38,
    lineHeight: 0.95,
    marginTop: 16,
  },
  coverSub: {
    fontFamily: FONT.body,
    fontSize: 12,
    color: COLOR.slateLight,
    marginTop: 20,
    maxWidth: 460,
    lineHeight: 1.55,
  },
  coverMeta: {
    marginTop: 48,
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },

  // Section header
  sectionEyebrow: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  sectionTitle: {
    ...pdfStyles.display,
    fontSize: 26,
    marginTop: 8,
    lineHeight: 0.95,
  },

  // H2 sub-section heading
  h2: {
    fontFamily: FONT.heading,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLOR.slate,
    marginTop: 18,
  },

  paragraph: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLOR.slate,
    marginTop: 10,
  },

  bulletRow: {
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 8,
    gap: 8,
  },
  bulletDot: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLOR.goldDark,
    width: 10,
    marginTop: 1,
  },
  bulletText: {
    fontFamily: FONT.body,
    fontSize: 10,
    lineHeight: 1.5,
    color: COLOR.slate,
    flex: 1,
  },

  // Closing page (dark)
  closingHeadline: {
    ...pdfStyles.display,
    fontSize: 38,
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
  ctaUrl: {
    fontFamily: FONT.body,
    fontSize: 8,
    color: COLOR.gold,
    marginTop: 14,
  },
  closingLine: {
    position: "absolute",
    bottom: 64,
    left: 48,
    right: 48,
    textAlign: "center",
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLOR.cream,
    opacity: 0.6,
  },

  // Fallback error page
  errorBox: {
    marginTop: 80,
    padding: 24,
    backgroundColor: COLOR.creamSoft,
    borderLeftWidth: 4,
    borderLeftColor: COLOR.gold,
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
      <Text style={pdfStyles.eyebrow}>FRE Job Description</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text>© 2026 Clayton Vaughan Strategies</Text>
      <Text>velocityframework.com</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Group parsed blocks into "sections" — each H1 starts a new section that
// gets its own page in the PDF.
// ---------------------------------------------------------------------------

type Section = {
  title: string;
  body: Block[];
};

function groupBlocksIntoSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const b of blocks) {
    if (b.kind === "heading1") {
      if (current) sections.push(current);
      current = { title: b.text, body: [] };
      continue;
    }
    if (!current) {
      // Pre-section content (e.g., orphan paragraph before first H1).
      current = { title: "", body: [] };
    }
    current.body.push(b);
  }
  if (current) sections.push(current);
  return sections;
}

function renderBody(blocks: Block[]): React.ReactNode {
  return blocks.map((b, i) => {
    switch (b.kind) {
      case "heading2":
        return (
          <Text key={i} style={s.h2} wrap={false}>
            {b.text}
          </Text>
        );
      case "paragraph":
        return (
          <Text key={i} style={s.paragraph}>
            {b.text}
          </Text>
        );
      case "bullet":
        return (
          <View key={i} style={s.bulletRow}>
            <Text style={s.bulletDot}>•</Text>
            <Text style={s.bulletText}>{b.text}</Text>
          </View>
        );
      default:
        return null;
    }
  });
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

type Props = {
  doc: ParsedDoc | null;
  fetchError?: string;
  lastUpdated: string;
};

export function FreJobDescriptionReport({
  doc,
  fetchError,
  lastUpdated,
}: Props) {
  const sections = doc ? groupBlocksIntoSections(doc.blocks) : [];
  const totalSections = sections.length;

  return (
    <Document>
      {/* ---------- Page 1 — Cover ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <View>
          <Text style={pdfStyles.eyebrow}>
            Velocity Framework · Toolbox resource
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.coverHero}>
          <Text style={s.coverEyebrow}>Heading pillar</Text>
          <Text style={s.coverTitle}>
            Fractional{"\n"}Revenue{"\n"}Executive
          </Text>
          <Text style={s.coverSub}>
            The job description for the unified-revenue leader your business
            has been missing.
          </Text>
          <Text style={s.coverMeta}>Last updated: {lastUpdated}</Text>
          <Text style={[pdfStyles.muted, { marginTop: 30 }]}>
            © 2026 Clayton Vaughan Strategies · velocityframework.com
          </Text>
        </View>
        <Footer />
      </Page>

      {/* ---------- Page 2 — Why This Role Exists ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>The case for the role</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 26 }]}>
            Why this role exists.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <Text style={[pdfStyles.body, { marginTop: 18 }]}>
          Most growing businesses hit a wall around $1–3M in revenue where
          the marketing team and the sales team start drifting apart. They
          use different language for the customer. They optimize for
          different metrics. They blame each other when the numbers slip.
          Growth stalls — not from lack of effort, but from lack of
          alignment.
        </Text>
        <Text style={[pdfStyles.body, { marginTop: 10 }]}>
          The Fractional Revenue Executive is the role that fixes this. One
          leader with executive authority over both sides. One strategy.
          One scorecard. One unified Revenue Department instead of two
          siloed ones. The book <Text style={{ fontWeight: 700 }}>Velocity</Text>{" "}
          makes the case that this role is the single highest-leverage hire
          most service businesses can make in their next stage of growth.
        </Text>
        <Text style={[pdfStyles.body, { marginTop: 10 }]}>
          This document is the role definition Good Agency uses for its own
          FREs and the candidates it certifies. Use it as the bar — for
          hiring, for evaluating, or for becoming.
        </Text>
        <Text style={[pdfStyles.muted, { marginTop: 20, fontStyle: "normal" }]}>
          The full role definition follows. Adapt the language to your
          business; keep the bones.
        </Text>
        <Footer />
      </Page>

      {/* ---------- Pages 3..N — Sections from Google Doc OR error ---------- */}
      {fetchError ? (
        <Page size="LETTER" style={pdfStyles.page}>
          <Header />
          <View style={s.errorBox}>
            <Text style={pdfStyles.eyebrow}>Content unavailable</Text>
            <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 22 }]}>
              This document is temporarily unavailable.
            </Text>
            <Text style={[pdfStyles.body, { marginTop: 14 }]}>
              We couldn&rsquo;t load the latest version of the FRE Job
              Description from its source. This is almost always a
              transient network issue on our end — please try downloading
              again in a few minutes.
            </Text>
            <Text style={[pdfStyles.body, { marginTop: 10 }]}>
              If the issue persists, email{" "}
              <Text style={{ color: COLOR.goldDark }}>clay@goodagency.com</Text>{" "}
              and we&rsquo;ll send you the current version directly.
            </Text>
            <Text style={[pdfStyles.muted, { marginTop: 20, fontSize: 9 }]}>
              Reference: {fetchError}
            </Text>
          </View>
          <Footer />
        </Page>
      ) : (
        sections.map((section, idx) => (
          <Page key={idx} size="LETTER" style={pdfStyles.page}>
            <Header />
            <View style={{ marginTop: 28 }}>
              <Text style={s.sectionEyebrow}>
                Section {idx + 1} of {totalSections}
              </Text>
              <Text style={s.sectionTitle}>
                {section.title || "Job Description"}
              </Text>
              <View style={pdfStyles.goldRule} />
            </View>
            <View style={{ marginTop: 4 }}>{renderBody(section.body)}</View>
            <Footer />
          </Page>
        ))
      )}

      {/* ---------- Final page — Closing ---------- */}
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
            Go deeper
          </Text>
        </View>
        <Text style={{ ...pdfStyles.eyebrow, color: COLOR.gold, marginTop: 70 }}>
          Go deeper
        </Text>
        <Text style={s.closingHeadline}>
          Ready to lead{"\n"}a Revenue{"\n"}Department?
        </Text>
        <View style={{ ...pdfStyles.goldRule, marginTop: 18 }} />
        <Text style={s.closingSub}>
          The role isn&rsquo;t a consultant chair. It&rsquo;s the leader
          your revenue department has been waiting for.
        </Text>

        <View style={s.ctaRow}>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>01</Text>
            <Text style={s.ctaTitle}>Apply for FRE Certification</Text>
            <Text style={s.ctaBody}>
              Two days in Austin with Clay and Luke. Twelve seats. Become
              the FRE this job description describes.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/workshop</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>02</Text>
            <Text style={s.ctaTitle}>
              Build your Revenue Team Accountability Map
            </Text>
            <Text style={s.ctaBody}>
              Define the seats around the FRE so the role has a real team
              to lead.
            </Text>
            <Text style={s.ctaUrl}>
              velocityframework.com/revenue-team-accountability-map
            </Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>03</Text>
            <Text style={s.ctaTitle}>Pull more tools from the Toolbox</Text>
            <Text style={s.ctaBody}>
              Every resource from Velocity is free. Pull the ones that fit
              your stage.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/toolbox</Text>
          </View>
        </View>

        <Text style={s.closingLine}>
          The FRE isn&rsquo;t a consultant. It&rsquo;s the leader your
          revenue department has been waiting for.
        </Text>

        <View
          style={[pdfStyles.footer, { color: COLOR.cream, opacity: 0.6 }]}
          fixed
        >
          <Text>© 2026 Clayton Vaughan Strategies</Text>
          <Text>velocityframework.com</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
