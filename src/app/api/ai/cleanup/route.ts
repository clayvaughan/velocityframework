/**
 * POST /api/ai/cleanup
 *
 * 1. Validate body { tool, userId }.
 * 2. Resolve client IP, hash for the rate limiter.
 * 3. Walk the 3-layer rate limiter; on hit, return 429 with the user-facing
 *    message and a Retry-After header.
 * 4. Look up the tool handler; build the prompt from saved user data.
 * 5. Call Claude; map errors to a stable user-facing JSON shape.
 *
 * Spec note: rate-limit denial returns the message that points the user back
 * to "Copy AI Prompt" — that endpoint is not rate-limited so the fallback
 * always works.
 */

import { NextResponse } from "next/server";
import {
  callClaudeForCleanup,
  ClaudeCleanupError,
  hashIpForLogging,
  isAiConfigured,
} from "@/lib/ai/anthropic-client";
import {
  checkAndConsumeRateLimit,
  rateLimitErrorMessage,
} from "@/lib/ai/rate-limiter";
import { getToolHandler } from "@/lib/ai/registry";

export const runtime = "nodejs";

type CleanupRequestBody = {
  tool?: string;
  userId?: string;
};

function extractClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      {
        error:
          "AI cleanup is not configured on this server. Use the Copy AI Prompt option instead.",
      },
      { status: 503 }
    );
  }

  let body: CleanupRequestBody;
  try {
    body = (await req.json()) as CleanupRequestBody;
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

  const ipHash = hashIpForLogging(extractClientIp(req));

  // Rate limiting BEFORE the Anthropic call. Failed API calls do not refund
  // the slot — see rate-limiter.ts header for rationale.
  const limit = checkAndConsumeRateLimit(ipHash);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: rateLimitErrorMessage(limit.reason, limit.retryAfterSeconds),
        kind: "rate_limited",
        reason: limit.reason,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  // Build prompt from saved user data.
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

  // Call Claude.
  try {
    const result = await callClaudeForCleanup({
      toolName: tool,
      ipHash,
      systemPrompt: built.system,
      userMessage: built.user,
    });
    return NextResponse.json({
      text: result.text,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    });
  } catch (e) {
    if (e instanceof ClaudeCleanupError) {
      // Map kinds to user-facing copy. Always nudge toward "Copy AI Prompt".
      if (e.kind === "rate_limited") {
        return NextResponse.json(
          {
            error:
              "Claude is rate-limiting requests right now. Try again in a minute, or copy the AI Prompt below.",
            kind: "rate_limited",
          },
          {
            status: 429,
            headers: e.retryAfterSeconds
              ? { "Retry-After": String(e.retryAfterSeconds) }
              : {},
          }
        );
      }
      if (e.kind === "overloaded") {
        return NextResponse.json(
          {
            error:
              "Claude is at capacity right now. Try again in a few minutes, or copy the AI Prompt below.",
            kind: "overloaded",
          },
          { status: 503 }
        );
      }
      if (e.kind === "auth") {
        return NextResponse.json(
          {
            error:
              "AI cleanup is misconfigured on this server. Use the Copy AI Prompt option instead.",
            kind: "auth",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error:
            "Claude returned an error. Try again, or copy the AI Prompt below.",
          kind: e.kind,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: "Unexpected error while polishing. Try again later.",
      },
      { status: 500 }
    );
  }
}
