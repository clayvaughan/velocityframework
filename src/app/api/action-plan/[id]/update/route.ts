import { NextResponse } from "next/server";
import {
  getActionPlan,
  isStorageConfigured,
  replaceFocusAreas,
  updateActionPlanMeta,
} from "@/lib/action-plan/storage";
import type { ToxinId } from "@/lib/action-plan/toxins";
import type { VirtueId } from "@/lib/action-plan/virtues";
import type { WeeklyRhythmId } from "@/lib/action-plan/weekly-rhythms";

export const runtime = "nodejs";

type Body = {
  focusAreas?: Array<{
    toxinId: ToxinId;
    counterMoveId: string | null;
    counterMoveCustom: string | null;
    virtueId: VirtueId | null;
    sevenDayAction: string;
    weeklyRhythmId: WeeklyRhythmId | null;
    weeklyRhythmCustom: string | null;
  }>;
  reassessmentDays?: 30 | 60 | 90;
  accountabilityPartnerName?: string | null;
  accountabilityPartnerEmail?: string | null;
  sendPartnerInvite?: boolean;
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
  if (!plan.ok) {
    console.error("[action-plan/update] plan lookup", plan);
    return NextResponse.json({ error: "Plan lookup failed." }, { status: 500 });
  }
  if (!plan.data) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }
  if (plan.data.status !== "in_progress") {
    return NextResponse.json(
      { error: "Plan is already finalized." },
      { status: 409 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Body;

  if (body.focusAreas) {
    const areas = body.focusAreas.slice(0, 3).map((f, i) => ({
      order_index: i + 1,
      toxin_id: f.toxinId,
      counter_move_id: f.counterMoveId,
      counter_move_custom: f.counterMoveCustom,
      virtue: f.virtueId,
      seven_day_action: f.sevenDayAction ?? null,
      weekly_rhythm_id: f.weeklyRhythmId,
      weekly_rhythm_custom: f.weeklyRhythmCustom,
    }));
    const replaceRes = await replaceFocusAreas(id, areas);
    if (!replaceRes.ok) {
      console.error("[action-plan/update] replace focus areas", replaceRes);
      return NextResponse.json(
        { error: "Could not save focus areas." },
        { status: 500 }
      );
    }
  }

  const metaPatch: Parameters<typeof updateActionPlanMeta>[1] = {};
  if (body.reassessmentDays) {
    metaPatch.reassessment_days = body.reassessmentDays;
    metaPatch.reassessment_date = new Date(
      Date.now() + body.reassessmentDays * 864e5
    )
      .toISOString()
      .slice(0, 10);
  }
  if (body.accountabilityPartnerName !== undefined) {
    metaPatch.accountability_partner_name = body.accountabilityPartnerName;
  }
  if (body.accountabilityPartnerEmail !== undefined) {
    metaPatch.accountability_partner_email = body.accountabilityPartnerEmail;
  }
  if (body.sendPartnerInvite !== undefined) {
    metaPatch.send_partner_invite = body.sendPartnerInvite;
  }

  if (Object.keys(metaPatch).length > 0) {
    const metaRes = await updateActionPlanMeta(id, metaPatch);
    if (!metaRes.ok) {
      console.error("[action-plan/update] meta update", metaRes);
      return NextResponse.json(
        { error: "Could not save plan metadata." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
