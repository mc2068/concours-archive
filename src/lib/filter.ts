import type { Archive, ConcoursPaper, Exercise, Selection } from './types';

/**
 * An exercise joined to its parent paper — the one place the exercise→paper
 * join happens (ticket 15). Everything downstream reads `paper` rather than
 * looking it up again.
 *
 * `paper` is `null` for an exercise whose `paperId` matches no paper. That is
 * unshippable (the `orphan-exercise` rule), so this is defence, not a feature,
 * and the whole policy follows from the `null`: such an exercise has no paper
 * facts, so it shows no meta and no link, and it satisfies no active
 * refinement, because every refinement is a fact about the paper.
 */
export interface PlacedExercise {
  exercise: Exercise;
  paper: ConcoursPaper | null;
}

/** Join every exercise of the {@link Archive} to its parent paper, once. */
export function placeExercises(archive: Archive): PlacedExercise[] {
  const paperById = new Map(archive.papers.map((p) => [p.id, p]));
  return archive.exercises.map((exercise) => ({ exercise, paper: paperById.get(exercise.paperId) ?? null }));
}

/**
 * The filter seam. Given the placed exercises and the current
 * {@link Selection}, return the matching ones in a deterministic order (year
 * descending, then exam brand, then paper, then label — so a paper's own
 * exercises stay contiguous).
 *
 * Rules:
 * - A chapter matches when it is anywhere in an exercise's `chapterIds`
 *   (the "touches at all" rule, not "primary only").
 * - Country, exam brand, and year are refinements read from the exercise's
 *   parent paper; every active axis is combined with AND.
 * - Absent fields do not constrain.
 * - Pure: never mutates its input.
 */
export function filterExercises(placed: PlacedExercise[], selection: Selection = {}): PlacedExercise[] {
  const { chapterId, country, examBrand, year } = selection;

  const matches = placed.filter(({ exercise, paper }) => {
    if (chapterId && !exercise.chapterIds.includes(chapterId)) return false;
    if (country != null && paper?.country !== country) return false;
    if (examBrand != null && paper?.examBrand !== examBrand) return false;
    if (year != null && paper?.year !== year) return false;
    return true;
  });

  return matches.sort((a, b) => {
    const yearA = a.paper?.year ?? 0;
    const yearB = b.paper?.year ?? 0;
    if (yearA !== yearB) return yearB - yearA; // newest first

    const brandA = a.paper?.examBrand ?? '';
    const brandB = b.paper?.examBrand ?? '';
    if (brandA !== brandB) return brandA.localeCompare(brandB, 'fr');

    // Keep a single paper's exercises together (spec: "then paper").
    const { exercise: ea } = a;
    const { exercise: eb } = b;
    if (ea.paperId !== eb.paperId) return ea.paperId.localeCompare(eb.paperId, 'fr');

    return ea.label.localeCompare(eb.label, 'fr', { numeric: true });
  });
}
