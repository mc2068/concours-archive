import type { Country } from './types';

/** Flag emoji per country — the only emoji on the site (data, not decoration). */
export const FLAGS: Record<Country, string> = {
  FR: '🇫🇷',
  TN: '🇹🇳',
  MA: '🇲🇦',
};

/** French exercise count, e.g. "1 exercice" / "8 exercices". */
export function exerciseCount(n: number): string {
  return `${n} exercice${n === 1 ? '' : 's'}`;
}
