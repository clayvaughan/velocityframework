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
import {
  logAndReturnPdfRenderError,
  pdfErrorResponse,
  pdfSuccessResponse,
} from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }
  const { id } = await params;

  const [planRes, faRes] = await Promise.all([
    getActionPlan(id),
    getFocusAreas(id),
  ]);
  if (!planRes.ok || !planRes.data) {
    return pdfErrorResponse("Plan not found.", 404);
  }
  if (!faRes.ok) {
    return pdfErrorResponse("Focus area fetch failed.", 500);
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

  try {
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
    return pdfSuccessResponse(buffer, `velocity-action-plan-${id}.pdf`);
  } catch (e) {
    return logAndReturnPdfRenderError("action-plan/pdf", e);
  }
}
