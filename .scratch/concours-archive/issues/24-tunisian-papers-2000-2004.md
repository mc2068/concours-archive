# 24: Add the Tunisian MP papers 2000–2004

**What to build:** Bundle the 10 Tunisian MP maths papers of 2000–2004 (Maths 1
and Maths 2 each year), trimmed to their sujets, and tag the exercises that
survive mapping.

**Blocked by:** 23

**Status:** done

## Context

Part of the Tunisian backfill that ticket 21 starts, newest first. Ticket 21
has the facts about the IPEIS files (URL pattern, sujet + corrigé, scans) and
the procedure. Follow it as written.

These papers were set on the **pre-reform** program. Judge every exercise by
the rule in `CONTEXT.md` ("Mapping") and ADR 0002's 2026-09-28 amendment:
it is kept when a student of the reformed program can answer it, with earlier
results taken as given, and excluded only when it needs a pre-reform notion.
Expect some parties, and possibly whole papers, to drop out.

These are the oldest and poorest scans (2002 Maths 1 is 19 MB). The 2001
corrigés are handwritten, so finding where the sujet ends needs a look at
the pages, not just the cover's page count.

Ticket 23 found a second source. IPEIB's archive,
`http://www.ipeib.rnu.tn/CONCOURS0212/concours.htm` (HTTP only), has the
2002–2004 MP sujets and corrigés as separate files, e.g.
`MP/2002/MP%20C%2002%20MATH%201.pdf`. Compare them with IPEIS's scans and
bundle the better copy. A sujet no copy has in full is an **incomplete
source** (`CONTEXT.md`): keep it, record the gap, and leave out only an
exercise it cuts off.

## Acceptance

- [x] Each of the 10 papers is bundled and trimmed to its sujet, or
      recorded below as not added because nothing survived mapping.
      (`tn-maths2-2000` is not added: its only source cuts off every partie.
      See "Not added".)
- [x] Each excluded exercise is listed below with the pre-reform notion it
      needs, so the exclusions can be reviewed.
- [x] For each paper, the comments record its IPEIS URL and the page where
      the corrigé starts in the original file.
- [x] New exercises' start pages and tags are audited, as in ticket 16.
- [x] The PRD's counts match the archive; `npm run verify` and `npm test` pass.

## Comments

**2026-09-30 — done.** 9 of the 10 papers are bundled. `tn-maths2-2000` is not
added, because its only source stops after the first page of its sujet. Five
exercises fall to "Mapping". The archive is now 134 papers and 346 exercises.
Pays = Tunisie shows 161 exercices, and Année offers 2000–2026. Page ranges
and tags come from reading every sujet page as an image. IPEIB's 2003 files
carry an OCR layer, but nothing was read from it.

**Sources and corrigés.** Each IPEIS file is
`https://ipeis.rnu.tn/userfiles/files/concours/<year>.MP.Maths I.pdf` (or
`Maths II`), and "Corrigé from" is the page of that file where the corrigé
starts. For 2002–2004, IPEIB
(`http://www.ipeib.rnu.tn/CONCOURS0212/concours.htm`) has the sujets alone.
Each IPEIB copy was compared with IPEIS's page by page, and the better one is
bundled:
- The IPEIS copies are trimmed with `pdfseparate` + `pdfunite`.
- The IPEIB copies are bundled unchanged.

| Paper | Bundled from | Sujet pages | IPEIS corrigé from | IPEIS original | Bundled |
| --- | --- | ---: | ---: | ---: | ---: |
| tn-maths1-2000 | IPEIS | 4 | 5 | 11 p, 2.8 MB | 1.0 MB |
| tn-maths2-2000 | not added | 1 of ? | 2 | 6 p, 2.0 MB | — |
| tn-maths1-2001 | IPEIS | 5 | 6 | 16 p, 0.5 MB | 0.2 MB |
| tn-maths2-2001 | IPEIS | 4 | 5 | 10 p, 0.4 MB | 0.2 MB |
| tn-maths1-2002 | IPEIB `MP/2002/MP%20C%2002%20MATH%201.pdf` | 5 | 6 | 16 p, 19.2 MB | 1.2 MB |
| tn-maths2-2002 | IPEIB `MP/2002/MP%20C%2002%20MATH%202.pdf` | 4 | 5 | 9 p, 9.6 MB | 1.0 MB |
| tn-maths1-2003 | IPEIB `MP/2003/mp_03_math1.pdf` | 5 | 6 | 17 p, 3.6 MB | 0.2 MB |
| tn-maths2-2003 | IPEIB `MP/2003/mp_03_math2.pdf` | 4 | 5 | 16 p, 3.7 MB | 0.2 MB |
| tn-maths1-2004 | IPEIS | 4 | 5 | 11 p, 3.2 MB | 1.3 MB |
| tn-maths2-2004 | IPEIB `MP/2004/MP%20C%2004%20MATH%202.pdf` | 5 | 6 | 12 p, 3.5 MB | 0.2 MB |

Why each source won:
- IPEIS's scans of 2002 Maths 1 and 2 and of 2003 Maths 1 each have a page
  scanned askew, with its text running diagonally. The IPEIB copies are
  straight and have no library stamps.
- 2004 Maths 1 goes the other way. IPEIB's scan clips the right edge of
  page 4 (VI.1's "x²−n²", VI.6's "ζ(4)"), and IPEIS's page 4 is whole.
- The 2001 corrigés are handwritten, as the ticket says. Every other year's
  sujet ends on its cover's "Nb pages".

IPEIS's earlier site also published separate sujet files. It is gone now, but
the Wayback Machine keeps a 2016 capture (research §3f). Its 2000 and 2001 MP
sujets hold the same page images as today's IPEIS files, so it adds nothing.

**Not added: `tn-maths2-2000`.** Its cover announces Parties I–IV. The IPEIS
file holds only page 1, then goes straight to the corrigé on page 2. Page 1
ends at Partie I's question 2, and the corrigé answers Partie I up to Q5. So
the source cuts off every partie, and none can be kept ("Incomplete source").
The cover's "Nb pages" is illegible, so the sujet's length is unknown. No other
copy was found:
- The Wayback capture of IPEIS's old site has a 1-page sujet file.
- The engineersworldtn blog's Google Drive file is the same 6-page scan.
- IPEIB starts at 2002.

With no exercise left, the paper is not added, like a paper emptied by
mapping.

**Incomplete source, kept: `tn-maths1-2000`.** All four pages are there, but
the tops of pages 2 and 3 are scanned short, in every copy found:
- Page 2 opens at I.6b, so I.4 (the limit of F at +∞), I.5 (T(g″)) and I.6a
  are lost.
- Page 3 opens at the definition of the Jₙ, so II.6 (yₙ′ = 2x yₙ₋₁ and the
  relation III.1a quotes as "II-6-b") is lost.

The corrigé (IPEIS pp. 6 and 8) restates what those questions ask. Both gaps
fall in the middle of an exercise, so Parties I and II stay. The gap is
recorded here and nowhere on the page, as with `tn-maths2-2025`.

**Excluded under "Mapping".**
- `tn-maths1-2000`, Partie III (pp. 3–4). III.4 expands U(r cos θ, r sin θ)
  = Σ Cₙ(r)e^{inθ}. The corrigé justifies this by the function being C² and
  2π-periodic: "elle coïncide avec la somme de sa série de Fourier". That is a
  Fourier convergence theorem.
- `tn-maths1-2001`, Partie I (pp. 1–2). I.1a compares ∬ e^{−(x²+y²)} over the
  quarter discs D_a and D_{a√2} and the square C_a: a multiple integral.
- `tn-maths1-2001`, Partie III (pp. 3–5). III.1d, "En déduire" from qₜ's
  Fourier coefficients that qₜ(x) = 1/2π + (1/π)Σ e^{−n²t} cos nx, needs a
  function to equal its Fourier series. So does III.5b, Σ cos(nx)/n² from h's
  coefficients.
- `tn-maths2-2001`, Partie II.B (pp. 3–4). Q is reduced ("Réduire la forme
  quadratique Q") to the matrix diag(1, −1, −1), and the partie studies its
  orthogonal group O(Q): the signature of a quadratic form.
- `tn-maths2-2001`, Partie III (p. 4). A basis where φ has matrix
  diag(Iₚ, −I_q), p and q counting the positive and negative eigenvalues: the
  signature again.
- `tn-maths1-2003`, Exercice (pp. 1–2). 1b deduces Σ sin²(nx)/n² =
  x(π − x)/2 from g's Fourier series.
- `tn-maths1-2004`, Partie V (p. 4). V.2 asks for the sum of the Fourier
  series of e^{ixt}: Dirichlet's theorem. Partie VI takes V.3's
  cotangent expansion as given, so it stays.

Two things follow:
- `tn-maths1-2001` keeps only Partie II.
- The last kept exercises of `tn-maths1-2000` and `-2001` end on page 3 of
  their 4- and 5-page PDFs. The paper is still the whole sujet, as with
  `mines-ponts-maths1-2021` and the CCINP papers whose last exercise was left
  out.

**Judgement calls a reviewer may want to check:**
- `tn-maths2-2001-ii-a` stays. It takes the matrix of a symmetric bilinear
  form and of its restriction to a plane, and asks when it is positive, by the
  2 × 2 criterion tr ≥ 0, det ≥ 0. No signature or reduction is needed. The
  closest precedents are `tn-maths2-2011-ii-a` (ticket 22) and
  `tn-maths2-2008-i` (ticket 23). "Matrix of a bilinear form" is not in the
  reformed program, though. If that alone counts as pre-reform, this exercise
  goes.
- `tn-maths2-2004-i` stays for the same reason. I.4 writes a symmetric
  bilinear form's matrix in a new basis as ᵗQAQ and diagonalises it in an
  orthonormal basis. That is the spectral theorem, not a signature.
- `tn-maths2-2004-ii` stays. II.3 assumes "toute suite de Cauchy de F
  converge dans F", and II.3c asks to show a sequence is Cauchy. Cauchy
  sequences are not in the reformed program (nor in the French one it
  follows), but they are not one of the pre-reform notions "Mapping" names.
  The paper states the hypothesis it needs. Excluding it would mean adding
  "suites de Cauchy" to that list.
- `tn-maths1-2000-i` stays. The corrigé answers I.7a with Fubini, but an
  integration by parts gives the same identity, so no multiple integral is
  needed.
- `tn-maths1-2003-p2` stays. II.3d's ∫₀^{+∞} w follows from II.2c,
  w′(x) = −1/x + ∫ₓ^{+∞} w, without a double integral.
- `tn-maths1-2001-ii` stays. ĝₜ is a Fourier transform, but only as an
  integral with a parameter, found through the equation y′ = −2txy. No Fourier
  theorem is used. This is the reading ticket 23 took for `tn-maths1-2008-i`.
- Sub-parties are split as ticket 22's review set out: `tn-maths2-2001-ii-a`,
  `tn-maths2-2002-ii-a`/`-ii-b`, `tn-maths2-2003-p2-a`/`-p2-b`. The
  Question préliminaire of 2003 Maths 2's Partie 2 opens `-p2-a`.

**Start pages.** Every exercise starts on the page with its heading and its
first text. `tn-maths2-2002-ii-b` starts on page 2: Partie B's heading is at
the foot of that page, but its introduction ("Soit u un endomorphisme normal
et soit Pᵤ son polynôme caractéristique") is under it. `tn-maths1-2004-ii`
starts on page 1, where Partie II's first question sits.

### Audit

This is the ticket 16 audit. All 40 bundled sujet pages were read at 100 dpi.
Every page range was checked against "Page range" in `CONTEXT.md`, and every
tag against the questions:
- All 26 page ranges hold.
- Each paper's page count matches `pdfinfo` and the gate's reader.
- The dev server serves all nine PDFs as `application/pdf`.

**Changes.**
- `tn-maths2-2002-ii-a` and `-ii-b` had near-identical labels. They now say
  how each gets the result: by matrices (II.A) and by the characteristic
  polynomial (II.B).

**Considered and left as they are.**
- `tn-maths1-2004-i` tags `series-numeriques-complements`, not
  `series-numeriques`, for I.1e's comparison of ζ with an integral. The
  program notes put série–intégrale comparison in the 2ème année compléments.
- `tn-maths2-2003-p2-a` has `prehilbertiens-y1` as primary: tr(AᵗB) is a
  first-year scalar product. It also tags `-y2`, for A.2a's S⁺, which needs
  the spectral theorem.
- `tn-maths2-2003-e` tags `prehilbertiens-euclidiens-y2` as primary: the Jₙ^α
  form a sequence of orthogonal polynomials and 𝒜_α is a symmetric
  endomorphism, as in ticket 19.

**PRD.** Every count is recomputed with the page's own view code:
- The totals go to 346 exercises and 134 papers. Tunisie has 161 exercises
  and 53 papers.
- Année runs from 2026 down to 2000.
- S1's last row is now `tn-maths1-2000-ii`. It was already stale before this
  ticket: since ticket 23 added `tn-maths2-2005-iii`, the last row had been
  that Partie III, not Partie II.
- The out-of-page-order pairs stay at 37, and the three chapitres with no
  exercises are unchanged.
- S3, S6, S8, S12 and S18 are unchanged, as are S10's CNC and 2014 steps.

`npm run verify` and `npm test` (80 tests) pass. `research/concours-paper-sources.md`
now records IPEIB (§3e) and the Wayback capture of IPEIS's old site (§3f).
