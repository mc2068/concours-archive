import { describe, expect, it } from 'vitest';
import { dataset } from './dataset';

const basename = (path: string) => path.split('/').pop();

// Enumerate the bundled PDFs the way the Astro/Vite toolchain sees them, so the
// existence check needs no Node type declarations (this repo ships none). Only
// the keys are read; the binaries are never imported.
const pdfBasenames = new Set(Object.keys(import.meta.glob('../../public/papers/*.pdf')).map(basename));

/**
 * Data-integrity guard for the hand-edited archive dataset. Unlike the filter
 * tests (which run on tiny in-memory fixtures — see spec "Testing Decisions"),
 * this suite runs on the *real* `dataset.json`, because the one way content is
 * added is by hand-editing that file (spec user story 23). These checks catch
 * the mistakes that hand data-entry actually makes: a typo'd `paperId`, a
 * chapter tag that doesn't exist, a primary chapter left out of `chapterIds`,
 * an inverted page range, a duplicate id, or a `pdfPath` with no PDF behind it.
 */
describe('dataset integrity', () => {
  const chapitreIds = new Set(dataset.chapitres.map((c) => c.id));
  const paperIds = new Set(dataset.papers.map((p) => p.id));

  it('has unique chapitre ids', () => {
    expect(dataset.chapitres.length).toBe(chapitreIds.size);
  });

  it('has unique paper ids', () => {
    expect(dataset.papers.length).toBe(paperIds.size);
  });

  it('has unique exercise ids', () => {
    const ids = dataset.exercises.map((e) => e.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('every paper points at a PDF bundled under public/papers', () => {
    // pdfPath is a site-absolute URL ("/papers/x.pdf") served from public/.
    const missing = dataset.papers
      .filter((p) => !pdfBasenames.has(basename(p.pdfPath)))
      .map((p) => `${p.id} → ${p.pdfPath}`);
    expect(missing).toEqual([]);
  });

  it('every exercise references an existing paper', () => {
    const orphans = dataset.exercises
      .filter((e) => !paperIds.has(e.paperId))
      .map((e) => `${e.id} → ${e.paperId}`);
    expect(orphans).toEqual([]);
  });

  it('every exercise chapter tag is a real chapitre', () => {
    const unknown = dataset.exercises.flatMap((e) =>
      e.chapterIds.filter((id) => !chapitreIds.has(id)).map((id) => `${e.id} → ${id}`),
    );
    expect(unknown).toEqual([]);
  });

  it('every exercise has at least one chapter tag', () => {
    const untagged = dataset.exercises.filter((e) => e.chapterIds.length === 0).map((e) => e.id);
    expect(untagged).toEqual([]);
  });

  it('every exercise primary chapter is one of its own tags', () => {
    const bad = dataset.exercises
      .filter((e) => !e.chapterIds.includes(e.primaryChapterId))
      .map((e) => `${e.id}: primary ${e.primaryChapterId} not in [${e.chapterIds.join(', ')}]`);
    expect(bad).toEqual([]);
  });

  it('every exercise has a sane page range (1 ≤ start ≤ end)', () => {
    const bad = dataset.exercises
      .filter((e) => !(Number.isInteger(e.pageStart) && e.pageStart >= 1 && e.pageEnd >= e.pageStart))
      .map((e) => `${e.id}: ${e.pageStart}–${e.pageEnd}`);
    expect(bad).toEqual([]);
  });
});
