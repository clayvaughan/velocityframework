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
import { PolishedMessagingReport } from "@/lib/pdf/PolishedMessagingReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { pdfErrorResponse, pdfSuccessResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }
  const { id } = await params;

  const [clRes, ciRes] = await Promise.all([
    getChecklist(id),
    getCollateralItems(id),
  ]);
  if (!clRes.ok || !clRes.data) {
    return pdfErrorResponse("Checklist not found.", 404);
  }
  const checklist = clRes.data;

  // If the user has saved an AI-polished version, render that instead of
  // the raw-answers report. The polished Markdown lives in the same row
  // (polished_version column); raw answers remain in Supabase regardless.
  if (checklist.polished_version) {
    try {
      const buffer = await renderPdfToBuffer(
        <PolishedMessagingReport
          firstName={checklist.first_name}
          companyName={checklist.company_name}
          generatedAt={
            checklist.updated_at
              ? new Date(checklist.updated_at)
              : new Date()
          }
          polishedMarkdown={checklist.polished_version}
        />
      );
      return pdfSuccessResponse(buffer, `velocity-messaging-${id}.pdf`);
    } catch (e) {
      console.error("[messaging/pdf] polished render failed", e);
      return pdfErrorResponse("PDF render failed.", 500);
    }
  }

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

  try {
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
    return pdfSuccessResponse(buffer, `velocity-messaging-${id}.pdf`);
  } catch (e) {
    console.error("[messaging/pdf] render failed", e);
    return pdfErrorResponse("PDF render failed.", 500);
  }
}
