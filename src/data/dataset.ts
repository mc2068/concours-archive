import type { Dataset } from '../lib/types';
import raw from './dataset.json';

/**
 * The archive dataset. Chapitres are the real Tunisian MP Maths program
 * (ticket 07); the first real concours are being loaded in ticket 08 (Centrale
 * Maths 1 2022 is the first paper) — more papers extend `papers`/`exercises`.
 */
export const dataset: Dataset = raw as unknown as Dataset;
