import { NextResponse } from "next/server";
import {
  getRevenueMap,
  getRevenueRoles,
  isStorageConfigured,
  updateRevenueMap,
} from "@/lib/revenue-team/storage";
import { syncRevenueTeamMapContact } from "@/lib/hubspot";

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
  const existing = await getRevenueMap(id);
  if (!existing.ok || !existing.data) {
    return NextResponse.json({ error: "Map not found." }, { status: 404 });
  }

  const rolesRes = await getRevenueRoles(id);
  if (!rolesRes.ok) {
    return NextResponse.json({ error: "Role fetch failed." }, { status: 500 });
  }
  const defined = rolesRes.data.filter(
    (r) => r.role_name && r.role_name.trim().length > 0
  );
  if (defined.length === 0) {
    return NextResponse.json(
      { error: "At least one role is required to save the map." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const meta = await updateRevenueMap(id, {
    status: "saved",
    saved_at: now,
    updated_at: now,
  });
  if (!meta.ok) {
    console.error("[revenue-team/save] meta", meta);
    return NextResponse.json({ error: "Could not save map." }, { status: 500 });
  }

  void syncRevenueTeamMapContact({
    email: existing.data.email,
    firstName: existing.data.first_name,
    companyName: existing.data.company_name,
    role: existing.data.role,
    roleCount: defined.length,
    hasDirectorOfRevenue: existing.data.has_director_of_revenue,
    annualRevenueRange: existing.data.annual_revenue,
  }).catch((e) => console.error("[revenue-team/save] hubspot", e));

  return NextResponse.json({ ok: true });
}
