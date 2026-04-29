/**
 * Polished Messaging & Proof Checklist — PDF.
 *
 * Used in place of MessagingReport when the user has clicked "Add to my PDF"
 * on an AI Polish version. Single-page-flow document with Velocity branding
 * + a footer note that names this as the AI-polished variant. The original
 * raw answers are still preserved in Supabase if the user ever needs them
 * (they're never deleted on save).
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

type Props = {
  firstName: string;
  companyName: string;
  generatedAt: Date;
  polishedMarkdown: string;
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

export function PolishedMessagingReport({
  firstName,
  companyName,
  generatedAt,
  polishedMarkdown,
}: Props) {
  const dateLabel = formatDate(generatedAt);
  return (
    <Document>
      <Page size="LETTER" style={s.page} wrap>
        {/* Brand row at top of first page only */}
        <View style={s.topRow}>
          <Text style={s.brand}>Velocity</Text>
          <Text style={s.brandEyebrow}>
            Messaging &amp; Proof · AI-Polished
          </Text>
        </View>

        {/* Title block */}
        <View style={s.titleBlock}>
          <Text style={s.titleEyebrow}>
            For {firstName} at {companyName}
          </Text>
          <Text style={s.title}>Your polished messaging.</Text>
          <View style={s.goldRule} />
          <Text style={s.titleSub}>
            What follows is an AI-polished version of your saved Messaging
            &amp; Proof Checklist. Treat suggested edits as starting points,
            not final copy. The original raw answers remain saved on
            velocityframework.com if you ever need to revisit them.
          </Text>
        </View>

        {/* Body — flows across pages automatically */}
        <MarkdownView markdown={polishedMarkdown} />

        {/* Footer fixed on every page */}
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
