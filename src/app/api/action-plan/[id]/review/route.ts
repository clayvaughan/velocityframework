import { NextResponse } from "next/server";
import {
  getActionPlan,
  isStorageConfigured,
  submitActionPlanReview,
  updateActionPlanMeta,
  type ReviewResponse,
} from "@/lib/action-plan/storage";

export const runtime = "nodejs";

type Body = {
  responses?: Record<string, ReviewResponse>;
  overall_reflection?: string | null;
};

type Params = Promise<{ id: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const plan = await getActionPlan(id);
  if (!plan.ok) return NextResponse.json({ error: "Plan lookup failed." }, { status: 500 });
  if (!plan.data) return NextResponse.json({ error: "Plan not found." }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as Body;
  const responses = body.responses ?? {};
  const validStates = new Set(["yes", "partially", "no", "not_yet"]);
  if (
    Object.keys(responses).length === 0 ||
    Object.values(responses).some((v) => !validStates.has(v))
  ) {
    return NextResponse.json(
      { error: "Invalid or missing responses." },
      { status: 400 }
    );
  }

  const write = await submitActionPlanReview({
    action_plan_id: id,
    responses,
    overall_reflection: body.overall_reflection ?? null,
  });
  if (!write.ok) {
    console.error("[action-plan/review]", write);
    return NextResponse.json(
      { error: "Could not save your review." },
      { status: 500 }
    );
  }

  // Mark the plan as completed so the nurture sequence can branch on it.
  await updateActionPlanMeta(id, {
    status: "completed",
    completed_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
