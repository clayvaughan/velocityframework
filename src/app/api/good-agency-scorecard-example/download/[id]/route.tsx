import {
  getScorecardDownload,
  isStorageConfigured,
  markScorecardDownloaded,
} from "@/lib/scorecard-example/storage";
import { ScorecardExampleReport } from "@/lib/pdf/ScorecardExampleReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { pdfErrorResponse, pdfSuccessResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }

  const { id } = await params;
  const row = await getScorecardDownload(id);
  if (!row.ok) {
    console.error("[scorecard-example/download] lookup", row);
    return pdfErrorResponse("Download unavailable.", 500);
  }
  if (!row.data) {
    return pdfErrorResponse("Download not found.", 404);
  }

  // Fire-and-forget — mark as downloaded on first fetch. Doesn't gate the PDF.
  void markScorecardDownloaded(id).catch((e) =>
    console.error("[scorecard-example/download] mark", e)
  );

  try {
    const buffer = await renderPdfToBuffer(<ScorecardExampleReport />);
    return pdfSuccessResponse(buffer, `velocity-scorecard-example-${id}.pdf`);
  } catch (e) {
    console.error("[scorecard-example/download] render failed", e);
    return pdfErrorResponse("PDF render failed.", 500);
  }
}
