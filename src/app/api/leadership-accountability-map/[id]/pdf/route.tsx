import {
  getMap,
  getRoles,
  isStorageConfigured,
} from "@/lib/accountability/storage";
import { DEFAULT_REFLECTION_QUESTION } from "@/lib/accountability/constants";
import {
  LeadershipAccountabilityReport,
  type AccountabilityRoleForPdf,
} from "@/lib/pdf/LeadershipAccountabilityReport";
import { PolishedReport } from "@/lib/pdf/PolishedReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { pdfErrorResponse, pdfSuccessResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }
  const { id } = await params;

  const [mapRes, rolesRes] = await Promise.all([getMap(id), getRoles(id)]);
  if (!mapRes.ok || !mapRes.data) {
    return pdfErrorResponse("Map not found.", 404);
  }
  if (!rolesRes.ok) {
    return pdfErrorResponse("Role fetch failed.", 500);
  }

  const map = mapRes.data;

  // If the user saved an AI-polished version, render that in place of the
  // raw-answers report. Raw answers stay intact in Supabase.
  if (map.polished_version) {
    try {
      const buffer = await renderPdfToBuffer(
        <PolishedReport
          firstName={map.first_name}
          companyName={map.company_name}
          generatedAt={
            map.updated_at ? new Date(map.updated_at) : new Date()
          }
          polishedMarkdown={map.polished_version}
          eyebrow="Leadership Accountability Map · AI-Polished"
          title="Your polished accountability map."
          intro="What follows is an AI-polished version of your saved Leadership Accountability Map. Treat suggested edits as starting points, not final copy. The original raw answers remain saved on velocityframework.com if you ever need to revisit them."
        />
      );
      return pdfSuccessResponse(buffer, `velocity-accountability-map-${id}.pdf`);
    } catch (e) {
      console.error("[accountability/pdf] polished render failed", e);
      return pdfErrorResponse("PDF render failed.", 500);
    }
  }

  const roles: AccountabilityRoleForPdf[] = rolesRes.data
    .filter((r) => r.role_name && r.role_name.trim().length > 0)
    .map((r) => ({
      position: r.position,
      roleName: r.role_name,
      ownerName: r.owner_name,
      missionStatement: r.mission_statement,
      responsibilities: [
        r.responsibility_1,
        r.responsibility_2,
        r.responsibility_3,
        r.responsibility_4,
        r.responsibility_5,
      ],
      accountableTo: r.accountable_to,
      isCustom: Boolean(r.is_custom),
    }));

  if (roles.length === 0) {
    return pdfErrorResponse("Map has no defined roles yet.", 404);
  }

  try {
    const buffer = await renderPdfToBuffer(
      <LeadershipAccountabilityReport
        firstName={map.first_name}
        companyName={map.company_name}
        completedAt={map.saved_at ? new Date(map.saved_at) : new Date()}
        roles={roles}
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
    return pdfSuccessResponse(buffer, `velocity-accountability-map-${id}.pdf`);
  } catch (e) {
    console.error("[accountability/pdf] render failed", e);
    return pdfErrorResponse("PDF render failed.", 500);
  }
}
