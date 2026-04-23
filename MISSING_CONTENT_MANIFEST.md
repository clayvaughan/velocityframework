# Missing Content Manifest

The Culture Health Check, Culture Action Plan, and Favorite Customer Profile Worksheet all ship with Clay-approved final copy. The outstanding items are short — calendar/anecdote placeholders, FCP nurture copy awaiting final, plus one confirmation pass.

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

## 4. Favorite Customer Profile — 4 draft nurture emails awaiting final copy

The FCP nurture sequence (`src/lib/fcp/nurture-sequence.ts`) ships with DRAFT bodies flagged `[DRAFT — awaiting Clay]`. All four email subjects and send-day cadence are Clay-approved; only the body copy is placeholder awaiting final language.

| Sequence · Email | Subject (final) | Body (draft) |
| ---------------- | --------------- | ------------ |
| Build Around Your Favorite Customer · Email 1 (day 0) | "Your Favorite Customer Profiles are saved — here's what to do next" | [DRAFT — awaiting Clay] |
| · Email 2 (day 3) | "The messaging question that breaks most service businesses" | [DRAFT — awaiting Clay] |
| · Email 3 (day 10) | "Why your referral requests aren't working (and the fix)" | [DRAFT — awaiting Clay] |
| · Email 4 (day 21) | "The test: can your team describe your Favorite Customer in 30 seconds?" | [DRAFT — awaiting Clay] |

**Action:** Replace the four draft bodies in `src/lib/fcp/nurture-sequence.ts` with final copy.

---

## 5. Messaging & Proof Checklist — 4 draft nurture emails awaiting final copy

The Messaging & Proof Checklist nurture sequence (`src/lib/messaging/nurture-sequence.ts`) ships with DRAFT bodies flagged `[DRAFT — awaiting Clay]`. All four email subjects and send-day cadence are Clay-approved; only the body copy is placeholder awaiting final language.

| Sequence · Email | Subject (final) | Body (draft) |
| ---------------- | --------------- | ------------ |
| Clear Your Message, Grow Your Revenue · Email 1 (day 0) | "Your Messaging & Proof Checklist is saved — the one-liner test" | [DRAFT — awaiting Clay] |
| · Email 2 (day 5) | "Why beautiful design means nothing without the right words" | [DRAFT — awaiting Clay] |
| · Email 3 (day 12) | "The testimonial question that gets stories instead of praise" | [DRAFT — awaiting Clay] |
| · Email 4 (day 21) | "Check-in: did you actually use your one-liner this week?" | [DRAFT — awaiting Clay] |

**Action:** Replace the four draft bodies in `src/lib/messaging/nurture-sequence.ts` with final copy.

---

## 6. Leadership Accountability Map — 4 draft nurture emails awaiting final copy

The Leadership Accountability Map nurture sequence (`src/lib/accountability/nurture-sequence.ts`) ships with DRAFT bodies flagged `[DRAFT — awaiting Clay]`. All four email subjects and send-day cadence are Clay-approved; only the body copy is placeholder awaiting final language.

| Sequence · Email | Subject (final) | Body (draft) |
| ---------------- | --------------- | ------------ |
| Ownership Makes Culture Stick · Email 1 (day 0) | "Your Accountability Map is saved — here's how to run the first conversation" | [DRAFT — awaiting Clay] |
| · Email 2 (day 7) | "The question that separates real accountability from theater" | [DRAFT — awaiting Clay] |
| · Email 3 (day 30) | "How to tell if someone's in the wrong seat" | [DRAFT — awaiting Clay] |
| · Email 4 (day 60) | "Two weeks out from your first reflection date — here's the prep" | [DRAFT — awaiting Clay] |

**Action:** Replace the four draft bodies in `src/lib/accountability/nurture-sequence.ts` with final copy.

---

## 7. Good Agency Scorecard Example — 3 draft nurture emails awaiting final copy

The Scorecard Example nurture sequence (`src/lib/scorecard-example/nurture-sequence.ts`) ships with DRAFT bodies flagged `[DRAFT — awaiting Clay]`. All three email subjects and send-day cadence are Clay-approved; only the body copy is placeholder awaiting final language.

| Sequence · Email | Subject (final) | Body (draft) |
| ---------------- | --------------- | ------------ |
| Scorecards That Actually Work · Email 1 (day 0) | "Your Scorecard Example is in — start with the job mission statement" | [DRAFT — awaiting Clay] |
| · Email 2 (day 7) | "Why self-scores matter as much as supervisor scores" | [DRAFT — awaiting Clay] |
| · Email 3 (day 21) | "The quarterly recalibration most leaders skip" | [DRAFT — awaiting Clay] |

**Action:** Replace the three draft bodies in `src/lib/scorecard-example/nurture-sequence.ts` with final copy.

---

## 8. Deferred navigation hooks (post-Scorecard Example build)

The Scorecard Example build skipped two navigation cross-links because their target routes don't exist yet. Wire each when the referenced tool ships:

- **Good Agency Dashboard Example** — when `/good-agency-dashboard-example/thanks/[id]` is built, add a "Next move · Scorecard Example" card to that thanks page pointing at `/good-agency-scorecard-example`. Framing: "Dashboards measure the company. Scorecards measure the person. Here's what one looks like."
- **Unified Revenue Team Accountability Map** — the Leadership Accountability Map saved page (`src/app/leadership-accountability-map/saved/[id]/page.tsx`) still links its primary "Next move" to `/toolbox/unified-revenue-map`, which is a placeholder resource route. When the real `/revenue-team-accountability-map` tool ships, point that Link's `href` at it.

---

## Infrastructure awaiting Clay / Abby (not content)

- **HubSpot Private App Token** (`HUBSPOT_PRIVATE_APP_TOKEN`) — Contact sync code is live in `src/lib/hubspot.ts` for Health Check, Action Plan, FCP, Messaging & Proof, Leadership Accountability Map, and Scorecard Example flows. Silent no-op until the token lands in Replit Secrets.
- **HubSpot sequence IDs** — Populate `NURTURE_SEQUENCE_IDS` (Health Check), `ACTION_PLAN_SEQUENCE_ID` (Action Plan), `FCP_SEQUENCE_ID` (FCP Worksheet), `MESSAGING_SEQUENCE_ID` (Messaging & Proof), `ACCOUNTABILITY_SEQUENCE_ID` (Leadership Accountability Map), and `SCORECARD_EXAMPLE_SEQUENCE_ID` (Scorecard Example) in `hubspot.ts` once Abby has created the corresponding HubSpot sequences with the final email copy.
- **HubSpot transactional email for PDF delivery** — `sendQuizResultEmail` remains stubbed awaiting Abby's transactional template id. The Scorecard Example landing page microcopy promises "A copy has been sent to your email," but the actual send-on-intake transactional email is not yet wired — users can still download the PDF directly from the thanks page via the download button.
- **Supabase schema** — Run `src/lib/quiz/SCHEMA.sql`, `src/lib/action-plan/SCHEMA.sql`, `src/lib/fcp/SCHEMA.sql`, `src/lib/messaging/SCHEMA.sql`, `src/lib/accountability/SCHEMA.sql`, and `src/lib/scorecard-example/SCHEMA.sql` in the velocityframework Supabase SQL editor. Health Check schema first (the Action Plan schema's `health_check_id` foreign key references `quiz_responses`); FCP, Messaging, Accountability, and Scorecard Example schemas have no cross-feature foreign keys and can run any time after.
- **Team-member optional email capture** (Health Check team mode) — Deferred, not wired; team responses stay fully anonymous unless/until Clay decides to add it.
