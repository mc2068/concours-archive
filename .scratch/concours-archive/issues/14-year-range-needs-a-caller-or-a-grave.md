# 14: Give `YearRange` a caller, or a grave

**What to build:** Either a year-range control in the refinement filters, or a
decision to drop `YearRange` — but not the present state, where the type claims
a capability the UI has never offered.

**Blocked by:** None. Touches the same files as ticket 12; do it after, not
during.

**Status:** open — decide the control first

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
3. Is the demand real? 88 papers across a handful of years — a range may be
   solving a problem the archive is too small to have yet. **Dropping
   `YearRange`, its branch, its three tests and story 8 is a legitimate answer**,
   and the cheapest one to reverse if the archive grows.

## Acceptance (provisional — settle the above first)

- [ ] Either the range is reachable from the UI and `YearRange` has a caller, or
      `YearRange`, its `yearMatches` branch and its three tests are gone and
      spec story 8 is struck.
- [ ] No third state: the type does not outlive the decision.
