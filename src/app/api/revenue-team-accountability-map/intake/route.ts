import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  createRevenueMapIntake,
  isStorageConfigured,
} from "@/lib/revenue-team/storage";
import {
  ANNUAL_REVENUE_OPTIONS,
  TEAM_SIZE_OPTIONS,
} from "@/lib/revenue-team/constants";

export const runtime = "nodejs";

type Body = {
  first_name?: string;
  email?: string;
  company_name?: string;
  role?: string;
  team_size?: string;
  annual_revenue?: string;
  has_director_of_revenue?: string;
  leadership_map_url?: string;
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
  const annual_revenue = body.annual_revenue?.trim();
  const has_director_of_revenue = body.has_director_of_revenue?.trim();

  if (
    !first_name ||
    !email ||
    !company_name ||
    !role ||
    !team_size ||
    !annual_revenue ||
    !has_director_of_revenue
  ) {
    return NextResponse.json(
      {
        error:
          "First name, email, company, role, team size, annual revenue, and Director of Revenue status are required.",
      },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right." },
      { status: 400 }
    );
  }
  if (!(TEAM_SIZE_OPTIONS as readonly string[]).includes(team_size)) {
    return NextResponse.json({ error: "Pick a team size." }, { status: 400 });
  }
  if (!(ANNUAL_REVENUE_OPTIONS as readonly string[]).includes(annual_revenue)) {
    return NextResponse.json(
      { error: "Pick an annual revenue range." },
      { status: 400 }
    );
  }
  if (!["yes", "no", "planning"].includes(has_director_of_revenue)) {
    return NextResponse.json(
      { error: "Pick a Director of Revenue option." },
      { status: 400 }
    );
  }

  const id = nanoid(32);
  const result = await createRevenueMapIntake({
    id,
    email,
    first_name,
    company_name,
    role,
    team_size,
    annual_revenue,
    has_director_of_revenue: has_director_of_revenue as "yes" | "no" | "planning",
    leadership_map_url: body.leadership_map_url?.trim() || null,
  });
  if (!result.ok) {
    console.error("[revenue-team/intake]", result);
    return NextResponse.json(
      { error: "Could not save your intake." },
      { status: 500 }
    );
  }
  return NextResponse.json({ id });
}
