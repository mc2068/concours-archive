# 07: Author the Tunisian MP Maths chapter list (content)

**What to build:** The canonical list of Tunisian 2ème prépa MP **Maths** chapitres — the taxonomy spine every exercise tags against (ADR 0002). This replaces the seed placeholders from ticket 02 with the real program. A content task, runnable in parallel with the build.

**Blocked by:** None (can start immediately, in parallel).

**Status:** done (commit e51c5e0, merged in PR #1; the chapter list was signed off by that merge)

Scope note: the list covers the **full MP program (1ère + 2ème année)**, since concours test both years. The 1ère-année linear-algebra block was consolidated from the source's over-split rendering (18 → 13 Algèbre chapters) toward the official breakdown. Final spine: **37 chapitres** (Analyse 18, Algèbre 16, Probabilités 3).

- [x] Gathered from a reliable source — cited research in `.scratch/concours-archive/research/tunisian-mp-maths-program.md` (best source myprepa.tn, which cites the official ministry PDF; corroborated by the government IPEIT page). Confidence: High for the list, Medium for exact ordering / 1ère-année granularity (ministry PDF not byte-verified — see the research file's §6).
- [x] Each chapitre captured as `{id, name, order, domain}` with stable kebab-case ids and French names, in program order (`src/data/dataset.json`). The 4 topics taught in both years get distinct ids (e.g. `structures-algebriques-y1` / `-y2`, `series-numeriques` / `series-numeriques-complements`, `prehilbertiens-y1` / `prehilbertiens-euclidiens-y2`, `probabilites` / `variables-aleatoires-discretes`).
- [x] Recorded in the dataset, replacing the 5 seed chapitres. The 8 placeholder exercises are remapped to valid new ids so the app stays coherent; real concours re-tag them in ticket 08.
- [x] Ambiguities noted for ticket-08 mapping — research §4 (vs. French MPSI→MP: the Séries/Familles split, the finer 1ère-year LA granularity, renames) and §3 (1ère↔2ème boundary duplicates). Consolidation of the over-split LA block is recorded here and in the PR.
