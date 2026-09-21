import { escapeHatch, type EscapeHatch } from './escape-hatch';
import { filterExercises, placeExercises, type PlacedExercise } from './filter';
import { COUNTRY_NAMES, FLAGS, exerciseCount, paperEpreuve } from './format';
import { pdfHref } from './pdf';
import type { Archive, Country, Domain, Selection } from './types';

/** Which layout the page is in. Learned from the page, never a pixel width. */
export type Viewport = 'mobile' | 'desktop';

/**
 * The three refinements as the page's `<select>`s hold them: raw strings, with
 * `''` meaning "no constraint". Taken by {@link ArchiveView.refine} and handed
 * back in the view.
 */
export interface RefinementFields {
  country: string;
  examBrand: string;
  year: string;
}

/** One `<option>` of a refinement: the string the select holds, and its text. */
export interface Option {
  value: string;
  label: string;
}

/** One sidebar group: a domain and its chapitres, in program order. */
export interface ChapitreGroup {
  domain: Domain;
  chapitres: { id: string; name: string }[];
}

/**
 * What the student can choose from. Fixed for the life of the archive, so the
 * page renders it once at build time rather than repainting it.
 */
export interface Controls {
  /** Domains in the order their first chapitre appears in the program. */
  chapitreGroups: ChapitreGroup[];
  /** Only the values some paper in the archive actually has. */
  refinements: Record<keyof RefinementFields, Option[]>;
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
 * says what can be chosen, takes commands, and answers one query. Flow is
 * one-way — the page hands in events and paints `view()`, and never reads
 * state back out of the DOM.
 */
export interface ArchiveView {
  /** The chapitre buttons and refinement options the page renders. */
  controls(): Controls;
  /** `undefined` (or `''`) means all chapitres. Refinements are kept. */
  selectChapitre(id?: string): void;
  /**
   * Partial merge over the three refinements. A value that is not one of
   * {@link Controls}' options — `''` included — means "no constraint".
   */
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

function controlsOf(archive: Archive): Controls {
  const chapitres = [...archive.chapitres].sort((a, b) => a.order - b.order);
  const domains = [...new Set(chapitres.map((c) => c.domain))];

  const presentCountries = new Set(archive.papers.map((p) => p.country));
  const countries = (Object.keys(COUNTRY_NAMES) as Country[]).filter((code) => presentCountries.has(code));
  const examBrands = [...new Set(archive.papers.map((p) => p.examBrand))].sort((a, b) => a.localeCompare(b, 'fr'));
  const years = [...new Set(archive.papers.map((p) => p.year))].sort((a, b) => b - a);

  return {
    chapitreGroups: domains.map((domain) => ({
      domain,
      chapitres: chapitres.filter((c) => c.domain === domain).map(({ id, name }) => ({ id, name })),
    })),
    refinements: {
      country: countries.map((code) => ({ value: code, label: `${FLAGS[code]} ${COUNTRY_NAMES[code]}` })),
      examBrand: examBrands.map((b) => ({ value: b, label: b })),
      year: years.map((y) => ({ value: String(y), label: String(y) })),
    },
  };
}

/**
 * Create the archive view over an {@link Archive}. Exercises are joined to
 * their papers once, here; a paper-less exercise follows the single rule on
 * {@link PlacedExercise}.
 */
export function createArchiveView(archive: Archive): ArchiveView {
  const chapitreById = new Map(archive.chapitres.map((c) => [c.id, c]));
  const placed = placeExercises(archive);
  const controls = controlsOf(archive);

  let selection: Selection = {};
  let viewport: Viewport = 'desktop';
  let sheetOpen = false;

  /** The value if the named refinement offers it, else `undefined`. */
  function offered(field: keyof RefinementFields, value: string): string | undefined {
    return controls.refinements[field].some((o) => o.value === value) ? value : undefined;
  }

  function selectChapitre(id?: string): void {
    selection = { ...selection, chapterId: id || undefined };
    // On mobile the sheet sits above the results; picking a chapitre closes
    // it so the student lands on the matches. Refinements never do.
    if (viewport === 'mobile') sheetOpen = false;
  }

  function refine(patch: Partial<RefinementFields>): void {
    const next = { ...selection };
    if (patch.country !== undefined) next.country = offered('country', patch.country) as Country | undefined;
    if (patch.examBrand !== undefined) next.examBrand = offered('examBrand', patch.examBrand);
    if (patch.year !== undefined) {
      const year = offered('year', patch.year);
      next.year = year === undefined ? undefined : Number(year);
    }
    selection = next;
  }

  function clearRefinements(): void {
    selection = { chapterId: selection.chapterId };
  }

  function row({ exercise: ex, paper }: PlacedExercise): Row {
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
    const matches = filterExercises(placed, selection);
    return {
      heading: chapterId ? (chapitreById.get(chapterId)?.name ?? 'Exercices') : 'Tous les exercices',
      count: exerciseCount(matches.length),
      pressedChapitreId: chapterId ?? null,
      refinements: { country: country ?? '', examBrand: examBrand ?? '', year: year != null ? String(year) : '' },
      sheetOpen,
      results:
        matches.length > 0
          ? { kind: 'rows', rows: matches.map(row) }
          : { kind: 'empty', escape: escapeHatch(placed, selection) },
    };
  }

  return {
    controls: () => controls,
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
