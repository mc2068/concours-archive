# 05: Empty-state and mobile-responsive polish

**What to build:** The rough edges that make the archive feel finished: a clear "no results" state when a filter combination matches nothing, the match count presented in context, and a layout that works on a phone so students can revise anywhere.

**Blocked by:** 03.

**Status:** done (commit 433284f)

- [x] A no-match combination shows a clear "Aucun résultat" state with a hint and a reset (offered when refinements narrowed it), never a blank list (`emptyState()` in `src/pages/index.astro`; `.empty-state__*` in `global.css`). Verified live.
- [x] The match count reads naturally — "3 exercices" / "0 exercices" / "1 exercice" (`exerciseCount`, now locked by `src/lib/format.test.ts`).
- [x] At phone width the sidebar (chapitre list + filters) collapses into a sheet behind a "Chapitres & filtres" toggle, so results lead; picking a chapitre closes it. Full-width selects, all legible/tappable (verified at 375px).
- [x] No horizontal scrolling or overlap at 375px (`scrollWidth === innerWidth`; result rows keep the "Ouvrir" action beside wrapped content). Verified.
