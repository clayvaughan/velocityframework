import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  createActionPlanIntake,
  isStorageConfigured,
  replaceFocusAreas,
} from "@/lib/action-plan/storage";
import { suggestedToxinsForLowestDimensions } from "@/lib/action-plan/toxins";
import { getQuizResult } from "@/lib/quiz/storage";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  role?: string;
  team_size?: string;
  health_check_id?: string;
};

export async function POST(req: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as Body;
  const first_name = body.first_name?.trim();
  const email = body.email?.trim().toLowerCase();
  const role = body.role?.trim();
  const team_size = body.team_size?.trim() || null;

  if (!first_name || !email || !role) {
    return NextResponse.json(
      { error: "First name, email, and role are required." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right." },
      { status: 400 }
    );
  }

  const id = nanoid(32);
  let healthCheckId: string | null = null;
  let preselectedToxins: string[] = [];

  if (body.health_check_id) {
    const hc = await getQuizResult(body.health_check_id);
    if (hc.ok && hc.data && hc.data.dimension_scores) {
      healthCheckId = body.health_check_id;
      const lowest = [...hc.data.dimension_scores]
        .sort((a, b) => a.subscore - b.subscore)
        .slice(0, 3)
        .map((d) => d.dimension);
      preselectedToxins = suggestedToxinsForLowestDimensions(lowest);
    }
    // If the health-check id was invalid, fall through and create a cold plan.
  }

  const result = await createActionPlanIntake({
    id,
    email,
    first_name,
    role,
    team_size,
    source: healthCheckId ? "health_check" : "direct",
    health_check_id: healthCheckId,
  });
  if (!result.ok) {
    console.error("[action-plan/intake]", result);
    return NextResponse.json(
      { error: "Could not save your intake." },
      { status: 500 }
    );
  }

  if (preselectedToxins.length > 0) {
    await replaceFocusAreas(
      id,
      preselectedToxins.map((toxinId, i) => ({
        order_index: i + 1,
        toxin_id: toxinId as never,
        counter_move_id: null,
        counter_move_custom: null,
        virtue: null,
        seven_day_action: null,
        weekly_rhythm_id: null,
        weekly_rhythm_custom: null,
      }))
    );
  }

  return NextResponse.json({ id });
}
