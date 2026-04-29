# AI Polish — shared infrastructure

A shared AI-cleanup feature: take a user's saved tool data, send it through
Claude with a tool-specific prompt, and return polished Markdown the user can
copy or persist to their PDF. Built once, reused across the toolbox.

Debut implementation: **Messaging & Proof Checklist** (`/messaging-proof-checklist/saved/[id]`).

---

## What ships in the box

```
src/lib/ai/
├── anthropic-client.ts        Shared SDK wrapper + structured logging
├── rate-limiter.ts            3-layer in-memory rate limiter
├── registry.ts                Tool-name → {buildPrompt, savePolishedVersion}
├── prompt-templates/
│   └── messaging-checklist.ts (one file per registered tool)
└── README.md                  This file

src/components/ai/AIAssist.tsx Shared client component (5 states, version history)

src/app/api/ai/
├── cleanup/route.ts           POST → rate-limit + Claude call
├── prompt/route.ts            POST → text-only formatted prompt
└── save-version/route.ts      POST → persist polished Markdown to user row

src/lib/pdf/
├── markdown-to-pdf.tsx        Markdown → @react-pdf renderer (subset of MD)
└── PolishedMessagingReport.tsx Velocity-branded polished PDF (per-tool)
```

---

## Adding AI Polish to a new tool — the 5-step recipe

> Target: < 30 minutes from "let's add this" to "shipped."

### 1. Write the prompt template

Create `src/lib/ai/prompt-templates/<tool-name>.ts`. Export a builder that
returns `{ system, user, combined }` strings. Mirror the pattern in
`messaging-checklist.ts` — the system prompt anchors role and output format,
the user message embeds the saved data with clear labels.

Treat this like a consulting deliverable. The quality of the prompt is the
quality of every output users see. Include:
- A role line that frames the model in Velocity Framework first, with any
  outside frameworks (StoryBrand, etc.) named secondarily
- Hard rules (no inventing data, no changing meaning, mark gap-fills with
  `(suggested)`)
- An exact output format the model must follow (numbered section list, exact
  Markdown headers, what each section should contain)

### 2. Register the tool

Add an entry to `TOOLS` in `src/lib/ai/registry.ts`:

```ts
"<tool-name>": {
  buildPrompt: async (userId) => {
    if (!isYourStorageConfigured()) return { ok: false, reason: "not_configured" };
    const row = await getYourSavedRow(userId);
    if (!row.ok) return { ok: false, reason: "db_error" };
    if (!row.data) return { ok: false, reason: "not_found" };
    return { ok: true, ...buildYourToolPrompt({ row: row.data }) };
  },
  savePolishedVersion: async (userId, text) => {
    // verify the row exists, then write polished_version
    // ...
    return { ok: true };
  },
},
```

### 3. Add the storage column (if you want PDF persistence)

The "Add to my PDF" button needs somewhere to write. Add a `polished_version text`
column to your tool's Supabase table:

- Update `src/lib/<tool>/SCHEMA.sql` with the column + an idempotent
  `alter table … add column if not exists polished_version text;` migration
- Update your tool's storage adapter to expose `savePolishedVersion()`
- Surface the migration step in `MISSING_CONTENT_MANIFEST.md` so Clay runs
  it in Supabase before the feature ships

If you don't want PDF persistence (e.g. quick generators where users just
copy the result), skip this step and have your `savePolishedVersion` handler
return `{ ok: false, reason: "not_configured" }` — the UI will surface a
graceful error if the user clicks "Add to my PDF".

### 4. Branch your PDF route

In your tool's PDF route handler, check if `polished_version` is set. If yes,
render `PolishedMessagingReport` (or write a tool-specific equivalent — they
can share `markdown-to-pdf.tsx`); if no, render the existing raw-answers
report. See `src/app/api/messaging-proof-checklist/[id]/pdf/route.tsx` for
the pattern.

### 5. Mount the component on your saved page

```tsx
import { AIAssist } from "@/components/ai/AIAssist";
import { isAiConfigured } from "@/lib/ai/anthropic-client";

<section className="section-padding bg-background">
  <div className="container-wide max-w-5xl">
    <AIAssist
      tool="<tool-name>"
      userId={savedRowId}
      aiCleanupAvailable={isAiConfigured()}
      initialSavedText={row.polished_version ?? null}
    />
  </div>
</section>
```

Place it above the existing "Make It Real" / final-CTAs block so it gets
attention.

---

## Rate limit thresholds

Defined as exported constants in `src/lib/ai/rate-limiter.ts`:

| Layer | Constant | Value | Window |
|---|---|---|---|
| Per-IP hourly | `PER_IP_HOURLY_LIMIT` | 10 | rolling 1h |
| Per-IP daily | `PER_IP_DAILY_LIMIT` | 25 | rolling 24h |
| Global daily | `GLOBAL_DAILY_LIMIT` | 500 | rolling 24h |

Shipping a higher-volume tool? Tune those constants. They're in one place by
design — don't add per-tool overrides without a strong reason. The rate
limiter is the only thing protecting against runaway spend.

A failed Claude call does **not** refund the rate-limit slot — see the file
header for rationale.

---

## Cost monitoring

Every `callClaudeForCleanup` invocation emits a structured log line to
stdout, captured by Replit's deployment logs:

```json
{"kind":"ai-call","ts":"...","tool":"messaging-checklist","ipHash":"...","model":"claude-sonnet-4-6","latencyMs":7234,"inputTokens":1240,"outputTokens":780,"costEstimateUsd":0.0156}
```

Failures emit `kind: "ai-call-error"` with the same shape. Filter logs by
`kind:"ai-call"` to compute total spend. Cost estimates use the constants at
the top of `anthropic-client.ts`; update them if Anthropic shifts pricing.

For a quick spend snapshot from the shell, run something like:

```sh
grep '"kind":"ai-call"' deployment.log \
  | jq -s 'map(.costEstimateUsd) | add'
```

---

## Going multi-instance

The rate limiter holds state in module-level Maps + an array — fine for a
single Replit Autoscale instance, but every instance gets its own counters
and a process restart resets to zero. If we ever scale horizontally:

1. Replace the three state stores in `rate-limiter.ts` with Redis or
   Supabase-backed sliding-window counters (sorted sets via
   `ZADD` + `ZREMRANGEBYSCORE` + `ZCARD` work directly with the same logic).
2. Keep the public API of `rate-limiter.ts` identical
   (`checkAndConsumeRateLimit`, `rateLimitErrorMessage`,
   `getRateLimiterSnapshot`) — call sites don't change.
3. Delete the `__resetRateLimiterForTest` helper (test-only; production
   never imports it).

Estimated work: half a day.

---

## Why version history is session-only

`<AIAssist />` keeps up to 5 most-recent attempts in React state. When the
user navigates away, that buffer clears. Their saved-to-PDF version still
persists in Supabase (`polished_version` column), but the in-memory carousel
of regenerations does not.

This is deliberate. Persisting attempt history would force decisions we
don't want to make in v1: schema design (per-attempt rows? JSONB?), UI for
managing N attempts across sessions, retention policy, what happens when a
user regenerates 50 times. Session-only sidesteps all of that and keeps the
mental model simple — you're polishing right now, you copy or save the
version you like, the rest evaporates.

If a tool needs persistent attempt history later, build it tool-specifically
rather than retrofitting `<AIAssist />`.

---

## What's NOT in scope (yet)

- Streaming responses. v1 is non-streaming with a 3-second-cycling loading
  state ("Reading your messaging…" → "Polishing the language…" → "Almost
  there…"). Sonnet 4.6 typically returns in 5–10 seconds, which is
  acceptable. Add streaming if real users say it feels slow.
- Prompt caching. Our system prompts run ~400 tokens, well below the
  Sonnet 4.6 cache minimum of 2048 tokens. No-op on the API today.
- Per-tool rate-limit overrides. One global ceiling for all tools.
- Persistent attempt history. See above.
- Multi-instance coordination. See above.
