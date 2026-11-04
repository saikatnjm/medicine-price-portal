# Colour palette

Tokens live in `src/app/globals.css` (`@theme`), so every Tailwind class (`bg-pine`, `text-brand-800`,
`bg-cat-hospital-bg`, …) follows them. Token names from the first redesign are unchanged; `surface` and
`accent-*` are new. The same hex values are hard-coded in three places that cannot read CSS variables:
`src/app/[lang]/layout.tsx` (`viewport.themeColor`), `src/app/manifest.ts` (`theme_color`) and
`src/app/opengraph-image.tsx`.

Chosen palette: **Clinical Blue** (picked 2026-11-04 from four options: Clinical Blue, Hospital Teal,
Navy & Mint and National Green). Hospital blue on white reads as a medical service; deep navy headings,
calm blue-grey surfaces, one clinical teal accent for positive states and a few call-to-action highlights,
and red reserved for emergencies. Meaning is never carried by colour alone: category tints, emergency
markers and notices always come with an icon and a text label.

## Core

Contrast is against white unless noted (WCAG AA: 4.5:1 body text, 3:1 large text / UI).

| Token | Hex | Role | Contrast |
| --- | --- | --- | --- |
| `pine` | `#0a5ca8` | Primary buttons, logo, active tab; browser theme colour | 6.75 · 5.98 on mist · 5.26 on brand-100 |
| `brand-50` | `#eaf2fb` | Faint blue fill (info panels, OG background) | ink on it 13.74 |
| `brand-100` | `#d4e5f7` | Chip hover, OG gradient end | pine on it 5.26 |
| `brand-600` | `#0a5ca8` | Focus outline, input focus border | 6.75 |
| `brand-700` | `#094f91` | Button hover | white on it 8.27 |
| `brand-800` | `#08427a` | Inline links, counts in chips | 10.14 · 8.98 on mist |
| `mist` | `#eaf2fb` | Soft section fill (hero, footer, chips) | slate-700 on it 9.3 |
| `surface` | `#f5f8fb` | Calm neutral card fill | slate-700 9.71 · flag 5.52 |
| `ink` | `#0b2540` | Headings and strong text | 15.52 · 13.74 on mist |
| `accent-50` | `#e3f4f1` | Teal call-out card fill | accent-700 on it 6.65 |
| `accent-100` | `#c8ebe4` | Accent hover fill (no text on it below 18px) | accent-600 on it 4.04 (large text only) |
| `accent-600` | `#0f7b6c` | Teal CTA fill (homepage search, "Read the guides") | white on it 5.16 |
| `accent-700` | `#0b5f54` | Accent hover, accent icons | 7.56 |
| `flag` | `#c8102e` | Emergency / urgent markers only | 5.88 |
| `notice-50` / `-200` / `-900` | `#fffbeb` / `#fde68a` / `#78350f` | "Sample data" and caution notices (unchanged) | 8.75 |

`text-pine/80` was replaced by solid `text-brand-800`: with a blue primary, 80 % opacity would fall to
4.36:1. `src/app/icon.svg` keeps its previous colours because it carries an embedded C2PA content-credentials
manifest that an edit would invalidate; replace it with a new icon file if a blue favicon is wanted.

Body text stays Tailwind `slate-900` / `slate-700` / `slate-600` on these surfaces.

## Category tints

Soft background + strong foreground; the label text on a tile is `ink` or `slate-700`.

| Category | Background | Foreground |
| --- | --- | --- |
| Medicine (teal) | `cat-medicine-bg` `#daf0f1` | `cat-medicine-fg` `#08636b` |
| Doctor (indigo) | `cat-doctor-bg` `#e7e9fc` | `cat-doctor-fg` `#3a3db8` |
| Hospital (sky) | `cat-hospital-bg` `#ddeefb` | `cat-hospital-fg` `#0b5a8a` |
| Pharmacy (emerald) | `cat-pharmacy-bg` `#ddf3e3` | `cat-pharmacy-fg` `#16683a` |
| Location (amber) | `cat-location-bg` `#fdefd0` | `cat-location-fg` `#874107` |
| Specialty (violet) | `cat-specialty-bg` `#f0e7fc` | `cat-specialty-fg` `#6a2bb0` |

## Contrast (WCAG 2.1)

Targets: 4.5:1 for body text, 3:1 for large text and UI parts (focus rings, icons, borders that identify a
control). Ratios are computed with the WCAG relative-luminance formula; alpha colours are blended onto the
background first.

| Foreground | Background | Ratio | Use |
| --- | --- | --- | --- |
| `slate-900` | white / mist / surface | 17.85 / 16.09 / 16.74 | Body text |
| `ink` | white / mist / surface / brand-50 | 15.28 / 13.77 / 14.32 / 13.96 | Headings |
| `slate-700` | white / mist / surface / slate-50 | 10.35 / 9.34 / 9.71 / 9.90 | Secondary text |
| `slate-600` | white / mist / surface | 7.58 / 6.83 / 7.10 | Small print, status lines |
| `pine` | white / mist / brand-100 | 10.20 / 9.19 / 8.18 | Chip text, logo, nav hover |
| `pine/80` | white / mist / brand-100 | 5.83 / 5.44 / 5.01 | Counts inside chips (was `/70`, 4.44 on white: raised) |
| white | `pine` / `brand-700` / `brand-800` / `brand-600` | 10.20 / 6.62 / 8.97 / 5.40 | Text on filled buttons |
| `white/80` | `pine` | 7.16 | Count on an active chip |
| `brand-800` | white / mist / brand-50 / surface | 8.97 / 8.09 / 8.20 / 8.41 | Links |
| `brand-700` | white / mist | 6.62 / 5.97 | Links |
| `brand-600` (focus ring) | white / mist / surface / accent-50 | 5.40 / 4.87 / 5.06 / 4.98 | Focus outline (needs 3:1) |
| white | `accent-600` / `accent-700` | 5.50 / 7.63 | CTA buttons |
| `accent-700` | white / accent-50 / accent-100 | 7.63 / 7.03 / 6.20 | Accent icon, accent text |
| `ink` / `slate-700` | `accent-50` | 14.08 / 9.54 | Guides card text |
| `flag` | white / surface | 5.88 / 5.52 | Emergency labels and icons |
| `notice-900` | `notice-50` | 8.75 | Notices |
| `cat-*-fg` | own `cat-*-bg` | 5.89 / 6.87 / 6.22 / 5.85 / 6.61 / 6.78 | Medicine / doctor / hospital / pharmacy / location / specialty |
| `cat-*-fg` | white | 6.98 / 8.27 / 7.38 / 6.83 / 7.53 / 8.12 | Same order (icons and labels on white) |
| `cat-*-fg` | white/80 chip on own tint | 6.76 / 7.99 / 7.15 / 6.64 / 7.35 / 7.83 | Icon chip in category tiles |
| `ink` | any `cat-*-bg` | 12.70–13.41 | Tile labels |
| `slate-700` | any `cat-*-bg` | 8.61–9.09 | Tile counts |
| `pine` / `brand-800` | brand-100 (social image) | 8.18 / 7.19 | Open Graph image text |

Decorative rings (`ring-brand-600/30` on the "see all" chip, `ring-flag/30`–`/40` around emergency
cards) are not the only cue that identifies the element (the text and icon are), so they are exempt from
the 3:1 UI rule.

## Usage rules

- One accent: `accent-*` is for a call to action that should stand out (homepage search, guide call-out). Do
  not use it for warnings (`notice-*`) or emergencies (`flag`).
- `flag` red appears only with an icon and text ("Emergency", the siren icon).
- Keep `slate-*` for running text; use `ink` for headings and `pine` for interactive text on tints.
- Print styles (`@media print` in `globals.css`) drop backgrounds, hide header, footer, navigation, buttons,
  forms, maps and the save/share toolbar, and print a website address once after external links.
- `src/app/icon.svg` still uses the previous teal (`#0f766e`); it carries a content-credentials manifest,
  so it was left unchanged.
