# 20: Tag gaps found outside the year-split pairs

**What to build:** Ticket 19's audit read these exercises and found chapitres
missing from them. They were outside ticket 19's scope, which covered only
the four year-split pairs. Read each exercise and fix its tags.

**Blocked by:** none

**Status:** open

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

- [ ] Each item has been read and fixed in `archive.json`, or recorded
      below as a deliberate choice.
- [ ] `npm run verify` passes.
