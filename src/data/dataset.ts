import type { Dataset } from '../lib/types';
import raw from './dataset.json';

/**
 * The archive dataset. Chapitres are the real Tunisian MP Maths program
 * (ticket 07); the papers and exercises are still placeholder content and are
 * re-tagged against these chapitres with real concours in ticket 08.
 */
export const dataset: Dataset = raw as unknown as Dataset;
