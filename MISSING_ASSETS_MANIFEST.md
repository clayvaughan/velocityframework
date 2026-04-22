# Missing Assets Manifest

Every placeholder in the build, in one list. Drop the real asset at the
indicated filename (under `/public/` or `/public/fonts/` as noted) and it
replaces the placeholder automatically — no code change needed.

Two kinds of placeholders per the locked spec:

- **Kind 1 — PDF asset placeholders.** HubSpot delivers a blank/placeholder PDF
  from each download form until real content ships. Tracked separately in
  `/docs/resource-hubspot-workflows.md` (to be written). Not re-listed here.
- **Kind 2 — Visual asset placeholders.** Listed below, one per `<VisualPlaceholder>`
  instance in the code. Each entry gives the filename the asset should be
  saved as (in `/public/`), its final dimensions, and which page it appears on.

---

## Brand fonts — `/public/fonts/`

Licensed Velocity brand font files. Until these arrive, `@font-face` rules in
`src/app/globals.css` fail silently and Google Font fallbacks (Bebas Neue,
Barlow, Montserrat) render instead.

| Filename | Format | Weight/Style | Purpose |
| -------- | ------ | ------------ | ------- |
| `big_noodle_titling.ttf` | TTF | 400 normal | `h1`, display |
| `big_noodle_titling_oblique.ttf` | TTF | 400 italic | display italic |
| `Nexa_Bold.otf` | OTF | 700 normal | `h2`, `h3`, section headings |
| `Montserrat-Regular.ttf` | TTF | 400 normal | body |

---

## Visual placeholders — `/public/`

Every entry corresponds to one `<VisualPlaceholder>` in the codebase. Aspect
ratio is implied by dimensions.

| # | Filename | Dimensions | Page | Description |
| - | -------- | ---------- | ---- | ----------- |
| 1 | `book-cover-hero-800x1000.jpg` | 800 × 1000 | `/` (hero) | Velocity book cover — hero shot |
| 2 | `clay-headshot-primary-800x1000.jpg` | 800 × 1000 | `/` (about strip) | Clay Vaughan primary headshot |
| 3 | `cohort-photo-past-1200x800.jpg` | 1200 × 800 | `/` (workshop teaser) | Past FRE cohort — group photo |
| 4 | `clay-headshot-about-900x1100.jpg` | 900 × 1100 | `/about` (hero) | Clay headshot — about-page |
| 5 | `book-cover-detail-900x1100.jpg` | 900 × 1100 | `/book` (hero) | Book cover — detail shot |
| 6 | `cohort-hero-1200x900.jpg` | 1200 × 900 | `/workshop` (hero) | Workshop cohort — hero image |
| 7 | `clay-workshop-portrait-800x1000.jpg` | 800 × 1000 | `/workshop` (founder note) | Clay portrait — workshop context |
| 8 | `fre-client-logo-1-240x120.png` through `fre-client-logo-6-240x120.png` | 240 × 120 | `/workshop` (social proof) | Six client logos from FRE network (anonymize as needed) |
| 9 | `toolbox-cover-<slug>-800x1000.jpg` × 12 | 800 × 1000 | `/toolbox/[slug]` (one per resource) | Cover artwork per resource; slug matches the resource slug in `src/lib/resources.ts` |

---

## Content placeholders (documented, not in this manifest)

The following are not visual placeholders but are worth flagging as "not-yet-final":

- Workshop page content — migrated with reasonable defaults (Clay's confirmed facts: $5k, Jun 25–26 2026, Austin, 12 seats, $1,500/yr renewal, EARLYBIRD2026 thru May 31 2026). Luke Frazier refines post-migration. Source `velocitybook.com/workshop` is a JavaScript-rendered SPA and could not be scraped — see project notes.
- Stripe Buy Button — `src/app/workshop/page.tsx` has a `data-stripe-buy-button-slot` element holding the "Secure your seat" space. Replace with the live Stripe Buy Button when Luke provides the product ID.
- `/AI` page tool list — seeded with reasonable defaults (ChatGPT, Claude, Fathom, Lindy, Gamma, Perplexity) pending Clay's direct curation. Quarterly update cadence.
- Privacy / Terms — template language. Final copy needs legal review before launch.
- HubSpot form slots — every `<HubSpotFormSlot>` in the codebase is a labeled placeholder. Abby wires the real HubSpot embeds. Slot identifiers (`data-form-key`, `data-workflow`) give her machine-readable targets.
