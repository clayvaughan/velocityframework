import {
  getProfiles,
  getWorksheet,
  isStorageConfigured,
  type ScopeGuardrails,
} from "@/lib/fcp/storage";
import { FCPReport, type FCPResolvedProfile } from "@/lib/pdf/FCPReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { pdfErrorResponse, pdfSuccessResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return pdfErrorResponse("Supabase is not configured.", 503);
  }
  const { id } = await params;

  const [wsRes, profilesRes] = await Promise.all([
    getWorksheet(id),
    getProfiles(id),
  ]);
  if (!wsRes.ok || !wsRes.data) {
    return pdfErrorResponse("Worksheet not found.", 404);
  }
  if (!profilesRes.ok) {
    return pdfErrorResponse("Profile fetch failed.", 500);
  }

  const worksheet = wsRes.data;
  const resolved: FCPResolvedProfile[] = profilesRes.data
    .filter((p) => p.profile_name && p.profile_name.trim().length > 0)
    .map((p) => ({
      position: p.position,
      profile_name: p.profile_name ?? "",
      who_they_are: p.who_they_are ?? "",
      how_they_come_in: p.how_they_come_in ?? "",
      why_great_fit: p.why_great_fit ?? "",
      what_they_say_yes_to: p.what_they_say_yes_to ?? "",
      what_we_say_yes_to: p.what_we_say_yes_to ?? "",
      when_we_say_no: p.when_we_say_no ?? "",
      examples: p.examples ?? "",
      hospitality_cues: p.hospitality_cues ?? "",
    }));

  if (resolved.length === 0) {
    return pdfErrorResponse("Worksheet has no completed profiles yet.", 404);
  }

  try {
    const buffer = await renderPdfToBuffer(
      <FCPReport
        firstName={worksheet.first_name}
        companyName={worksheet.company_name}
        scopeGuardrails={worksheet.scope_guardrails as ScopeGuardrails | null}
        hasScopeFilters={worksheet.has_scope_filters}
        profiles={resolved}
        completedAt={worksheet.saved_at ? new Date(worksheet.saved_at) : new Date()}
      />
    );
    return pdfSuccessResponse(buffer, `velocity-fcp-${id}.pdf`);
  } catch (e) {
    console.error("[fcp/pdf] render failed", e);
    return pdfErrorResponse("PDF render failed.", 500);
  }
}
