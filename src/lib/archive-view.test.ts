import { describe, expect, it } from 'vitest';
import { createArchiveView, type ArchiveViewModel } from './archive-view';
import type { Archive } from './types';

// Small in-memory fixture — no real data, no DOM. `vide` is a chapitre with no
// exercises at all. Papers span three years so ordering is observable.
const archive: Archive = {
  chapitres: [
    { id: 'series', name: 'Séries numériques', order: 1, domain: 'Analyse' },
    { id: 'reduc', name: 'Réduction', order: 2, domain: 'Algèbre' },
    { id: 'vide', name: 'Limites, continuité', order: 3, domain: 'Analyse' },
  ],
  papers: [
    { id: 'mines', examBrand: 'Mines-Ponts', label: 'Maths 1', year: 2021, country: 'FR', subject: 'Maths', pdfPath: '/papers/mines.pdf' },
    { id: 'tn', examBrand: 'Concours tunisien', year: 2020, country: 'TN', subject: 'Maths', pdfPath: '/papers/tn.pdf' },
    { id: 'cnc', examBrand: 'CNC', year: 2019, country: 'MA', subject: 'Maths', pdfPath: '/papers/cnc.pdf' },
  ],
  exercises: [
    { id: 'e1', paperId: 'cnc', label: 'Problème 1', pageStart: 1, pageEnd: 4, chapterIds: ['series', 'reduc'], primaryChapterId: 'series' },
    { id: 'e2', paperId: 'mines', label: 'Exercice 2', pageStart: 5, pageEnd: 6, chapterIds: ['reduc'], primaryChapterId: 'reduc' },
    { id: 'e3', paperId: 'tn', label: 'Exercice 1', pageStart: 3, pageEnd: 3, chapterIds: ['series'], primaryChapterId: 'series' },
  ],
};

const rowIds = (v: ArchiveViewModel) => (v.results.kind === 'rows' ? v.results.rows.map((r) => r.id) : []);
const escapeOf = (v: ArchiveViewModel) => (v.results.kind === 'empty' ? v.results.escape : 'not empty');

describe('createArchiveView', () => {
  describe('the controls', () => {
    it('groups the chapitres by domain, in program order', () => {
      expect(createArchiveView(archive).controls().chapitreGroups).toEqual([
        { domain: 'Analyse', chapitres: [{ id: 'series', name: 'Séries numériques' }, { id: 'vide', name: 'Limites, continuité' }] },
        { domain: 'Algèbre', chapitres: [{ id: 'reduc', name: 'Réduction' }] },
      ]);
    });

    it('offers only the refinement values some paper has, flagged, sorted and newest first', () => {
      const noTunisia: Archive = { ...archive, papers: archive.papers.filter((p) => p.country !== 'TN') };
      expect(createArchiveView(noTunisia).controls().refinements).toEqual({
        country: [
          { value: 'FR', label: '🇫🇷 France' },
          { value: 'MA', label: '🇲🇦 Maroc' },
        ],
        examBrand: [
          { value: 'CNC', label: 'CNC' },
          { value: 'Mines-Ponts', label: 'Mines-Ponts' },
        ],
        year: [
          { value: '2021', label: '2021' },
          { value: '2019', label: '2019' },
        ],
      });
    });
  });

  describe('the selection', () => {
    it('starts on the whole archive, newest first, with nothing pressed or refined', () => {
      const v = createArchiveView(archive).view();
      expect(v.heading).toBe('Tous les exercices');
      expect(v.count).toBe('3 exercices');
      expect(v.pressedChapitreId).toBeNull();
      expect(v.refinements).toEqual({ country: '', examBrand: '', year: '' });
      expect(rowIds(v)).toEqual(['e2', 'e3', 'e1']);
    });

    it('narrows to a chapitre, heads the list with its name, and presses it', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('reduc');
      const v = av.view();
      expect(v.heading).toBe('Réduction');
      expect(v.count).toBe('2 exercices');
      expect(v.pressedChapitreId).toBe('reduc');
      expect(rowIds(v)).toEqual(['e2', 'e1']);
    });

    it('returns to all chapitres when selecting undefined', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('reduc');
      av.selectChapitre(undefined);
      expect(av.view().pressedChapitreId).toBeNull();
      expect(av.view().heading).toBe('Tous les exercices');
      expect(rowIds(av.view())).toEqual(['e2', 'e3', 'e1']);
    });

    it('heads an unresolvable chapitre id with a generic title and matches nothing', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('bogus');
      const v = av.view();
      expect(v.heading).toBe('Exercices');
      expect(v.count).toBe('0 exercices');
      expect(v.results.kind).toBe('empty');
    });

    it('takes refinements as raw select strings and echoes them back', () => {
      const av = createArchiveView(archive);
      av.refine({ country: 'FR', year: '2021' });
      expect(av.view().refinements).toEqual({ country: 'FR', examBrand: '', year: '2021' });
      expect(rowIds(av.view())).toEqual(['e2']);
    });

    it('treats a value no option offers as no constraint', () => {
      const av = createArchiveView(archive);
      av.refine({ country: 'XX', examBrand: 'Polytechnique', year: '1999' });
      expect(av.view().refinements).toEqual({ country: '', examBrand: '', year: '' });
      expect(av.view().count).toBe('3 exercices');
    });

    it("treats '' as no constraint — never as year 0", () => {
      const av = createArchiveView(archive);
      av.refine({ country: '', examBrand: '', year: '' });
      expect(av.view().count).toBe('3 exercices');
      expect(av.view().refinements).toEqual({ country: '', examBrand: '', year: '' });
    });

    it('merges each refine over the refinements already active', () => {
      const av = createArchiveView(archive);
      av.refine({ examBrand: 'CNC' });
      av.refine({ year: '2019' });
      expect(av.view().refinements).toEqual({ country: '', examBrand: 'CNC', year: '2019' });
      expect(rowIds(av.view())).toEqual(['e1']);
      av.refine({ examBrand: '' });
      expect(av.view().refinements).toEqual({ country: '', examBrand: '', year: '2019' });
    });

    it('stacks refinements on the chapitre with AND, and keeps them across a chapitre change', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('series');
      av.refine({ country: 'TN' });
      expect(rowIds(av.view())).toEqual(['e3']);
      av.selectChapitre('reduc');
      expect(av.view().refinements.country).toBe('TN');
      expect(av.view().results.kind).toBe('empty');
    });

    it('clears the refinements without losing the chapitre', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('series');
      av.refine({ country: 'FR', examBrand: 'Mines-Ponts', year: '2021' });
      av.clearRefinements();
      const v = av.view();
      expect(v.refinements).toEqual({ country: '', examBrand: '', year: '' });
      expect(v.pressedChapitreId).toBe('series');
      expect(v.heading).toBe('Séries numériques');
      expect(rowIds(v)).toEqual(['e3', 'e1']);
    });

    it('shows everything: drops the chapitre and the refinements together', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('vide');
      av.refine({ country: 'FR' });
      av.showAll();
      const v = av.view();
      expect(v.pressedChapitreId).toBeNull();
      expect(v.refinements).toEqual({ country: '', examBrand: '', year: '' });
      expect(v.count).toBe('3 exercices');
    });
  });

  describe('result rows', () => {
    it('resolves every row to its title, paper facts, chips and a page-anchored PDF link', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('reduc');
      const v = av.view();
      if (v.results.kind !== 'rows') throw new Error('expected rows');
      expect(v.results.rows).toEqual([
        {
          id: 'e2',
          title: 'Exercice 2',
          meta: { flag: '🇫🇷', epreuve: 'Mines-Ponts Maths 1', year: '2021' },
          chips: [{ label: 'Réduction', primary: true }],
          href: '/papers/mines.pdf#page=5',
        },
        {
          id: 'e1',
          title: 'Problème 1',
          meta: { flag: '🇲🇦', epreuve: 'CNC', year: '2019' },
          chips: [
            { label: 'Séries numériques', primary: true },
            { label: 'Réduction', primary: false },
          ],
          href: '/papers/cnc.pdf#page=1',
        },
      ]);
    });

    it('offers no link when the paper has no usable PDF path', () => {
      const noPdf: Archive = { ...archive, papers: archive.papers.map((p) => (p.id === 'tn' ? { ...p, pdfPath: '  ' } : p)) };
      const av = createArchiveView(noPdf);
      av.refine({ country: 'TN' });
      const v = av.view();
      if (v.results.kind !== 'rows') throw new Error('expected rows');
      expect(v.results.rows[0].href).toBeNull();
      expect(v.results.rows[0].meta).not.toBeNull();
    });

    it('shows an exercise whose paper is missing without paper facts, and never under a refinement', () => {
      const orphaned: Archive = {
        ...archive,
        exercises: [...archive.exercises, { id: 'lost', paperId: 'gone', label: 'Exercice 9', pageStart: 1, pageEnd: 1, chapterIds: ['vide'], primaryChapterId: 'vide' }],
      };
      const av = createArchiveView(orphaned);
      av.selectChapitre('vide');
      const v = av.view();
      if (v.results.kind !== 'rows') throw new Error('expected rows');
      expect(v.results.rows).toEqual([
        { id: 'lost', title: 'Exercice 9', meta: null, chips: [{ label: 'Limites, continuité', primary: true }], href: null },
      ]);
      av.refine({ year: '2021' });
      expect(av.view().results.kind).toBe('empty');
    });
  });

  describe('the empty state', () => {
    it('offers to clear the refinements when the chapitre alone has exercises', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('series');
      av.refine({ country: 'FR' });
      expect(escapeOf(av.view())).toEqual({ label: 'Réinitialiser les filtres', kind: 'clear-refinements' });
      av.clearRefinements();
      expect(av.view().results.kind).toBe('rows');
    });

    it('offers to show everything when the chapitre has no exercises, refinements or not', () => {
      const av = createArchiveView(archive);
      av.selectChapitre('vide');
      expect(escapeOf(av.view())).toEqual({ label: 'Voir tous les exercices', kind: 'show-all' });
      av.refine({ country: 'FR' });
      expect(escapeOf(av.view())).toEqual({ label: 'Voir tous les exercices', kind: 'show-all' });
      av.showAll();
      expect(av.view().results.kind).toBe('rows');
    });

    it('offers no way out of an empty archive', () => {
      const av = createArchiveView({ ...archive, exercises: [] });
      expect(av.view().count).toBe('0 exercices');
      expect(escapeOf(av.view())).toBeNull();
    });
  });

  describe('the mobile sheet', () => {
    it('starts closed and toggles open and shut', () => {
      const av = createArchiveView(archive);
      expect(av.view().sheetOpen).toBe(false);
      av.toggleSheet();
      expect(av.view().sheetOpen).toBe(true);
      av.toggleSheet();
      expect(av.view().sheetOpen).toBe(false);
    });

    it('closes when a chapitre is picked on mobile, so the student lands on the matches', () => {
      const av = createArchiveView(archive);
      av.setViewport('mobile');
      av.toggleSheet();
      av.selectChapitre('series');
      expect(av.view().sheetOpen).toBe(false);
    });

    it('stays open when a chapitre is picked on desktop', () => {
      const av = createArchiveView(archive);
      av.setViewport('desktop');
      av.toggleSheet();
      av.selectChapitre('series');
      expect(av.view().sheetOpen).toBe(true);
    });

    it('stays open on mobile while refinements change or clear', () => {
      const av = createArchiveView(archive);
      av.setViewport('mobile');
      av.toggleSheet();
      av.refine({ country: 'FR' });
      av.clearRefinements();
      expect(av.view().sheetOpen).toBe(true);
    });

    it('closes on mobile when showing everything, like picking a chapitre', () => {
      const av = createArchiveView(archive);
      av.setViewport('mobile');
      av.toggleSheet();
      av.showAll();
      expect(av.view().sheetOpen).toBe(false);
    });

    it('never opens or closes the sheet just because the viewport changed', () => {
      const av = createArchiveView(archive);
      av.toggleSheet();
      av.setViewport('mobile');
      expect(av.view().sheetOpen).toBe(true);
      av.setViewport('desktop');
      av.toggleSheet();
      av.setViewport('mobile');
      expect(av.view().sheetOpen).toBe(false);
    });
  });
});
