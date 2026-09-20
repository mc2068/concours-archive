import type { Archive, Country, Domain } from '../lib/types';

/**
 * One broken rule, about one thing.
 *
 * `rule` is the stable key tests assert on, `subject` is the id you search
 * `archive.json` for, and `detail` is the sentence you read. Deliberately flat:
 * no severities (a state that is legal while authoring gets no rule at all, so
 * everything here is a failure) and no nesting.
 */
export interface Violation {
  rule: string;
  subject: string;
  detail: string;
}

/** Page count of each bundled paper PDF, keyed by file name. */
export type PageCounts = Record<string, number>;

const DOMAINS: readonly Domain[] = ['Analyse', 'Algèbre', 'Géométrie', 'Probabilités'];
const COUNTRIES: readonly Country[] = ['FR', 'TN', 'MA'];
/** `pdfPath` is a site-absolute URL served from `public/papers`. */
const PAPERS_DIR = '/papers/';

/**
 * The file a `pdfPath` names inside `public/papers`, or `null` when the path
 * does not point directly at a file in that folder. Matching on the file name
 * alone would accept `/papers/archive/x.pdf` — a path that resolves to a 404
 * while looking, to a basename check, exactly like the real thing.
 */
function paperFile(pdfPath: string): string | null {
  if (!pdfPath.startsWith(PAPERS_DIR)) return null;
  const file = pdfPath.slice(PAPERS_DIR.length);
  return file.length > 0 && !file.includes('/') ? file : null;
}

function duplicates<T>(values: T[]): T[] {
  const seen = new Set<T>();
  const dupes = new Set<T>();
  for (const v of values) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  return [...dupes];
}

/**
 * Every rule the hand-authored Archive must satisfy, checked in one pass.
 *
 * Pure: reads nothing, throws nothing, mutates nothing. The page counts are
 * handed in rather than read here, so the rules can be exercised against an
 * archive that has no PDFs behind it — which is what the fixture tests do, and
 * what keeps the filesystem in the caller where it belongs.
 *
 * Returns **every** violation, not the first: a curator running this wants the
 * whole list, and one mistake repeated across 55 exercises should read as one
 * problem with 55 subjects (see {@link formatViolations}).
 *
 * Says nothing about states that are legal mid-authoring — a chapitre with no
 * exercises yet, a paper not yet tagged, a program area with no chapitres (the
 * archive has no Géométrie chapitre today). A guard that cries about normal
 * work teaches you to ignore it.
 *
 * @param pageCounts page count per PDF file name; a paper whose file is absent
 *   from this map is reported as `missing-pdf`.
 */
export function checkArchive(archive: Archive, pageCounts: PageCounts): Violation[] {
  const violations: Violation[] = [];
  const add = (rule: string, subject: string, detail: string) =>
    violations.push({ rule, subject, detail });

  // ---- identity -----------------------------------------------------------
  for (const id of duplicates(archive.chapitres.map((c) => c.id))) {
    add('duplicate-chapitre-id', id, 'more than one chapitre carries this id');
  }
  for (const id of duplicates(archive.papers.map((p) => p.id))) {
    add('duplicate-paper-id', id, 'more than one paper carries this id');
  }
  for (const id of duplicates(archive.exercises.map((e) => e.id))) {
    add('duplicate-exercise-id', id, 'more than one exercise carries this id');
  }

  // ---- chapitres ----------------------------------------------------------
  for (const c of archive.chapitres) {
    if (!DOMAINS.includes(c.domain)) {
      add('unknown-domain', c.id, `domain "${c.domain}" is not one of ${DOMAINS.join(', ')}`);
    }
  }
  for (const order of duplicates(archive.chapitres.map((c) => c.order))) {
    const ids = archive.chapitres.filter((c) => c.order === order).map((c) => c.id);
    add('duplicate-chapitre-order', ids.join(' + '), `order ${order} is claimed by more than one chapitre`);
  }

  // ---- papers -------------------------------------------------------------
  for (const p of archive.papers) {
    if (!COUNTRIES.includes(p.country)) {
      add('unknown-country', p.id, `country "${p.country}" is not one of ${COUNTRIES.join(', ')}`);
    }
    const file = paperFile(p.pdfPath);
    if (file === null) {
      add('pdf-outside-papers-dir', p.id, `pdfPath "${p.pdfPath}" is not a file directly in ${PAPERS_DIR}`);
    } else if (pageCounts[file] === undefined) {
      add('missing-pdf', p.id, `no PDF bundled at "${p.pdfPath}"`);
    }
  }

  // ---- exercises ----------------------------------------------------------
  const chapitreIds = new Set(archive.chapitres.map((c) => c.id));
  const paperById = new Map(archive.papers.map((p) => [p.id, p]));

  for (const e of archive.exercises) {
    const paper = paperById.get(e.paperId);
    if (!paper) {
      add('orphan-exercise', e.id, `paperId "${e.paperId}" matches no paper`);
    }

    for (const id of e.chapterIds) {
      if (!chapitreIds.has(id)) {
        add('unknown-chapter-tag', e.id, `chapter tag "${id}" matches no chapitre`);
      }
    }
    if (e.chapterIds.length === 0) {
      add('untagged-exercise', e.id, 'no chapter tags, so no filter can ever return it');
    } else if (!e.chapterIds.includes(e.primaryChapterId)) {
      add(
        'primary-not-tagged',
        e.id,
        `primary chapter "${e.primaryChapterId}" is not among [${e.chapterIds.join(', ')}]`,
      );
    }

    const sane =
      Number.isInteger(e.pageStart) &&
      Number.isInteger(e.pageEnd) &&
      e.pageStart >= 1 &&
      e.pageEnd >= e.pageStart;
    if (!sane) {
      add('invalid-page-range', e.id, `pages ${e.pageStart}–${e.pageEnd} is not 1 ≤ start ≤ end`);
      continue;
    }

    // The page range is inclusive (ADR 0003), so the last page of the last
    // exercise is the paper's last page — never one past it.
    const paperPdf = paper ? paperFile(paper.pdfPath) : null;
    const pages = paperPdf === null ? undefined : pageCounts[paperPdf];
    if (pages !== undefined && e.pageEnd > pages) {
      add('anchor-past-end', e.id, `pages ${e.pageStart}–${e.pageEnd}, PDF has ${pages}`);
    }
  }

  return violations;
}

/**
 * The violations as one readable report, grouped by rule so a single mistake
 * repeated across many exercises reads as one heading. Empty string when there
 * is nothing wrong, so a caller can assert on it directly.
 */
export function formatViolations(violations: Violation[]): string {
  if (violations.length === 0) return '';

  const byRule = new Map<string, Violation[]>();
  for (const v of violations) {
    const bucket = byRule.get(v.rule);
    if (bucket) bucket.push(v);
    else byRule.set(v.rule, [v]);
  }

  return [...byRule]
    .map(([rule, group]) =>
      [`${rule} (${group.length})`, ...group.map((v) => `  ${v.subject} — ${v.detail}`)].join('\n'),
    )
    .join('\n\n');
}
