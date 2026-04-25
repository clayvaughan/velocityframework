import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  createFreJobDescriptionDownload,
  isStorageConfigured,
} from "@/lib/fre-job-description/storage";
import { syncFreJobDescriptionContact } from "@/lib/hubspot";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  company_name?: string;
  role?: string;
  download_reason?: string;
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

  if (!first_name || !email || !company_name || !role) {
    return NextResponse.json(
      { error: "First name, email, company, and role are required." },
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
  const download_reason = body.download_reason?.trim() || null;
  const result = await createFreJobDescriptionDownload({
    id,
    email,
    first_name,
    company_name,
    role,
    download_reason,
  });
  if (!result.ok) {
    console.error("[fre-job-description/intake]", result);
    return NextResponse.json(
      { error: "Could not save your request." },
      { status: 500 }
    );
  }

  void syncFreJobDescriptionContact({
    email,
    firstName: first_name,
    companyName: company_name,
    role,
    downloadReason: download_reason,
  }).catch((e) => console.error("[fre-job-description/intake] hubspot", e));

  return NextResponse.json({ id });
}
