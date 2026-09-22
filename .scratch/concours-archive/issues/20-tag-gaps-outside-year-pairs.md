# 20: Tag gaps found outside the year-split pairs

**What to build:** Ticket 19's audit read these exercises and found chapitres
missing from them. They were outside ticket 19's scope, which covered only
the four year-split pairs. Read each exercise and fix its tags.

**Blocked by:** none

**Status:** done

## Items

1. `centrale-maths1-2024-p2`: Part II proves the AM–GM and Carleman
   inequalities through gradients and a constrained extremum. It lacks
   `calcul-differentiel`.
2. `mines-ponts-maths1-2015-ii`: Part B is Weierstrass's theorem through
   Bernstein polynomials and Bienaymé–Tchebychev. It lacks `probabilites`,
   or possibly `variables-aleatoires-discretes`.
3. `cnc-maths1-2021-p2`, tagged only `suites-series-fonctions`: Partie 2
   studies the alternating series Σ(−1)ⁿ/nˣ and its uniform convergence. It
   probably needs `series-numeriques-complements` (see ticket 19's séries
   boundary).

## Acceptance

- [x] Each item has been read and fixed in `archive.json`, or recorded
      below as a deliberate choice.
- [x] `npm run verify` passes.

## Comments

**2026-09-22 — done.** All three were read from the extracted text of their
pages.

1. `centrale-maths1-2024-p2` gains `calcul-differentiel`, which is now its
   primary. II.A and II.B are gradients, a maximum on a compact set, and a
   Lagrange multiplier (Q11–Q21). Only Q22 turns the finite bound into the
   Carleman series inequality, so `series-numeriques` stays, as a secondary tag.
   It is a positive-term comparison, which is 1ère année. It loses
   `fonctions-convexes`: part II proves AM–GM by constrained extremum, and no
   question uses convexity. The label now says "par extremum lié", so that it
   matches the primary.
2. `mines-ponts-maths1-2015-ii` gains `variables-aleatoires-discretes`, not
   `probabilites`. Part B uses the binomial law, independent Bernoulli
   variables, expectation, variance and Bienaymé–Tchebychev, which all belong
   to the variables chapitre. No probability-space or conditioning question
   appears. The exercise also gains `equations-differentielles`. Its pages
   cover part D, the Sturm–Liouville problem y″ + λy + h = 0 with boundary
   conditions, and that part had no ODE tag. The label now names the Sturm–Liouville problem.
3. `cnc-maths1-2021-p2` gains `series-numeriques-complements`. Q3 is
   Σ(−1)ⁿ/nˣ, with pointwise convergence from the alternating criterion. The
   convergence is not uniform on ]0,+∞[ (Q3b). Q3c gets uniform convergence
   of the derivative series on [a,+∞[ from the bound on the remainder. Q5c sums Σ(−1)ⁿ/n and Σ(−1)ⁿ⁻¹ln n/n. It does not gain
   `series-numeriques`. The Q2 series–integral comparison bounds each
   term φₙ(x) in order to study the function ζ near 1. It is part of the
   series-of-functions argument, so it is not a separate block that needs
   only the first-year tools. It does not gain `analyse-asymptotique`
   either, since the développement limité in Q5 is only
   a tool.

Counts: `calcul-differentiel` +1, `fonctions-convexes` −1,
`variables-aleatoires-discretes` +1, `equations-differentielles` +1,
`series-numeriques-complements` 11→12.
