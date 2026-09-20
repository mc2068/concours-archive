import { readdirSync, readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import type { PageCounts } from './archive-rules';

/*
  Build-time only. This module touches the filesystem, so it must never be
  imported from `archive.ts` or from the page's client script — only from the
  verification gate and its tests.
*/

const PAPERS = new URL('../../public/papers/', import.meta.url);

/** `/Type /Pages … /Count N` in either order — the root page tree's size. */
const COUNT_PATTERNS = [
  /\/Type\s*\/Pages[^>]*?\/Count\s+(\d+)/g,
  /\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages/g,
];

function countsIn(text: string): number[] {
  return COUNT_PATTERNS.flatMap((re) => [...text.matchAll(re)].map((m) => Number(m[1])));
}

/**
 * How many pages a paper's PDF has.
 *
 * Reads the page tree out of the file's own bytes rather than parsing the PDF:
 * the only fact needed is the root `/Count`, and a full parser would be a
 * dependency earning its keep on one number.
 *
 * Roughly a third of the archive's papers — every Centrale one — keep that
 * node inside a compressed object stream, where a plain scan finds nothing. So
 * when the direct scan comes up empty, every `FlateDecode` stream in the file
 * is inflated and scanned in turn. Between the two, all 88 bundled papers
 * report a count.
 *
 * @returns the page count, or `null` if the file yields no page tree at all.
 */
export function pdfPageCount(bytes: Buffer): number | null {
  const raw = bytes.toString('latin1');

  const direct = countsIn(raw);
  if (direct.length > 0) return Math.max(...direct);

  let best = 0;
  const streamStart = /stream\r?\n/g;
  let match: RegExpExecArray | null;
  while ((match = streamStart.exec(raw)) !== null) {
    const from = match.index + match[0].length;
    const to = raw.indexOf('endstream', from);
    if (to < 0) continue;
    try {
      const found = countsIn(inflateSync(bytes.subarray(from, to)).toString('latin1'));
      if (found.length > 0) best = Math.max(best, ...found);
    } catch {
      // Not a Flate stream, or not inflatable on its own: nothing to read here.
    }
  }
  return best || null;
}

/**
 * Page count of every PDF bundled under `public/papers`, keyed by file name —
 * the shape {@link checkArchive} expects. A file whose page tree cannot be read
 * is left out of the map, which surfaces as `missing-pdf` rather than passing
 * silently.
 */
export function readPageCounts(): PageCounts {
  const dir = fileURLToPath(PAPERS);
  const counts: PageCounts = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.pdf')) continue;
    const pages = pdfPageCount(readFileSync(fileURLToPath(new URL(file, PAPERS))));
    if (pages !== null) counts[file] = pages;
  }
  return counts;
}
