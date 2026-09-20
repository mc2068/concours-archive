import { describe, expect, it } from 'vitest';
import { archive } from './archive';
import { checkArchive, formatViolations } from './archive-rules';
import { readPageCounts } from './pdf-page-counts';

/*
  The verification gate. `npm run verify` runs this file and `npm run build`
  will not reach `astro build` until it passes, so a bad edit to `archive.json`
  cannot deploy. `npm test` runs it too, which is where you want to meet it.

  It states one thing. Every rule lives in `archive-rules.ts` and is exercised
  against fixtures in `archive-rules.test.ts`; restating any of them here would
  give the project two versions of a rule and no way to know which one is stale.
*/

describe('the real Archive', () => {
  it('breaks no rule', () => {
    const report = formatViolations(checkArchive(archive, readPageCounts()));
    // Asserting on the report rather than the array: when this fails, the
    // message is the list of what to fix, grouped by rule.
    expect(report).toBe('');
  });

  it('has a page count for every paper it ships', () => {
    // Guards the guard: if the PDF page tree ever stops being readable, the
    // anchor rule would fall silent instead of failing, and `missing-pdf`
    // would be the only sign. Better to say so here.
    const pages = readPageCounts();
    const unreadable = archive.papers
      .filter((p) => pages[p.pdfPath.split('/').pop() ?? ''] === undefined)
      .map((p) => p.pdfPath);
    expect(unreadable).toEqual([]);
  });
});
