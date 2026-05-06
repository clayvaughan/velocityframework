/**
 * Generic AI-Polished PDF — used by every tool that opts into AI Polish.
 *
 * Replaces a tool's raw-answers PDF when the user has clicked "Add to my PDF"
 * on an AI-generated cleanup. Single, branded layout parameterized by the
 * tool's eyebrow, title, and intro paragraph so each tool reads as its own
 * deliverable while sharing one component.
 *
 * The original raw answers always remain in Supabase (the tool-specific
 * `polished_version` column is the only thing this layer sets).
 */

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";
import { MarkdownView } from "./markdown-to-pdf";

registerFonts();

export type PolishedReportProps = {
  firstName: string;
  /** Optional — omit for tools that don't capture a company on intake (e.g. Culture Action Plan). */
  companyName?: string | null;
  generatedAt: Date;
  polishedMarkdown: string;
  /** Top-right eyebrow, e.g. "Messaging & Proof · AI-Polished". */
  eyebrow: string;
  /** Display title under the eyebrow, e.g. "Your polished messaging." */
  title: string;
  /** One-paragraph intro under the title. Renders verbatim. */
  intro: string;
};

const s = StyleSheet.create({
  page: {
    ...pdfStyles.page,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  brand: {
    fontFamily: FONT.display,
    fontSize: 14,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: COLOR.slate,
  },
  brandEyebrow: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  titleBlock: {
    marginTop: 28,
    marginBottom: 18,
  },
  titleEyebrow: {
    fontFamily: FONT.heading,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  title: {
    ...pdfStyles.display,
    fontSize: 36,
    lineHeight: 1.0,
    marginTop: 8,
  },
  titleSub: {
    fontFamily: FONT.body,
    fontSize: 11,
    color: COLOR.slateLight,
    marginTop: 12,
    maxWidth: 460,
  },
  goldRule: {
    height: 2,
    width: 56,
    backgroundColor: COLOR.gold,
    marginTop: 14,
  },
  footer: {
    ...pdfStyles.footer,
  },
});

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PolishedReport({
  firstName,
  companyName,
  generatedAt,
  polishedMarkdown,
  eyebrow,
  title,
  intro,
}: PolishedReportProps) {
  const dateLabel = formatDate(generatedAt);
  return (
    <Document>
      <Page size="LETTER" style={s.page} wrap>
        <View style={s.topRow}>
          <Text style={s.brand}>Velocity</Text>
          <Text style={s.brandEyebrow}>{eyebrow}</Text>
        </View>

        <View style={s.titleBlock}>
          <Text style={s.titleEyebrow}>
            {companyName && companyName.trim().length > 0
              ? `For ${firstName} at ${companyName}`
              : `For ${firstName}`}
          </Text>
          <Text style={s.title}>{title}</Text>
          <View style={s.goldRule} />
          <Text style={s.titleSub}>{intro}</Text>
        </View>

        <MarkdownView markdown={polishedMarkdown} />

        <View style={s.footer} fixed>
          <Text>AI-polished · Generated {dateLabel}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
          <Text>velocityframework.com</Text>
        </View>
      </Page>
    </Document>
  );
}
