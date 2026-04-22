# velocityframework.com

Public site for Clay Vaughan's Velocity framework — the companion site to the
book *Velocity: Less Chaos. More Profit. Real Growth.* (January 2026).

## Stack

- **Next.js 16** (App Router) + TypeScript + React 19
- **Tailwind CSS 4** (CSS-based `@theme` tokens in `src/app/globals.css`)
- **shadcn/ui pattern** — local `src/components/ui/` with CVA + Radix Slot
- **Google Fonts** — Bebas Neue, Barlow, Montserrat (fallbacks until licensed
  Velocity brand fonts land in `/public/fonts/`)
- **Hosting** — Replit (import this repo as source of truth)

## Out of scope here

- **Supabase** — not used in this build. Phase 2 (`app.velocityframework.com`)
  will use a separate Supabase project.
- **HubSpot integration** — forms are rendered as labeled slot placeholders
  (`<HubSpotFormSlot>`). Abby wires real HubSpot embeds later.
- **Stripe integration** — workshop checkout has a labeled slot; wire the
  real Stripe Buy Button when the product ID is ready.
- **Real PDF content** — every `/toolbox/[slug]` page ships a working HubSpot
  form placeholder that will deliver a provisional PDF. Final PDFs come later
  from Lindsay / the designer.

## Dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

Then:

```bash
npm run build        # production build + type check
npm run lint         # ESLint
```

## Repo layout

```
src/
├── app/                        # App Router pages, one folder per route
│   ├── layout.tsx              # Root layout — fonts, header, footer
│   ├── globals.css             # Design tokens, @theme, @font-face
│   ├── page.tsx                # Homepage
│   ├── about/ book/ contact/   # Phase 1 pages
│   ├── privacy/ terms/         # Legal (placeholder templates)
│   ├── heart/ heading/ hustle/ # Pillar hubs
│   ├── toolbox/                # Resource library + [slug] detail
│   ├── workshop/               # FRE Certification
│   ├── AI/ conference/ insights/ health-survey/
├── components/
│   ├── layout/                 # SiteHeader, SiteFooter
│   ├── ui/                     # Button (locked variants)
│   ├── HubSpotFormSlot.tsx     # Placeholder for every HubSpot embed
│   ├── VisualPlaceholder.tsx   # Labeled gray rectangle for missing imagery
│   ├── PillarTag.tsx PillarCard.tsx ResourceCard.tsx SectionHeader.tsx
├── config/
│   └── site.ts                 # Nav, metadata, site constants
└── lib/
    ├── utils.ts                # cn() helper
    └── resources.ts            # Master list of 13 resources + pillar meta
```

## Design system (locked — do not deviate)

- **Colors:** Slate Black `#272727` · Harvest Gold `#c7af81` · Cream `#f9f7f2`
  plus semantic tokens for success / warning / info / destructive.
- **Typography:** `font-velocity` (BigNoodleTitling → Bebas Neue) for display;
  `font-heading` (NexaBold → Barlow) for section headings; `font-sans`
  (Montserrat) for body. H1 all-caps, 0.08em tracking.
- **Button variants:** default, outline, secondary, hero, cta, gold-outline,
  success, warning, info, destructive, toggle, link.
- **No serif fonts. No stock photos of handshakes or laptops.**

## Before you launch

See `MISSING_ASSETS_MANIFEST.md` in the repo root for every placeholder that
needs to be replaced with real content — visual assets, PDFs, Stripe product,
HubSpot wiring.
