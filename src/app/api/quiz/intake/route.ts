import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createQuizIntake, isStorageConfigured } from "@/lib/quiz/storage";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  role?: string;
  company?: string;
  company_size?: string;
};

export async function POST(req: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Replit Secrets." },
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
  const result = await createQuizIntake({
    id,
    email,
    first_name: firstName,
    role,
    company: body.company?.trim() || null,
    company_size: body.company_size?.trim() || null,
    taking_for: "self",
  });
  if (!result.ok) {
    console.error("[intake] storage write failed", result);
    return NextResponse.json(
      { error: "Could not save your intake. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id });
}
