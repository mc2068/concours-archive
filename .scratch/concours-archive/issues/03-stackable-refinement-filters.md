# 03: Stackable refinement filters — country, exam brand, year

**What to build:** On top of the chapitre selection, optional filters the student can stack to narrow results — country (🇫🇷/🇹🇳/🇲🇦), exam brand, and year — combined with AND. A live count shows how many exercises match, and a control clears/resets the filters.

**Blocked by:** 02.

**Status:** ready-for-agent

- [ ] `filterExercises` accepts optional `country`, `examBrand`, and `year`/year-range in `criteria`, combined with the chapitre via AND; absent axes don't constrain.
- [ ] Tests cover: stacked axes AND together; an exercise excluded when any active axis doesn't match; each axis alone.
- [ ] The page exposes optional controls for country, exam brand, and year that refine the current chapitre results.
- [ ] A live match count reflects the active filters.
- [ ] A clear/reset control returns to the chapitre-only view.
