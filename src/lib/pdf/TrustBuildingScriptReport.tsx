/**
 * Bellamere Trust-Building Script — dynamically-sourced PDF.
 *
 * Structure:
 *   1. Cover (with dynamic "last updated" timestamp)
 *   2. How to Use This Script (static intro)
 *   3..N. Section pages — one per parsed section from the Google Doc
 *   N+1. Best Practices & Reminders
 *   N+2. Closing ("Trust compounds. So does the revenue it creates.")
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
import type { Block, ParsedDoc, Section } from "@/lib/trust-building-script/parser";

registerFonts();

const s = StyleSheet.create({
  // Cover
  coverHero: { marginTop: 110 },
  coverEyebrow: { ...pdfStyles.eyebrow },
  coverTitle: {
    ...pdfStyles.display,
    fontSize: 40,
    lineHeight: 0.95,
    marginTop: 16,
  },
  coverSub: {
    fontFamily: FONT.body,
    fontSize: 12,
    color: COLOR.slateLight,
    marginTop: 20,
    maxWidth: 440,
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

  // Shared section header
  sectionEyebrow: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  sectionTitle: {
    ...pdfStyles.display,
    fontSize: 30,
    marginTop: 8,
    lineHeight: 0.95,
  },

  // Section body blocks
  objective: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLOR.creamSoft,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
  },
  objectiveLabel: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  objectiveBody: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.5,
    color: COLOR.slate,
    marginTop: 4,
  },

  stepRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  stepNumber: {
    fontFamily: FONT.display,
    fontSize: 16,
    letterSpacing: 1.5,
    color: COLOR.goldDark,
    width: 22,
    lineHeight: 1,
  },
  stepBody: { flex: 1 },
  stepText: {
    fontFamily: FONT.heading,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLOR.slate,
    lineHeight: 1.35,
  },

  bulletRow: {
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 32,
    gap: 8,
  },
  bulletDot: {
    fontFamily: FONT.body,
    fontSize: 10,
    color: COLOR.goldDark,
    width: 8,
    marginTop: 1,
  },
  bulletText: {
    fontFamily: FONT.body,
    fontSize: 10,
    lineHeight: 1.5,
    color: COLOR.slate,
    flex: 1,
  },

  paragraph: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLOR.slate,
    marginTop: 10,
  },

  // Script callout (cream body, gold border)
  script: {
    marginTop: 10,
    marginLeft: 32,
    padding: 10,
    backgroundColor: COLOR.cream,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
  },
  scriptLabel: {
    fontFamily: FONT.heading,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  scriptBody: {
    fontFamily: FONT.body,
    fontSize: 10,
    lineHeight: 1.5,
    color: COLOR.slate,
    marginTop: 4,
  },

  // Coaching callout (slate body, cream text)
  coaching: {
    marginTop: 12,
    padding: 12,
    backgroundColor: COLOR.slate,
  },
  coachingLabel: {
    fontFamily: FONT.heading,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.gold,
  },
  coachingBody: {
    fontFamily: FONT.body,
    fontSize: 10,
    lineHeight: 1.5,
    color: COLOR.cream,
    marginTop: 4,
  },

  // Breadcrumb in footer
  breadcrumb: {
    fontFamily: FONT.heading,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },

  // Closing page (dark)
  closingHeadline: {
    ...pdfStyles.display,
    fontSize: 40,
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

function Header({ title }: { title?: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <Text style={{ ...pdfStyles.display, fontSize: 14 }}>Velocity</Text>
      <Text style={pdfStyles.eyebrow}>
        {title ?? "Bellamere Trust-Building Script"}
      </Text>
    </View>
  );
}

function Footer({ breadcrumb }: { breadcrumb?: string }) {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text>© 2026 Clayton Vaughan Strategies</Text>
      {breadcrumb ? <Text style={s.breadcrumb}>{breadcrumb}</Text> : <Text>velocityframework.com</Text>}
      <Text
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Block renderer
// ---------------------------------------------------------------------------

function renderBlocks(blocks: Block[]): React.ReactNode {
  return blocks.map((b, i) => {
    switch (b.kind) {
      case "objective":
        return (
          <View key={i} style={s.objective}>
            <Text style={s.objectiveLabel}>Objective</Text>
            <Text style={s.objectiveBody}>{b.text}</Text>
          </View>
        );
      case "step":
        return (
          <View key={i} style={s.stepRow} wrap={false}>
            <Text style={s.stepNumber}>{b.number}.</Text>
            <View style={s.stepBody}>
              <Text style={s.stepText}>{b.text}</Text>
            </View>
          </View>
        );
      case "bullet":
        return (
          <View key={i} style={s.bulletRow}>
            <Text style={s.bulletDot}>•</Text>
            <Text style={s.bulletText}>{b.text}</Text>
          </View>
        );
      case "script":
        return (
          <View key={i} style={s.script} wrap={false}>
            <Text style={s.scriptLabel}>Script</Text>
            <Text style={s.scriptBody}>{b.text}</Text>
          </View>
        );
      case "coaching":
        return (
          <View key={i} style={s.coaching} wrap={false}>
            <Text style={s.coachingLabel}>{b.label}</Text>
            <Text style={s.coachingBody}>{b.text}</Text>
          </View>
        );
      case "paragraph":
        return (
          <Text key={i} style={s.paragraph}>
            {b.text}
          </Text>
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
  /** Present when Google Doc fetch failed — renderer shows a fallback page. */
  fetchError?: string;
  /** Formatted "Last updated" date — render-time timestamp. */
  lastUpdated: string;
};

export function TrustBuildingScriptReport({
  doc,
  fetchError,
  lastUpdated,
}: Props) {
  const hasBestPractices = (doc?.bestPractices.length ?? 0) > 0;

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
          <Text style={s.coverEyebrow}>Hustle pillar</Text>
          <Text style={s.coverTitle}>
            The Bellamere{"\n"}Trust-Building{"\n"}Script
          </Text>
          <Text style={s.coverSub}>
            A living example of a high-trust, high-conversion sales
            conversation. Built by Luke Frazier. Used by every FRE Clay
            certifies.
          </Text>
          <Text style={s.coverMeta}>Last updated: {lastUpdated}</Text>
          <Text style={[pdfStyles.muted, { marginTop: 30 }]}>
            © 2026 Clayton Vaughan Strategies · velocityframework.com
          </Text>
        </View>
        <Footer />
      </Page>

      {/* ---------- Page 2 — How to Use This Script ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>How to use this script</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 26 }]}>
            Read it once. Practice it out loud. Make it yours.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <Text style={[pdfStyles.body, { marginTop: 18 }]}>
          This script isn&rsquo;t meant to be memorized word-for-word.
          It&rsquo;s a structure — ten coached sections that walk a prospect
          from arrival to a confident decision. The words are the example.
          The structure is the principle.
        </Text>
        <Text style={[pdfStyles.body, { marginTop: 10 }]}>
          The first time you read it, notice the coaching tips after each
          section. Those are the psychological moves: when to ask an open
          question, when to pause, when to reflect something back, when to
          share a story. The coaching is where the script actually lives.
        </Text>
        <Text style={[pdfStyles.body, { marginTop: 10 }]}>
          Then practice it out loud. Adapt the language to your industry.
          Keep the structure. The best FREs turn this into their own script
          in about 30 days — same bones, their voice, their product.
          That&rsquo;s the goal.
        </Text>
        <View style={s.objective}>
          <Text style={s.objectiveBody}>
            The rest of this document is the actual script Bellamere uses.
            Names and specifics are from a real wedding venue tour; the
            patterns work in any high-trust sale.
          </Text>
        </View>
        <Footer />
      </Page>

      {/* ---------- Pages 3..N — Sections OR fallback error ---------- */}
      {fetchError ? (
        <Page size="LETTER" style={pdfStyles.page}>
          <Header />
          <View style={s.errorBox}>
            <Text style={pdfStyles.eyebrow}>Content unavailable</Text>
            <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 22 }]}>
              This script is temporarily unavailable.
            </Text>
            <Text style={[pdfStyles.body, { marginTop: 14 }]}>
              We couldn&rsquo;t load the latest version of the Bellamere
              Trust-Building Script from its source. This is almost always a
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
        <>
          {doc?.sections.map((section: Section) => (
            <Page key={section.number} size="LETTER" style={pdfStyles.page}>
              <Header />
              <View style={{ marginTop: 28 }}>
                <Text style={s.sectionEyebrow}>
                  Section {section.number} of {doc.sections.length}
                </Text>
                <Text style={s.sectionTitle}>{section.title}</Text>
                <View style={pdfStyles.goldRule} />
              </View>
              <View style={{ marginTop: 10 }}>
                {renderBlocks(section.blocks)}
              </View>
              <Footer
                breadcrumb={`Section ${section.number} of ${doc.sections.length}`}
              />
            </Page>
          ))}

          {/* Best Practices page */}
          {hasBestPractices && doc ? (
            <Page size="LETTER" style={pdfStyles.page}>
              <Header />
              <View style={{ marginTop: 28 }}>
                <Text style={s.sectionEyebrow}>Apply broadly</Text>
                <Text style={[pdfStyles.h2, { marginTop: 8, fontSize: 28 }]}>
                  Best Practices.
                </Text>
                <View style={pdfStyles.goldRule} />
              </View>
              <View style={{ marginTop: 10 }}>
                {renderBlocks(doc.bestPractices)}
              </View>
              <Footer breadcrumb="Best Practices" />
            </Page>
          ) : null}
        </>
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
          Trust compounds.{"\n"}So does the revenue{"\n"}it creates.
        </Text>
        <View style={{ ...pdfStyles.goldRule, marginTop: 18 }} />
        <Text style={s.closingSub}>
          The script is a structure. The coaching is the product. The
          practice is where it becomes yours.
        </Text>

        <View style={s.ctaRow}>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>01</Text>
            <Text style={s.ctaTitle}>
              Build your Messaging & Proof Checklist
            </Text>
            <Text style={s.ctaBody}>
              The script only works if your messaging underneath it is
              dialed. Lock the one-liner, case studies, and CTAs that point
              in the same direction.
            </Text>
            <Text style={s.ctaUrl}>
              velocityframework.com/messaging-proof-checklist
            </Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>02</Text>
            <Text style={s.ctaTitle}>
              Pull more tools from the Toolbox
            </Text>
            <Text style={s.ctaBody}>
              Every resource from Velocity is free. Pull the ones that fit
              your stage and use them at your next leadership meeting.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/toolbox</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>03</Text>
            <Text style={s.ctaTitle}>Apply for FRE Certification</Text>
            <Text style={s.ctaBody}>
              Two days in Austin with Clay and Luke. Learn to install this
              script — and the system around it — inside client businesses.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/workshop</Text>
          </View>
        </View>

        <Text style={s.closingLine}>
          Sales isn&rsquo;t about closing. It&rsquo;s about showing up in a
          way that makes the right people want to say yes.
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
