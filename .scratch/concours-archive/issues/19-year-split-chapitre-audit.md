# 19: Tag year-split topics with the chapitre each exercise really uses

**What to build:** Some topics are taught in both years, so the program has one
chapitre for each year. For every exercise tagged with one of these chapitres,
read its pages and keep the chapitre it really uses. A student filtering on a
2ème-année chapitre should find its exercises there, not under the first-year
chapitre.

**Blocked by:** none

**Status:** open

## Context

A grilling session on 2026-09-22 settled that the canonical program is the
reformed one as myprepa.tn publishes it (ADR 0002, amended). In that program, a
topic taught in both years is several chapitres (`CONTEXT.md`, "Chapitre").
The tag counts suggest curators reached for the first-year chapitre by
default:

| 1ère année | tagged | 2ème année | tagged |
|---|---|---|---|
| `series-numeriques` | 42 | `series-numeriques-complements` | 1 |
| `structures-algebriques-y1` | 0 | `structures-algebriques-y2` | 6 |
| `prehilbertiens-y1` | 7 | `prehilbertiens-euclidiens-y2` | 33 |
| `integration` (now "Intégration sur un segment") | 15 | `integration-intervalle-quelconque` | 28 |

`integrales-parametre` (17) also belongs to the integration group.

Reported case: a student wants exercises on integration on a segment only.
Today `integration` may hold integrals over ]0, +∞[, for example Knopp's
inequality (`centrale-maths1-2024-p1`) or ζ(1) (`mines-ponts-maths2-2023-i`),
and those would pollute the filter.

## To do

- For every exercise carrying a chapitre from one of the four pairs, read its
  pages and decide which year's chapitre(s) it really uses. Where it uses
  both, it keeps both.
- Settle each chapitre's boundary before tagging and write it in the comments
  below: what makes a series exercise a 2ème-année "complément" (series–integral
  comparison, Abel/alternating refinements, summation by packets, …), and
  what separates Y1 from Y2 préhilbertien and structures algébriques.
  Use myprepa.tn's chapter contents as the reference.
- Keep `primaryChapterId` among the tags. Change it when the main subject
  moves to the other year's chapitre.
- About 130 exercises are in scope. If that is too much for one pass, split it
  by pair and record where the split falls.

## Acceptance

- [ ] Every exercise in scope has been read and its tags confirmed or moved.
- [ ] The boundary chosen for each pair is recorded below.
- [ ] `npm run verify` passes.
