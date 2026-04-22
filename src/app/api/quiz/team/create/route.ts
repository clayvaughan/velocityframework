import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createTeamQuiz, isStorageConfigured } from "@/lib/quiz/storage";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  role?: string;
  company?: string;
  company_size?: string;
  team_name?: string;
};

export async function POST(req: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const firstName = body.first_name?.trim();
  const email = body.email?.trim().toLowerCase();
  const role = body.role?.trim();

  if (!firstName || !email || !role) {
    return NextResponse.json(
      { error: "First name, email, and role are required." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right. Try again." },
      { status: 400 }
    );
  }

  const id = nanoid(32);
  const result = await createTeamQuiz({
    id,
    owner_email: email,
    owner_first_name: firstName,
    owner_role: role,
    owner_company: body.company?.trim() || null,
    owner_company_size: body.company_size?.trim() || null,
    team_name: body.team_name?.trim() || null,
  });
  if (!result.ok) {
    console.error("[team/create] storage write failed", result);
    return NextResponse.json(
      { error: "Could not create the team quiz." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id });
}
