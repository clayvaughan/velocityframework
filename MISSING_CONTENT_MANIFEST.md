# Missing Content Manifest

Both the Culture Health Check and Culture Action Plan ship with Clay-approved final copy. The outstanding items are short — calendar/anecdote placeholders plus one confirmation pass.

---

## 1. Clay's direct calendar booking URL

Referenced in two places, both currently marked with the literal placeholder `[CLAY_CALENDAR_URL]`:

- `src/lib/quiz/nurture-sequences.ts` — Critical-tier Health Check nurture sequence, email 5 (day 21)
- `src/app/action-plan/review/[id]/thanks/page.tsx` — "Book a call with Clay" card on the Culture Action Plan review-thanks screen

**Action:** Replace `[CLAY_CALENDAR_URL]` in both files with the real booking URL.

---

## 2. Optional anecdote swaps

The nurture sequences reference non-specific or composite anecdotes in four places:

| File | Sequence · Email | Placeholder reference |
| ---- | ---------------- | --------------------- |
| `src/lib/quiz/nurture-sequences.ts` | At Risk · Email 4 (day 14) | "composite of how Good Agency has helped clients turn an At Risk score into Healthy" |
| `src/lib/quiz/nurture-sequences.ts` | Critical · Email 4 (day 12) | "Story from Clay's own experience turning around a broken culture at Good Agency or with a client" |
| `src/lib/action-plan/nurture-sequence.ts` | Making Culture Stick · Email 2 (day 3) | Generic "why most culture plans die in week 1" framing — optional to swap for a specific story |
| `src/lib/action-plan/nurture-sequence.ts` | Making Culture Stick · Email 4 (day 20) | Generic virtue deep-dive — optional to swap for a specific client vignette |

**Action:** If Clay wants specific (permissioned, anonymized) stories in any of these, replace the relevant `body` string. Otherwise, the current copy ships as written.

---

## 3. Final approval of shipped copy

Everything else is verbatim from Clay's final specs:

- 15 Health Check questions
- 3 Health Check tier headlines + subheads
- 15 Health Check dimension × tier interpretations
- 15 Health Check recommended actions
- Health Check facilitator guide (used in both individual and team PDFs)
- 12 Culture Action Plan toxin descriptions
- 30+ Culture Action Plan counter-moves with behavioral definitions
- 3 virtue descriptions
- 7 weekly-rhythm options
- Leadership-email and accountability-partner-email drafts
- 3 Health Check nurture sequences (Healthy / At Risk / Critical, 5 emails each)
- "Making Culture Stick" Action Plan nurture sequence (5 emails)

**Action:** Clay confirms copy as-is, or sends targeted diffs.

---

## Infrastructure awaiting Clay / Abby (not content)

- **HubSpot Private App Token** (`HUBSPOT_PRIVATE_APP_TOKEN`) — Contact sync code is live in `src/lib/hubspot.ts` for both Health Check and Action Plan flows. Silent no-op until the token lands in Replit Secrets.
- **HubSpot sequence IDs** — Populate `NURTURE_SEQUENCE_IDS` (Health Check, in `hubspot.ts`) and `ACTION_PLAN_SEQUENCE_ID` (Action Plan, in `hubspot.ts`) once Abby has created the corresponding HubSpot sequences with the final email copy.
- **HubSpot transactional email for PDF delivery** — `sendQuizResultEmail` remains stubbed awaiting Abby's transactional template id.
- **Supabase schema** — Run `src/lib/quiz/SCHEMA.sql` and `src/lib/action-plan/SCHEMA.sql` in the velocityframework Supabase SQL editor. They can be run in any order; the Action Plan schema's `health_check_id` foreign key expects `quiz_responses` to exist first, so run Health Check schema before Action Plan schema if doing them fresh.
- **Team-member optional email capture** (Health Check team mode) — Deferred, not wired; team responses stay fully anonymous unless/until Clay decides to add it.
