import { NextResponse } from "next/server";
import {
  getChecklist,
  getCollateralItems,
  isStorageConfigured,
} from "@/lib/messaging/storage";
import {
  COLLATERAL_ITEMS,
  collateralReadinessScore,
  type CollateralItemKey,
  type CollateralStatus,
} from "@/lib/messaging/constants";
import {
  MessagingReport,
  type MessagingCollateralRow,
} from "@/lib/pdf/MessagingReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }
  const { id } = await params;

  const [clRes, ciRes] = await Promise.all([
    getChecklist(id),
    getCollateralItems(id),
  ]);
  if (!clRes.ok || !clRes.data) {
    return NextResponse.json({ error: "Checklist not found." }, { status: 404 });
  }
  const checklist = clRes.data;

  const items = ciRes.ok ? ciRes.data : [];
  const statuses: Record<string, CollateralStatus> = {};
  for (const row of items) statuses[row.item_key] = row.status;
  const score = collateralReadinessScore(statuses);

  const collateral: MessagingCollateralRow[] = COLLATERAL_ITEMS.map((item) => {
    const row = items.find((r) => r.item_key === item.key);
    return {
      key: item.key as CollateralItemKey,
      status: (row?.status ?? null) as CollateralStatus | null,
      notes: row?.notes ?? null,
    };
  });

  const buffer = await renderPdfToBuffer(
    <MessagingReport
      firstName={checklist.first_name}
      companyName={checklist.company_name}
      completedAt={
        checklist.saved_at ? new Date(checklist.saved_at) : new Date()
      }
      onelinerFinal={checklist.oneliner_final}
      messageTopOfFunnel={checklist.message_top_of_funnel}
      messageMiddleOfFunnel={checklist.message_middle_of_funnel}
      messageBottomOfFunnel={checklist.message_bottom_of_funnel}
      messagePostPurchase={checklist.message_post_purchase}
      caseCustomer={checklist.case_customer}
      caseProblem={checklist.case_problem}
      caseWhyChoseYou={checklist.case_why_chose_you}
      caseWhatYouDid={checklist.case_what_you_did}
      caseResult={checklist.case_result}
      caseFriendQuote={checklist.case_friend_quote}
      testimonialOutreachNotes={checklist.testimonial_outreach_notes}
      collateral={collateral}
      collateralScore={score}
      ctaHomeDirect={checklist.cta_home_direct}
      ctaHomeTransitional={checklist.cta_home_transitional}
      ctaProductDirect={checklist.cta_product_direct}
      ctaProductTransitional={checklist.cta_product_transitional}
      ctaEmailDirect={checklist.cta_email_direct}
      ctaEmailTransitional={checklist.cta_email_transitional}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="velocity-messaging-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
