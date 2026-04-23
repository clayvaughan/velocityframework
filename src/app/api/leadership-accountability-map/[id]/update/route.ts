import { NextResponse } from "next/server";
import {
  deleteRolesOutsideRange,
  getMap,
  isStorageConfigured,
  updateMap,
  upsertRole,
  type MapMetaPatch,
  type RoleInput,
} from "@/lib/accountability/storage";

export const runtime = "nodejs";

type Body = {
  fields?: MapMetaPatch;
  roles?: Omit<RoleInput, "map_id">[];
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
  const existing = await getMap(id);
  if (!existing.ok) {
    console.error("[accountability/update] lookup", existing);
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
    const r = await updateMap(id, body.fields);
    if (!r.ok) {
      console.error("[accountability/update] fields", r);
      return NextResponse.json(
        { error: "Could not save fields." },
        { status: 500 }
      );
    }
  }

  if (body.roles) {
    const positions: number[] = [];
    for (const role of body.roles) {
      const r = await upsertRole({ ...role, map_id: id });
      if (!r.ok) {
        console.error("[accountability/update] role", r);
        return NextResponse.json(
          { error: "Could not save role." },
          { status: 500 }
        );
      }
      positions.push(role.position);
    }
    // Drop any roles at positions the client didn't send — user may have
    // un-checked a default role or removed a custom one.
    const prune = await deleteRolesOutsideRange(id, positions);
    if (!prune.ok) {
      console.error("[accountability/update] prune", prune);
      return NextResponse.json(
        { error: "Could not prune deselected roles." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
