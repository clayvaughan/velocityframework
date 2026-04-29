/**
 * Three-layer in-memory rate limiter for the AI Polish feature.
 *
 *   Layer 1 — per-IP per rolling hour:  10 requests
 *   Layer 2 — per-IP per rolling 24h:   25 requests
 *   Layer 3 — global per rolling 24h:  500 requests
 *
 * Layer 3 is checked first because it's both the cheapest to evaluate and
 * the layer most likely to protect us from a viral spike or a leaked key.
 *
 * IMPORTANT — single-instance only.
 *
 * State is held in module-level Maps and an array, so it lives in the Node
 * process. Every running instance has its own counters, and a process restart
 * resets everything to zero. That's acceptable while the site runs as a single
 * Replit Autoscale instance and the cost ceiling is low.
 *
 * To scale to multi-instance:
 *   - Replace the three state stores with Redis (or Supabase) backed counters
 *     that are atomic across instances. Sliding-window counters via sorted sets
 *     (ZADD + ZREMRANGEBYSCORE + ZCARD) work directly with the same logic.
 *   - Keep the public API of this module identical — checkAndConsumeRateLimit
 *     and rateLimitErrorMessage — so call sites don't change.
 *   - The reset / snapshot helpers below are test-only and can be deleted on
 *     migration; production never imports them.
 *
 * Keys are pre-hashed by the caller (see hashIpForLogging in anthropic-client).
 * Raw IPs never enter this module's state.
 */

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export const PER_IP_HOURLY_LIMIT = 10;
export const PER_IP_DAILY_LIMIT = 25;
export const GLOBAL_DAILY_LIMIT = 500;

export type RateLimitReason = "per-ip-hour" | "per-ip-day" | "global-day";

export type RateLimitResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: RateLimitReason;
      retryAfterSeconds: number;
    };

// In-memory state. See module header for the multi-instance migration path.
const ipHourTimestamps = new Map<string, number[]>();
const ipDayTimestamps = new Map<string, number[]>();
let globalDayTimestamps: number[] = [];

/**
 * Drop entries strictly older than `cutoff`. Returns a new array if any were
 * pruned, or the same array reference if untouched (small allocation savings
 * on the hot path).
 */
function pruneOlder(arr: number[], cutoff: number): number[] {
  let firstKeep = 0;
  while (firstKeep < arr.length && arr[firstKeep] < cutoff) firstKeep++;
  return firstKeep === 0 ? arr : arr.slice(firstKeep);
}

function retryAfterFromOldest(oldest: number, windowMs: number): number {
  const now = Date.now();
  return Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
}

/**
 * Check whether `ipKey` (already hashed) may consume one slot. If yes, this
 * call records the consumption immediately. If no, returns the failing layer
 * and a retry-after hint.
 *
 * Note: consumption is debited on entry, not on success — a downstream API
 * failure does NOT refund the slot. This is intentional v1 behavior; a user
 * who hits a transient failure can still use "Copy AI Prompt" without
 * wedging on a refund race.
 */
export function checkAndConsumeRateLimit(ipKey: string): RateLimitResult {
  const now = Date.now();
  const hourCutoff = now - HOUR_MS;
  const dayCutoff = now - DAY_MS;

  // Layer 3 — global daily.
  globalDayTimestamps = pruneOlder(globalDayTimestamps, dayCutoff);
  if (globalDayTimestamps.length >= GLOBAL_DAILY_LIMIT) {
    return {
      allowed: false,
      reason: "global-day",
      retryAfterSeconds: retryAfterFromOldest(globalDayTimestamps[0], DAY_MS),
    };
  }

  // Layer 1 — per-IP hourly.
  const hourArr = pruneOlder(ipHourTimestamps.get(ipKey) ?? [], hourCutoff);
  if (hourArr.length >= PER_IP_HOURLY_LIMIT) {
    ipHourTimestamps.set(ipKey, hourArr);
    return {
      allowed: false,
      reason: "per-ip-hour",
      retryAfterSeconds: retryAfterFromOldest(hourArr[0], HOUR_MS),
    };
  }

  // Layer 2 — per-IP daily.
  const dayArr = pruneOlder(ipDayTimestamps.get(ipKey) ?? [], dayCutoff);
  if (dayArr.length >= PER_IP_DAILY_LIMIT) {
    ipDayTimestamps.set(ipKey, dayArr);
    return {
      allowed: false,
      reason: "per-ip-day",
      retryAfterSeconds: retryAfterFromOldest(dayArr[0], DAY_MS),
    };
  }

  // All checks passed — consume one slot in every layer.
  hourArr.push(now);
  dayArr.push(now);
  globalDayTimestamps.push(now);
  ipHourTimestamps.set(ipKey, hourArr);
  ipDayTimestamps.set(ipKey, dayArr);

  return { allowed: true };
}

/**
 * Map a rate-limit failure to the user-facing message described in the spec.
 * Always points the user back to "Copy AI Prompt" so they have a fallback path
 * even when the API is locked.
 */
export function rateLimitErrorMessage(
  reason: RateLimitReason,
  retryAfterSeconds: number
): string {
  if (reason === "per-ip-hour") {
    const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
    return `You've reached the hourly limit for AI cleanup. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}, or copy the AI Prompt to use with your own AI tool.`;
  }
  if (reason === "per-ip-day") {
    return `You've reached your daily limit for AI cleanup. Try again tomorrow, or copy the AI Prompt to use with your own AI tool.`;
  }
  return `AI cleanup is temporarily at capacity. Please try again in a few hours, or copy the AI Prompt to use with your own AI tool.`;
}

/**
 * Quick health snapshot for an admin / dashboard endpoint. Production code
 * should treat this as read-only.
 */
export function getRateLimiterSnapshot() {
  return {
    perIpHourEntries: ipHourTimestamps.size,
    perIpDayEntries: ipDayTimestamps.size,
    globalDayCount: globalDayTimestamps.length,
    limits: {
      PER_IP_HOURLY_LIMIT,
      PER_IP_DAILY_LIMIT,
      GLOBAL_DAILY_LIMIT,
    },
  };
}

/** Test-only — clear all in-memory state between cases. */
export function __resetRateLimiterForTest(): void {
  ipHourTimestamps.clear();
  ipDayTimestamps.clear();
  globalDayTimestamps = [];
}
