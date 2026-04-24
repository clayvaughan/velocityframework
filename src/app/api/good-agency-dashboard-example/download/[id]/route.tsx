import {
  getDashboardDownload,
  isStorageConfigured,
  markDashboardDownloaded,
} from "@/lib/dashboard-example/storage";
import { DashboardExampleReport } from "@/lib/pdf/DashboardExampleReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { pdfErrorResponse, pdfSuccessResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }

  const { id } = await params;
  const row = await getDashboardDownload(id);
  if (!row.ok) {
    console.error("[dashboard-example/download] lookup", row);
    return pdfErrorResponse("Download unavailable.", 500);
  }
  if (!row.data) {
    return pdfErrorResponse("Download not found.", 404);
  }

  void markDashboardDownloaded(id).catch((e) =>
    console.error("[dashboard-example/download] mark", e)
  );

  try {
    const buffer = await renderPdfToBuffer(<DashboardExampleReport />);
    return pdfSuccessResponse(buffer, `velocity-dashboard-example-${id}.pdf`);
  } catch (e) {
    console.error("[dashboard-example/download] render failed", e);
    return pdfErrorResponse("PDF render failed.", 500);
  }
}
