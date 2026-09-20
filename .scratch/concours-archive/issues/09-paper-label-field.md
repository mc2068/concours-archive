# 09: Distinguish papers of the same brand/year (paper label)

**What to build:** A way to tell apart two papers that share exam brand, year, and country — most immediately **Mines-Ponts Maths 1 2026** and **Mines-Ponts Maths 2 2026**, which both render as "🇫🇷 Mines-Ponts · 2026" in a result row's meta line because the paper's specific épreuve (Maths 1 / Maths 2) isn't shown. Add a paper-level label/title and surface it so rows are unambiguous.

**Blocked by:** None (small enhancement on the existing schema; independent of content batches).

**Status:** ready-for-agent

## Context

- Surfaced in ticket 08: the `ConcoursPaper` record is `{ id, examBrand, year, country, subject, pdfPath }` and the result-row meta shows `${flag} ${examBrand} · ${year}` (`src/pages/index.astro`), so `subject` ("Maths 1" / "Maths 2") is stored but never displayed.
- Any two épreuves from the same brand/year/country (Centrale Maths 1 & 2, Mines-Ponts Maths 1 & 2, …) are therefore visually identical in the list.
- The filter engine (`filterExercises`) doesn't need paper identity, so this is a **display/data-model** change, not a filter change.

## Acceptance

- [ ] The paper model carries a human label for its épreuve (e.g. a `label`/`title` field, or promote the existing `subject` — decide and record which). Backfill it for the ticket-08 papers.
- [ ] The result-row meta distinguishes same-brand/year papers (e.g. "🇫🇷 Mines-Ponts Maths 1 · 2026" vs "… Maths 2 · 2026"), staying legible on mobile.
- [ ] The `Chapitre`/`ConcoursPaper` types and `CONTEXT.md` glossary are updated to match the chosen field.
- [ ] No regression: existing exercise rows still render, and the two Mines-Ponts 2026 papers are now told apart in the UI.

## Notes

- Keep it minimal — this is a labelling fix, not a redesign of the row. Prefer reusing/renaming `subject` over adding a redundant field if that reads cleanly.
