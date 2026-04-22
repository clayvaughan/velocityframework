import { NextResponse } from "next/server";
import {
  getTeamQuiz,
  isStorageConfigured,
  submitTeamQuizResponse,
} from "@/lib/quiz/storage";
import { scoreAnswers, validateAnswers, type Answers } from "@/lib/quiz/scoring";

export const runtime = "nodejs";

type Body = { id?: string; answers?: Record<string, number> };
type Params = Promise<{ id: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const { id: teamQuizId } = await params;
  const body = (await req.json().catch(() => ({}))) as Body;
  const answers = body.answers as Answers | undefined;

  if (!answers) {
    return NextResponse.json({ error: "Missing answers." }, { status: 400 });
  }
  const invalid = validateAnswers(answers);
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: "Some answers are missing or out of range.", invalid },
      { status: 400 }
    );
  }

  // Confirm the team quiz exists (so strangers can't spam team_quiz_responses
  // with arbitrary ids).
  const quiz = await getTeamQuiz(teamQuizId);
  if (!quiz.ok || !quiz.data) {
    return NextResponse.json(
      { error: "Team quiz not found." },
      { status: 404 }
    );
  }

  const scored = scoreAnswers(answers);

  const write = await submitTeamQuizResponse({
    team_quiz_id: teamQuizId,
    answers,
    dimension_scores: scored.dimension_scores,
    overall_score: scored.overall_score,
    overall_tier: scored.overall_tier,
  });
  if (!write.ok) {
    console.error("[team/submit] storage write failed", write);
    return NextResponse.json(
      { error: "Could not save your response." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    resultUrl: `/health-survey/team/${teamQuizId}/thanks`,
  });
}
