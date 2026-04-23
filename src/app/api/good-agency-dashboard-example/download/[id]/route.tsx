import { NextResponse } from "next/server";
import {
  getDashboardDownload,
  isStorageConfigured,
  markDashboardDownloaded,
} from "@/lib/dashboard-example/storage";
import { DashboardExampleReport } from "@/lib/pdf/DashboardExampleReport";
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
  const row = await getDashboardDownload(id);
  if (!row.ok) {
    console.error("[dashboard-example/download] lookup", row);
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

  void markDashboardDownloaded(id).catch((e) =>
    console.error("[dashboard-example/download] mark", e)
  );

  const buffer = await renderPdfToBuffer(<DashboardExampleReport />);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="velocity-dashboard-example-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
