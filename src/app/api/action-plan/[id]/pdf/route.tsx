import { NextResponse } from "next/server";
import {
  getActionPlan,
  getFocusAreas,
  isStorageConfigured,
} from "@/lib/action-plan/storage";
import {
  counterMoveById,
  COUNTER_MOVES,
} from "@/lib/action-plan/counter-moves";
import { labelForRhythm, type WeeklyRhythmId } from "@/lib/action-plan/weekly-rhythms";
import type { ToxinId } from "@/lib/action-plan/toxins";
import type { VirtueId } from "@/lib/action-plan/virtues";
import { ActionPlanReport } from "@/lib/pdf/ActionPlanReport";
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

  const [planRes, faRes] = await Promise.all([
    getActionPlan(id),
    getFocusAreas(id),
  ]);
  if (!planRes.ok || !planRes.data) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }
  if (!faRes.ok) {
    return NextResponse.json({ error: "Focus area fetch failed." }, { status: 500 });
  }

  const plan = planRes.data;
  const reassessmentDays = (plan.reassessment_days ?? 30) as 30 | 60 | 90;
  const reassessmentDate = plan.reassessment_date
    ? new Date(plan.reassessment_date)
    : new Date(Date.now() + reassessmentDays * 864e5);

  const focusAreas = faRes.data.map((f) => {
    const toxinId = f.toxin_id as ToxinId;
    const counterMoveText =
      f.counter_move_custom ??
      counterMoveById(toxinId, f.counter_move_id ?? "")?.text ??
      COUNTER_MOVES[toxinId]?.[0]?.text ??
      "";
    return {
      toxinId,
      virtueId: f.virtue as VirtueId | null,
      sevenDayAction: f.seven_day_action ?? "",
      weeklyRhythmLabel: labelForRhythm(
        f.weekly_rhythm_id as WeeklyRhythmId | null,
        f.weekly_rhythm_custom
      ),
      counterMoveText,
    };
  });

  // Consolidate unique weekly rhythms for the accountability page
  const weeklyLabels = Array.from(
    new Set(focusAreas.map((f) => f.weeklyRhythmLabel).filter(Boolean))
  );
  const weeklyCheckInLabel =
    weeklyLabels.length === 1
      ? weeklyLabels[0]
      : weeklyLabels.join(" · ") || "Weekly 30-minute check-in";

  const buffer = await renderPdfToBuffer(
    <ActionPlanReport
      firstName={plan.first_name}
      reassessmentDays={reassessmentDays}
      reassessmentDate={reassessmentDate}
      focusAreas={focusAreas}
      accountabilityPartnerName={plan.accountability_partner_name}
      weeklyCheckInLabel={weeklyCheckInLabel}
      planUrl={`https://velocityframework.com/action-plan/saved/${id}`}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="velocity-action-plan-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
