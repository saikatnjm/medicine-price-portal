# UI modernisation brief (Phase 6b) — design plan

Product: Bangladesh healthcare finder used mostly on phones, in English and Bangla. Job: get someone from "I need X" to a trustworthy place/medicine page and an action (call, directions, save) in seconds.

## Tokens (keep the existing Tailwind `brand-*` scale working; ADD, don't rename)
- Colour: pine `#0b4f4a` (primary/headers, = brand-800 family), mist `#eaf4f2` (soft section fill), paper `#ffffff`, ink `#12302e` (text, use slate-900 where simpler), flag-red `#c8102e` ONLY for emergency/urgent markers (always with icon + text), saffron `#b45309`/`#fffbeb` for notices (already notice-*). Category tints (soft bg + strong fg, text/icon always present): medicine = teal, doctor = indigo, hospital = sky/blue, pharmacy = emerald, location = amber, specialty = violet. Define as CSS variables / Tailwind `@theme` tokens in src/app/globals.css (`--color-cat-*`), never colour alone for meaning.
- Type: Figtree (Latin) + Hind Siliguri (Bangla) via `next/font/google` in `src/app/[lang]/layout.tsx` (CSS variables `--font-latin`, `--font-bn`, applied in globals.css `--font-sans`; Bangla glyphs fall to Hind Siliguri automatically). Scale: h1 28/36 mobile → 40/48 desktop, semibold, tight tracking; body 16/26; small 14. Bangla text needs slightly more line-height (1.7): `html[lang="bn"] body { line-height: 1.7 }`.
- Shape: ONE card radius (rounded-2xl) for primary surfaces, rounded-full only for pills/chips/buttons. Prefer soft tinted fills (mist) and spacing over borders and shadows; max one bordered container per section; no stacked cards inside cards.
- Motion: none by default except focus/hover colour transitions (<=150ms) and native <details>; respect prefers-reduced-motion.
- Memorable element (spend boldness here only): a persistent MOBILE BOTTOM TAB BAR (Search, Doctors, Hospitals, Pharmacies, Saved) — app-like, thumb-reachable, hidden from md up; and category-coloured icon tiles used consistently everywhere an entity type appears.

## Principles
1. Answer-first: each page opens with what it is + the 2–3 actions people want. Technical/source metadata goes LAST (collapsed under "Source & last checked").
2. Progressive disclosure: <details> or "Show more" for long lists/secondary facts.
3. Never show empty fields. Never invent data. Keep every existing fact, link, aria-label and English string that tests assert (update tests if you intentionally change wording).
4. Mobile-first, 44px touch targets, visible focus, WCAG AA contrast, works in Bangla (longer strings wrap).
5. All new user-visible text needs en + bn message keys (see docs/I18N.md).
