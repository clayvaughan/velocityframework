import { NextResponse } from "next/server";
import {
  completeQuizSubmission,
  getQuizResult,
  isStorageConfigured,
} from "@/lib/quiz/storage";
import { scoreAnswers, validateAnswers, type Answers } from "@/lib/quiz/scoring";
import { recommendationsFor } from "@/lib/quiz/recommendations";
import { syncContactWithQuizResult } from "@/lib/hubspot";

export const runtime = "nodejs";

type Body = { id?: string; answers?: Record<string, number> };

export async function POST(req: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const id = body.id;
  const answers = body.answers as Answers | undefined;

  if (!id || !answers) {
    return NextResponse.json(
      { error: "Missing quiz id or answers." },
      { status: 400 }
    );
  }

  const invalid = validateAnswers(answers);
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: "Some answers are missing or out of range.", invalid },
      { status: 400 }
    );
  }

  // Fetch the intake row so we have the user's details for HubSpot sync.
  const row = await getQuizResult(id);
  if (!row.ok || !row.data) {
    return NextResponse.json(
      { error: "Quiz session not found." },
      { status: 404 }
    );
  }

  const scored = scoreAnswers(answers);

  const write = await completeQuizSubmission(id, {
    answers,
    overall_score: scored.overall_score,
    overall_tier: scored.overall_tier,
    dimension_scores: scored.dimension_scores,
  });
  if (!write.ok) {
    console.error("[submit] storage write failed", write);
    return NextResponse.json(
      { error: "Could not save your submission." },
      { status: 500 }
    );
  }

  // Fire-and-forget HubSpot sync (best effort — won't block the user flow).
  const recs = recommendationsFor(
    scored.dimension_scores.map((d) => ({
      dimension: d.dimension,
      tier: d.tier,
    }))
  );
  void syncContactWithQuizResult({
    email: row.data.email,
    firstName: row.data.first_name,
    role: row.data.role,
    company: row.data.company ?? undefined,
    companySize: row.data.company_size ?? undefined,
    cultureHealthScore: scored.overall_score,
    cultureHealthTier: scored.overall_tier,
    recommendedResourceSlugs: recs.map((r) => r.resource.slug),
  }).catch((e) => console.error("[submit] hubspot sync error", e));

  return NextResponse.json({
    resultUrl: `/health-survey/results/${id}`,
  });
}
