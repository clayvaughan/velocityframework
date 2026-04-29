/**
 * Minimal Markdown → @react-pdf renderer.
 *
 * Handles the subset our AI-Polish prompts produce:
 *   ## H2 / ### H3 headings
 *   paragraphs separated by blank lines
 *   `> blockquote` (single-line)
 *   `- item` and `* item` bullet lists
 *   inline **bold**, _italic_ / *italic*, `code`
 *   `---` horizontal rule
 *
 * Not yet supported (none of these appear in our prompt outputs):
 *   ordered lists, nested lists, tables, images, links (text-only)
 *
 * Pagination: @react-pdf flows content across pages automatically when the
 * caller wraps this component in a single <Page>, so MarkdownView itself
 * just emits a flat sequence of block <View>s.
 */

import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles } from "./theme";

// ----------------------------------------------------------------------------
// Block parser
// ----------------------------------------------------------------------------

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "li"; text: string }
  | { type: "hr" };

function parseBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let paragraphLines: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) return;
    blocks.push({ type: "p", text: paragraphLines.join(" ").trim() });
    paragraphLines = [];
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    if (line === "---" || line === "***" || line === "___") {
      flushParagraph();
      blocks.push({ type: "hr" });
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: line.slice(2).trim() });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push({ type: "blockquote", text: line.slice(2).trim() });
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      blocks.push({ type: "li", text: line.slice(2).trim() });
      continue;
    }
    paragraphLines.push(line);
  }
  flushParagraph();
  return blocks;
}

// ----------------------------------------------------------------------------
// Inline parser — tokenizes a line into styled spans for nested <Text>.
// ----------------------------------------------------------------------------

type Span = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

// Order matters: ** before *, ` before _ to avoid misclassifying nested marks.
const INLINE_PATTERN =
  /(\*\*[^*\n]+\*\*)|(`[^`\n]+`)|(\*[^*\n]+\*)|(_[^_\n]+_)/g;

function parseSpans(text: string): Span[] {
  const spans: Span[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(INLINE_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      spans.push({ text: text.slice(lastIndex, start) });
    }
    const matched = match[0];
    if (matched.startsWith("**")) {
      spans.push({ text: matched.slice(2, -2), bold: true });
    } else if (matched.startsWith("`")) {
      spans.push({ text: matched.slice(1, -1), code: true });
    } else if (matched.startsWith("*")) {
      spans.push({ text: matched.slice(1, -1), italic: true });
    } else {
      spans.push({ text: matched.slice(1, -1), italic: true });
    }
    lastIndex = start + matched.length;
  }
  if (lastIndex < text.length) {
    spans.push({ text: text.slice(lastIndex) });
  }
  return spans;
}

// ----------------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------------

const s = StyleSheet.create({
  h2: {
    fontFamily: FONT.display,
    fontSize: 22,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLOR.slate,
    marginTop: 22,
    marginBottom: 8,
    lineHeight: 1.05,
  },
  h2GoldRule: {
    height: 2,
    width: 32,
    backgroundColor: COLOR.gold,
    marginBottom: 12,
  },
  h3: {
    fontFamily: FONT.heading,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
    marginTop: 14,
    marginBottom: 4,
  },
  paragraph: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLOR.slate,
    marginBottom: 8,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
    paddingLeft: 12,
    paddingRight: 8,
    marginVertical: 10,
    fontFamily: FONT.body,
    fontSize: 11,
    lineHeight: 1.55,
    fontStyle: "italic",
    color: COLOR.slateLight,
  },
  listItemRow: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 6,
  },
  listBullet: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    color: COLOR.goldDark,
    width: 12,
  },
  listText: {
    fontFamily: FONT.body,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLOR.slate,
    flex: 1,
  },
  hr: {
    borderTopWidth: 0.5,
    borderTopColor: COLOR.border,
    marginVertical: 14,
  },
  bold: { fontWeight: 700 },
  italic: { fontStyle: "italic" },
  code: {
    fontFamily: "Courier",
    fontSize: 10,
    color: COLOR.slate,
    backgroundColor: COLOR.creamSoft,
  },
});

// ----------------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------------

function InlineSpans({ text }: { text: string }) {
  const spans = parseSpans(text);
  return (
    <>
      {spans.map((sp, i) => {
        const styles = [
          sp.bold ? s.bold : null,
          sp.italic ? s.italic : null,
          sp.code ? s.code : null,
        ].filter(Boolean) as Array<typeof s.bold>;
        return (
          <Text key={i} style={styles.length > 0 ? styles : undefined}>
            {sp.text}
          </Text>
        );
      })}
    </>
  );
}

export function MarkdownView({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown);
  return (
    <View>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <View key={i} wrap={false}>
                <Text style={s.h2}>{b.text}</Text>
                <View style={s.h2GoldRule} />
              </View>
            );
          case "h3":
            return (
              <Text key={i} style={s.h3}>
                {b.text}
              </Text>
            );
          case "p":
            return (
              <Text key={i} style={s.paragraph}>
                <InlineSpans text={b.text} />
              </Text>
            );
          case "blockquote":
            return (
              <View key={i} style={s.blockquote}>
                <Text style={pdfStyles.body}>
                  <InlineSpans text={b.text} />
                </Text>
              </View>
            );
          case "li":
            return (
              <View key={i} style={s.listItemRow}>
                <Text style={s.listBullet}>•</Text>
                <Text style={s.listText}>
                  <InlineSpans text={b.text} />
                </Text>
              </View>
            );
          case "hr":
            return <View key={i} style={s.hr} />;
        }
      })}
    </View>
  );
}
