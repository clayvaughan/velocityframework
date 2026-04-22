import { NextResponse } from "next/server";
import {
  getTeamQuiz,
  getTeamQuizResponses,
  isStorageConfigured,
} from "@/lib/quiz/storage";
import { aggregateTeamResponses } from "@/lib/quiz/scoring";
import { TeamReport } from "@/lib/pdf/TeamReport";
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

  const [quizRes, respRes] = await Promise.all([
    getTeamQuiz(id),
    getTeamQuizResponses(id),
  ]);

  if (!quizRes.ok || !quizRes.data) {
    return NextResponse.json(
      { error: "Team quiz not found." },
      { status: 404 }
    );
  }
  if (!respRes.ok) {
    console.error("[team/pdf] responses fetch failed", respRes);
    return NextResponse.json({ error: "PDF unavailable." }, { status: 500 });
  }
  if (respRes.data.length === 0) {
    return NextResponse.json(
      { error: "No responses yet. Share the link with your team to collect responses first." },
      { status: 404 }
    );
  }

  const aggregate = aggregateTeamResponses(
    respRes.data.map((r) => ({
      answers: r.answers,
      dimension_scores: r.dimension_scores,
      overall_score: r.overall_score,
    }))
  );

  const buffer = await renderPdfToBuffer(
    <TeamReport
      teamName={quizRes.data.team_name}
      ownerFirstName={quizRes.data.owner_first_name}
      completedAt={new Date()}
      aggregate={aggregate}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="velocity-team-culture-check-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
