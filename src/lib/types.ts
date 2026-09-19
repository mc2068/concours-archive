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
  subject: string;
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
 * Filter selections. Chapter is the primary axis; country/exam/year refinements
 * arrive in ticket 03. Absent fields do not constrain.
 */
export interface FilterCriteria {
  chapterId?: string;
}
