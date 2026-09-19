import type { Dataset, Exercise, FilterCriteria } from './types';

/**
 * The filter seam. Given the whole {@link Dataset} and the current
 * {@link FilterCriteria}, return the matching exercises in a deterministic
 * order (year descending, then exam brand, then label).
 *
 * Rules:
 * - A chapter matches when it is anywhere in an exercise's `chapterIds`
 *   (the "touches at all" rule, not "primary only").
 * - Absent criteria do not constrain.
 * - Pure: never mutates the dataset.
 */
export function filterExercises(
  dataset: Dataset,
  criteria: FilterCriteria = {},
): Exercise[] {
  const { chapterId } = criteria;
  const paperById = new Map(dataset.papers.map((p) => [p.id, p]));

  const matches = dataset.exercises.filter((ex) => {
    if (chapterId && !ex.chapterIds.includes(chapterId)) return false;
    return true;
  });

  return [...matches].sort((a, b) => {
    const pa = paperById.get(a.paperId);
    const pb = paperById.get(b.paperId);

    const yearA = pa?.year ?? 0;
    const yearB = pb?.year ?? 0;
    if (yearA !== yearB) return yearB - yearA; // newest first

    const brandA = pa?.examBrand ?? '';
    const brandB = pb?.examBrand ?? '';
    if (brandA !== brandB) return brandA.localeCompare(brandB, 'fr');

    return a.label.localeCompare(b.label, 'fr', { numeric: true });
  });
}
