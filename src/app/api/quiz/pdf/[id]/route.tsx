import { getQuizResult, isStorageConfigured } from "@/lib/quiz/storage";
import { recommendationsFor } from "@/lib/quiz/recommendations";
import { IndividualReport } from "@/lib/pdf/IndividualReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { pdfErrorResponse, pdfSuccessResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }

  const { id } = await params;
  const res = await getQuizResult(id);
  if (!res.ok) {
    console.error("[pdf] storage error", res);
    return pdfErrorResponse("PDF unavailable.", 500);
  }
  const row = res.data;
  if (
    !row ||
    row.overall_score == null ||
    row.overall_tier == null ||
    !row.dimension_scores
  ) {
    return pdfErrorResponse("Quiz not completed.", 404);
  }

  const recs = recommendationsFor(
    row.dimension_scores.map((d) => ({
      dimension: d.dimension,
      tier: d.tier,
    }))
  );

  try {
    const buffer = await renderPdfToBuffer(
      <IndividualReport
        firstName={row.first_name}
        completedAt={row.completed_at ? new Date(row.completed_at) : new Date()}
        overall_score={row.overall_score}
        overall_tier={row.overall_tier}
        dimension_scores={row.dimension_scores}
        recommendations={recs}
      />
    );
    return pdfSuccessResponse(buffer, `velocity-culture-check-${id}.pdf`);
  } catch (e) {
    console.error("[pdf] render failed", e);
    return pdfErrorResponse("PDF render failed.", 500);
  }
}
