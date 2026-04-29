import {
  getTrustBuildingScriptDownload,
  isStorageConfigured,
  markTrustBuildingScriptDownloaded,
} from "@/lib/trust-building-script/storage";
import { TRUST_BUILDING_SCRIPT_DOC_ID } from "@/lib/trust-building-script/constants";
import { fetchTrustBuildingScriptDoc } from "@/lib/trust-building-script/doc-fetcher";
import { parseTrustBuildingScript } from "@/lib/trust-building-script/parser";
import { TrustBuildingScriptReport } from "@/lib/pdf/TrustBuildingScriptReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import {
  logAndReturnPdfRenderError,
  pdfErrorResponse,
  pdfSuccessResponse,
} from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }

  const { id } = await params;
  const row = await getTrustBuildingScriptDownload(id);
  if (!row.ok) {
    console.error("[trust-building-script/download] lookup", row);
    return pdfErrorResponse("Download unavailable.", 500);
  }
  if (!row.data) {
    return pdfErrorResponse("Download not found.", 404);
  }

  // Fire-and-forget — mark as downloaded on first fetch. Doesn't gate the PDF.
  void markTrustBuildingScriptDownloaded(id).catch((e) =>
    console.error("[trust-building-script/download] mark", e)
  );

  const fetchResult = await fetchTrustBuildingScriptDoc(
    TRUST_BUILDING_SCRIPT_DOC_ID
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
        <TrustBuildingScriptReport
          doc={null}
          fetchError={reference}
          lastUpdated={lastUpdated}
        />
      );
      return pdfSuccessResponse(
        buffer,
        `velocity-sample-trust-building-script-${id}.pdf`
      );
    }

    const parsed = parseTrustBuildingScript(fetchResult.content);
    const buffer = await renderPdfToBuffer(
      <TrustBuildingScriptReport
        doc={parsed}
        lastUpdated={lastUpdated}
      />
    );
    return pdfSuccessResponse(
      buffer,
      `velocity-sample-trust-building-script-${id}.pdf`
    );
  } catch (e) {
    return logAndReturnPdfRenderError("trust-building-script/download", e);
  }
}
