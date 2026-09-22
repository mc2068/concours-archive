# 17: Curation fixes found by the page audit

**What to build:** Settle the archive problems that ticket 16's page audit
turned up but couldn't fix by moving a page. Each one needs the curator to
read the paper and decide.

**Blocked by:** none

**Status:** done

## Context

Ticket 16 checked every exercise's `pageStart` against its paper. On the way
it found things that are wrong in the archive and that a page number can't
fix. Some of them can affect what the chapitre filter returns.

## Items

1. **`cnc-maths2-2017.pdf` looks like a second copy of Maths I.** Both CNC 2017
   files have the PDF title "CNC Maths I MP 2017" and the same page-2 header,
   though the files differ. If it is Maths I, the real Maths 2 paper is
   missing and `cnc-maths2-2017-*` points at Maths I content. Finding the
   real Maths 2 is a `/research` job, starting from
   `research/concours-paper-sources.md`.
2. **Labels that don't match the pages**, and possibly the chapter tags with
   them:
   - `cnc-maths2-2019-p` says "Endomorphismes d'un espace euclidien"; the
     Problème is "Déterminants de Cauchy et de Gram".
   - `cnc-maths2-2018-p` says "Famille de vecteurs d'un espace euclidien";
     the Problème is about endomorphisms where (x, f(x), …) is bound
     (Aupetit).
   - `centrale-maths1-2026-i` says "Matrices symétriques positives…"; its
     Partie A is "Sous-groupes finis de On(R)".
3. **`tn-maths2-2024` ranges and labels** (found in ticket 16's review):
   - `-i` is 1–1, but Partie I (Q1–Q8) is entirely on page 2, so `pageEnd`
     should be 2.
   - `-ii` ends on 2, but Partie II runs to Q19 on page 3.
   - The `-ii` and `-iii` labels don't match their pages' content.
4. **Partie III of `tn-maths1-2026`** (pages 18–23, a normed space of
   functions and the distance to 𝓛) now falls inside `-i`'s range, but none of
   `-i`'s tags covers it. Tag it on `-i`, or make it its own exercise.

## Acceptance

- [x] Each item is fixed in `archive.json` (or its PDF replaced), or it is
      recorded below as a deliberate choice.
- [x] `npm run verify` passes.

## Comments

**2026-09-22 — done.** Each fix below came from reading the paper. The chapter
tags are a curator's judgement, so they are worth checking in review.

1. **CNC 2017 Maths 2: removed.** `cnc-maths2-2017.pdf` has the same text as
   Maths I, apart from indentation. The mistake is at the source: the
   groupe-reussite file `cnc-maths2-mp-2017.pdf`, which mathencpge.ma also
   links to, is 1,072,104 bytes, exactly the bundled file, and it is Maths I.
   The paper, its two exercises and the PDF are gone. They showed the Maths I
   exercises a second time under "Maths 2", one of them under a made-up
   label. The archive is now 87 papers and 203 exercises. Sourcing the real
   paper is ticket 18.
2. **Labels corrected, with tags to match:**
   - `cnc-maths2-2019-p` is now "Déterminants de Cauchy et de Gram, distance à
     un sous-espace". Tags: euclidiens, determinants and polynomes-fractions;
     it drops reduction and matrices, which the Problème doesn't use.
   - `cnc-maths2-2018` had its two labels swapped. The unit-vector family in a
     Euclidean space is the **Exercice**, together with a real symmetric
     matrix, and it is now tagged euclidiens. The Problème is Aupetit's
     theorem on endomorphisms where (x, f(x), …) is bound: reduction,
     polynomes-fractions, espaces-vectoriels. It is no longer tagged
     euclidien.
   - `centrale-maths1-2026-i` is now "Sous-groupes finis de Oₙ(R) et
     sous-groupes compacts de GLₙ(R)", with primary structures-algebriques.
     Fonctions-convexes and topologie-evn are added for B.II (the
     log-concavity of det) and for compactness.
   - `-ii` was labelled "Convexité et déterminants…", which is really Partie
     B.II. Its actual Partie C is the growth of the discrete Heisenberg group:
     groups, denombrement, analyse-asymptotique.
3. **`tn-maths2-2024`:** all three labels described other parts.
   - I (Q1–8) is the trace étoilée in a Euclidean space, pages 1–2.
   - II (Q9–19) bounds ‖N‖² below by the eigenvalues of N: reduction, pages
     2–3.
   - III (Q20+) covers the matrix exponential, a C^∞ function and extrema on
     the unit sphere, pages 3–5, with primary calcul-differentiel.
4. **`tn-maths1-2026-i`** now names Partie III in its label and is tagged
   topologie-evn.
