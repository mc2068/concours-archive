# 17: Curation fixes found by the page audit

**What to build:** Settle the archive problems that ticket 16's page audit
turned up but couldn't fix by moving a page. Each one needs the curator to
read the paper and decide.

**Blocked by:** none

**Status:** open

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

- [ ] Each item is fixed in `archive.json` (or its PDF replaced), or it is
      recorded below as a deliberate choice.
- [ ] `npm run verify` passes.
