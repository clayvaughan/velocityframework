import { NextResponse } from "next/server";
import {
  getActionPlan,
  getFocusAreas,
  isStorageConfigured,
  updateActionPlanMeta,
} from "@/lib/action-plan/storage";
import { syncActionPlanContact } from "@/lib/hubspot";
import { TOXINS_BY_ID, type ToxinId } from "@/lib/action-plan/toxins";
import type { VirtueId } from "@/lib/action-plan/virtues";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function POST(_req: Request, { params }: { params: Params }) {
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

  const focusRes = await getFocusAreas(id);
  if (!focusRes.ok) return NextResponse.json({ error: "Focus area fetch failed." }, { status: 500 });

  // Validate: at least one focus area with required fields filled.
  const complete = focusRes.data.length > 0 && focusRes.data.every(
    (f) =>
      (f.counter_move_id || f.counter_move_custom) &&
      f.seven_day_action &&
      f.weekly_rhythm_id &&
      f.virtue
  );
  if (!complete) {
    return NextResponse.json(
      { error: "Plan is not complete yet." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const saveRes = await updateActionPlanMeta(id, {
    status: "saved",
    saved_at: now,
  });
  if (!saveRes.ok) {
    console.error("[action-plan/save] status update", saveRes);
    return NextResponse.json({ error: "Could not save plan." }, { status: 500 });
  }

  // Fire-and-forget HubSpot sync
  const toxinTitles = focusRes.data.map(
    (f) => TOXINS_BY_ID[f.toxin_id as ToxinId].title
  );
  const virtues = focusRes.data
    .map((f) => f.virtue as VirtueId | null)
    .filter((v): v is VirtueId => v !== null);
  void syncActionPlanContact({
    email: plan.data.email,
    firstName: plan.data.first_name,
    role: plan.data.role,
    teamSize: plan.data.team_size ?? undefined,
    focusAreaTitles: toxinTitles,
    virtues,
    reassessmentDate: plan.data.reassessment_date,
  }).catch((e) => console.error("[action-plan/save] hubspot", e));

  return NextResponse.json({ ok: true });
}
