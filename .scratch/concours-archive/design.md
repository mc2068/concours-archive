# Design decisions: Concours archive

Settled in conversation before build. These describe the look and feel to apply
directly in the Astro components — there is no separate mockup (we designed in
words, not as an artifact). No code here; this is the reference the build follows.

## Canonical source

The authoritative design system is the **"Concours archive" Design System
artifact** (`https://claude.ai/artifact/3TW52qK7xbZGKbTaSEKpbc`). The tokens and
components below are copied from it as a build reference; if the two ever
disagree, **the artifact wins** — re-read it before building. It is light-theme
only and defines five components: Button, ChapterList, ResultRow, ChapterChip,
ResultsState.

## Approach

- Design agreed **in conversation** and formalized in the design-system artifact,
  applied straight into the real Astro build. No throwaway mockup.
- **Light theme only** for v1. Dark mode is a plausible fast-follow (students
  revise at night) but out of scope now.

## Identity: "ink & paper"

Neutral, academic, content-first. A focused revision tool used under exam
stress — the chrome recedes, the exercises and chapter names are the hero.
Deliberately **not** the AI-default indigo/violet look.

- **Background:** warm off-white ("paper").
- **Text:** near-black ink.
- **Accent (single):** a muted **amber / ochre** highlight — like a highlighter on
  revision notes — used only for the selected chapitre, focus rings, and primary
  actions. Chosen because it is the one accent that clashes with **none** of the
  🇫🇷 🇹🇳 🇲🇦 flag colors (all red/green/blue) that appear in result rows.
- Everything else: neutral grays. One accent, lots of calm space.
- No shadows anywhere; separate with `border` hairlines only.

## Tokens (light theme — from the artifact)

Colors:

| token | value | role |
| --- | --- | --- |
| `surface` | `#faf8f3` | page background (the paper) |
| `surface-raised` | `#ffffff` | result rows, inputs, mobile sidebar sheet |
| `surface-sunken` | `#efeadf` | hover ground for rows/chapitre items, chip ground |
| `ink` | `#1c1b18` | primary text |
| `ink-muted` | `#5f5b53` | secondary lines, counts, group labels |
| `border` | `#e3ded3` | hairline dividers (never a control's sole boundary) |
| `border-strong` | `#8a8478` | control outlines (secondary button, inputs) |
| `accent` | `#e8b23a` | ochre highlighter: selected chapitre fill, primary button — always carries `ink` text |
| `accent-soft` | `#fbeec8` | selected-row ground, primary-chip ground |
| `accent-strong` | `#7a4f00` | outline of accent fills, primary-chip border, text on `accent-soft` |
| `focus-ring` | `#7a4f00` | solid 2px ring, 2px offset (amber alone fails 3:1, so the ring is dark ochre) |
| `on-accent` | `#1c1b18` | text/icons on `accent` |

Type — one family `sans` = `Inter, system-ui, -apple-system, "Segoe UI", Roboto,
"Helvetica Neue", Arial, sans-serif`. Styles: `heading` 20/28/600 · `row-title`
16/24/700 · `body` 15/22/400 · `meta` 13/20/400 · `chip` 12/16/500 ·
`group-label` 12/16/600 (`+0.06em`) · `button` 14/20/600. Years use tabular
figures (`.tnum`). Inter loads from Google Fonts; the system stack is the offline
fallback.

Spacing: `space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-6` 24 · `-8` 32.
Radius: `radius-sm` 4 (sidebar items) · `radius-md` 8 (rows, buttons) ·
`radius-pill` 999 (chips).

## Components (from the artifact)

The five components cover the whole filter page — build them to these:

- **Button** — primary (`accent` fill, `on-accent` text, `accent-strong` outline)
  and secondary (`border-strong` outline). Label e.g. "Ouvrir".
- **ChapterList** — sidebar front door; chapitres grouped by domain
  (`group-label`), single-select, selected item on `accent-soft`.
- **ResultRow** — `row-title` label / `meta` `🇫🇷 Mines · 2019` line /
  ChapterChips / "Ouvrir" Button; `space-4` padding, hairline separated.
- **ChapterChip** — `radius-pill`; primary chapitre emphasized with `accent-soft`
  ground and `accent-strong` border.
- **ResultsState** — the match count ("12 exercices" / "1 exercice") and the
  "Aucun résultat" empty state with a reset.

## CSS approach

- **Tailwind CSS**, the standard Astro pairing. Keeps the static site small and
  makes density/spacing fast to tune.
- No React component library (e.g. shadcn) — unnecessary for a mostly-static
  filter page and would pull in JS we don't want.

## Typography

- **One sans-serif throughout: `Inter`**, with a system-sans fallback stack. No
  second typeface.
- **Tabular figures** for years so "2019 / 2023" align in columns.
- Note: this styles only *our* UI text. Exercise content lives in the PDFs and is
  untouched.

## Layout

- **Desktop:** a left **sidebar** holds the chapitre list + refinement filters;
  results fill the main column. The chapitre list is the front door and gets
  persistent, always-visible space.
- **Mobile:** the sidebar collapses into a top sheet/drawer. No horizontal
  scrolling; everything legible and tappable at phone width.

## Chapter list (sidebar front door)

- Chapitres **grouped by domain** (Analyse / Algèbre / Géométrie / Probabilités…),
  nested under each group.
- **Single-select**; the chosen chapitre is clearly highlighted (amber).

## Result row anatomy

Comfortable rows (not a compact table) — roomy, easy to tap. Each row:

- **Primary line:** exercise label ("Exercice 2" / "Problème 1"), bold.
- **Secondary line:** `🇫🇷 Mines · 2019` — flag + exam brand + year, muted.
- **Chapter chips:** small pills of the exercise's chapitre tags; the **primary**
  chapitre subtly emphasized.
- **Action:** an "Ouvrir" button (opens the paper PDF at the page — ticket 04).

## Supporting states (ticket 05)

- Live **match count** ("12 exercices") reads naturally in context.
- Clear French **"aucun résultat"** empty state, never a blank list.
- Easy clear/reset back to the chapitre-only view.
