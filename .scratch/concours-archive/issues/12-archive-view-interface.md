# 12: Give the archive view an interface

**What to build:** Pull the page's stateful behaviour — what chapitre is
selected, what the refinements are, what should be on screen — out of the
client `<script>` and behind one module, so the script becomes the adapter that
hands it events and paints its output. Candidate **A** of the architecture
review that produced ticket 11, and its larger prize.

**Blocked by:** None. Ticket 11 landed the Archive seam underneath this.

**Status:** ready — **grill before building** (see Open questions)

## Context

The tested modules are the leaves; the behaviour is in the page.

- `src/pages/index.astro:171–367` is ~195 lines of real behaviour: criteria
  assembly (`:219–226`), `render` (`:285–299`), row construction (`:235–283`),
  the empty state with its two different escape hatches (`:303–340`), chapitre
  selection and `aria-pressed` bookkeeping (`:342–354`), mobile sheet toggling
  (`:362–364`).
- The pure modules it calls total 105 lines: `filter.ts` 65, `format.ts` 23,
  `pdf.ts` 17.
- The repo has **49 tests across 6 files. None of them import or exercise the
  page.** Every line above is unreachable by any test.

This is the "extracted for testability, bugs live at the call site" shape. Three
tells, all still true at HEAD:

- **`YearRange` has 3 tests and 0 callers.** `index.astro:224` only ever sets
  `criteria.year = Number(yearSel.value)`; the range branch is exercised only at
  `filter.test.ts:98,102,103`.
- **`selectedChapterId` — the primary filter axis, the whole product — is a
  module-scoped mutable** declared at `:198`, written at `:344`, read at `:221`,
  `:288` and `:334`. It has no interface at all.
- **"Voir tous les exercices" works by synthesising a click on another button**
  (`:336`, `chapitreResetBtn.click()`). Nothing verifies that it resets
  `aria-pressed` across all 37 chapitre buttons, or that `clearRefinements`
  (`:205–210`) keeps the chapitre while dropping the refinements.

**Deletion test:** delete the proposed module and the state, the reset
semantics and the `aria-pressed` bookkeeping scatter back across the script.
Complexity concentrates → it earns its keep.

## Open questions (take these into `/grill-with-docs`)

Do not pre-decide these here:

1. Where the seam sits: a module that owns the state and answers "what is on
   screen", vs. one that only computes a view from selections handed in.
2. What crosses it — a view model the script paints, or DOM-shaped instructions.
3. What happens to the three leaf modules: absorbed behind the new interface, or
   left as its internals.
4. Whether the row builder keeps reaching into the data shape directly
   (`paper.country`, `ex.chapterIds` vs `ex.primaryChapterId`, `pdfPath` +
   `pageStart`) — this overlaps candidate **C**, the exercise→paper join done
   twice with two different missing-paper policies.
5. How the tests drive it: the module directly, or the page through a DOM
   harness. There is no DOM test setup in the repo today (`vitest.config.ts`
   sets `environment: 'node'`).

## Acceptance (provisional — settle the above first)

- [ ] The page's behaviour is unchanged for a student: same filtering, same
      ordering, same empty states, same mobile sheet, same URLs on "Ouvrir".
- [ ] Selection, refinement and reset semantics are exercised by tests that
      cross the new module's interface — including the two empty-state escape
      hatches and "keep the chapitre, drop the refinements".
- [ ] No behaviour is tested *past* the interface; if a test wants to reach
      inside, the module is the wrong shape.
- [ ] The client bundle does not grow meaningfully (77,725 bytes at HEAD).
- [ ] `astro check` clean, all tests pass, page verified in the browser at
      desktop and 375px.

## Notes

- **Adjacent cleanup, candidate E** — decide during the grilling whether it
  rides along, since it touches the same files: `YearRange` (wire the year
  refinement to the range it already supports, or drop it),
  `src/lib/harness.test.ts` (still asserting `1 + 1 === 2` and promising a seam
  that shipped in ticket 02), and the 767px breakpoint declared twice
  (`index.astro:196` and `global.css:392`, kept in lockstep by a comment).
- `paper.subject` is authored on all 88 papers and read by nothing. Leave it:
  that is the Physique fast-follow, settled in ticket 09.
- Don't reopen ADR 0001 (papers stored whole, exercises as pointers) or ADR 0002
  (Tunisian program as the canonical taxonomy). Neither is in scope.
- The architecture review that produced this was rendered to a temp file, not
  the repo. This ticket is the surviving record of candidate A.
