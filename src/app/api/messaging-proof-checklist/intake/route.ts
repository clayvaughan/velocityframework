import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  createChecklistIntake,
  isStorageConfigured,
} from "@/lib/messaging/storage";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  company_name?: string;
  role?: string;
  favorite_customer?: string;
  fcp_worksheet_url?: string;
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
  const favorite_customer = body.favorite_customer?.trim();

  if (!first_name || !email || !company_name || !role || !favorite_customer) {
    return NextResponse.json(
      { error: "First name, email, company, role, and favorite customer are required." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  const id = nanoid(32);
  const result = await createChecklistIntake({
    id,
    email,
    first_name,
    company_name,
    role,
    favorite_customer,
    fcp_worksheet_url: body.fcp_worksheet_url?.trim() || null,
  });
  if (!result.ok) {
    console.error("[messaging/intake]", result);
    return NextResponse.json(
      { error: "Could not save your intake." },
      { status: 500 }
    );
  }
  return NextResponse.json({ id });
}
