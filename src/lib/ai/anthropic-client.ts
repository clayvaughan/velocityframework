/**
 * Shared Anthropic API client for AI Polish features.
 *
 * Reads ANTHROPIC_API_KEY from the environment. Without it, isAiConfigured()
 * returns false and the UI hides the "Generate AI Cleanup" button — only the
 * "Copy AI Prompt" path stays available so users always have a path forward.
 *
 * Errors from the SDK are classified into a small enum so route handlers can
 * map them to clean user-facing messages without sniffing message strings.
 *
 * Logging: every successful call emits a structured one-line JSON record to
 * stdout so Replit's deployment logs can be grepped for cost and latency.
 * IPs are hashed before they reach this module — see hashIpForLogging.
 */

import Anthropic from "@anthropic-ai/sdk";
import crypto from "node:crypto";

// Sonnet 4.6 — confirmed against the SDK model catalog at install time.
// Pricing (per 1M tokens) is documented for cost-estimate logging; if Anthropic
// adjusts pricing, update these constants. The model string is sourced from the
// Anthropic SDK; if a more recent stable Sonnet ships and we move to it,
// update both this constant and the price values.
export const AI_MODEL = "claude-sonnet-4-6" as const;
const INPUT_PRICE_PER_MILLION_USD = 3.0;
const OUTPUT_PRICE_PER_MILLION_USD = 15.0;

const DEFAULT_MAX_TOKENS = 2000;

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ClaudeCleanupError(
      "auth",
      "ANTHROPIC_API_KEY is not set in this environment."
    );
  }
  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * SHA-256 of the raw IP, truncated to 16 hex chars (64 bits — collision-safe
 * for this scale). The hash is the only form the IP appears in inside this
 * module's state and logs; raw IPs never get persisted anywhere.
 */
export function hashIpForLogging(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
}

export type ClaudeCleanupArgs = {
  toolName: string;
  ipHash: string;
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
};

export type ClaudeCleanupResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  costEstimateUsd: number;
};

export type ClaudeCleanupErrorKind =
  | "rate_limited"
  | "overloaded"
  | "auth"
  | "bad_request"
  | "unknown";

export class ClaudeCleanupError extends Error {
  kind: ClaudeCleanupErrorKind;
  retryAfterSeconds?: number;
  constructor(
    kind: ClaudeCleanupErrorKind,
    message: string,
    retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "ClaudeCleanupError";
    this.kind = kind;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

// Test seam — unit tests can swap in a stub so we exercise rate-limit logic
// and route plumbing without spending real API credits. Production paths
// always use the real SDK.
type ClaudeImpl = (args: ClaudeCleanupArgs) => Promise<ClaudeCleanupResult>;
let implOverride: ClaudeImpl | null = null;

export function __setClaudeImplForTest(impl: ClaudeImpl): void {
  implOverride = impl;
}
export function __resetClaudeImplForTest(): void {
  implOverride = null;
}

export async function callClaudeForCleanup(
  args: ClaudeCleanupArgs
): Promise<ClaudeCleanupResult> {
  if (implOverride) return implOverride(args);

  const startedAt = Date.now();
  try {
    const client = getClient();
    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: args.maxTokens ?? DEFAULT_MAX_TOKENS,
      system: args.systemPrompt,
      messages: [{ role: "user", content: args.userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const costEstimateUsd =
      (inputTokens * INPUT_PRICE_PER_MILLION_USD) / 1_000_000 +
      (outputTokens * OUTPUT_PRICE_PER_MILLION_USD) / 1_000_000;

    const latencyMs = Date.now() - startedAt;
    console.log(
      JSON.stringify({
        kind: "ai-call",
        ts: new Date().toISOString(),
        tool: args.toolName,
        ipHash: args.ipHash,
        model: AI_MODEL,
        latencyMs,
        inputTokens,
        outputTokens,
        costEstimateUsd: Number(costEstimateUsd.toFixed(5)),
      })
    );

    return { text, inputTokens, outputTokens, costEstimateUsd };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    const classified = classifyError(err);
    console.error(
      JSON.stringify({
        kind: "ai-call-error",
        ts: new Date().toISOString(),
        tool: args.toolName,
        ipHash: args.ipHash,
        model: AI_MODEL,
        latencyMs,
        errorKind: classified.kind,
        message: classified.message,
      })
    );
    throw new ClaudeCleanupError(
      classified.kind,
      classified.message,
      classified.retryAfterSeconds
    );
  }
}

function classifyError(err: unknown): {
  kind: ClaudeCleanupErrorKind;
  message: string;
  retryAfterSeconds?: number;
} {
  if (err instanceof Anthropic.RateLimitError) {
    const retryHeader = err.headers?.get?.("retry-after");
    const retry = retryHeader ? Number(retryHeader) || undefined : undefined;
    return {
      kind: "rate_limited",
      message: err.message,
      retryAfterSeconds: retry,
    };
  }
  if (err instanceof Anthropic.AuthenticationError) {
    return { kind: "auth", message: err.message };
  }
  if (err instanceof Anthropic.BadRequestError) {
    return { kind: "bad_request", message: err.message };
  }
  if (err instanceof Anthropic.APIError) {
    if (err.status === 529) return { kind: "overloaded", message: err.message };
    return { kind: "unknown", message: err.message };
  }
  if (err instanceof Error) return { kind: "unknown", message: err.message };
  return { kind: "unknown", message: String(err) };
}
