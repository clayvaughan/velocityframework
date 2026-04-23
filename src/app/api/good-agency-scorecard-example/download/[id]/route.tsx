import { NextResponse } from "next/server";
import {
  getScorecardDownload,
  isStorageConfigured,
  markScorecardDownloaded,
} from "@/lib/scorecard-example/storage";
import { ScorecardExampleReport } from "@/lib/pdf/ScorecardExampleReport";
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
  const row = await getScorecardDownload(id);
  if (!row.ok) {
    console.error("[scorecard-example/download] lookup", row);
    return NextResponse.json(
      { error: "Download unavailable." },
      { status: 500 }
    );
  }
  if (!row.data) {
    return NextResponse.json(
      { error: "Download not found." },
      { status: 404 }
    );
  }

  // Fire-and-forget — mark as downloaded on first fetch. Doesn't gate the PDF.
  void markScorecardDownloaded(id).catch((e) =>
    console.error("[scorecard-example/download] mark", e)
  );

  const buffer = await renderPdfToBuffer(<ScorecardExampleReport />);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="velocity-scorecard-example-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
