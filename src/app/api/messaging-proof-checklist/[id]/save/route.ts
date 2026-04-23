import { NextResponse } from "next/server";
import {
  getChecklist,
  getCollateralItems,
  isStorageConfigured,
  updateChecklist,
} from "@/lib/messaging/storage";
import { collateralReadinessScore } from "@/lib/messaging/constants";
import { syncMessagingChecklistContact } from "@/lib/hubspot";

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
  const existing = await getChecklist(id);
  if (!existing.ok || !existing.data) {
    return NextResponse.json({ error: "Checklist not found." }, { status: 404 });
  }

  if (!existing.data.oneliner_final || existing.data.oneliner_final.trim().length === 0) {
    return NextResponse.json(
      { error: "Lock your one-liner before saving." },
      { status: 400 }
    );
  }

  const collateral = await getCollateralItems(id);
  const statuses: Record<string, "yes" | "no" | "partial"> = {};
  if (collateral.ok) {
    for (const c of collateral.data) statuses[c.item_key] = c.status;
  }
  const score = collateralReadinessScore(statuses);

  const now = new Date().toISOString();
  const meta = await updateChecklist(id, {
    status: "saved",
    saved_at: now,
    updated_at: now,
  });
  if (!meta.ok) {
    console.error("[messaging/save] meta", meta);
    return NextResponse.json({ error: "Could not save checklist." }, { status: 500 });
  }

  void syncMessagingChecklistContact({
    email: existing.data.email,
    firstName: existing.data.first_name,
    companyName: existing.data.company_name,
    role: existing.data.role,
    onelinerFinal: existing.data.oneliner_final,
    collateralScore: score,
  }).catch((e) => console.error("[messaging/save] hubspot", e));

  return NextResponse.json({ ok: true });
}
