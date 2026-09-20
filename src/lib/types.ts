// Domain types — vocabulary from CONTEXT.md.

/** Country of origin of a concours paper. */
export type Country = 'FR' | 'TN' | 'MA';

/**
 * A topic in the Tunisian 2ème prépa MP program — the canonical chapter list
 * (ADR 0002). Chapters are the primary filter axis.
 */
export interface Chapitre {
  id: string;
  name: string;
  /** Sort order within the whole program. */
  order: number;
  /** Broad domain used to group the sidebar (Analyse, Algèbre, …). */
  domain: string;
}

/**
 * An archived past exam paper (épreuve). The container an Exercise points into;
 * stored once, never cut up (ADR 0001).
 */
export interface ConcoursPaper {
  id: string;
  examBrand: string;
  year: number;
  country: Country;
  /** The discipline — "Maths" today; Physique is a planned fast-follow. */
  subject: string;
  /**
   * The specific épreuve within the brand/year, e.g. "Maths 1" / "Maths 2",
   * so two papers of the same brand and year are distinguishable. Optional:
   * omit for a concours with a single maths paper.
   */
  label?: string;
  /** Path to the paper's PDF; opened at a page in ticket 04. */
  pdfPath: string;
}

/**
 * The taggable unit: a single exercise/problème pointing into its parent paper
 * (ADR 0001). Carries one or more Tunisian chapter tags.
 */
export interface Exercise {
  id: string;
  paperId: string;
  label: string;
  pageStart: number;
  pageEnd: number;
  /** All chapters this exercise touches. Filtering matches any of these. */
  chapterIds: string[];
  /** The chapter marked as its main subject (one of chapterIds). */
  primaryChapterId: string;
}

/** The whole archive, loaded in the browser. */
export interface Dataset {
  chapitres: Chapitre[];
  papers: ConcoursPaper[];
  exercises: Exercise[];
}

/**
 * An inclusive year range. Either bound may be omitted to leave that side
 * unbounded (`{ from: 2019 }` = 2019 and later; `{ to: 2020 }` = up to 2020).
 */
export interface YearRange {
  from?: number;
  to?: number;
}

/**
 * Filter selections combined with AND. Chapter is the primary axis; country,
 * exam brand, and year are optional stackable refinements. Absent fields do not
 * constrain. `year` accepts a single year or an inclusive {@link YearRange}.
 */
export interface FilterCriteria {
  chapterId?: string;
  country?: Country;
  examBrand?: string;
  year?: number | YearRange;
}
