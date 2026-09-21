import type { ConcoursPaper, Country } from './types';

/** Flag emoji per country — the only emoji on the site (data, not decoration). */
export const FLAGS: Record<Country, string> = {
  FR: '🇫🇷',
  TN: '🇹🇳',
  MA: '🇲🇦',
};

/** French name per country, for the country refinement's options. */
export const COUNTRY_NAMES: Record<Country, string> = {
  FR: 'France',
  TN: 'Tunisie',
  MA: 'Maroc',
};

/**
 * The paper's heading for a result row: exam brand plus its épreuve label when
 * one is set (e.g. "Mines-Ponts Maths 1"), so two papers of the same brand and
 * year are told apart. Falls back to the brand alone when there's no label.
 */
export function paperEpreuve(paper: Pick<ConcoursPaper, 'examBrand' | 'label'>): string {
  const label = paper.label?.trim();
  return label ? `${paper.examBrand} ${label}` : paper.examBrand;
}

/** French exercise count, e.g. "1 exercice" / "8 exercices". */
export function exerciseCount(n: number): string {
  return `${n} exercice${n === 1 ? '' : 's'}`;
}
