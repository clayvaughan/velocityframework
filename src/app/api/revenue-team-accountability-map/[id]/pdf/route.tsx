import { NextResponse } from "next/server";
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

  const [mapRes, rolesRes] = await Promise.all([
    getRevenueMap(id),
    getRevenueRoles(id),
  ]);
  if (!mapRes.ok || !mapRes.data) {
    return NextResponse.json({ error: "Map not found." }, { status: 404 });
  }
  if (!rolesRes.ok) {
    return NextResponse.json({ error: "Role fetch failed." }, { status: 500 });
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
    return NextResponse.json(
      { error: "Map has no defined roles yet." },
      { status: 404 }
    );
  }

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

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="velocity-revenue-team-map-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
