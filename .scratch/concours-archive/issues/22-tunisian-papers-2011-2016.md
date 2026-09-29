# 22: Add the Tunisian MP papers 2011–2016

**What to build:** Bundle the 12 Tunisian MP maths papers of 2011–2016 (Maths 1
and Maths 2 each year), trimmed to their sujets, and tag the exercises that
survive mapping.

**Blocked by:** 21

**Status:** done (commit e6c232d)

## Context

Part of the Tunisian backfill that ticket 21 starts, newest first. Ticket 21
has the facts about the IPEIS files (URL pattern, sujet + corrigé, scans) and
the procedure. Follow it as written.

These papers were set on the **pre-reform** program. Judge every exercise by
the rule in `CONTEXT.md` ("Mapping") and ADR 0002's 2026-09-28 amendment:
it is kept when a student of the reformed program can answer it, with earlier
results taken as given, and excluded only when it needs a pre-reform notion.
Expect some parties, and possibly whole papers, to drop out.

Already seen on the cover pages: 2012 Maths 1 opens with Fourier coefficients.

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

**2026-09-29 — done.** All 12 papers are bundled. No paper lost every
exercise, so none was dropped. Three Fourier parties (or runs of parties) and
one Exercice fell to mapping (below). After the review the archive is 113
papers and 279 exercises. Pays = Tunisie shows 94 exercices, and Année offers
2011–2026. Page ranges and tags come from reading every sujet page as an
image, since none of these files has a text layer.

**Sources and corrigés.** Each file is
`https://ipeis.rnu.tn/userfiles/files/concours/<year>.MP.Maths I.pdf` (or
`Maths II`). It was trimmed to its sujet with poppler's `pdfseparate` +
`pdfunite`, as in ticket 21. Every cover's "Nb pages" matches the sujet kept,
and the corrigé starts on the next page of the original file.

| Paper | Sujet pages | Corrigé from | Original | Bundled |
| --- | ---: | ---: | ---: | ---: |
| tn-maths1-2011 | 5 | 6 | 10 p, 0.4 MB | 0.2 MB |
| tn-maths2-2011 | 5 | 6 | 17 p, 0.7 MB | 0.3 MB |
| tn-maths1-2012 | 5 | 6 | 10 p, 2.0 MB | 0.9 MB |
| tn-maths2-2012 | 4 | 5 | 10 p, 1.8 MB | 0.8 MB |
| tn-maths1-2013 | 5 | 6 | 17 p, 3.2 MB | 0.8 MB |
| tn-maths2-2013 | 5 | 6 | 9 p, 1.4 MB | 0.8 MB |
| tn-maths1-2014 | 4 | 5 | 16 p, 2.8 MB | 0.6 MB |
| tn-maths2-2014 | 4 | 5 | 10 p, 1.6 MB | 0.7 MB |
| tn-maths1-2015 | 4 | 5 | 16 p, 9.0 MB | 2.4 MB |
| tn-maths2-2015 | 4 | 5 | 9 p, 4.6 MB | 1.9 MB |
| tn-maths1-2016 | 5 | 6 | 18 p, 7.3 MB | 1.8 MB |
| tn-maths2-2016 | 4 | 5 | 8 p, 3.3 MB | 1.6 MB |

**Excluded under "Mapping".** Every exclusion is Fourier, except one
quadratic-form Exercice:

- `tn-maths1-2012`, Parties I–III (pp. 1–4). I.1b gets Σ1/n² = π²/6 from the
  coefficients bₙ(H), and I.5c gets ∫(ln(x² − 2x cos t + 1))² = 4πΣx²ⁿ/n².
  Both are Parseval. II.3e concludes g′ = 0 from cₙ(g′) = 0 for every n,
  which is the uniqueness of Fourier coefficients. III.2 is Parseval again.
  Partie IV (Γ as the limit of Γₙ) stays. Its last question uses Partie III's
  result, which counts as given.
- `tn-maths1-2014`, Problème II, Partie III (p. 4). III.2 asks what can be
  said of the Fourier series of φₙ (Dirichlet's theorem). III.3d expands
  B₂ₙ(t) as a cosine series, and III.4 reads ζ(2) and ζ(4) off it. III.5–7
  would only need III.3e as given, but the partie is built on Fourier's
  theorems, so it goes as a whole.
- `tn-maths1-2015`, Problème I, Partie II (pp. 2–3). II.1 writes
  f(r,θ) = u₀(r) + Σ(uₙ(r)e^{inθ} + u₋ₙ(r)e^{−inθ}): the convergence of the
  Fourier series of a C¹ periodic function. Partie III stays, taking
  Partie II's result as given.
- `tn-maths2-2014`, the Exercice (p. 1). Its question 2 asks for the Gauss
  decomposition of the quadratic form P ↦ P(0)P(1), and for a basis in which
  q = a₁² − a₂², which is its signature. Questions 1 (units of Z/nZ) and 3
  (critical points) go with it, because the exercise is the unit (see "After
  the branch review").

**Judgement calls a reviewer may want to check:**

- `tn-maths1-2013-p3` stays. III.6 writes
  e^{x cos t} = I₀(x) + 2ΣIₙ(x)cos(nt), which looks like a Fourier expansion,
  but the reformed program reaches it without Fourier. Expand
  e^{x cos t} = Σxᵏcosᵏt/k!, linearise cosᵏt (III.2), and regroup with the
  power series of Iₙ from the Deuxième partie (A.2). III.7 then follows by
  squaring that normally convergent series and integrating over [0, π], with
  no Parseval needed.
- `tn-maths2-2011-ii-a` stays. It uses symmetric positive definite matrices, a
  square root, and a 2 × 2 criterion a > 0, ac − b² > 0. Those are symmetric
  endomorphisms, not a quadratic form's signature.
- `tn-maths2-2013` (Jordan reduction) uses the dual E* only to name linear
  forms and hyperplanes, so the whole paper stays.
- `tn-maths2-2012-ii` tags `prehilbertiens-y1`, not `-y2`. Its orthogonal
  basis of Rₙ[X] comes from Schmidt under a discrete scalar product, not from
  a sequence of orthogonal polynomials in ticket 19's sense.

**Start pages.** When page 1 holds only the cover and notations for the
whole paper, the first exercise starts on page 2. That applies to
`tn-maths2-2011`, `-2013` and `-2015`. `tn-maths2-2012-i` and
`tn-maths2-2016-i` start on page 1, where their Partie I begins.

**PRD.** Every count is recomputed from the archive with the page's own view
code. Several lines changed:
- The totals go to 279 exercises and 113 papers. Tunisie has 94 exercises and
  32 papers.
- Année now runs from 2026 down to 2011.
- S1's last row is now `tn-maths2-2011-ii-b`.
- Année = 2014 now gives 9 rows: four Concours tunisien, then five
  Mines-Ponts (S10, S18).
- The count of out-of-page-order pairs goes from 34 to 37.

The "until ticket 22" notes that ticket 21 added are gone.

`npm run verify` and `npm test` (80 tests) pass.

### After the branch review

The review read every new exercise against its pages again, in two
independent passes, one for Maths 1 and one for Maths 2. This is the audit the
acceptance asks for. Every page count, trim, split, start page and page range
held. It also confirmed the calls on `tn-maths1-2013-p3`,
`tn-maths2-2011-ii-a`, `tn-maths2-2012-ii` and `tn-maths2-2013`.

**The Mapping unit.** The first pass cut at two sizes. It excluded whole
parties for 2012, 2014 and 2015 Maths 1, and a single question for 2014
Maths 2. The review showed that most questions in those Fourier parties could
take the Fourier results as given, so the two sizes were inconsistent. The
unit is now the exercise, as the archive splits the paper, and never a single
question. `CONTEXT.md` ("Mapping") and ADR 0002's amendment now say so. Under
that rule the Fourier parties stay out, and `tn-maths2-2014-e` goes, with its
question 2. Cutting at question level would have left exercises whose pages
still show the excluded questions.

**Changes.**

- `tn-maths2-2011-ii`/`-iii` become `-ii-a`/`-ii-b`. Both are sub-parties of
  Partie II, and the paper has no Partie III.
- `tn-maths2-2014-p`'s label now names its Partie I, the orthogonal of a sum.
- `tn-maths1-2013-p3` gains `familles-sommables` for III.6's regrouping of a
  double series. It also gains `suites-series-fonctions` and `integration`
  for III.7, which integrates term by term over [0, π].
- `tn-maths1-2016-p2` gains `suites-series-fonctions`, for III.3b's
  term-by-term integration.
- `tn-maths1-2016-p4` gains `determinants`: III.2a shows (zI − A)⁻¹ is
  rational through the comatrix.
- `tn-maths2-2015-i` gains `reduction-endomorphismes` for the characteristic
  polynomial P_M of I.2b–c.

**Considered and left as they are.**

- `systemes-lineaires` on `tn-maths2-2012-i`. The normal equations
  ᵗAAξ₀ = ᵗAb come from an orthogonal projection, not from the chapitre's
  elimination methods.
- `series-numeriques` on `tn-maths1-2011-ii`, `-2013-p1` and `-2016-p1`. They
  compare with positive terms and use absolute convergence, which is
  1ère-année material under ticket 19's boundary.
- The `-p1…-p4` counters of the two-problème papers match the existing `-pN`
  convention, and the labels name the problème.
- `tn-maths1-2012-iv`'s IV.6b uses (Eₚ), which is defined in the excluded
  Partie II. The bundled PDF still holds that page, and a result stated
  earlier counts as given.

The PRD is recomputed again: 279 exercises, Tunisie 94, and Année = 2014 gives
9 rows. `npm run verify` and `npm test` pass.
