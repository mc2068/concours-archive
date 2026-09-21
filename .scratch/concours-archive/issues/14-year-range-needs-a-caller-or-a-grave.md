# 14: Give `YearRange` a caller, or a grave

**What to build:** Either a year-range control in the refinement filters, or a
decision to drop `YearRange` — but not the present state, where the type claims
a capability the UI has never offered.

**Blocked by:** None. Touches the same files as ticket 12; do it after, not
during.

**Status:** done: dropped (commit 180fe15 in PR #13, review fixes f231754 in PR #14)

## Context

`YearRange` (`types.ts`) and the range branch of `yearMatches`
(`filter.ts:5–10`) are fully implemented and covered by three tests
(`filter.test.ts:98,102,103`). They have **zero callers**: `index.astro:224`
only ever sets `criteria.year = Number(yearSel.value)`, a single year.

Spec **user story 8** says: "As a student, I want to further filter by year (or
a year range), so that I can prefer recent papers." So this is not dead code —
it is an unbuilt story whose engine already shipped.

Raised during the ticket 12 grilling and deliberately left alone there: deleting
it inside a refactor would quietly drop a spec'd capability, and wiring it would
be a feature inside a ticket whose acceptance is "behaviour unchanged".

## Open questions

1. What is the control? One select ("Depuis 2019"), two selects (from / to), or
   presets ("5 dernières années")? The sidebar is narrow (`md:w-72`) and the
   design system has no slider.
2. Does a range replace the single-year select, or sit beside it? Two ways to
   express one axis is a worse UI than either alone.
3. Is the demand real? 88 papers across a handful of years (wrong: 13 years, see Comments) — a
   range may be solving a problem the archive is too small to have yet. **Dropping
   `YearRange`, its branch, its three tests and story 8 is a legitimate answer**,
   and the cheapest one to reverse if the archive grows.

## Acceptance

- [x] Either the range is reachable from the UI and `YearRange` has a caller, or
      `YearRange`, its `yearMatches` branch and its three tests are gone and
      spec story 8 is struck. (Story 8 was rewritten to a single year rather
      than struck, because that half of it shipped. See Comments.)
- [x] No third state: the type does not outlive the decision.

## Comments

**Grilled 2026-09-21 — decision: drop.**

- **The fact behind question 3 was wrong.** The archive is 88 papers across
  **13 years (2014–2026)**, not "a handful": 2–4 a year for 2014–2018, 7–10 a
  year since 2019. A range was plausible on size alone, so size is not why it
  went.
- **Why drop anyway.** Story 8's goal was "prefer recent papers", and results
  are already ordered newest first, so the order serves that goal without a
  control. The single-year select does a job a range would lose: year + brand
  isolates one paper (up to Maths 1 / Maths 2), which is how a student sits a
  full past paper. A "Depuis" select would trade that away, and a range beside
  the select would give one axis two controls in a `md:w-72` sidebar.
- **What changed.**
  - `YearRange` and the range branch of `yearMatches` are gone. The year test
    is inline: `paper.year !== year`.
  - Two range tests are removed (the three assertions this ticket named). The
    single-year test stays.
  - `FilterCriteria` is folded into `Selection`, because once `year` became a
    `number` the two had the same shape. `Selection` keeps the name, since it
    is the glossary's term. `filterExercises` and `escapeHatch` now take a
    `Selection`.
  - Spec story 8 is rewritten to the single year that shipped, not struck,
    because that half of it is built. The engine line (spec §filter engine) is
    fixed too.
  - `CONTEXT.md` *Refinement* now says "a single year, not a range", so the
    next reader finds the answer where they would look.
  - The PRD already said "single year only" and is unchanged.
- **No ADR.** It is a real trade-off, but git restores about 10 lines, so it
  fails the hard-to-reverse test.
