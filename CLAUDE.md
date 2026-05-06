# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Public marketing + tools site for Clay Vaughan's *Velocity* framework, companion to the book *Velocity: Less Chaos. More Profit. Real Growth.* (Jan 2026). Phase 2 (`app.velocityframework.com`) is a separate project and is **not** in this repo.

Hosted on **Replit Autoscale**. Replit's deployment is the source of truth — the dev server binds `0.0.0.0:5000` to match Replit's port-mapping convention (see `.replit`).

## Commands

```bash
npm install
npm run dev          # next dev on 0.0.0.0:5000  (NOT :3000 — see .replit)
npm run build        # production build + type check
npm run start        # next start on 0.0.0.0:5000
npm run lint         # eslint
```

There is **no test runner configured**. The only test-shaped scripts are ad-hoc PDF-render harnesses (`scripts/test-*-pdf.ts`) — run with `npx tsx scripts/test-fre-job-description-pdf.ts`. Don't add Jest/Vitest scaffolding without asking.

After every merge Replit runs `scripts/post-merge.sh` (re-installs deps). Keep it idempotent and non-interactive.

## Architecture

### App Router with one folder per route
`src/app/` contains both the marketing site (`/`, `/about`, `/book`, `/heart`, `/heading`, `/hustle`, `/workshop`, `/contact`, etc.) and the interactive tools (`/messaging-proof-checklist`, `/leadership-accountability-map`, `/revenue-team-accountability-map`, `/favorite-customer-profile`, `/action-plan`, `/fre-job-description`, `/sample-trust-building-script`, `/health-survey`, the dashboard/scorecard examples). The `/toolbox` hub lists all 12 resources from `src/lib/resources.ts`; tools that are live interactive flows (not PDF downloads) set `externalHref` on their resource entry, and `/toolbox/[slug]` redirects to that URL.

### Tool architecture (the repeatable shape)
Each interactive tool follows the same skeleton — when adding or modifying a tool, mirror an existing one rather than inventing structure:

- `src/lib/<tool>/` — `storage.ts` (Supabase wrapper, **graceful no-op when env vars are missing**), `SCHEMA.sql` (run manually in Supabase SQL editor; migrations are idempotent `alter table … add column if not exists`), tool-specific types and helpers.
- `src/components/<tool>/` — client form components (multi-screen builders typically).
- `src/app/<tool>/page.tsx` — the form/build page.
- `src/app/<tool>/saved/[id]/page.tsx` — the read-only saved view (where AI Polish mounts).
- `src/app/api/<tool>/[id]/pdf/route.tsx` — PDF generation endpoint.
- `src/app/api/<tool>/[id]/save/route.ts` (or `update`, `intake`) — write endpoints.

Supabase is used **service-role-only** server-side; the client never talks to Supabase directly. Storage modules return `{ ok: false, reason }` shapes rather than throwing — call sites check `isStorageConfigured()` first.

### PDF rendering pipeline
All PDFs use `@react-pdf/renderer` server-side. Shared infra lives in `src/lib/pdf/`:

- `theme.ts` — fonts (registered via `Font.register` against files in `/public/fonts/`) and color tokens. **Always import COLOR/styles from here**; never hard-code brand colors in a report. The `resolveFontsDir()` helper is load-bearing — it tries multiple candidates because Replit Autoscale sometimes runs with a different `cwd`. Don't simplify it.
- `render.ts` — the `renderPdfToBuffer()` wrapper. All PDF routes go through it.
- `markdown-to-pdf.tsx` — minimal Markdown subset → react-pdf nodes, used by AI-polished reports.
- `<Tool>Report.tsx` — one report component per tool (e.g. `MessagingReport.tsx`, `FCPReport.tsx`, `FreJobDescriptionReport.tsx`). The `Polished*` variant renders the AI-cleaned Markdown version.

Recent commits show a production "PDF RENDER FAILED" issue rooted in font resolution — be cautious touching `theme.ts`/`resolveFontsDir`.

### AI Polish (shared infrastructure)
See `src/lib/ai/README.md` — it is the canonical guide for adding AI Polish to a new tool (5-step recipe, ~30 minutes). Key constraints:

- Single global rate limiter at `src/lib/ai/rate-limiter.ts` (per-IP hourly + daily, global daily). In-memory only — fine for single-instance Replit Autoscale, would need Redis/Supabase if we ever scale horizontally. **Don't add per-tool overrides.**
- Tool registry at `src/lib/ai/registry.ts` maps `tool-name → { buildPrompt, savePolishedVersion }`. Every new tool registers here.
- Cost monitoring is a structured `{kind:"ai-call", ...}` log line per call — no separate metrics pipeline. Update token costs in `anthropic-client.ts` if Anthropic shifts pricing.
- Each tool that persists a polished version needs a `polished_version text` column added via its `SCHEMA.sql` migration; surface the migration in `MISSING_CONTENT_MANIFEST.md` so Clay runs it in Supabase before the feature ships.
- Streaming, prompt caching, persistent attempt history are explicitly out of scope — see the README for rationale before adding.

### Site config + nav
`src/config/site.ts` is the single source of truth for nav, contact email, HubSpot portal ID, Stripe payment link, Amazon book URL. Update once and CTAs across the site follow.

### Resources catalog
`src/lib/resources.ts` is the master list of toolbox resources (slug, pillar, owner, HubSpot workflow key). Add a new resource here first; the toolbox grid and `[slug]` routing key off this.

## Design system (locked — do not deviate)

These are enforced because the brand identity is locked, not because the code requires it:

- **Colors**: Slate Black `#272727`, Harvest Gold `#c7af81`, Cream `#f9f7f2` + semantic tokens (success/warning/info/destructive). Defined as `@theme` tokens in `src/app/globals.css`.
- **Fonts**: `font-velocity` (BigNoodleTitling → Bebas Neue) for display, `font-heading` (NexaBold → Barlow) for headings, `font-sans` (Montserrat) for body. H1 is all-caps, `0.08em` tracking. Local font files in `/public/fonts/` are open-source stand-ins until licensed Velocity fonts arrive — overwrite with same filenames when they land.
- **Buttons**: Variants are locked (`default | outline | secondary | hero | cta | gold-outline | success | warning | info | destructive | toggle | link`). Don't add new variants without a strong reason.
- **No serif fonts. No stock photos of handshakes/laptops.**
- Tailwind source detection is **disabled** in `globals.css` and explicitly opt-in for `./src/**` only — adding utility classes in `.local/` workspace docs or stray markdown won't be picked up (intentionally).

## Placeholders that are intentional (don't "fix" these)

These are wired as labeled slots and will be filled by other people — do not replace with real integrations unless asked:

- `<HubSpotFormSlot>` — every HubSpot form. Abby wires real GUIDs later. The portal ID in `siteConfig.hubspotPortalId` is correct; what's missing is per-form GUIDs + Private App Token.
- `<VisualPlaceholder>` — labeled gray rectangles for missing imagery.
- `/toolbox/[slug]` PDFs — most slugs ship with provisional PDFs; final PDFs come from Lindsay/the designer.
- Stripe workshop checkout — currently a Payment Link in `siteConfig.stripeWorkshopPaymentLink`. Embedded checkout (Stripe.js/Elements) is intentionally not wired.

`MISSING_ASSETS_MANIFEST.md` and `MISSING_CONTENT_MANIFEST.md` at the repo root track everything still pending — keep them current when you ship or stub something.

## Out of scope here

- **Supabase auth / RLS for end users** — current pattern is service-role server-side only; there is no logged-in user model on this site.
- **Multi-instance scaling** — rate limiter and any in-memory caches assume single Replit Autoscale instance.
- **Phase 2** (`app.velocityframework.com`) — separate repo, separate Supabase project. Don't conflate.
