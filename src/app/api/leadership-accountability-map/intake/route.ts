import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  createMapIntake,
  isStorageConfigured,
} from "@/lib/accountability/storage";
import { TEAM_SIZE_OPTIONS } from "@/lib/accountability/constants";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  company_name?: string;
  role?: string;
  team_size?: string;
  health_check_completed?: boolean;
  health_check_url?: string;
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
  const company_name = body.company_name?.trim();
  const role = body.role?.trim();
  const team_size = body.team_size?.trim();

  if (!first_name || !email || !company_name || !role || !team_size) {
    return NextResponse.json(
      { error: "First name, email, company, role, and team size are required." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  if (!(TEAM_SIZE_OPTIONS as readonly string[]).includes(team_size)) {
    return NextResponse.json({ error: "Pick a team size." }, { status: 400 });
  }

  const id = nanoid(32);
  const result = await createMapIntake({
    id,
    email,
    first_name,
    company_name,
    role,
    team_size,
    health_check_completed: Boolean(body.health_check_completed),
    health_check_url: body.health_check_url?.trim() || null,
  });
  if (!result.ok) {
    console.error("[accountability/intake]", result);
    return NextResponse.json(
      { error: "Could not save your intake." },
      { status: 500 }
    );
  }
  return NextResponse.json({ id });
}
