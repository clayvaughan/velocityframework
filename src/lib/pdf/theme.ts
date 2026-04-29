/**
 * PDF theme — colors, fonts, common styles for the Culture Health Check
 * report. Mirrors the on-site design system:
 *   Cream #f9f7f2  ·  Slate Black #272727  ·  Harvest Gold #c7af81
 *   BigNoodleTitling (display) · NexaBold (headings) · Montserrat (body)
 */

import fs from "node:fs";
import path from "node:path";
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
 * Resolve the on-disk public/fonts directory at runtime. process.cwd() is
 * the canonical answer when `next start` is invoked from project root, but
 * some deploy environments (e.g. Replit Autoscale) can run the server with
 * a different working directory. Try a small set of candidates and pick
 * the first one that actually contains the fonts.
 */
function resolveFontsDir(): string {
  const candidates: string[] = [
    path.join(process.cwd(), "public", "fonts"),
  ];
  // __dirname is provided by Next.js's server bundle. Fall back to paths
  // anchored to this compiled module's location in case cwd is wrong.
  const dirname =
    typeof __dirname === "string" ? __dirname : null;
  if (dirname) {
    candidates.push(
      path.resolve(dirname, "../../../public/fonts"),
      path.resolve(dirname, "../../public/fonts"),
      path.resolve(dirname, "../public/fonts"),
      path.resolve(dirname, "../../../../public/fonts")
    );
  }
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "Montserrat-Regular.ttf"))) {
      return dir;
    }
  }
  throw new Error(
    `[velocity-pdf] Could not locate public/fonts directory. Tried: ${candidates.join(", ")}`
  );
}

/**
 * Read a font file and return it as a base64 data URL. @react-pdf/font
 * handles `data:*;base64,` sources by decoding the bytes directly into
 * fontkit, which avoids any runtime filesystem lookup at render time —
 * Font.register can't fail on a missing path because there's no path.
 */
function loadFontDataUrl(
  fontsDir: string,
  filename: string,
  mimeType: string
): string {
  const fullPath = path.join(fontsDir, filename);
  const bytes = fs.readFileSync(fullPath);
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

/**
 * Register local font files with @react-pdf/renderer. Reads font bytes
 * once at module-init time and embeds them as data URLs so renders don't
 * depend on the working directory. Safe to call multiple times —
 * Font.register dedupes internally.
 */
let fontsRegistered = false;
export function registerFonts() {
  if (fontsRegistered) return;
  const fontsDir = resolveFontsDir();

  const bigNoodle = loadFontDataUrl(
    fontsDir,
    "big_noodle_titling.ttf",
    "font/ttf"
  );
  const bigNoodleOblique = loadFontDataUrl(
    fontsDir,
    "big_noodle_titling_oblique.ttf",
    "font/ttf"
  );
  const nexaBold = loadFontDataUrl(fontsDir, "Nexa_Bold.otf", "font/otf");
  const montserrat = loadFontDataUrl(
    fontsDir,
    "Montserrat-Regular.ttf",
    "font/ttf"
  );

  Font.register({
    family: "BigNoodleTitling",
    fonts: [
      { src: bigNoodle },
      { src: bigNoodleOblique, fontStyle: "italic" },
    ],
  });
  Font.register({
    family: "NexaBold",
    src: nexaBold,
    fontWeight: 700,
  });
  // Register Montserrat with both upright and italic style sources. The
  // current italic source is the regular file (visually upright until
  // Lindsay delivers a real Montserrat-Italic), but the registration is
  // required — without it, @react-pdf throws "Could not resolve font" the
  // moment any text styled `fontStyle: italic` lands on the body font.
  Font.register({
    family: "Montserrat",
    fonts: [
      { src: montserrat },
      { src: montserrat, fontStyle: "italic" },
    ],
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
