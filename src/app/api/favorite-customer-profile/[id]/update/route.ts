import { NextResponse } from "next/server";
import {
  deleteProfilesOutsideRange,
  getWorksheet,
  isStorageConfigured,
  updateWorksheetMeta,
  upsertProfile,
  type FcpProfileInput,
  type ScopeGuardrails,
} from "@/lib/fcp/storage";

export const runtime = "nodejs";

type ProfilePayload = {
  position: 1 | 2 | 3;
  profile_name?: string | null;
  who_they_are?: string | null;
  how_they_come_in?: string | null;
  why_great_fit?: string | null;
  what_they_say_yes_to?: string | null;
  what_we_say_yes_to?: string | null;
  when_we_say_no?: string | null;
  examples?: string | null;
  hospitality_cues?: string | null;
};

type Body = {
  hasScopeFilters?: boolean;
  scopeGuardrails?: ScopeGuardrails | null;
  profiles?: ProfilePayload[];
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
  const worksheet = await getWorksheet(id);
  if (!worksheet.ok) {
    console.error("[fcp/update] worksheet lookup", worksheet);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
  if (!worksheet.data) {
    return NextResponse.json({ error: "Worksheet not found." }, { status: 404 });
  }
  if (worksheet.data.status !== "in_progress") {
    return NextResponse.json(
      { error: "Worksheet is already finalized." },
      { status: 409 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Body;

  const metaPatch: Parameters<typeof updateWorksheetMeta>[1] = {};
  if (typeof body.hasScopeFilters === "boolean") {
    metaPatch.has_scope_filters = body.hasScopeFilters;
  }
  if (body.scopeGuardrails !== undefined) {
    metaPatch.scope_guardrails = body.scopeGuardrails;
  }
  if (Object.keys(metaPatch).length > 0) {
    const m = await updateWorksheetMeta(id, metaPatch);
    if (!m.ok) {
      console.error("[fcp/update] meta", m);
      return NextResponse.json(
        { error: "Could not save metadata." },
        { status: 500 }
      );
    }
  }

  if (body.profiles) {
    const keep: number[] = [];
    for (const p of body.profiles) {
      if (![1, 2, 3].includes(p.position)) continue;
      keep.push(p.position);
      const input: FcpProfileInput = {
        worksheet_id: id,
        position: p.position,
        profile_name: p.profile_name ?? null,
        who_they_are: p.who_they_are ?? null,
        how_they_come_in: p.how_they_come_in ?? null,
        why_great_fit: p.why_great_fit ?? null,
        what_they_say_yes_to: p.what_they_say_yes_to ?? null,
        what_we_say_yes_to: p.what_we_say_yes_to ?? null,
        when_we_say_no: p.when_we_say_no ?? null,
        examples: p.examples ?? null,
        hospitality_cues: p.hospitality_cues ?? null,
      };
      const up = await upsertProfile(input);
      if (!up.ok) {
        console.error("[fcp/update] profile upsert", up);
        return NextResponse.json(
          { error: "Could not save a profile." },
          { status: 500 }
        );
      }
    }
    // Remove any profiles no longer in the list (e.g., user deleted FCP #3)
    await deleteProfilesOutsideRange(id, keep);
  }

  return NextResponse.json({ ok: true });
}
