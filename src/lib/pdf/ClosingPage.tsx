/**
 * Closing page shared by both Culture Health Check PDFs (individual and
 * team). Echoes the book's 7-Day Quick Start closing energy: short sharp
 * headline, three structured CTAs instead of flowing paragraphs, and a
 * final italic line that gives the report somewhere to land.
 *
 * Only the footer `pageLabel` varies between Individual (Page 6 of 6) and
 * Team (Page 7 of 7).
 */

import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles } from "./theme";

type Props = {
  pageLabel: string;
};

const s = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  headerLogo: { ...pdfStyles.display, fontSize: 14, color: COLOR.cream },
  headerEyebrow: { ...pdfStyles.eyebrow, color: COLOR.gold },
  closeEyebrow: { ...pdfStyles.eyebrow, color: COLOR.gold, marginTop: 70 },
  headline: {
    ...pdfStyles.display,
    fontSize: 52,
    color: COLOR.cream,
    marginTop: 14,
    lineHeight: 0.95,
  },
  goldRule: { height: 2, backgroundColor: COLOR.gold, width: 48, marginTop: 18 },
  subhead: {
    fontFamily: FONT.body,
    fontSize: 11,
    lineHeight: 1.5,
    color: COLOR.cream,
    opacity: 0.85,
    marginTop: 20,
    maxWidth: 460,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 36,
  },
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
    letterSpacing: 0.3,
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
    fontStyle: "italic",
    fontSize: 10,
    color: COLOR.cream,
    opacity: 0.6,
  },
  footer: {
    ...pdfStyles.footer,
    color: COLOR.cream,
    opacity: 0.6,
  },
});

type Cta = {
  number: string;
  title: string;
  body: string;
  url: string;
};

const CTAS: Cta[] = [
  {
    number: "01",
    title: "Build your Culture Action Plan",
    body: "Turn this report into a 30/60/90-day plan with calendar events, a pre-drafted leadership email, and an accountability partner invite — in ten minutes.",
    url: "velocityframework.com/action-plan",
  },
  {
    number: "02",
    title: "Download the tools you need",
    body: "Every resource Velocity references is free in the Toolbox. Pull the ones that match your lowest-scoring dimensions and use them at your next leadership meeting.",
    url: "velocityframework.com/toolbox",
  },
  {
    number: "03",
    title: "Apply for FRE Certification",
    body: "Two days in Austin with Clay Vaughan. Twelve seats. Learn the framework that turns these diagnostics into measurable growth for your clients.",
    url: "velocityframework.com/workshop",
  },
];

export function ClosingPage({ pageLabel }: Props) {
  return (
    <Page size="LETTER" style={pdfStyles.pageDark}>
      <View style={s.headerRow}>
        <Text style={s.headerLogo}>Velocity</Text>
        <Text style={s.headerEyebrow}>Next steps</Text>
      </View>

      <Text style={s.closeEyebrow}>Close</Text>
      <Text style={s.headline}>
        You&rsquo;ve named it.{"\n"}Now move.
      </Text>
      <View style={s.goldRule} />
      <Text style={s.subhead}>
        Culture isn&rsquo;t fixed in a file. It&rsquo;s fixed in the first
        move you make this week. Here&rsquo;s how to keep momentum.
      </Text>

      <View style={s.ctaRow}>
        {CTAS.map((c) => (
          <View key={c.number} style={s.ctaCard}>
            <Text style={s.ctaNumber}>{c.number}</Text>
            <Text style={s.ctaTitle}>{c.title}</Text>
            <Text style={s.ctaBody}>{c.body}</Text>
            <Text style={s.ctaUrl}>{c.url}</Text>
          </View>
        ))}
      </View>

      <Text style={s.closingLine}>
        Define your next move. Act on it. Watch the Velocity start.
      </Text>

      <View style={s.footer} fixed>
        <Text>© 2026 Clayton Vaughan Strategies</Text>
        <Text>{pageLabel}</Text>
        <Text>velocityframework.com</Text>
      </View>
    </Page>
  );
}
