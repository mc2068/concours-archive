# Design decisions: Concours archive

Settled in conversation before build, then revised when the "archive" design
system board replaced the original "ink & paper" system. These describe the look
and feel to apply directly in the Astro components. No code here; this is the
reference the build follows.

## Canonical source

The authoritative design system is the **Concours Archive design system board**,
committed at `design/design-system.jfif`. The older "ink & paper" system and its
artifact (`https://claude.ai/artifact/3TW52qK7xbZGKbTaSEKpbc`) are **superseded**
— do not build from them.

The board is a rendered image, not a spec: it prints five colours and a six-step
type ramp and nothing else. Every value it does not print is **derived** here and
marked DERIVED in `src/styles/global.css`. When the board and this file disagree
on something the board actually prints, the board wins; on everything else, this
file is the record.

The board is also drawn for a *different product* — an archive of Tunisian
**university** concours (Médecine, Droit, Économie) with accounts, favourites,
downloads and a document viewer. **Only its visual layer is adopted.** Its
information architecture and its nouns ("Université", "Matière", "Document",
"Mes favoris") are refused: they contradict `CONTEXT.md`, where the unit is the
*exercice*, the front door is the *chapitre*, and v1 has no accounts.

## Approach

- Design applied straight into the real Astro build. No throwaway mockup.
- **Light theme only** for v1. Dark mode is a plausible fast-follow (students
  revise at night) but out of scope now.

## Identity: "archive"

Academic, warm, printed. The page should read as a reference shelf a student
trusts, not as a SaaS dashboard. Charcoal and cream, a serif that sets and a
sans that runs, and content on white sheets over a cream ground.

- **Ground:** cream, with ivory as the recessed tint.
- **Text:** charcoal, with a warm brown-grey for secondary lines.
- **Emphasis:** dark brown fills. There is **no chroma accent in the UI**.
- **Spot colour:** amber survives only inside the brand art (`design/logo.png`,
  `design/empty-state.png`) — one warm mark on an otherwise neutral page.

### What this reversed, and why

Three decisions from "ink & paper" are deliberately undone. Do not re-argue them
without reading this section.

| was | now | why |
| --- | --- | --- |
| one typeface (Inter) | Playfair Display sets, Inter runs | the board's ramp is explicitly two-family; the serif is what makes a filter list read as an archive |
| no shadows anywhere, hairlines only | one soft card shadow on panels | the board composes in elevated sheets; hairlines alone left the page reading as an unstyled document |
| amber accent, chosen because it clashes with none of the 🇫🇷🇹🇳🇲🇦 flag colours in result rows | brown/charcoal fills, no UI accent | the flag argument is *satisfied more strongly* by a neutral emphasis colour — nothing to clash with. Amber stays in the brand art only |

## Tokens (light theme)

Colours. The first five are the board's, verbatim; the rest are roles.

| token | value | role |
| --- | --- | --- |
| `charcoal` | `#1f1f1f` | board colour 1 — masthead ground, primary text |
| `brown` | `#4a3f2f` | board colour 2 — emphasis fills |
| `beige` | `#c9b8a4` | board colour 3 — decorative outline, masthead secondary text |
| `ivory` | `#ede6dc` | board colour 4 — recessed tint |
| `cream` | `#f7f5ef` | board colour 5 — the page |
| `surface` | `#f7f5ef` | page background |
| `surface-raised` | `#ffffff` | panels, result rows |
| `surface-sunken` | `#ede6dc` | hover ground, chip ground |
| `ink` | `#1f1f1f` | primary text |
| `ink-muted` | `#6e6355` | **DERIVED** — secondary text; 5.4:1 on cream |
| `border` | `#e0d8ca` | **DERIVED** — decorative hairlines only |
| `border-strong` | `#8a7b66` | **DERIVED** — a control's own boundary; 3.8:1 on cream |
| `accent` | `#4a3f2f` | selected chapitre, primary action |
| `accent-strong` | `#1f1f1f` | outline on accent fills, primary hover |
| `on-accent` | `#f7f5ef` | text on brown/charcoal fills |
| `focus-ring` | `#1f1f1f` | solid 2px ring, 2px offset |

**Contrast note.** The board draws control borders in beige `#c9b8a4`, which is
1.9:1 on white — below the 3:1 floor for a control's only boundary. Beige is
therefore kept for *decorative* outlines (the primary-chapitre chip) and
`border-strong` carries anything a user has to find: selects, secondary buttons.

Type — two families. `display` = `"Playfair Display", Georgia, "Times New
Roman", serif`; `sans` = `Inter, system-ui, -apple-system, "Segoe UI", Roboto,
"Helvetica Neue", Arial, sans-serif`. Both load from Google Fonts; the fallbacks
are the offline stacks. The board's ramp — H1 48/56/700 · H2 32/40/700 · H3
24/32/600 (display) · body 16/24/400 · small 14/20/400 · caption 12/16/500
(sans) — maps onto this page as: masthead wordmark 26/32/700 display · panel
title 24/32/600 display · row title 18/26/600 display · body 14–16 sans · meta
13/20 sans · chip and group label 12/16/500 sans, uppercase `+0.08em`. Years use
tabular figures (`.tnum`).

Spacing (**DERIVED**, carried over unchanged): 4 · 8 · 12 · 16 · 24 · 32.
Radius: `sm` 4 (chapitre items) · `md` 8 (buttons, selects) · `lg` 12 (panels) ·
`pill` 999 (chips).
Shadow (**DERIVED**): `shadow-card` — a 1px contact shadow plus a wide, faint
lift. One value; nothing else on the page is elevated.

## Components

- **Masthead** — full-bleed charcoal band: logo mark, wordmark, tagline, and the
  dataset counts (exercices / épreuves) read off the dataset so they cannot
  drift. The board's masthead is a photograph of a library reading room; this is
  the same shape in flat charcoal, because a hero photo costs a licence and a few
  hundred KB on a phone. Below 640px the counts are dropped so the list leads.
- **Panel** — the white sheet: `radius-lg`, hairline border, `shadow-card`. Used
  for the sidebar and for the result list (which adds a `panel__header` holding
  the chapitre name and the match count).
- **Button** — primary (brown fill, cream text, charcoal outline; the "Ouvrir"
  action) and secondary (`border-strong` outline on white).
- **ChapterList** — sidebar front door; chapitres grouped by domain, single
  select. The selected chapitre is a **filled brown bar with cream text**, not a
  tint: on a page this neutral, a tint cannot carry the only state that matters.
- **ResultRow** — display-serif label / `meta` `🇫🇷 Mines Maths 1 · 2019` line /
  ChapterChips / "Ouvrir" button; hairline separated, cream on hover.
- **ChapterChip** — `radius-pill`, outlined not filled. The primary chapitre
  takes an ivory ground, a beige border and brown text, so it cannot compete
  with the filled selection in the column.
- **ResultsState** — the match count in the panel header, and an "Aucun
  résultat" empty state built around `design/empty-state.png` with a reset.
- **Footer** — one muted line over a hairline, saying what the archive is.

## Brand assets

`design/` holds the full-size source art (~800 KB each, painted on an opaque
cream ground). `scripts/build-brand-assets.mjs` unmixes that ground back out to
an alpha channel, trims and downscales, and writes `public/logo.png`,
`public/favicon.png` and `public/empty-state.png` — about 8 KB total. Re-run it
after changing anything in `design/`; never hand-edit the files in `public/`.

## CSS approach

- **Tailwind CSS**, the standard Astro pairing. Tokens live in `@theme`;
  anything the client script builds (rows, chips, empty state) is a component
  class in `global.css`, so server and client markup share one source of truth.
- No React component library — unnecessary for a mostly-static filter page and
  would pull in JS we don't want.

## Layout

- **Desktop:** a left **sidebar** panel holds the chapitre list + refinement
  filters; the results panel fills the main column. The chapitre list is the
  front door and gets persistent, always-visible space.
- **Mobile:** the sidebar collapses into a sheet behind a toggle above the
  content. No horizontal scrolling; everything legible and tappable at phone
  width.
