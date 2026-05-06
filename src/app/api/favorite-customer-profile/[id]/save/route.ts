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

  // Fire-and-forget HubSpot sync so the user's save response isn't blocked
  // on HubSpot latency. The .then() logs typed `{ ok: false }` failures —
  // a plain `.catch()` only catches thrown exceptions and would silently
  // swallow API rejections (the failure mode that hid the schema mismatch
  // diagnosed in commit 9d97c90).
  void syncFcpContact({
    email: worksheet.data.email,
    firstName: worksheet.data.first_name,
    companyName: worksheet.data.company_name,
    role: worksheet.data.role,
    industry: worksheet.data.industry,
    fcpProfileCount: Math.min(populated.length, 3) as 1 | 2 | 3,
    fcpHasScopeFilters: worksheet.data.has_scope_filters,
  })
    .then((result) => {
      if (!result.ok && result.skipped !== true) {
        console.error("[fcp/save] hubspot sync failed:", result);
      }
    })
    .catch((e) => console.error("[fcp/save] hubspot threw:", e));

  return NextResponse.json({ ok: true });
}
