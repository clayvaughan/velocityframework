/**
 * Messaging & Proof Checklist — multi-page PDF report.
 *
 * Structure:
 *   1. Cover
 *   2. Locked one-liner
 *   3. Message map (4 funnel stages)
 *   4. Case study (6 fields)
 *   5. Testimonial prompts + outreach notes
 *   6. Collateral audit (7 items + readiness score)
 *   7. CTA map (homepage, product, email)
 *   Final: Closing page
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { COLOR, FONT, pdfStyles, registerFonts } from "./theme";
import {
  COLLATERAL_ITEMS,
  TESTIMONIAL_PROMPTS,
  type CollateralItemKey,
  type CollateralStatus,
} from "@/lib/messaging/constants";

registerFonts();

export type MessagingCollateralRow = {
  key: CollateralItemKey;
  status: CollateralStatus | null;
  notes: string | null;
};

type Props = {
  firstName: string;
  companyName: string;
  completedAt: Date;
  onelinerFinal: string | null;
  messageTopOfFunnel: string | null;
  messageMiddleOfFunnel: string | null;
  messageBottomOfFunnel: string | null;
  messagePostPurchase: string | null;
  caseCustomer: string | null;
  caseProblem: string | null;
  caseWhyChoseYou: string | null;
  caseWhatYouDid: string | null;
  caseResult: string | null;
  caseFriendQuote: string | null;
  testimonialOutreachNotes: string | null;
  collateral: MessagingCollateralRow[];
  collateralScore: number;
  ctaHomeDirect: string | null;
  ctaHomeTransitional: string | null;
  ctaProductDirect: string | null;
  ctaProductTransitional: string | null;
  ctaEmailDirect: string | null;
  ctaEmailTransitional: string | null;
};

const s = StyleSheet.create({
  coverHero: { marginTop: 120 },
  coverTitle: { ...pdfStyles.display, fontSize: 44, lineHeight: 0.95 },
  coverSub: { ...pdfStyles.h2, color: COLOR.goldDark, marginTop: 18 },
  onelinerCard: {
    marginTop: 28,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
    backgroundColor: "#FFFFFF",
  },
  onelinerLabel: {
    fontFamily: FONT.heading,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  onelinerBody: {
    fontFamily: FONT.display,
    fontSize: 22,
    letterSpacing: 1.5,
    lineHeight: 1.2,
    color: COLOR.slate,
    marginTop: 10,
  },
  section: {
    marginBottom: 12,
    paddingBottom: 12,
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
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontFamily: FONT.heading,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  collateralRow: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.border,
  },
  ctaBlock: {
    marginBottom: 16,
    padding: 12,
    borderLeftWidth: 2,
    borderLeftColor: COLOR.gold,
    backgroundColor: "#FFFFFF",
  },
  ctaSurfaceLabel: {
    fontFamily: FONT.heading,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: COLOR.slate,
  },
  ctaPairRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  ctaPairCell: { flex: 1 },
  ctaPairLabel: {
    fontFamily: FONT.heading,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLOR.goldDark,
  },
  ctaPairBody: { ...pdfStyles.body, fontSize: 10, marginTop: 3 },
  scoreCard: {
    marginTop: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.gold,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreNumber: {
    fontFamily: FONT.display,
    fontSize: 36,
    letterSpacing: 2,
    color: COLOR.slate,
  },
  closingHeadline: {
    ...pdfStyles.display,
    fontSize: 46,
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
      <Text style={pdfStyles.eyebrow}>Messaging &amp; Proof Checklist</Text>
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

function statusColor(status: CollateralStatus | null): {
  bg: string;
  fg: string;
  label: string;
} {
  if (status === "yes") return { bg: "#E4F1E8", fg: COLOR.success, label: "Yes" };
  if (status === "partial") return { bg: "#FCEFD5", fg: COLOR.warning, label: "Partial" };
  if (status === "no") return { bg: "#F9E0E0", fg: "#B23535", label: "No" };
  return { bg: COLOR.creamSoft, fg: COLOR.mutedText, label: "Not set" };
}

export function MessagingReport({
  firstName,
  companyName,
  completedAt,
  onelinerFinal,
  messageTopOfFunnel,
  messageMiddleOfFunnel,
  messageBottomOfFunnel,
  messagePostPurchase,
  caseCustomer,
  caseProblem,
  caseWhyChoseYou,
  caseWhatYouDid,
  caseResult,
  caseFriendQuote,
  testimonialOutreachNotes,
  collateral,
  collateralScore,
  ctaHomeDirect,
  ctaHomeTransitional,
  ctaProductDirect,
  ctaProductTransitional,
  ctaEmailDirect,
  ctaEmailTransitional,
}: Props) {
  const dateStr = completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const collateralByKey = new Map<CollateralItemKey, MessagingCollateralRow>();
  for (const row of collateral) collateralByKey.set(row.key, row);

  const totalPages = 8;
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
          <Text style={pdfStyles.eyebrow}>Messaging &amp; Proof Checklist</Text>
          <Text style={[s.coverTitle, { marginTop: 14 }]}>{companyName}</Text>
          <Text style={s.coverSub}>
            {onelinerFinal ? "One-liner locked" : "Checklist saved"}
          </Text>
          <Text style={[pdfStyles.muted, { marginTop: 24 }]}>
            Completed by {firstName} · {dateStr}
          </Text>
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 2 — Locked one-liner ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>The anchor</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>Your locked one-liner</Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.onelinerCard}>
          <Text style={s.onelinerLabel}>Problem → Solution → Success</Text>
          <Text style={s.onelinerBody}>
            {onelinerFinal && onelinerFinal.trim().length > 0
              ? onelinerFinal
              : "(Not yet locked)"}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={[pdfStyles.muted, { fontStyle: "italic" }]}>
            Read it out loud. If you stumble, simplify. Share it with one sales
            rep and one marketer — ask them where it breaks in the wild. Fix
            one word. Lock it again.
          </Text>
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 3 — Message Map ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Step 2 · Message Map</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            One message across the buyer journey
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          <DeepSection
            label="Top of funnel — stranger becomes aware"
            body={messageTopOfFunnel}
          />
          <DeepSection
            label="Middle of funnel — aware becomes interested"
            body={messageMiddleOfFunnel}
          />
          <DeepSection
            label="Bottom of funnel — interested becomes buyer"
            body={messageBottomOfFunnel}
          />
          <DeepSection
            label="Post-purchase — buyer becomes advocate"
            body={messagePostPurchase}
          />
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 4 — Case Study ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Step 3 · Case Study</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            {caseCustomer && caseCustomer.trim().length > 0
              ? caseCustomer
              : "Case study"}
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          <DeepSection
            label="Their problem before working with you"
            body={caseProblem}
          />
          <DeepSection label="Why they chose you" body={caseWhyChoseYou} />
          <DeepSection label="What you did" body={caseWhatYouDid} />
          <DeepSection label="The result" body={caseResult} />
          <DeepSection
            label="What they'd tell a friend"
            body={caseFriendQuote}
          />
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 5 — Testimonial prompts ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Step 4 · Testimonial Prompts</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            Story, not praise
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          {TESTIMONIAL_PROMPTS.map((prompt, i) => (
            <View key={i} style={s.section}>
              <Text style={s.sectionLabel}>Prompt {i + 1}</Text>
              <Text style={s.sectionBody}>{prompt}</Text>
            </View>
          ))}
          {testimonialOutreachNotes && testimonialOutreachNotes.trim().length > 0 ? (
            <View style={{ marginTop: 16 }}>
              <Text style={s.sectionLabel}>Your outreach notes</Text>
              <Text style={s.sectionBody}>{testimonialOutreachNotes}</Text>
            </View>
          ) : null}
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 6 — Collateral audit ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Step 5 · Collateral Audit</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            Minimum Collateral Checklist
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={s.scoreCard}>
          <View>
            <Text style={s.onelinerLabel}>Collateral readiness</Text>
            <Text style={[pdfStyles.muted, { marginTop: 4 }]}>
              Your starting point. Re-audit in 30 days.
            </Text>
          </View>
          <Text style={s.scoreNumber}>{collateralScore}%</Text>
        </View>
        <View style={{ marginTop: 18 }}>
          {COLLATERAL_ITEMS.map((item) => {
            const row = collateralByKey.get(item.key);
            const c = statusColor(row?.status ?? null);
            return (
              <View key={item.key} style={s.collateralRow}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <Text style={[pdfStyles.body, { flex: 1, fontSize: 10 }]}>
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      s.statusPill,
                      { backgroundColor: c.bg, color: c.fg },
                    ]}
                  >
                    {c.label}
                  </Text>
                </View>
                {row?.notes && row.notes.trim().length > 0 ? (
                  <Text
                    style={[pdfStyles.muted, { marginTop: 4, fontSize: 9 }]}
                  >
                    {row.notes}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
        <Footer label={nextLabel()} />
      </Page>

      {/* ---------- Page 7 — CTA Map ---------- */}
      <Page size="LETTER" style={pdfStyles.page}>
        <Header />
        <View style={{ marginTop: 28 }}>
          <Text style={pdfStyles.eyebrow}>Step 6 · CTA Map</Text>
          <Text style={[pdfStyles.h2, { marginTop: 8 }]}>
            One direct. One transitional. Per surface.
          </Text>
          <View style={pdfStyles.goldRule} />
        </View>
        <View style={{ marginTop: 20 }}>
          <CtaSurface
            label="Homepage"
            direct={ctaHomeDirect}
            transitional={ctaHomeTransitional}
          />
          <CtaSurface
            label="Main product / service page"
            direct={ctaProductDirect}
            transitional={ctaProductTransitional}
          />
          <CtaSurface
            label="Email signature + outbound emails"
            direct={ctaEmailDirect}
            transitional={ctaEmailTransitional}
          />
        </View>
        <Footer label={nextLabel()} />
      </Page>

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
          Ship the{"\n"}messaging.
        </Text>
        <View style={{ ...pdfStyles.goldRule, marginTop: 18 }} />
        <Text style={s.closingSub}>
          If you confuse, you lose. You&rsquo;ve cleared the confusion. Now
          three moves turn it into revenue.
        </Text>
        <View style={s.ctaRow}>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>01</Text>
            <Text style={s.ctaTitle}>Run the Trust-Building Script</Text>
            <Text style={s.ctaBody}>
              The sales conversation that turns your locked one-liner into
              revenue. The one place in the Hustle pillar that depends most on
              messaging clarity.
            </Text>
            <Text style={s.ctaUrl}>
              velocityframework.com/toolbox/trust-building-script
            </Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>02</Text>
            <Text style={s.ctaTitle}>Re-audit collateral in 30 days</Text>
            <Text style={s.ctaBody}>
              Come back to this checklist on your 30-day review. Move one more
              item from &ldquo;partial&rdquo; to &ldquo;yes.&rdquo; Compound
              monthly.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/toolbox</Text>
          </View>
          <View style={s.ctaCard}>
            <Text style={s.ctaNumber}>03</Text>
            <Text style={s.ctaTitle}>Apply for FRE Certification</Text>
            <Text style={s.ctaBody}>
              Two days in Austin with Clay Vaughan. Twelve seats. Learn the
              framework that turns clear messaging into measurable client
              growth.
            </Text>
            <Text style={s.ctaUrl}>velocityframework.com/workshop</Text>
          </View>
        </View>
        <Text style={s.closingLine}>
          Messaging that drives Velocity is short, succinct, unchanging, and relevant.
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

function DeepSection({
  label,
  body,
}: {
  label: string;
  body: string | null;
}) {
  if (!body || !body.trim()) return null;
  return (
    <View style={s.section}>
      <Text style={s.sectionLabel}>{label}</Text>
      <Text style={s.sectionBody}>{body}</Text>
    </View>
  );
}

function CtaSurface({
  label,
  direct,
  transitional,
}: {
  label: string;
  direct: string | null;
  transitional: string | null;
}) {
  return (
    <View style={s.ctaBlock}>
      <Text style={s.ctaSurfaceLabel}>{label}</Text>
      <View style={s.ctaPairRow}>
        <View style={s.ctaPairCell}>
          <Text style={s.ctaPairLabel}>Direct</Text>
          <Text style={s.ctaPairBody}>
            {direct && direct.trim().length > 0 ? direct : "—"}
          </Text>
        </View>
        <View style={s.ctaPairCell}>
          <Text style={s.ctaPairLabel}>Transitional</Text>
          <Text style={s.ctaPairBody}>
            {transitional && transitional.trim().length > 0
              ? transitional
              : "—"}
          </Text>
        </View>
      </View>
    </View>
  );
}
