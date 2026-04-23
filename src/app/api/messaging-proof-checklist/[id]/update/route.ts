import { NextResponse } from "next/server";
import {
  getChecklist,
  isStorageConfigured,
  updateChecklist,
  upsertCollateralItem,
  type ChecklistMetaPatch,
} from "@/lib/messaging/storage";
import type { CollateralItemKey, CollateralStatus } from "@/lib/messaging/constants";

export const runtime = "nodejs";

type Body = {
  fields?: ChecklistMetaPatch;
  collateral?: Array<{
    item_key: CollateralItemKey;
    status: CollateralStatus;
    notes: string | null;
  }>;
};

type Params = Promise<{ id: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const existing = await getChecklist(id);
  if (!existing.ok) {
    console.error("[messaging/update] lookup", existing);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: "Checklist not found." }, { status: 404 });
  }
  if (existing.data.status !== "in_progress") {
    return NextResponse.json(
      { error: "Checklist is already finalized." },
      { status: 409 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Body;

  if (body.fields) {
    const r = await updateChecklist(id, body.fields);
    if (!r.ok) {
      console.error("[messaging/update] fields", r);
      return NextResponse.json(
        { error: "Could not save fields." },
        { status: 500 }
      );
    }
  }
  if (body.collateral) {
    for (const c of body.collateral) {
      const r = await upsertCollateralItem({
        checklist_id: id,
        item_key: c.item_key,
        status: c.status,
        notes: c.notes,
      });
      if (!r.ok) {
        console.error("[messaging/update] collateral", r);
        return NextResponse.json(
          { error: "Could not save collateral item." },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
