import type { Archive } from '../lib/types';
import raw from './archive.json';

/**
 * The Archive: every chapitre, concours paper and exercise the site serves
 * (CONTEXT.md, "Archive"). Hand-authored in `archive.json`; this module is the
 * only place that JSON becomes a typed {@link Archive}.
 *
 * The cast is not a hope. `npm run verify` runs every rule in
 * `archive-rules.ts` over this file and over the real PDFs behind it, and
 * `npm run build` will not reach `astro build` until that passes — so no
 * deployed build can contain an archive that breaks the type or its
 * invariants. Change that wiring and this cast becomes a lie.
 *
 * Nothing here validates at import time on purpose: this module is bundled
 * into the page's client script, and a student should download the archive,
 * not the rules that checked it.
 */
export const archive: Archive = raw as unknown as Archive;
