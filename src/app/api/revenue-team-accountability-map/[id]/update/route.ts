import { NextResponse } from "next/server";
import {
  deleteRevenueRolesOutsideRange,
  getRevenueMap,
  isStorageConfigured,
  updateRevenueMap,
  upsertRevenueRole,
  type RevenueMapMetaPatch,
  type RevenueRoleInput,
} from "@/lib/revenue-team/storage";

export const runtime = "nodejs";

type Body = {
  fields?: RevenueMapMetaPatch;
  roles?: Omit<RevenueRoleInput, "map_id">[];
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
  const existing = await getRevenueMap(id);
  if (!existing.ok) {
    console.error("[revenue-team/update] lookup", existing);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: "Map not found." }, { status: 404 });
  }
  if (existing.data.status !== "in_progress") {
    return NextResponse.json(
      { error: "Map is already finalized." },
      { status: 409 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Body;

  if (body.fields) {
    const r = await updateRevenueMap(id, body.fields);
    if (!r.ok) {
      console.error("[revenue-team/update] fields", r);
      return NextResponse.json(
        { error: "Could not save fields." },
        { status: 500 }
      );
    }
  }

  if (body.roles) {
    const positions: number[] = [];
    for (const role of body.roles) {
      const r = await upsertRevenueRole({ ...role, map_id: id });
      if (!r.ok) {
        console.error("[revenue-team/update] role", r);
        return NextResponse.json(
          { error: "Could not save role." },
          { status: 500 }
        );
      }
      positions.push(role.position);
    }
    const prune = await deleteRevenueRolesOutsideRange(id, positions);
    if (!prune.ok) {
      console.error("[revenue-team/update] prune", prune);
      return NextResponse.json(
        { error: "Could not prune deselected roles." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
