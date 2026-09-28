# 21: Add the Tunisian MP papers 2017–2022 and 2025 Maths 2

**What to build:** Bundle the 13 missing Tunisian MP maths papers of the
reformed era, tag their exercises, and add the gate rule that keeps a paper
without exercises out of the archive.

**Blocked by:** none

**Status:** open

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

- [ ] 13 papers are bundled, each trimmed to its sujet, or recorded below as
      not added because nothing survived mapping.
- [ ] For each paper, the comments record its IPEIS URL and the page where
      the corrigé starts in the original file, for the solutions fast-follow.
- [ ] `paper-without-exercises` exists, is tested, and passes.
- [ ] `npm run verify` and `npm test` pass.
- [ ] The PRD's counts match the archive.

## Comments
