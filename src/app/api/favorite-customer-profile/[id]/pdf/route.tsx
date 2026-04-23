import { NextResponse } from "next/server";
import {
  getProfiles,
  getWorksheet,
  isStorageConfigured,
  type ScopeGuardrails,
} from "@/lib/fcp/storage";
import { FCPReport, type FCPResolvedProfile } from "@/lib/pdf/FCPReport";
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

  const [wsRes, profilesRes] = await Promise.all([
    getWorksheet(id),
    getProfiles(id),
  ]);
  if (!wsRes.ok || !wsRes.data) {
    return NextResponse.json({ error: "Worksheet not found." }, { status: 404 });
  }
  if (!profilesRes.ok) {
    return NextResponse.json({ error: "Profile fetch failed." }, { status: 500 });
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
    return NextResponse.json(
      { error: "Worksheet has no completed profiles yet." },
      { status: 404 }
    );
  }

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

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="velocity-fcp-${id}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
