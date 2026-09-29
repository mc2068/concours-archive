# 23: Add the Tunisian MP papers 2005–2010

**What to build:** Bundle the 12 Tunisian MP maths papers of 2005–2010 (Maths 1
and Maths 2 each year), trimmed to their sujets, and tag the exercises that
survive mapping.

**Blocked by:** 22

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

Already seen on the cover pages: 2009 Maths 1 is on séries trigonométriques
(a Dirichlet problem), and 2010 Maths 1 on Borel summability of series.

## Acceptance

- [x] Each of the 12 papers is bundled and trimmed to its sujet, or
      recorded below as not added because nothing survived mapping.
- [x] Each excluded exercise is listed below with the pre-reform notion it
      needs, so the exclusions can be reviewed.
- [x] For each paper, the comments record its IPEIS URL and the page where
      the corrigé starts in the original file.
- [x] New exercises' start pages and tags are audited, as in ticket 16.
- [x] The PRD's counts match the archive; `npm run verify` and `npm test` pass.

## Comments

**2026-09-29 — done.** All 12 papers are bundled and none was dropped. One
partie fell to mapping, and two more are left out because the IPEIS file
lacks their last page (below). The archive is now 125 papers and 319
exercises. Pays = Tunisie shows 134 exercices, and Année offers 2005–2026.
Page ranges and tags come from reading every sujet page as an image, since
none of these files has a text layer. The unit judged is the exercise, as
`CONTEXT.md` ("Mapping") says since ticket 22.

**Sources and corrigés.** Each file is
`https://ipeis.rnu.tn/userfiles/files/concours/<year>.MP.Maths I.pdf` (or
`Maths II`). It was trimmed to its sujet with poppler's `pdfseparate` +
`pdfunite`, as in ticket 21. "Corrigé from" is the page of the original
file where the corrigé starts.

| Paper | Sujet pages | Corrigé from | Original | Bundled |
| --- | ---: | ---: | ---: | ---: |
| tn-maths1-2005 | 5 | 6 | 17 p, 0.6 MB | 0.2 MB |
| tn-maths2-2005 | 4 of 5 | 5 | 14 p, 0.4 MB | 0.2 MB |
| tn-maths1-2006 | 4 of 5 | 5 | 16 p, 3.5 MB | 0.9 MB |
| tn-maths2-2006 | 5 | 6 | 8 p, 1.8 MB | 1.2 MB |
| tn-maths1-2007 | 6 | 7 | 16 p, 3.3 MB | 1.2 MB |
| tn-maths2-2007 | 4 | 5 | 8 p, 1.7 MB | 1.0 MB |
| tn-maths1-2008 | 4 | 5 | 11 p, 0.4 MB | 0.2 MB |
| tn-maths2-2008 | 4 | 5 | 11 p, 0.6 MB | 0.3 MB |
| tn-maths1-2009 | 5 | 6 | 13 p, 0.9 MB | 0.3 MB |
| tn-maths2-2009 | 4 | 5 | 7 p, 0.4 MB | 0.3 MB |
| tn-maths1-2010 | 5 | 6 | 14 p, 0.7 MB | 0.3 MB |
| tn-maths2-2010 | 5 | 6 | 11 p, 0.5 MB | 0.3 MB |

**Two IPEIS files lack their last sujet page.** The covers of 2005 Maths 2
and 2006 Maths 1 say "Nb pages : 5". Both files go straight from sujet page
4 to the corrigé, and the fifth page is nowhere in either file. Their four
pages are bundled, and every exercise that ends on them is in. The one that
runs onto the missing page is left out, because its later questions can't
be read:

- `tn-maths2-2005`, Partie III (Dunford applied to exp). Only III.1a–b are on
  page 4, and the corrigé answers questions up to III.6.
- `tn-maths1-2006`, Partie IV (the Hermite functions Uₙ). Only IV.1° is on
  page 4, and the corrigé answers 2° and 3°.

The bundled PDFs therefore stop short of their covers' page count, like
`tn-maths2-2025` (ticket 21). A complete copy would bring these two parties
back.

**Excluded under "Mapping".**

- `tn-maths1-2008`, Partie II (pp. 2–3). II.4b writes the periodised f_T as
  the sum of its Fourier series, (√2π/T)Σ F(f)(2πn/T)e^{2iπnx/T}. That is the
  convergence of the Fourier series of a C¹ periodic function (Dirichlet's
  theorem). II.5 gets the inversion formula from it. Partie III uses that
  formula as given, so it stays.

**Judgement calls a reviewer may want to check:**

- `tn-maths1-2009` stays whole, although it is about séries trigonométriques
  and the Dirichlet problem. No question quotes a Fourier theorem. II.B.1
  computes the coefficients by integrating a uniformly convergent series
  term by term. II.B.4 proves, within the paper, that a trigonometric series
  with a continuous sum is the Fourier series of that sum, using Partie
  II.A's pseudo-derivative. Partie III uses that result as given. This
  differs from `tn-maths1-2012`'s Partie II (ticket 22), which needed the
  uniqueness of Fourier coefficients without proving it.
- `tn-maths1-2008-i` stays. The "transformée de Fourier" is an integral with
  a parameter, and no Fourier theorem is used.
- `tn-maths1-2005-e` stays. A.2's cosine expansion of 1/(ch a − cos x) comes
  from A.1's partial fractions as a geometric series. A.3's Iₙ and ∫φ²
  integrate that normally convergent series (squared, for ∫φ²) term by term.
  That is the route ticket 22 accepted for `tn-maths1-2013-p3`.
- `tn-maths2-2008-i` stays. Its bilinear form φ is invariant under f, and I.3
  asks when it is définie positive: a scalar product, not a signature.
- `tn-maths1-2009-ii-a` / `-ii-b` follow the sub-partie ids of ticket 22's
  review.

**Start pages.** When page 1 holds only the cover and notations for the whole
paper, the first exercise starts on page 2. That applies to
`tn-maths2-2006`, `-2007`, `-2009` and `-2010`. `tn-maths2-2008-i` starts on
page 1, where Partie I begins under the definitions.

**PRD.** Every count is recomputed with the page's own view code:
- The totals go to 319 exercises and 125 papers. Tunisie has 134 exercises
  and 44 papers.
- Année now runs from 2026 down to 2005.
- S1's last row is now `tn-maths2-2005-ii`.
- S12 used "Nombres réels et suites numériques", which now has a Tunisian
  exercise (`tn-maths1-2010-ii`). It now uses "Groupe symétrique", which has
  4 exercises and none from Tunisia.

`npm run verify` and `npm test` (80 tests) pass.
