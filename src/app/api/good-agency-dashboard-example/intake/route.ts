import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  createDashboardDownload,
  isStorageConfigured,
} from "@/lib/dashboard-example/storage";
import { syncDashboardExampleContact } from "@/lib/hubspot";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  company_name?: string;
  role?: string;
  metrics_challenge?: string;
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
  const metricsChallenge = body.metrics_challenge?.trim() || null;
  const result = await createDashboardDownload({
    id,
    email,
    first_name,
    company_name,
    role,
    metrics_challenge: metricsChallenge,
  });
  if (!result.ok) {
    console.error("[dashboard-example/intake]", result);
    return NextResponse.json(
      { error: "Could not save your request." },
      { status: 500 }
    );
  }

  void syncDashboardExampleContact({
    email,
    firstName: first_name,
    companyName: company_name,
    role,
    metricsChallenge,
  }).catch((e) => console.error("[dashboard-example/intake] hubspot", e));

  return NextResponse.json({ id });
}
