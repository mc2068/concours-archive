import { describe, expect, it } from 'vitest';
import { checkArchive, formatViolations, type PageCounts } from './archive-rules';
import type { Archive } from '../lib/types';

/*
  The rules are exercised the way every caller crosses them: hand an Archive and
  its page counts in, read the violations out. No filesystem, no PDFs, no real
  `archive.json` — each test breaks exactly one thing in a clean fixture, so a
  failure names the rule that broke rather than the file that happens to hold it.

  The real Archive is checked through the same interface in `archive.check.test.ts`.
*/

const PAGES: PageCounts = { 'mines-2019.pdf': 8 };

function clean(): Archive {
  return {
    chapitres: [
      { id: 'series', name: 'Séries numériques', order: 1, domain: 'Analyse' },
      { id: 'reduc', name: 'Réduction', order: 2, domain: 'Algèbre' },
    ],
    papers: [
      {
        id: 'mines-2019',
        examBrand: 'Mines-Ponts',
        year: 2019,
        country: 'FR',
        subject: 'Maths',
        label: 'Maths 1',
        pdfPath: '/papers/mines-2019.pdf',
      },
    ],
    exercises: [
      {
        id: 'mines-2019-i',
        paperId: 'mines-2019',
        label: 'Exercice I',
        pageStart: 1,
        pageEnd: 4,
        chapterIds: ['series', 'reduc'],
        primaryChapterId: 'series',
      },
    ],
  };
}

/** The rules a broken fixture trips, so a test asserts on rules, not counts. */
const rulesOf = (archive: Archive, pages: PageCounts = PAGES) =>
  checkArchive(archive, pages).map((v) => v.rule);

describe('checkArchive', () => {
  it('passes a clean archive', () => {
    expect(checkArchive(clean(), PAGES)).toEqual([]);
  });

  describe('identity', () => {
    it('catches a duplicate chapitre id', () => {
      const a = clean();
      a.chapitres.push({ ...a.chapitres[0]!, name: 'Copie', order: 3 });
      expect(rulesOf(a)).toContain('duplicate-chapitre-id');
    });

    it('catches a duplicate paper id', () => {
      const a = clean();
      a.papers.push({ ...a.papers[0]! });
      expect(rulesOf(a)).toContain('duplicate-paper-id');
    });

    it('catches a duplicate exercise id', () => {
      const a = clean();
      a.exercises.push({ ...a.exercises[0]! });
      expect(rulesOf(a)).toContain('duplicate-exercise-id');
    });
  });

  describe('chapitres', () => {
    it('catches a domain outside the program', () => {
      const a = clean();
      // A plausible typo: the accent dropped. Left unchecked it mints a fifth
      // sidebar group (CONTEXT.md, "Domain").
      a.chapitres[1]!.domain = 'Algebre' as Archive['chapitres'][number]['domain'];
      expect(rulesOf(a)).toContain('unknown-domain');
    });

    it('accepts a program area with no chapitre yet', () => {
      // Géométrie is in the program and has no chapitre in the archive today.
      expect(checkArchive(clean(), PAGES)).toEqual([]);
    });

    it('catches two chapitres claiming one order', () => {
      const a = clean();
      a.chapitres[1]!.order = 1;
      expect(rulesOf(a)).toContain('duplicate-chapitre-order');
    });
  });

  describe('papers', () => {
    it('catches an unknown country code', () => {
      const a = clean();
      a.papers[0]!.country = 'BE' as Archive['papers'][number]['country'];
      expect(rulesOf(a)).toContain('unknown-country');
    });

    it('catches a pdfPath outside /papers', () => {
      const a = clean();
      a.papers[0]!.pdfPath = '/pdfs/mines-2019.pdf';
      expect(rulesOf(a)).toContain('pdf-outside-papers-dir');
    });

    it('catches a pdfPath with no PDF behind it', () => {
      const a = clean();
      a.papers[0]!.pdfPath = '/papers/mines-2029.pdf';
      expect(rulesOf(a)).toContain('missing-pdf');
    });

    it('catches a nested path whose file name happens to exist', () => {
      const a = clean();
      // Matching on the file name alone passes this and ships a 404.
      a.papers[0]!.pdfPath = '/papers/archive/mines-2019.pdf';
      expect(rulesOf(a)).toContain('pdf-outside-papers-dir');
    });
  });

  describe('exercises', () => {
    it('catches an exercise pointing at no paper', () => {
      const a = clean();
      a.exercises[0]!.paperId = 'mines-2020';
      expect(rulesOf(a)).toContain('orphan-exercise');
    });

    it('catches a chapter tag that is not a chapitre', () => {
      const a = clean();
      a.exercises[0]!.chapterIds = ['series', 'topologie'];
      expect(rulesOf(a)).toContain('unknown-chapter-tag');
    });

    it('catches an untagged exercise', () => {
      const a = clean();
      a.exercises[0]!.chapterIds = [];
      expect(rulesOf(a)).toContain('untagged-exercise');
    });

    it('catches a primary chapter missing from the tags', () => {
      const a = clean();
      a.exercises[0]!.primaryChapterId = 'reduc';
      a.exercises[0]!.chapterIds = ['series'];
      expect(rulesOf(a)).toContain('primary-not-tagged');
    });

    it('catches an inverted page range', () => {
      const a = clean();
      a.exercises[0]!.pageStart = 5;
      a.exercises[0]!.pageEnd = 2;
      expect(rulesOf(a)).toContain('invalid-page-range');
    });

    it('catches a page range that starts before page 1', () => {
      const a = clean();
      a.exercises[0]!.pageStart = 0;
      expect(rulesOf(a)).toContain('invalid-page-range');
    });
  });

  describe('page anchors against the real PDF', () => {
    it('accepts an exercise ending on the last page', () => {
      const a = clean();
      a.exercises[0]!.pageEnd = 8; // the PDF has 8
      expect(checkArchive(a, PAGES)).toEqual([]);
    });

    it('catches an exercise ending one page past the end', () => {
      const a = clean();
      a.exercises[0]!.pageEnd = 9;
      const [violation] = checkArchive(a, PAGES);
      expect(violation).toEqual({
        rule: 'anchor-past-end',
        subject: 'mines-2019-i',
        detail: 'pages 1–9, PDF has 8',
      });
    });

    it('says nothing about anchors when the PDF is missing', () => {
      // The missing PDF is the problem to report; a page check against a count
      // nobody has would be noise on top of it.
      const a = clean();
      a.exercises[0]!.pageEnd = 99;
      expect(rulesOf(a, {})).toEqual(['missing-pdf']);
    });
  });
});

describe('formatViolations', () => {
  it('is empty when nothing is wrong', () => {
    expect(formatViolations([])).toBe('');
  });

  it('groups one mistake repeated across many subjects under one heading', () => {
    const report = formatViolations([
      { rule: 'anchor-past-end', subject: 'a', detail: 'pages 1–9, PDF has 8' },
      { rule: 'anchor-past-end', subject: 'b', detail: 'pages 2–9, PDF has 8' },
      { rule: 'untagged-exercise', subject: 'c', detail: 'no chapter tags' },
    ]);
    expect(report).toBe(
      [
        'anchor-past-end (2)',
        '  a — pages 1–9, PDF has 8',
        '  b — pages 2–9, PDF has 8',
        '',
        'untagged-exercise (1)',
        '  c — no chapter tags',
      ].join('\n'),
    );
  });
});
