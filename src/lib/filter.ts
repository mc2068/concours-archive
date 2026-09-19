import type { Dataset, Exercise, FilterCriteria } from './types';

/** True when `year` falls inside the criteria's single year or inclusive range. */
function yearMatches(year: number, criterion: NonNullable<FilterCriteria['year']>): boolean {
  if (typeof criterion === 'number') return year === criterion;
  if (criterion.from != null && year < criterion.from) return false;
  if (criterion.to != null && year > criterion.to) return false;
  return true;
}

/**
 * The filter seam. Given the whole {@link Dataset} and the current
 * {@link FilterCriteria}, return the matching exercises in a deterministic
 * order (year descending, then exam brand, then paper, then label — so a
 * paper's own exercises stay contiguous).
 *
 * Rules:
 * - A chapter matches when it is anywhere in an exercise's `chapterIds`
 *   (the "touches at all" rule, not "primary only").
 * - Country, exam brand, and year are refinements read from the exercise's
 *   parent paper; every active axis is combined with AND.
 * - Absent criteria do not constrain.
 * - Pure: never mutates the dataset.
 */
export function filterExercises(
  dataset: Dataset,
  criteria: FilterCriteria = {},
): Exercise[] {
  const { chapterId, country, examBrand, year } = criteria;
  const paperById = new Map(dataset.papers.map((p) => [p.id, p]));

  const matches = dataset.exercises.filter((ex) => {
    if (chapterId && !ex.chapterIds.includes(chapterId)) return false;

    // Refinement axes live on the parent paper; an exercise whose paper is
    // missing cannot satisfy any active refinement.
    const needsPaper = country != null || examBrand != null || year != null;
    if (needsPaper) {
      const paper = paperById.get(ex.paperId);
      if (!paper) return false;
      if (country != null && paper.country !== country) return false;
      if (examBrand != null && paper.examBrand !== examBrand) return false;
      if (year != null && !yearMatches(paper.year, year)) return false;
    }
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

    // Keep a single paper's exercises together (spec: "then paper").
    if (a.paperId !== b.paperId) return a.paperId.localeCompare(b.paperId, 'fr');

    return a.label.localeCompare(b.label, 'fr', { numeric: true });
  });
}
