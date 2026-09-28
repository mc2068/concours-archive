# 21: Add the Tunisian MP papers 2017–2022 and 2025 Maths 2

**What to build:** Bundle the 13 missing Tunisian MP maths papers of the
reformed era, tag their exercises, and add the gate rule that keeps a paper
without exercises out of the archive.

**Blocked by:** none

**Status:** done (commit 094a1bf)

## Context

The archive has 7 Tunisian papers: 2023 and 2024 (both), 2025 Maths 1 only, and
2026 (both). IPEIS, the Sfax prépa institute, publishes Maths I and Maths II for
every session from 2000 to 2025 at
<https://ipeis.rnu.tn/fr/article/721/concours-nationaux>. This is the first of
four tickets that fill the gap, newest first (22: 2011–2016, 23: 2005–2010,
24: 2000–2004). The owner approved downloading all of them from IPEIS on
2026-09-28.

What the IPEIS files are like:

- **URL:** `https://ipeis.rnu.tn/userfiles/files/concours/<year>.MP.Maths I.pdf`
  (and `Maths II`). For 2025 it is `Math I` / `Math II`, without the s.
- **Sujet + corrigé.** Every file is the sujet (4–6 pages, matching the
  "Nb pages" on its cover) followed by a full corrigé. `CONTEXT.md` ("Concours
  (paper)", "Corrigé") says a paper is the sujet only, so the corrigé is
  trimmed off.
- **Scans.** Most have no text layer, so page ranges and tags come from
  reading page images. 2019 M1/M2 and 2020 M2 have text, but only in the
  corrigé.
- **2025 Maths II** is the answer-booklet format, with the corrigé typed into
  the answer boxes. The clean sujet still comes first. The official
  concours-ingenieurs.rnu.tn has no 2025 MP Maths 2 (its 2025 list has only
  "Maths 1 – MP"), so IPEIS is the only source.
- Keep the 2023–2025 files we already have. They came from the official site
  and have no corrigé.

Probability first appears in 2017 (Maths I, Exercice 1). 2017–2022 should
mostly map onto the reformed program as it is. Still judge every exercise by
the rule in `CONTEXT.md` ("Mapping").

## To do

- Download the 13 papers: M1 and M2 for 2017–2022, plus 2025 M2.
- Find where each sujet ends: the "Nb pages" on the cover, checked against the
  first corrigé page. Keep pages `1..N` only, using poppler's `pdfseparate` +
  `pdfunite` so pages are copied, not re-encoded. Save as
  `public/papers/tn-maths{1,2}-<year>.pdf`.
- Add each paper to `archive.json`: brand "Concours tunisien", country TN,
  label "Maths 1" / "Maths 2", ids following the existing `tn-maths1-2023`
  convention.
- Split each paper into exercises the way the existing Tunisian papers are
  split (Exercice / Problème parties). Apply "Page range" and "Mapping" from
  `CONTEXT.md`. A paper with no exercise left is not added.
- Add the gate rule `paper-without-exercises` to `archive-rules.ts`, with a
  test, so a paper that no exercise points at fails `npm run verify`.
- Record IPEIS in `research/concours-paper-sources.md` §3 as the source for
  2000–2022: an institute mirror whose files bundle the corrigé.
- Update the PRD's scenario counts and any scenario the new years break. For
  example, S10 says "Année = 2014 → every row Mines-Ponts", which ticket 22
  will break, so check it here and note it.
- Audit every new exercise's start page and tags, as ticket 16 did.

## Acceptance

- [x] 13 papers are bundled, each trimmed to its sujet, or recorded below as
      not added because nothing survived mapping.
- [x] For each paper, the comments record its IPEIS URL and the page where
      the corrigé starts in the original file, for the solutions fast-follow.
- [x] `paper-without-exercises` exists, is tested, and passes.
- [x] `npm run verify` and `npm test` pass.
- [x] The PRD's counts match the archive.

## Comments

**2026-09-28 — done.** All 13 papers are bundled, and every exercise maps onto
the reformed program, so nothing was excluded and no paper was dropped. The
archive is now 101 papers and 245 exercises. Page ranges and tags come from
reading every sujet page as an image; they are a curator's judgement and worth
checking in review.

**Sources and corrigés.** Each file is
`https://ipeis.rnu.tn/userfiles/files/concours/<year>.MP.Maths I.pdf` (or
`Maths II`; `Math II` for 2025). It was trimmed to its sujet with poppler's
`pdfseparate` + `pdfunite`, so pages are copied, not re-encoded. "Corrigé from"
is the page of the original IPEIS file where the corrigé starts.

| Paper | Sujet pages | Corrigé from | Original | Bundled |
| --- | ---: | ---: | ---: | ---: |
| tn-maths1-2017 | 4 | 5 | 17 p, 8.1 MB | 2.1 MB |
| tn-maths2-2017 | 4 | 5 | 8 p, 4.1 MB | 2.0 MB |
| tn-maths1-2018 | 4 | 5 | 11 p, 5.3 MB | 2.0 MB |
| tn-maths2-2018 | 4 | 5 | 10 p, 4.8 MB | 2.4 MB |
| tn-maths1-2019 | 4 | 5 | 16 p, 2.4 MB | 1.9 MB |
| tn-maths2-2019 | 4 | 5 | 10 p, 2.8 MB | 2.4 MB |
| tn-maths1-2020 | 5 | 6 | 18 p, 7.4 MB | 2.0 MB |
| tn-maths2-2020 | 4 | 5 | 12 p, 2.7 MB | 2.1 MB |
| tn-maths1-2021 | 5 | 6 | 12 p, 4.4 MB | 1.8 MB |
| tn-maths2-2021 | 4 | 5 | 10 p, 4.5 MB | 1.9 MB |
| tn-maths1-2022 | 5 | 6 | 12 p, 1.8 MB | 0.8 MB |
| tn-maths2-2022 | 5 | 6 | 16 p, 2.3 MB | 0.7 MB |
| tn-maths2-2025 | 5 | 6 | 16 p, 8.0 MB | 2.3 MB |

2025 Maths 2 keeps the "BIB-IPEIS" watermark of its source; the older scans
keep the IPEIS library stamps.

**Start pages.** Where page 1 holds only the cover and notations for the whole
paper, the first exercise starts on page 2, where its own text begins
(`tn-maths2-2018`, `-2019`, `-2021`, `-2022`, `-2025`, `tn-maths1-2022`).
`tn-maths2-2020-i` starts on page 1, because page 1 states the system (E)
X′ = AX that the whole problem studies.

**Tags a reviewer may want to check:**

- `tn-maths1-2018-i` tags **Limites, continuité**, which had no exercise before
  (the höldérienne functions of Partie II).
- `tn-maths2-2022-i` tags **Fonctions vectorielles, arcs paramétrés**, for the
  derivatives of t ↦ exp(φ(t)) in Mₙ(C). That chapitre now has 2 exercises.
- `tn-maths1-2017-e2` tags **Espaces préhilbertiens réels** (1ère année) for
  the distance to a finite-dimensional subspace, and **Suites et séries de
  fonctions** for the Weierstrass question.
- `tn-maths2-2017-ii` Q12 is a quadratic form ax² + 2bxy + cy², solved through
  the eigenvalues of a symmetric matrix. It stays in under the Mapping rule and
  is tagged with the euclidean chapitre, not with any quadratic-form notion.
- Probability from 2017 onwards: binomial laws (2017), Bernstein polynomials
  (2018), Poisson and generating functions (2019), Poisson approximation
  (2020), a random walk and the CLT (2021), characteristic functions (2022),
  and geometric laws inside algebra problems (2018 M2, 2021 M2).

**Gate.** `paper-without-exercises` is in `archive-rules.ts` with a fixture
test. `checkArchive`'s comment used to call "a paper not yet tagged" a legal
authoring state; it now says a paper goes in together with its exercises, or
not at all.

**PRD.** Every count is recomputed from the archive with the page's own
`createArchiveView`. Several were already stale before this ticket, because
tickets 19–20 retagged exercises: Matrices, Séries numériques and the first
row's label had moved. "Limites, continuité" now has an exercise, so S13, S14
and S21 use "Calculs algébriques" as the chapitre with none. S3 is now
"2 exercices", not the singular; S6 still covers "1 exercice". S10's
"Année = 2014 → every row Mines-Ponts" holds until ticket 22.

`npm run verify`, `npm test` (80 tests) and `astro check` pass. In the dev
server, Pays = Tunisie shows 60 exercices, Année offers 2014–2026, and
`/papers/tn-maths1-2018.pdf` is served as `application/pdf`.
