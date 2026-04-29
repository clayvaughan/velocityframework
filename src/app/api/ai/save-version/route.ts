/**
 * POST /api/ai/save-version
 *
 * Persists an AI-polished Markdown version to the right Supabase column
 * so the next PDF render uses it instead of the raw answers.
 */

import { NextResponse } from "next/server";
import { getToolHandler } from "@/lib/ai/registry";

export const runtime = "nodejs";

type SaveVersionRequestBody = {
  tool?: string;
  userId?: string;
  text?: string;
};

const MIN_TEXT_LEN = 50; // Reject obviously-empty saves.
const MAX_TEXT_LEN = 50_000; // Defensive ceiling — typical polish is ~5K chars.

export async function POST(req: Request) {
  let body: SaveVersionRequestBody;
  try {
    body = (await req.json()) as SaveVersionRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const tool = body.tool;
  const userId = body.userId;
  const text = body.text;
  if (!tool || !userId || typeof text !== "string") {
    return NextResponse.json(
      { error: "Missing tool, userId, or text." },
      { status: 400 }
    );
  }
  if (text.length < MIN_TEXT_LEN) {
    return NextResponse.json(
      { error: "Polished text is too short to save." },
      { status: 400 }
    );
  }
  if (text.length > MAX_TEXT_LEN) {
    return NextResponse.json(
      { error: "Polished text exceeds the maximum size." },
      { status: 413 }
    );
  }

  const handler = getToolHandler(tool);
  if (!handler) {
    return NextResponse.json(
      { error: `Unknown tool: ${tool}` },
      { status: 400 }
    );
  }

  const result = await handler.savePolishedVersion(userId, text);
  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json(
        { error: "We couldn't find your saved data." },
        { status: 404 }
      );
    }
    if (result.reason === "not_configured") {
      return NextResponse.json(
        { error: "Storage is not configured on this server." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Couldn't save your polished version." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
