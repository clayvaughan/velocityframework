import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  createTrustBuildingScriptDownload,
  isStorageConfigured,
} from "@/lib/trust-building-script/storage";
import { syncTrustBuildingScriptContact } from "@/lib/hubspot";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  company_name?: string;
  role?: string;
  highest_stakes_sale?: string;
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
  const highest_stakes_sale = body.highest_stakes_sale?.trim() || null;
  const result = await createTrustBuildingScriptDownload({
    id,
    email,
    first_name,
    company_name,
    role,
    highest_stakes_sale,
  });
  if (!result.ok) {
    console.error("[trust-building-script/intake]", result);
    return NextResponse.json(
      { error: "Could not save your request." },
      { status: 500 }
    );
  }

  void syncTrustBuildingScriptContact({
    email,
    firstName: first_name,
    companyName: company_name,
    role,
    highestStakesSale: highest_stakes_sale,
  }).catch((e) =>
    console.error("[trust-building-script/intake] hubspot", e)
  );

  return NextResponse.json({ id });
}
