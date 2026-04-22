# Missing Content Manifest

Clay's final content for the Culture Health Check is **already in code and shipping as-is**. The following three items are the only outstanding content asks before public launch.

---

## 1. Clay's direct calendar booking URL

Referenced in the Critical-tier nurture sequence, email 5 (day 21). Current copy ends with:

> "If you want to talk through your specific situation with me directly, here's my calendar: `[CLAY_CALENDAR_URL]`."

**Action:** Swap `[CLAY_CALENDAR_URL]` in `src/lib/quiz/nurture-sequences.ts` for the real URL. When Abby wires up HubSpot sequence enrollment (post-launch), she can substitute the URL there too — the code path is already in place.

---

## 2. Client anecdotes (optional)

Two places in the nurture sequences reference a composite or non-specific anecdote:

- **At Risk tier · email 4 (day 14):** "composite of how Good Agency has helped clients turn an At Risk score into Healthy"
- **Critical tier · email 4 (day 12):** "Story from Clay's own experience turning around a broken culture at Good Agency or with a client"

**Action:** If Clay wants to substitute a specific (permissioned, anonymized) story in either email, replace the relevant `body` in `src/lib/quiz/nurture-sequences.ts`. Otherwise the current copy ships as written.

---

## 3. Final approval of shipped copy

Every question, tier headline/subhead, dimension interpretation, recommended action, facilitator guide section, and nurture email is already live in code, verbatim from Clay's final spec. Flagged here so it's explicit that nothing is waiting on editorial review — just a green light.

**Action:** Clay confirms the copy as-is, or sends a diff. No structural content placeholders remain in the codebase.

---

## Infrastructure awaiting Clay / Abby (not content — tracking here for cross-reference)

- **HubSpot Private App Token** (`HUBSPOT_PRIVATE_APP_TOKEN`) — Contact sync code is in `src/lib/hubspot.ts`, gated on the env var. Silent no-op until the token lands.
- **HubSpot nurture-sequence creation** — The three sequences (Healthy / At Risk / Critical) are captured as data in `src/lib/quiz/nurture-sequences.ts` with full copy. When the token is available, Abby creates the sequences in HubSpot (workflow or sequence), populates `NURTURE_SEQUENCE_IDS` in `src/lib/hubspot.ts`, and enrollment activates automatically.
- **HubSpot transactional email for PDF delivery** — `sendQuizResultEmail` in `src/lib/hubspot.ts` is stubbed. Requires Abby to create a transactional template in HubSpot and drop the template id in that file.
- **Team-member optional email capture** — Spec notes this as optional; not wired in the core flow to preserve simplicity and anonymity. Team members can still subscribe via any other site touchpoint.
