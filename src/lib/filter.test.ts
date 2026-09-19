import { describe, expect, it } from 'vitest';
import { filterExercises } from './filter';
import type { Dataset, Exercise } from './types';

// Small in-memory fixture — no real data, no DOM, no PDFs.
// Papers span three years so ordering (year desc) is observable.
const dataset: Dataset = {
  chapitres: [
    { id: 'series', name: 'Séries numériques', order: 1, domain: 'Analyse' },
    { id: 'integ', name: 'Intégration', order: 2, domain: 'Analyse' },
    { id: 'reduc', name: 'Réduction', order: 3, domain: 'Algèbre' },
  ],
  papers: [
    { id: 'p2021', examBrand: 'Mines', year: 2021, country: 'FR', subject: 'Maths', pdfPath: '/a.pdf' },
    { id: 'p2019', examBrand: 'CNC', year: 2019, country: 'MA', subject: 'Maths', pdfPath: '/b.pdf' },
    { id: 'p2020', examBrand: 'Concours tunisien', year: 2020, country: 'TN', subject: 'Maths', pdfPath: '/c.pdf' },
  ],
  exercises: [
    // multi-chapter: series + integ
    { id: 'e1', paperId: 'p2019', label: 'Problème 1', pageStart: 1, pageEnd: 4, chapterIds: ['series', 'integ'], primaryChapterId: 'series' },
    { id: 'e2', paperId: 'p2021', label: 'Exercice 2', pageStart: 5, pageEnd: 6, chapterIds: ['reduc'], primaryChapterId: 'reduc' },
    { id: 'e3', paperId: 'p2020', label: 'Exercice 1', pageStart: 1, pageEnd: 3, chapterIds: ['series'], primaryChapterId: 'series' },
  ],
};

const ids = (xs: Exercise[]) => xs.map((x) => x.id);

describe('filterExercises', () => {
  it('returns every exercise when no criteria are given', () => {
    expect(ids(filterExercises(dataset))).toEqual(['e2', 'e3', 'e1']); // year desc: 2021, 2020, 2019
  });

  it('returns every exercise for empty criteria object', () => {
    expect(ids(filterExercises(dataset, {}))).toEqual(['e2', 'e3', 'e1']);
  });

  it('matches exercises whose chapterIds include the selected chapter', () => {
    expect(ids(filterExercises(dataset, { chapterId: 'reduc' }))).toEqual(['e2']);
  });

  it('includes a multi-chapter exercise under each of its chapters', () => {
    // e1 is tagged [series, integ] — it must appear under BOTH.
    expect(ids(filterExercises(dataset, { chapterId: 'series' }))).toContain('e1');
    expect(ids(filterExercises(dataset, { chapterId: 'integ' }))).toEqual(['e1']);
    expect(ids(filterExercises(dataset, { chapterId: 'series' }))).toEqual(['e3', 'e1']); // 2020 then 2019
  });

  it('orders results by year descending', () => {
    // series matches e3 (2020) and e1 (2019) → newest first.
    expect(ids(filterExercises(dataset, { chapterId: 'series' }))).toEqual(['e3', 'e1']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterExercises(dataset, { chapterId: 'nonexistent' })).toEqual([]);
  });

  it('keeps a single paper\'s exercises contiguous within the same year', () => {
    // Two same-year papers; exercises interleaved in the source. A paper's own
    // exercises must not be split apart by another paper's.
    const sameYear: Dataset = {
      chapitres: [{ id: 'c', name: 'C', order: 1, domain: 'D' }],
      papers: [
        { id: 'centrale', examBrand: 'Centrale', year: 2022, country: 'FR', subject: 'Maths', pdfPath: '/x.pdf' },
        { id: 'mines', examBrand: 'Mines', year: 2022, country: 'FR', subject: 'Maths', pdfPath: '/y.pdf' },
      ],
      exercises: [
        { id: 'm1', paperId: 'mines', label: 'Exercice 1', pageStart: 1, pageEnd: 2, chapterIds: ['c'], primaryChapterId: 'c' },
        { id: 'c1', paperId: 'centrale', label: 'Exercice 1', pageStart: 1, pageEnd: 2, chapterIds: ['c'], primaryChapterId: 'c' },
        { id: 'c2', paperId: 'centrale', label: 'Exercice 2', pageStart: 3, pageEnd: 4, chapterIds: ['c'], primaryChapterId: 'c' },
      ],
    };
    // Centrale sorts before Mines (brand), and its two exercises stay together.
    expect(ids(filterExercises(sameYear))).toEqual(['c1', 'c2', 'm1']);
  });

  it('does not mutate the input dataset', () => {
    const before = ids(dataset.exercises);
    filterExercises(dataset, { chapterId: 'series' });
    expect(ids(dataset.exercises)).toEqual(before);
  });
});
