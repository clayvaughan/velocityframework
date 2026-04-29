import {
  getRevenueMap,
  getRevenueRoles,
  isStorageConfigured,
} from "@/lib/revenue-team/storage";
import { DEFAULT_REFLECTION_QUESTION } from "@/lib/revenue-team/constants";
import {
  RevenueTeamAccountabilityReport,
  type RevenueRoleForPdf,
} from "@/lib/pdf/RevenueTeamAccountabilityReport";
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

  const [mapRes, rolesRes] = await Promise.all([
    getRevenueMap(id),
    getRevenueRoles(id),
  ]);
  if (!mapRes.ok || !mapRes.data) {
    return pdfErrorResponse("Map not found.", 404);
  }
  if (!rolesRes.ok) {
    return pdfErrorResponse("Role fetch failed.", 500);
  }

  const map = mapRes.data;
  const roles: RevenueRoleForPdf[] = rolesRes.data
    .filter((r) => r.role_name && r.role_name.trim().length > 0)
    .map((r) => ({
      position: r.position,
      roleName: r.role_name,
      ownerName: r.owner_name,
      missionStatement: r.mission_statement,
      metrics: [r.metric_1, r.metric_2, r.metric_3],
      responsibilities: [
        r.responsibility_1,
        r.responsibility_2,
        r.responsibility_3,
        r.responsibility_4,
        r.responsibility_5,
      ],
      accountableTo: r.accountable_to,
      isCustom: Boolean(r.is_custom),
      isDirectorOfRevenue: r.role_type === "director_of_revenue",
    }));

  if (roles.length === 0) {
    return pdfErrorResponse("Map has no defined roles yet.", 404);
  }

  try {
    const buffer = await renderPdfToBuffer(
      <RevenueTeamAccountabilityReport
        firstName={map.first_name}
        companyName={map.company_name}
        completedAt={map.saved_at ? new Date(map.saved_at) : new Date()}
        roles={roles}
        weeklyMeetingDay={map.weekly_meeting_day}
        weeklyMeetingTime={map.weekly_meeting_time}
        weeklyMeetingDuration={map.weekly_meeting_duration}
        weeklyMeetingAgenda={map.weekly_meeting_agenda}
        reflectionDate1={map.reflection_date_1}
        reflectionDate2={map.reflection_date_2}
        reflectionDate3={map.reflection_date_3}
        reflectionQuestion={
          map.reflection_question && map.reflection_question.trim().length > 0
            ? map.reflection_question
            : DEFAULT_REFLECTION_QUESTION
        }
      />
    );
    return pdfSuccessResponse(buffer, `velocity-revenue-team-map-${id}.pdf`);
  } catch (e) {
    return logAndReturnPdfRenderError("revenue-team/pdf", e);
  }
}
