import {
  getFreJobDescriptionDownload,
  isStorageConfigured,
  markFreJobDescriptionDownloaded,
} from "@/lib/fre-job-description/storage";
import { FRE_JOB_DESCRIPTION_DOC_ID } from "@/lib/fre-job-description/constants";
import { fetchFreJobDescriptionDoc } from "@/lib/fre-job-description/doc-fetcher";
import { parseFreJobDescription } from "@/lib/fre-job-description/parser";
import { FreJobDescriptionReport } from "@/lib/pdf/FreJobDescriptionReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { pdfErrorResponse, pdfSuccessResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }

  const { id } = await params;
  const row = await getFreJobDescriptionDownload(id);
  if (!row.ok) {
    console.error("[fre-job-description/download] lookup", row);
    return pdfErrorResponse("Download unavailable.", 500);
  }
  if (!row.data) {
    return pdfErrorResponse("Download not found.", 404);
  }

  void markFreJobDescriptionDownloaded(id).catch((e) =>
    console.error("[fre-job-description/download] mark", e)
  );

  const fetchResult = await fetchFreJobDescriptionDoc(
    FRE_JOB_DESCRIPTION_DOC_ID
  );

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  try {
    if (!fetchResult.ok) {
      const reference =
        fetchResult.reason === "http_error"
          ? `http_${fetchResult.status ?? "?"}`
          : fetchResult.reason;
      const buffer = await renderPdfToBuffer(
        <FreJobDescriptionReport
          doc={null}
          fetchError={reference}
          lastUpdated={lastUpdated}
        />
      );
      return pdfSuccessResponse(
        buffer,
        `velocity-fre-job-description-${id}.pdf`
      );
    }

    const parsed = parseFreJobDescription(fetchResult.content);
    const buffer = await renderPdfToBuffer(
      <FreJobDescriptionReport doc={parsed} lastUpdated={lastUpdated} />
    );
    return pdfSuccessResponse(buffer, `velocity-fre-job-description-${id}.pdf`);
  } catch (e) {
    console.error("[fre-job-description/download] render failed", e);
    return pdfErrorResponse("PDF render failed.", 500);
  }
}
