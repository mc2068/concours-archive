# 10: Adopt the "archive" design system

**What to build:** Replace the "ink & paper" design system (warm off-white, one
typeface, amber accent, no shadows) with the Concours Archive design system
board at `design/design-system.jfif` — charcoal / brown / beige / ivory / cream,
Playfair Display over Inter, content on elevated white sheets — and give the page
the structural presence it was missing: a real masthead, framed panels, a footer.

**Blocked by:** None (presentation only; no change to the dataset, the filter
engine, or any tested seam).

**Status:** done (commit pending)

## Context

- The board is drawn for a *different product*: an archive of Tunisian
  **university** concours with accounts, favourites, downloads and a document
  viewer. Only its visual layer is in scope — adopting its IA or its nouns
  ("Université", "Matière", "Document") would contradict `CONTEXT.md`.
- It is a rendered image, not a spec: five colours and a six-step type ramp, and
  nothing on spacing, radii, states, focus or dividers.
- Restyling alone would not have answered the complaint. The page was one bare
  column on a flat ground; the board reads as professional largely because it is
  *composed* — banded masthead, framed panels, a closing footer.

## Acceptance

- [x] Tokens in `src/styles/global.css` rebuilt on the board's five colours.
      Three values the board does not print are derived and marked DERIVED:
      `ink-muted` `#6e6355` (5.4:1 on cream), `border` `#e0d8ca` (decorative
      hairlines), `border-strong` `#8a7b66` (3.8:1 — a control's own boundary).
- [x] The board's beige control borders (1.9:1 on white) are **not** used as a
      control's only boundary; beige is kept for decorative outlines. Recorded
      in design.md under Contrast note.
- [x] Two families: Playfair Display for the wordmark, panel titles and row
      labels; Inter for meta, controls, chips and buttons.
- [x] Structure added — full-bleed charcoal masthead (mark, wordmark, tagline,
      dataset counts), sidebar and results as `.panel` sheets, site footer.
      Counts are read off the dataset, never typed in.
- [x] Three reversals of "ink & paper" (one typeface → two; no shadows → one
      card shadow; amber accent → neutral fills) recorded in design.md with the
      reasoning, so they are not re-argued. Amber survives in the brand art only.
- [x] Brand art shipped: `scripts/build-brand-assets.mjs` keys the cream ground
      out of the `design/` source PNGs to alpha, trims and downscales — 1.6 MB of
      source art becomes ~21 KB in `public/` (logo, favicon, empty state), each
      at ~3x its CSS box, and the mark sits on the charcoal masthead with no
      cream block. Neither mark is square, so the pages size them by width with
      `height: auto`; only the favicon is squared, by padding onto a transparent
      canvas rather than by stretching.
- [x] Verified in the browser at desktop and 375px: selection, empty state,
      focus rings, mobile sheet, no console errors, no horizontal scroll. Below
      640px the masthead counts are dropped so two results clear the fold.
- [x] No regression — `astro check` clean, 34 tests pass. Beyond
      `src/pages/index.astro`, `src/styles/global.css`, `public/` and `design/`,
      the change adds `scripts/build-brand-assets.mjs` and declares its `sharp`
      dependency in `package.json`; nothing else is touched.

## Notes

- `CONTEXT.md` is unchanged on purpose: this ticket introduced no domain term.
  The glossary is not where visual decisions live.
- The masthead's archive totals (exercices / épreuves) are the one addition no
  user story asks for — the spec's count story is "how many match my filters",
  which `panel__count` serves. They are kept deliberately, as the board's
  "statistiques" row reduced to what this archive actually has, and they are
  dropped below 640px.
- No ADR: the decision is reversible in one file and already carries its
  reasoning in design.md, which is where the next reader will look.

## Comments

**Review round (`/code-review` against `25b4755`), all findings fixed.**

Standards axis found 6 hard breaches and 7 judgement calls; Spec axis found 8.
Both were told the ticket and design.md were written by the commit under review,
so ticked boxes proved nothing. What changed:

- **Aspect ratio.** `logo.png` (128x114) was pinned into a 40x40 box and
  `empty-state.png` (96x103) into 72x72 — every brand image was stretched ~11%
  and ~7%. Now `height: auto` with the intrinsic size on the tag, and the
  favicon is padded square instead of squashed. The empty-state render also went
  from 96px to 192px so it is ~3x its box on a phone.
- **Spacing scale.** design.md claimed a derived scale that did not exist; ~14
  values sat off it. Real `--space-*` tokens now, in `:root` so they cannot
  redefine Tailwind's own `px-4` / `gap-6`.
- **`sharp` was undeclared** — it resolved only through Astro's *optional*
  dependency, so the documented "re-run the script" step would break under
  `npm ci --omit=optional`. Declared in `devDependencies`.
- **Asset size claims were wrong**: ~8 KB from 2.5 MB was really ~15 KB from
  1.6 MB. Corrected here and in design.md, and now ~21 KB after the empty-state
  bump.
- **Invalid `<dl>`**: `<dd>` preceded `<dt>`. Reordered; `column-reverse` keeps
  the number above its label.
- **Row hover removed.** It used a palette colour outside its documented role,
  and on hover a row's chips lost their ground. A row is not clickable anyway —
  only its button is — so the tint promised a click that isn't there.
- **Dead weight**: `design/favicon.ico` (838 KB) was shipped but consumed by
  nothing, since the favicon derives from `logo.png`. Deleted; recoverable at
  `25b4755:design/Favicon.ico`.
- **Duplication**: the caption style (3x), the focus ring (3x) and
  `.filter-reset` (a restatement of `.btn--secondary`) are now each one rule.
  `--color-ivory` was declared and unused; palette and roles are now two layers,
  with the roles pointing at the palette.
- **Script**: the `floor` option no caller varied is a constant; `logo.png` is
  keyed once and encoded twice instead of twice over; and an all-ground image
  now throws a sentence instead of an opaque `extract` error.
