/**
 * PDF theme — colors, fonts, common styles for the Culture Health Check
 * report. Mirrors the on-site design system:
 *   Cream #f9f7f2  ·  Slate Black #272727  ·  Harvest Gold #c7af81
 *   BigNoodleTitling (display) · NexaBold (headings) · Montserrat (body)
 */

import path from "path";
import { Font, StyleSheet } from "@react-pdf/renderer";

export const COLOR = {
  cream: "#F9F7F2",
  creamSoft: "#F3EEE4",
  slate: "#272727",
  slateLight: "#4A4A4A",
  gold: "#C7AF81",
  goldDark: "#A6894F",
  goldLight: "#D6C29E",
  success: "#198A4B",
  warning: "#F3A712",
  border: "#E0DBD0",
  mutedText: "#6B6B6B",
} as const;

/**
 * Register local font files with @react-pdf/renderer. Safe to call multiple
 * times — Font.register dedupes internally.
 */
let fontsRegistered = false;
export function registerFonts() {
  if (fontsRegistered) return;
  const fontsDir = path.join(process.cwd(), "public", "fonts");

  Font.register({
    family: "BigNoodleTitling",
    fonts: [
      { src: path.join(fontsDir, "big_noodle_titling.ttf") },
      {
        src: path.join(fontsDir, "big_noodle_titling_oblique.ttf"),
        fontStyle: "italic",
      },
    ],
  });
  Font.register({
    family: "NexaBold",
    src: path.join(fontsDir, "Nexa_Bold.otf"),
    fontWeight: 700,
  });
  Font.register({
    family: "Montserrat",
    src: path.join(fontsDir, "Montserrat-Regular.ttf"),
  });

  // Disable @react-pdf's word-break hyphenation — we want clean line breaks
  // on business copy, not split words.
  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
}

export const FONT = {
  display: "BigNoodleTitling",
  heading: "NexaBold",
  body: "Montserrat",
} as const;

export const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: COLOR.cream,
    color: COLOR.slate,
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.5,
    padding: 48,
  },
  pageDark: {
    backgroundColor: COLOR.slate,
    color: COLOR.cream,
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.5,
    padding: 48,
  },
  display: {
    fontFamily: FONT.display,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: COLOR.slate,
  },
  h2: {
    fontFamily: FONT.heading,
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.slate,
  },
  h3: {
    fontFamily: FONT.heading,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLOR.slate,
  },
  eyebrow: {
    fontFamily: FONT.heading,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  body: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLOR.slate,
  },
  muted: {
    fontFamily: FONT.body,
    fontSize: 9,
    color: COLOR.mutedText,
  },
  goldRule: {
    height: 2,
    backgroundColor: COLOR.gold,
    width: 48,
    marginTop: 4,
  },
  divider: {
    borderTopWidth: 0.5,
    borderTopColor: COLOR.border,
    marginVertical: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    letterSpacing: 1,
    color: COLOR.mutedText,
    fontFamily: FONT.heading,
    textTransform: "uppercase",
  },
});
