# Velocity brand fonts

Drop licensed font files here with these **exact** filenames — the @font-face
rules in `src/app/globals.css` look for them by name:

| File | Weight | Style | Status |
| ---- | ------ | ----- | ------ |
| `big_noodle_titling.ttf` | 400 | normal | **MISSING — fallback Bebas Neue** |
| `big_noodle_titling_oblique.ttf` | 400 | italic | **MISSING — fallback Bebas Neue italic** |
| `Nexa_Bold.otf` | 700 | normal | **MISSING — fallback Barlow 700** |
| `Montserrat-Regular.ttf` | 400 | normal | **MISSING — fallback Montserrat (Google Fonts)** |

Until these land, the site renders using the Google Font fallbacks wired in
`src/app/layout.tsx`. Once the files are dropped here, the real Velocity fonts
take over automatically — no code change needed.

Tracked in the root `MISSING_ASSETS_MANIFEST.md`.
