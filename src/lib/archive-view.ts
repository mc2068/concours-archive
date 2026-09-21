import { escapeHatch, type EscapeHatch } from './escape-hatch';
import { filterExercises } from './filter';
import { FLAGS, exerciseCount, paperEpreuve } from './format';
import { pdfHref } from './pdf';
import type { Archive, Country, Exercise, Selection } from './types';

/** Which layout the page is in. Learned from the page, never a pixel width. */
export type Viewport = 'mobile' | 'desktop';

/**
 * The three refinements as the page's `<select>`s hold them: raw strings, with
 * `''` meaning "no constraint". Taken verbatim by {@link ArchiveView.refine}
 * and handed back verbatim in the view.
 */
export interface RefinementFields {
  country: string;
  examBrand: string;
  year: string;
}

/** One chapitre tag on a row; `primary` marks the exercise's main subject. */
export interface Chip {
  label: string;
  primary: boolean;
}

/** One result row, fully resolved: nothing domain-shaped for the page to join. */
export interface Row {
  id: string;
  title: string;
  /** The parent paper's facts; `null` when the paper is missing (see below). */
  meta: { flag: string; epreuve: string; year: string } | null;
  chips: Chip[];
  /** Opens the paper's PDF at the exercise's first page; `null` = no link. */
  href: string | null;
}

/** Everything the page should show, and what every control should read. */
export interface ArchiveViewModel {
  /** The chapitre's name, or "Tous les exercices". */
  heading: string;
  /** e.g. "205 exercices". */
  count: string;
  /** The pressed chapitre button; `null` = "Tous les chapitres". */
  pressedChapitreId: string | null;
  refinements: RefinementFields;
  sheetOpen: boolean;
  /** Empty means zero rows — the only way the union lets it be said. */
  results: { kind: 'rows'; rows: Row[] } | { kind: 'empty'; escape: EscapeHatch | null };
}

/**
 * The archive view: owns the student's {@link Selection} and the mobile sheet,
 * takes commands, and answers one query. Flow is one-way — the page hands in
 * events and paints `view()`, and never reads state back out of the DOM.
 */
export interface ArchiveView {
  /** `undefined` (or `''`) means all chapitres. Refinements are kept. */
  selectChapitre(id?: string): void;
  /** Partial merge over the three refinements. */
  refine(patch: Partial<RefinementFields>): void;
  /** Drops the refinements, keeps the chapitre (CONTEXT.md, "Refinement"). */
  clearRefinements(): void;
  /** Drops the chapitre and the refinements: the "show-all" escape hatch. */
  showAll(): void;
  toggleSheet(): void;
  /** Only reports the layout; never opens or closes the sheet by itself. */
  setViewport(viewport: Viewport): void;
  view(): ArchiveViewModel;
}

/**
 * Create the archive view over an {@link Archive}.
 *
 * One rule for an exercise whose paper is missing — impossible in a shipped
 * archive (the `orphan-exercise` rule), so this is defence, not a feature: it
 * has no paper facts, so it shows no meta and no link, and it satisfies no
 * active refinement. That last clause is enforced by `filterExercises`, which
 * drops a paper-less exercise whenever a refinement is active; this module
 * relies on it rather than restating it.
 */
export function createArchiveView(archive: Archive): ArchiveView {
  const chapitreById = new Map(archive.chapitres.map((c) => [c.id, c]));
  const paperById = new Map(archive.papers.map((p) => [p.id, p]));

  let selection: Selection = {};
  let viewport: Viewport = 'desktop';
  let sheetOpen = false;

  function selectChapitre(id?: string): void {
    selection = { ...selection, chapterId: id || undefined };
    // On mobile the sheet sits above the results; picking a chapitre closes
    // it so the student lands on the matches. Refinements never do.
    if (viewport === 'mobile') sheetOpen = false;
  }

  function refine(patch: Partial<RefinementFields>): void {
    const next = { ...selection };
    // Number('') is 0, not NaN — hence the explicit '' checks.
    if (patch.country !== undefined) next.country = patch.country ? (patch.country as Country) : undefined;
    if (patch.examBrand !== undefined) next.examBrand = patch.examBrand || undefined;
    if (patch.year !== undefined) next.year = patch.year ? Number(patch.year) : undefined;
    selection = next;
  }

  function clearRefinements(): void {
    selection = { chapterId: selection.chapterId };
  }

  function row(ex: Exercise): Row {
    const paper = paperById.get(ex.paperId);
    return {
      id: ex.id,
      title: ex.label,
      meta: paper ? { flag: FLAGS[paper.country], epreuve: paperEpreuve(paper), year: String(paper.year) } : null,
      chips: ex.chapterIds.map((id) => ({
        label: chapitreById.get(id)?.name ?? id,
        primary: id === ex.primaryChapterId,
      })),
      href: paper ? pdfHref(paper.pdfPath, ex.pageStart) : null,
    };
  }

  function view(): ArchiveViewModel {
    const { chapterId, country, examBrand, year } = selection;
    const matches = filterExercises(archive, selection);
    return {
      heading: chapterId ? (chapitreById.get(chapterId)?.name ?? 'Exercices') : 'Tous les exercices',
      count: exerciseCount(matches.length),
      pressedChapitreId: chapterId ?? null,
      refinements: { country: country ?? '', examBrand: examBrand ?? '', year: year != null ? String(year) : '' },
      sheetOpen,
      results:
        matches.length > 0
          ? { kind: 'rows', rows: matches.map(row) }
          : { kind: 'empty', escape: escapeHatch(archive, selection) },
    };
  }

  return {
    selectChapitre,
    refine,
    clearRefinements,
    showAll() {
      clearRefinements();
      selectChapitre(undefined);
    },
    toggleSheet() {
      sheetOpen = !sheetOpen;
    },
    setViewport(next) {
      viewport = next;
    },
    view,
  };
}
