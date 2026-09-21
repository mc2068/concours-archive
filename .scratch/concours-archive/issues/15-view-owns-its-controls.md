# 15: The archive view owns its controls, and joins exercises to papers once

**What to build:** Move "what can be chosen" (the chapitre groups and the
refinement options) out of `index.astro`'s frontmatter and into the archive
view. Also finish ticket 12's "the exercise→paper join happens once, inside",
which the code never actually did.

**Blocked by:** none

**Status:** done (commit 99dcaf6)

## Context

From the architecture review of 2026-09-21 (candidates A and B).

- **A.** `index.astro:7–20` sorted the chapitres, grouped them by domain and
  derived the country, brand and year options. That was domain logic with no
  test, because the harness has no DOM and none is wanted (ticket 12). Also,
  `refine` cast any incoming string to `Country` without checking it.
- **B.** `paperById` was built in three places: `archive-view`, `filter`, and
  `filter` again through `escapeHatch`. `archive-view` said in a comment that
  it relied on `filterExercises` for half of the missing-paper rule. That's the
  split policy ticket 12 set out to remove.

## Decision

- `ArchiveView.controls()` returns `{ chapitreGroups, refinements }`, built once
  from the Archive. The page renders it at build time, and its frontmatter
  derives nothing. `COUNTRY_NAMES` moves next to `FLAGS` in `format.ts`.
- `refine` treats any value the controls don't offer as no constraint, and
  `''` is just one such value. This replaces the unchecked `as Country` and
  the `Number('')` special case.
- `placeExercises(archive)` in `filter.ts` joins each exercise to its paper,
  once. `filterExercises` and `escapeHatch` take the placed exercises. The
  orphan rule is written down once, on `PlacedExercise`: a `null` paper
  matches no refinement, because every refinement compares a fact about the
  paper. The filter's `needsPaper` special case is gone.
- Ticket 12's other decisions stand. `filter`, `escape-hatch`, `format` and
  `pdf` stay public neighbours with their own tests, and the page still maps
  the escape hatch's `kind` to a command.

Nothing changes for a student. The built `index.html` is byte-for-byte the same
before and after, apart from the client script's content hash.

## Not done

The options are still archive-wide, not narrowed to the current selection, so
a chapitre plus a refinement can still come up empty. Ticket 13's escape hatch
still handles that case. Narrowing the options to the selection would now be a
change inside `controls()` alone, but it changes what a student sees, so it
needs its own ticket.
