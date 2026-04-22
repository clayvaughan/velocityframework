# Phase 1 — Culture Health Check (Individual Mode)

Approved scope and checkpoints for the Velocity Culture Health Check quiz.
Phase 2 (PDF), Phase 3 (team mode), Phase 4 (nurture sequences) follow after
Phase 1 ships end-to-end.

---

## Scope

- Real 15-question culture diagnostic at `/health-survey`
- Email-gated, single-session (no login, no account)
- 5 dimensions × 3 questions each = 15 Likert (1–5) statements
- Scoring: dimension subscores 0–100 + overall 0–100 + tier (Healthy / At Risk / Critical)
- Results screen at `/health-survey/results/[id]` (nanoid slug = unguessable, URL-as-auth)
- Landing page offers two paths:
  - **Solo** → full quiz flow, live in Phase 1
  - **Team** → early-access email capture (genuine "coming soon — notify me", not a disabled button)
- Storage: Supabase (new project, separate from Cash Flow Intelligence)
- HubSpot contact sync: code path built, gated on `HUBSPOT_PRIVATE_APP_TOKEN` — no-op with warning if the token is not in Replit Secrets yet
- Mobile-first responsive, WCAG AA, brand-locked design system

## Out of scope for Phase 1

- PDF report generation and email delivery (Phase 2)
- Team mode with aggregate dashboard (Phase 3)
- Nurture email sequence copy (Phase 4)
- "Book a call with Clay" CTA (lives in the Critical-tier nurture email — Phase 4)

---

## Checkpoints

Each checkpoint ends with a `git diff --stat` shown to Clay **before pushing**.
Push only after Clay approves.

### Checkpoint 1 — Scaffolding

Foundation files only. No user-facing pages yet. No API route yet.

**New dependencies:** `@supabase/supabase-js`, `nanoid`.

**New files:**
```
src/lib/quiz/questions.ts              15 placeholder questions, typed, Heart-section-grounded
src/lib/quiz/copy.ts                   Tier + dimension interpretation text (placeholder)
src/lib/quiz/recommendations.ts        Score → toolbox resource mapping
src/lib/quiz/storage.ts                Supabase client wrapper — no-op stub if env missing
src/lib/hubspot.ts                     Contact sync stub — no-op if token missing
src/components/quiz/LikertScale.tsx
src/components/quiz/QuizProgress.tsx
src/components/quiz/ResultsTier.tsx
src/components/quiz/DimensionBreakdown.tsx
src/components/quiz/RecommendedResources.tsx
MISSING_CONTENT_MANIFEST.md            All Clay-owned content items, flagged
```

**Acceptance:**
- `npm run build` passes
- All questions + copy clearly marked as placeholders in `MISSING_CONTENT_MANIFEST.md`
- Storage stub gracefully no-ops when `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are missing so local dev doesn't break before Clay adds secrets
- HubSpot stub gracefully no-ops when `HUBSPOT_PRIVATE_APP_TOKEN` is missing

### Checkpoint 2 — Scoring logic

Pure math, no UI.

**New files:**
```
src/lib/quiz/scoring.ts                Subscore + overall + tier + dimension lookup
src/lib/quiz/scoring.test-run.ts       Small runnable script demonstrating sample inputs → outputs
```

**Scoring formula:**
- Each answer is 1–5 (Likert)
- Each dimension: 3 questions → raw = sum (3–15) → subscore = `((raw - 3) / 12) × 100` → rounded
- Overall = mean of 5 dimension subscores → rounded
- Tier: `0–44` Critical · `45–74` At Risk · `75–100` Healthy

**Acceptance:**
- Sample-output script produces expected values for: all-1s, all-3s, all-5s, and one mixed realistic pattern
- TypeScript types prevent mis-shaped quiz payloads from reaching the scoring function
- Zero UI dependencies (importable from pure Node / tests / server)

### Checkpoint 3 — Quiz flow + results screen

Full user-facing flow, end-to-end against Supabase (once credentials land).

**New files:**
```
src/app/health-survey/page.tsx         Landing — hero, solo/team gate, team early-access form
src/app/health-survey/start/page.tsx   Email capture before the quiz starts
src/app/health-survey/question/[n]/page.tsx   Single-question screen, 1..15
src/app/health-survey/results/[id]/page.tsx   Results view
src/app/api/quiz/submit/route.ts       POST: receive answers, score, persist, return result id
```

**Existing file modified:** the current `/health-survey/page.tsx` placeholder is replaced.

**Flow:**
1. Land on `/health-survey` → pick solo or team
2. Solo → `/start` → email capture → POST creates a skeleton submission, returns nanoid → redirect to `/question/1`
3. `/question/[n]` → one question per screen, Likert answer stored in `localStorage` keyed by result id → Next → n+1
4. After q15 → POST to `/api/quiz/submit` with all answers + result id → server scores, persists full row, returns success
5. Redirect to `/results/[id]` → server-renders results from Supabase

**Acceptance:**
- Full flow works end-to-end on mobile and desktop
- WCAG AA on every screen
- Results URL is shareable + re-loadable from the DB
- Team early-access form captures email to Supabase even though team mode isn't live
- Clay can take the quiz himself and feel the flow

### Checkpoint 4 — HubSpot integration

**Files modified:**
- `src/lib/hubspot.ts` — real Contacts API calls (create or update by email, set `culture_health_score` / `culture_health_tier` / lifecycle)
- `src/app/api/quiz/submit/route.ts` — call `hubspot.syncContact()` after successful Supabase write

**Env var:** `HUBSPOT_PRIVATE_APP_TOKEN` in Replit Secrets.

**Acceptance:**
- Submitting the quiz with the token set creates/updates a HubSpot contact with the score and tier
- Submitting without the token logs a clear warning, quiz still succeeds
- All other Phase 1 acceptance criteria still pass

---

## Content drafts needing Clay refinement

Flagged in `MISSING_CONTENT_MANIFEST.md` as they land. Claude Code drafts
placeholders grounded in the five-dimension framing (Trust, Communication,
Accountability, Purpose Alignment, Hospitality) using Heart-section voice
patterns where inferable. Clay swaps in final language before ship. Specific
items:

- 15 quiz questions (3 per dimension)
- Three tier-level interpretation paragraphs (Healthy / At Risk / Critical)
- Fifteen dimension-by-tier interpretation paragraphs (5 dims × 3 tiers)
- Fifteen dimension-by-tier recommended-next-step actions

## Existing pages, components, and styles — untouched

- `SiteHeader`, `SiteFooter`, `PillarCard`, `SectionHeader`, `ResourceCard`, `Button`, `VisualPlaceholder`, `HubSpotFormSlot`, `PillarTag`
- `globals.css` (no `@media (prefers-color-scheme: dark)`, no `dark:` variants, no theme provider)
- `layout.tsx`, `next.config.ts`, `.replit`, `postcss.config.mjs`, `tsconfig.json`
- Any page outside the `/health-survey` tree
- Any asset in `/public/` or `/attached_assets/`
