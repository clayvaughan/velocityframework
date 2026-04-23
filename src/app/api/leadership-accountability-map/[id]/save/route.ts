import { NextResponse } from "next/server";
import {
  getMap,
  getRoles,
  isStorageConfigured,
  updateMap,
} from "@/lib/accountability/storage";
import { syncAccountabilityMapContact } from "@/lib/hubspot";

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
  const existing = await getMap(id);
  if (!existing.ok || !existing.data) {
    return NextResponse.json({ error: "Map not found." }, { status: 404 });
  }

  const rolesRes = await getRoles(id);
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
  const meta = await updateMap(id, {
    status: "saved",
    saved_at: now,
    updated_at: now,
  });
  if (!meta.ok) {
    console.error("[accountability/save] meta", meta);
    return NextResponse.json({ error: "Could not save map." }, { status: 500 });
  }

  const nextReflectionISO =
    [
      existing.data.reflection_date_1,
      existing.data.reflection_date_2,
      existing.data.reflection_date_3,
    ]
      .filter((d): d is string => Boolean(d))
      .sort()
      .find((d) => new Date(d).getTime() >= Date.now() - 864e5) ?? null;

  void syncAccountabilityMapContact({
    email: existing.data.email,
    firstName: existing.data.first_name,
    companyName: existing.data.company_name,
    role: existing.data.role,
    roleCount: defined.length,
    nextReflectionDateISO: nextReflectionISO,
  }).catch((e) => console.error("[accountability/save] hubspot", e));

  return NextResponse.json({ ok: true });
}
