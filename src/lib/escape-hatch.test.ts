import { describe, expect, it } from 'vitest';
import { escapeHatch, type EscapeHatch } from './escape-hatch';
import { filterExercises } from './filter';
import type { Archive, Country, Selection } from './types';

// Small in-memory fixture. `vide` is a chapitre with no exercises at all — the
// case that used to dead-end twice.
const archive: Archive = {
  chapitres: [
    { id: 'series', name: 'Séries numériques', order: 1, domain: 'Analyse' },
    { id: 'reduc', name: 'Réduction', order: 2, domain: 'Algèbre' },
    { id: 'vide', name: 'Limites, continuité', order: 3, domain: 'Analyse' },
  ],
  papers: [
    { id: 'mines', examBrand: 'Mines', year: 2021, country: 'FR', subject: 'Maths', pdfPath: '/a.pdf' },
    { id: 'cnc', examBrand: 'CNC', year: 2019, country: 'MA', subject: 'Maths', pdfPath: '/b.pdf' },
  ],
  exercises: [
    { id: 'e1', paperId: 'cnc', label: 'Problème 1', pageStart: 1, pageEnd: 4, chapterIds: ['series'], primaryChapterId: 'series' },
    { id: 'e2', paperId: 'mines', label: 'Exercice 2', pageStart: 5, pageEnd: 6, chapterIds: ['reduc'], primaryChapterId: 'reduc' },
  ],
};

const CLEAR: EscapeHatch = { label: 'Réinitialiser les filtres', kind: 'clear-refinements' };
const SHOW_ALL: EscapeHatch = { label: 'Voir tous les exercices', kind: 'show-all' };

/** What the page does on click, per the kind's documented contract. */
function widen(criteria: Selection, hatch: EscapeHatch): Selection {
  return hatch.kind === 'clear-refinements' ? { chapterId: criteria.chapterId } : {};
}

describe('escapeHatch', () => {
  it('clears the refinements and keeps the chapitre when the chapitre has exercises', () => {
    // series only has e1 (MA) — France narrows it to nothing.
    const criteria = { chapterId: 'series', country: 'FR' as const };
    expect(filterExercises(archive, criteria)).toEqual([]);
    expect(escapeHatch(archive, criteria)).toEqual(CLEAR);
  });

  it('shows everything in one step when the chapitre has no exercises, even with refinements active', () => {
    // Clearing the refinements here would land on a second empty page.
    expect(escapeHatch(archive, { chapterId: 'vide', country: 'FR' })).toEqual(SHOW_ALL);
    expect(escapeHatch(archive, { chapterId: 'vide', examBrand: 'Mines', year: 2021 })).toEqual(SHOW_ALL);
  });

  it('shows everything when the chapitre has no exercises and nothing else is active', () => {
    expect(escapeHatch(archive, { chapterId: 'vide' })).toEqual(SHOW_ALL);
  });

  it('clears the refinements when no chapitre is selected', () => {
    // No FR paper from 2019 — the refinements alone narrow to nothing.
    expect(escapeHatch(archive, { country: 'FR', year: 2019 })).toEqual(CLEAR);
  });

  it('treats an unknown chapitre id like an empty chapitre', () => {
    expect(escapeHatch(archive, { chapterId: 'bogus', country: 'FR' })).toEqual(SHOW_ALL);
  });

  it('offers no way out of an empty archive', () => {
    const emptyArchive: Archive = { chapitres: archive.chapitres, papers: archive.papers, exercises: [] };
    expect(escapeHatch(emptyArchive, {})).toBeNull();
    expect(escapeHatch(emptyArchive, { chapterId: 'series', country: 'FR' })).toBeNull();
  });

  it('lands on results in one click from every combination that matches nothing', () => {
    const chapterIds = [undefined, ...archive.chapitres.map((c) => c.id)];
    const countries: (Country | undefined)[] = [undefined, 'FR', 'TN', 'MA'];
    const brands = [undefined, 'Mines', 'CNC'];
    const years = [undefined, 2019, 2021];

    let emptyCombos = 0;
    for (const chapterId of chapterIds)
      for (const country of countries)
        for (const examBrand of brands)
          for (const year of years) {
            const criteria: Selection = { chapterId, country, examBrand, year };
            if (filterExercises(archive, criteria).length > 0) continue;
            emptyCombos++;
            const hatch = escapeHatch(archive, criteria);
            expect(hatch, JSON.stringify(criteria)).not.toBeNull();
            expect(filterExercises(archive, widen(criteria, hatch!)).length, JSON.stringify(criteria)).toBeGreaterThan(0);
          }
    expect(emptyCombos).toBeGreaterThan(0); // the sweep actually exercised something
  });
});
