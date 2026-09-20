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
- [x] Brand art shipped: `scripts/build-brand-assets.mjs` unmixes the cream
      ground out of the `design/` source PNGs to alpha, trims and downscales —
      2.5 MB of source art becomes ~8 KB in `public/` (logo, favicon, empty
      state), and the mark sits on the charcoal masthead with no cream block.
- [x] Verified in the browser at desktop and 375px: selection, empty state,
      focus rings, mobile sheet, no console errors, no horizontal scroll. Below
      640px the masthead counts are dropped so two results clear the fold.
- [x] No regression — `astro check` clean, 34 tests pass. Nothing outside
      `src/pages/index.astro`, `src/styles/global.css`, `public/` and `design/`
      was touched.

## Notes

- `CONTEXT.md` is unchanged on purpose: this ticket introduced no domain term.
  The glossary is not where visual decisions live.
- No ADR: the decision is reversible in one file and already carries its
  reasoning in design.md, which is where the next reader will look.
