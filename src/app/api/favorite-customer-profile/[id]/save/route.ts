import { NextResponse } from "next/server";
import {
  getProfiles,
  getWorksheet,
  isStorageConfigured,
  updateWorksheetMeta,
} from "@/lib/fcp/storage";
import { syncFcpContact } from "@/lib/hubspot";

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
  console.log("[fcp-route-debug] Save route CALLED for id:", id);
  const worksheet = await getWorksheet(id);
  if (!worksheet.ok || !worksheet.data) {
    return NextResponse.json({ error: "Worksheet not found." }, { status: 404 });
  }

  const profilesRes = await getProfiles(id);
  if (!profilesRes.ok) {
    return NextResponse.json({ error: "Profile fetch failed." }, { status: 500 });
  }

  // Minimum: at least one profile with a profile_name.
  const populated = profilesRes.data.filter(
    (p) => p.profile_name && p.profile_name.trim().length > 0
  );
  if (populated.length === 0) {
    return NextResponse.json(
      { error: "At least one Favorite Customer Profile (with a name) is required to save." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const meta = await updateWorksheetMeta(id, {
    status: "saved",
    saved_at: now,
    updated_at: now,
  });
  if (!meta.ok) {
    console.error("[fcp/save] meta update", meta);
    return NextResponse.json({ error: "Could not save worksheet." }, { status: 500 });
  }

  // Diagnostic: awaiting the call (instead of fire-and-forget) so the
  // returned typed result is observable in production logs. Revert to
  // fire-and-forget once the silent-failure root cause is confirmed fixed.
  console.log("[fcp-route-debug] About to call syncFcpContact");
  try {
    const syncResult = await syncFcpContact({
      email: worksheet.data.email,
      firstName: worksheet.data.first_name,
      companyName: worksheet.data.company_name,
      role: worksheet.data.role,
      industry: worksheet.data.industry,
      fcpProfileCount: Math.min(populated.length, 3) as 1 | 2 | 3,
      fcpHasScopeFilters: worksheet.data.has_scope_filters,
    });
    console.log(
      "[fcp-route-debug] syncFcpContact returned, continuing — result:",
      JSON.stringify(syncResult)
    );
  } catch (e) {
    console.error(
      "[fcp-route-debug] syncFcpContact threw — message:",
      e instanceof Error ? e.message : String(e),
      "stack:",
      e instanceof Error ? e.stack : "no stack"
    );
  }

  return NextResponse.json({ ok: true });
}
