# 09: Distinguish papers of the same brand/year (paper label)

**What to build:** A way to tell apart two papers that share exam brand, year, and country — most immediately **Mines-Ponts Maths 1 2026** and **Mines-Ponts Maths 2 2026**, which both render as "🇫🇷 Mines-Ponts · 2026" in a result row's meta line because the paper's specific épreuve (Maths 1 / Maths 2) isn't shown. Add a paper-level label/title and surface it so rows are unambiguous.

**Blocked by:** None (small enhancement on the existing schema; independent of content batches).

**Status:** done (commit pending)

## Context

- Surfaced in ticket 08: the `ConcoursPaper` record is `{ id, examBrand, year, country, subject, pdfPath }` and the result-row meta shows `${flag} ${examBrand} · ${year}` (`src/pages/index.astro`), so `subject` ("Maths 1" / "Maths 2") is stored but never displayed.
- Any two épreuves from the same brand/year/country (Centrale Maths 1 & 2, Mines-Ponts Maths 1 & 2, …) are therefore visually identical in the list.
- The filter engine (`filterExercises`) doesn't need paper identity, so this is a **display/data-model** change, not a filter change.

## Acceptance

- [x] Added an optional `label` field to `ConcoursPaper` (the épreuve, e.g. "Maths 1"). Chose a dedicated field over reusing `subject`, because `subject` is the discipline (Maths → Physique fast-follow) and overloading it would break that. Reverted `subject` back to "Maths" and backfilled `label` for all 7 papers.
- [x] The result-row meta shows `${flag} ${brand} ${label} · ${year}` via the tested pure `paperEpreuve()` seam (`src/lib/format.ts`) — verified: "🇫🇷 Mines-Ponts Maths 1 · 2026" vs "… Maths 2 · 2026".
- [x] `ConcoursPaper` type + `CONTEXT.md` glossary updated to describe `subject` (discipline) vs `label` (épreuve).
- [x] No regression — all 21 rows render with distinct meta; `paperEpreuve` falls back to the brand alone when a paper has no label (unit-tested).

## Notes

- Keep it minimal — this is a labelling fix, not a redesign of the row. Prefer reusing/renaming `subject` over adding a redundant field if that reads cleanly.
