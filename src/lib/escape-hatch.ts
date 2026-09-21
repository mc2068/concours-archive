import { filterExercises, type PlacedExercise } from './filter';
import type { Selection } from './types';

/**
 * The one button an empty result offers. `label` is its French text; `kind`
 * is the widening the page must perform when it is clicked:
 *
 * - `'clear-refinements'` — drop the refinements, keep the chapitre.
 * - `'show-all'` — drop the chapitre *and* the refinements.
 */
export interface EscapeHatch {
  label: string;
  kind: 'clear-refinements' | 'show-all';
}

/**
 * Pick the escape hatch for a selection that matches nothing: the smallest widening
 * that lands on results, so no button ever leads to a second empty page
 * (ticket 13).
 *
 * - Refinements active and dropping them would leave results (the chapitre has
 *   exercises, or no chapitre is selected) → clear the refinements and keep
 *   the chapitre (CONTEXT.md, "Refinement").
 * - Otherwise — the chapitre has no exercises at all, or is unknown — show
 *   everything, whatever refinements are active.
 * - `null` only when the archive itself is empty: there is nowhere to go.
 */
export function escapeHatch(placed: PlacedExercise[], selection: Selection): EscapeHatch | null {
  const { chapterId, country, examBrand, year } = selection;
  const refined = country != null || examBrand != null || year != null;

  if (refined && filterExercises(placed, { chapterId }).length > 0) {
    return { label: 'Réinitialiser les filtres', kind: 'clear-refinements' };
  }
  if (placed.length > 0) {
    return { label: 'Voir tous les exercices', kind: 'show-all' };
  }
  return null;
}
