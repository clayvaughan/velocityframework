/**
 * POST /api/ai/prompt
 *
 * Returns the formatted prompt for the user to paste into their own AI tool.
 * NOT rate-limited — pure text formatting, no Anthropic API cost.
 */

import { NextResponse } from "next/server";
import { getToolHandler } from "@/lib/ai/registry";

export const runtime = "nodejs";

type PromptRequestBody = {
  tool?: string;
  userId?: string;
};

export async function POST(req: Request) {
  let body: PromptRequestBody;
  try {
    body = (await req.json()) as PromptRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const tool = body.tool;
  const userId = body.userId;
  if (!tool || !userId) {
    return NextResponse.json(
      { error: "Missing tool or userId." },
      { status: 400 }
    );
  }

  const handler = getToolHandler(tool);
  if (!handler) {
    return NextResponse.json(
      { error: `Unknown tool: ${tool}` },
      { status: 400 }
    );
  }

  const built = await handler.buildPrompt(userId);
  if (!built.ok) {
    if (built.reason === "not_found") {
      return NextResponse.json(
        { error: "We couldn't find your saved data." },
        { status: 404 }
      );
    }
    if (built.reason === "not_configured") {
      return NextResponse.json(
        { error: "Storage is not configured on this server." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Couldn't load your saved data." },
      { status: 500 }
    );
  }

  return NextResponse.json({ text: built.combined });
}
