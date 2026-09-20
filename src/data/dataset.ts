import type { Dataset } from '../lib/types';
import raw from './dataset.json';

/**
 * The archive dataset. Chapitres are the real Tunisian MP Maths program
 * (ticket 07); the first real concours batch is loaded in ticket 08 (7 papers
 * across FR/TN/MA) — more papers extend `papers`/`exercises`.
 */
export const dataset: Dataset = raw as unknown as Dataset;
