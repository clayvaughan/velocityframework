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

## 8. Good Agency Dashboard Example — 3 draft nurture emails awaiting final copy

The Dashboard Example nurture sequence (`src/lib/dashboard-example/nurture-sequence.ts`) ships with DRAFT bodies flagged `[DRAFT — awaiting Clay]`. All three email subjects and send-day cadence are Clay-approved; only the body copy is placeholder awaiting final language.

| Sequence · Email | Subject (final) | Body (draft) |
| ---------------- | --------------- | ------------ |
| From Dashboard to Discipline · Email 1 (day 0) | "Your Good Agency Dashboard Example is in — here's how to use it" | [DRAFT — awaiting Clay] |
| · Email 2 (day 7) | "The one metric most leaders are missing (and why)" | [DRAFT — awaiting Clay] |
| · Email 3 (day 21) | "When to add more metrics, and when to cut them" | [DRAFT — awaiting Clay] |

**Action:** Replace the three draft bodies in `src/lib/dashboard-example/nurture-sequence.ts` with final copy.

---

## 9. Unified Revenue Team Accountability Map — 4 draft nurture emails awaiting final copy

The Revenue Team Map nurture sequence (`src/lib/revenue-team/nurture-sequence.ts`) ships with DRAFT bodies flagged `[DRAFT — awaiting Clay]`. All four email subjects and send-day cadence are Clay-approved; only the body copy is placeholder awaiting final language.

| Sequence · Email | Subject (final) | Body (draft) |
| ---------------- | --------------- | ------------ |
| Unified Revenue = Predictable Growth · Email 1 (day 0) | "Your Revenue Team Accountability Map is saved — the first meeting is everything" | [DRAFT — awaiting Clay] |
| · Email 2 (day 7) | "The three metrics a Director of Revenue is actually accountable for" | [DRAFT — awaiting Clay] |
| · Email 3 (day 30) | "Why marketing-sales silos kill growth (and the fix that actually works)" | [DRAFT — awaiting Clay] |
| · Email 4 (day 60) | "The FRE conversation — who's ready for one" | [DRAFT — awaiting Clay] |

**Action:** Replace the four draft bodies in `src/lib/revenue-team/nurture-sequence.ts` with final copy.

---

## 10. Sample Trust-Building Script — 3 draft nurture emails awaiting final copy

The Trust-Building Script nurture sequence (`src/lib/trust-building-script/nurture-sequence.ts`) ships with DRAFT bodies flagged `[DRAFT — awaiting Clay]`. All three email subjects and send-day cadence are Clay-approved; only the body copy is placeholder awaiting final language.

| Sequence · Email | Subject (final) | Body (draft) |
| ---------------- | --------------- | ------------ |
| Sales That Feel Like Service · Email 1 (day 0) | "The Sample Trust-Building Script is in — here's how to read it the first time" | [DRAFT — awaiting Clay] |
| · Email 2 (day 7) | "The one question that separates a closer from a trust-builder" | [DRAFT — awaiting Clay] |
| · Email 3 (day 21) | "Your turn — adapt this script to your industry in 30 days" | [DRAFT — awaiting Clay] |

**Action:** Replace the three draft bodies in `src/lib/trust-building-script/nurture-sequence.ts` with final copy.

**Note on the Bellamere → Sample rename:** the resource is now titled "Sample Trust-Building Script" everywhere in the website chrome (page titles, headings, eyebrows, navigation, CTA copy, PDF cover). The actual script content inside the source Google Doc still names Bellamere as the example client — that's intentional and preserved by design. Only surrounding chrome was changed. Old `/bellamere-trust-building-script/*` URLs 308-redirect to the new `/sample-trust-building-script/*` paths so any links shared from the original launch keep working.

---

## 11. FRE Job Description — 3 draft nurture emails awaiting final copy

The FRE Job Description nurture sequence (`src/lib/fre-job-description/nurture-sequence.ts`) ships with DRAFT bodies flagged `[DRAFT — awaiting Clay]`. All three email subjects and send-day cadence are Clay-approved; only the body copy is placeholder awaiting final language.

| Sequence · Email | Subject (final) | Body (draft) |
| ---------------- | --------------- | ------------ |
| The FRE Path · Email 1 (day 0) | "The FRE Job Description is in — here's how to use it" | [DRAFT — awaiting Clay] |
| · Email 2 (day 7) | "Hiring an FRE? Three questions to ask every candidate" | [DRAFT — awaiting Clay] |
| · Email 3 (day 21) | "Becoming an FRE? The certification path explained" | [DRAFT — awaiting Clay] |

**Action:** Replace the three draft bodies in `src/lib/fre-job-description/nurture-sequence.ts` with final copy.

---

## Infrastructure awaiting Clay / Abby (not content)

- **HubSpot Private App Token** (`HUBSPOT_PRIVATE_APP_TOKEN`) — Contact sync code is live in `src/lib/hubspot.ts` for Health Check, Action Plan, FCP, Messaging & Proof, Leadership Accountability Map, Scorecard Example, Dashboard Example, Revenue Team Map, Trust-Building Script, and FRE Job Description flows. Silent no-op until the token lands in Replit Secrets.
- **HubSpot sequence IDs** — Populate `NURTURE_SEQUENCE_IDS` (Health Check), `ACTION_PLAN_SEQUENCE_ID` (Action Plan), `FCP_SEQUENCE_ID` (FCP Worksheet), `MESSAGING_SEQUENCE_ID` (Messaging & Proof), `ACCOUNTABILITY_SEQUENCE_ID` (Leadership Accountability Map), `SCORECARD_EXAMPLE_SEQUENCE_ID` (Scorecard Example), `DASHBOARD_EXAMPLE_SEQUENCE_ID` (Dashboard Example), `REVENUE_TEAM_SEQUENCE_ID` (Revenue Team Map), `TRUST_BUILDING_SCRIPT_SEQUENCE_ID` (Sample Trust-Building Script), and `FRE_JOB_DESCRIPTION_SEQUENCE_ID` (FRE Job Description) in `hubspot.ts` once Abby has created the corresponding HubSpot sequences with the final email copy.
- **HubSpot transactional email for PDF delivery** — `sendQuizResultEmail` remains stubbed awaiting Abby's transactional template id. The Scorecard Example, Dashboard Example, Trust-Building Script, and FRE Job Description landing pages all promise "A copy has been sent to your email," but the actual send-on-intake transactional email is not yet wired — users can still download the PDF directly from the thanks page via the download button.
- **Supabase schema** — Run `src/lib/quiz/SCHEMA.sql`, `src/lib/action-plan/SCHEMA.sql`, `src/lib/fcp/SCHEMA.sql`, `src/lib/messaging/SCHEMA.sql`, `src/lib/accountability/SCHEMA.sql`, `src/lib/scorecard-example/SCHEMA.sql`, `src/lib/dashboard-example/SCHEMA.sql`, `src/lib/revenue-team/SCHEMA.sql`, `src/lib/trust-building-script/SCHEMA.sql`, and `src/lib/fre-job-description/SCHEMA.sql` in the velocityframework Supabase SQL editor. Health Check schema first (the Action Plan schema's `health_check_id` foreign key references `quiz_responses`); all other schemas have no cross-feature foreign keys and can run any time after.
- **Team-member optional email capture** (Health Check team mode) — Deferred, not wired; team responses stay fully anonymous unless/until Clay decides to add it.

---

## Operational dependency — Google Docs source files

Two toolbox PDFs fetch their content from Google Docs at render time (5-minute in-memory cache per server instance). Both documents must remain set to **"Anyone with the link can view."** If sharing permissions are tightened to "restricted" or "organization-only," the public export URL will 403/404 and the PDF endpoint serves a graceful fallback page ("This document is temporarily unavailable…") instead of the content.

| Resource | Doc ID | Constant |
| -------- | ------ | -------- |
| Sample Trust-Building Script | `1-so7nDEbFNnBS_YtmYlaO_Vv6Xk3xFwLvrSdBJTkjPA` | `TRUST_BUILDING_SCRIPT_DOC_ID` in `src/lib/trust-building-script/constants.ts` |
| FRE Job Description | `1wRSgNuNC6lz4QeO69sqOFIsLSnGBuvbzJyaPrs-GmqA` | `FRE_JOB_DESCRIPTION_DOC_ID` in `src/lib/fre-job-description/constants.ts` |

**If Luke or Clay ever switch a source doc:** update the corresponding constant. The replacement doc must also be publicly viewable for the export URL to work.
