import type { Dataset } from '../lib/types';
import raw from './dataset.json';

/**
 * The seed archive (ticket 02). Real chapitres arrive in ticket 07 and real
 * concours in ticket 08; this is placeholder content so the page works.
 */
export const dataset: Dataset = raw as unknown as Dataset;
