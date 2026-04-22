# Velocity brand fonts

The four files in this folder satisfy the `@font-face` declarations in
`src/app/globals.css`. The site loads them automatically — no code change is
needed when files are swapped, only the filenames must stay identical.

| File | Weight | Style | Status |
| ---- | ------ | ----- | ------ |
| `big_noodle_titling.ttf` | 400 | normal | **Stand-in (Bebas Neue Regular — swap to the licensed BigNoodleTitling file).** Hero display falls back to Google Fonts Anton (heavier-stroke display font) in the web-font stack while this local file is a thin stand-in. |
| `big_noodle_titling_oblique.ttf` | 400 | italic | **Stand-in (Bebas Neue Regular)** — replace with the licensed BigNoodleTitling Italic file |
| `Nexa_Bold.otf` | 700 | normal | **Stand-in (Barlow Bold)** — replace with the licensed Nexa Bold file |
| `Montserrat-Regular.ttf` | 400 | normal | Open-source (Google Fonts Montserrat) — final |

Open-source fonts under the licensed filenames are visually equivalent to the
Google Font fallbacks the site previously rendered, so the typography is
production-acceptable today. When Lindsay supplies the truly-licensed
Velocity files (BigNoodleTitling, NexaBold), drop them in here under the
exact filenames above and they take effect automatically.

Tracked in the root `MISSING_ASSETS_MANIFEST.md`.
