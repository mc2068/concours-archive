# 03: Stackable refinement filters — country, exam brand, year

**What to build:** On top of the chapitre selection, optional filters the student can stack to narrow results — country (🇫🇷/🇹🇳/🇲🇦), exam brand, and year — combined with AND. A live count shows how many exercises match, and a control clears/resets the filters.

**Blocked by:** 02.

**Status:** done (commit pending)

- [x] `filterExercises` accepts optional `country`, `examBrand`, and `year`/year-range in `criteria`, combined with the chapitre via AND; absent axes don't constrain (`src/lib/types.ts` `FilterCriteria` + `YearRange`, `src/lib/filter.ts`).
- [x] Tests cover: stacked axes AND together; an exercise excluded when any active axis doesn't match; each axis alone; single year and inclusive/open-ended year range (`src/lib/filter.test.ts`, 16 tests).
- [x] The page exposes optional country / exam brand / year `<select>` controls that refine the current chapitre results; options derived from the dataset (`src/pages/index.astro`).
- [x] A live match count reflects the active filters (verified in preview: 4 → 1 → 0 → 3).
- [x] A clear/reset control returns to the chapitre-only view — clears refinements, keeps the chapitre.
