import {
  getTeamQuiz,
  getTeamQuizResponses,
  isStorageConfigured,
} from "@/lib/quiz/storage";
import { aggregateTeamResponses } from "@/lib/quiz/scoring";
import { TeamReport } from "@/lib/pdf/TeamReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { pdfErrorResponse, pdfSuccessResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }

  const { id } = await params;

  const [quizRes, respRes] = await Promise.all([
    getTeamQuiz(id),
    getTeamQuizResponses(id),
  ]);

  if (!quizRes.ok || !quizRes.data) {
    return pdfErrorResponse("Team quiz not found.", 404);
  }
  if (!respRes.ok) {
    console.error("[team/pdf] responses fetch failed", respRes);
    return pdfErrorResponse("PDF unavailable.", 500);
  }
  if (respRes.data.length === 0) {
    return pdfErrorResponse(
      "No responses yet. Share the link with your team to collect responses first.",
      404
    );
  }

  const aggregate = aggregateTeamResponses(
    respRes.data.map((r) => ({
      answers: r.answers,
      dimension_scores: r.dimension_scores,
      overall_score: r.overall_score,
    }))
  );

  try {
    const buffer = await renderPdfToBuffer(
      <TeamReport
        teamName={quizRes.data.team_name}
        ownerFirstName={quizRes.data.owner_first_name}
        completedAt={new Date()}
        aggregate={aggregate}
      />
    );
    return pdfSuccessResponse(buffer, `velocity-team-culture-check-${id}.pdf`);
  } catch (e) {
    console.error("[team/pdf] render failed", e);
    return pdfErrorResponse("PDF render failed.", 500);
  }
}
