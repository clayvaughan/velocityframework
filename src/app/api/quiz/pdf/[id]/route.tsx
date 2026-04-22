import { NextResponse } from "next/server";
import { getQuizResult, isStorageConfigured } from "@/lib/quiz/storage";
import { recommendationsFor } from "@/lib/quiz/recommendations";
import { IndividualReport } from "@/lib/pdf/IndividualReport";
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
  const res = await getQuizResult(id);
  if (!res.ok) {
    console.error("[pdf] storage error", res);
    return NextResponse.json({ error: "PDF unavailable." }, { status: 500 });
  }
  const row = res.data;
  if (
    !row ||
    row.overall_score == null ||
    row.overall_tier == null ||
    !row.dimension_scores
  ) {
    return NextResponse.json(
      { error: "Quiz not completed." },
      { status: 404 }
    );
  }

  const recs = recommendationsFor(
    row.dimension_scores.map((d) => ({
      dimension: d.dimension,
      tier: d.tier,
    }))
  );

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

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="velocity-culture-check-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
