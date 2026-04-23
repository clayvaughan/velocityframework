import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  createWorksheetIntake,
  isStorageConfigured,
} from "@/lib/fcp/storage";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  company_name?: string;
  role?: string;
  industry?: string;
  has_scope_filters?: boolean;
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
  const industry = body.industry?.trim();
  const has_scope_filters = Boolean(body.has_scope_filters);

  if (!first_name || !email || !company_name || !role || !industry) {
    return NextResponse.json(
      { error: "First name, email, company, role, and industry are required." },
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
  const result = await createWorksheetIntake({
    id,
    email,
    first_name,
    company_name,
    role,
    industry,
    has_scope_filters,
  });
  if (!result.ok) {
    console.error("[fcp/intake]", result);
    return NextResponse.json(
      { error: "Could not save your intake." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id });
}
