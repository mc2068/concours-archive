# 13: The empty state can dead-end twice

**What to build:** When a chapitre *and* refinements are both active and nothing
matches, give the student a way out that works in one click instead of two.

**Blocked by:** 12 — the escape-hatch choice moves into `archive-view` there,
and this is a change to that choice.

**Status:** open — needs a design call before building

## Context

`index.astro:331–339` picks exactly one escape hatch:

- refinements active → "Réinitialiser les filtres"
- else a chapitre selected → "Voir tous les exercices"
- else → no button at all

So a student with a chapitre *and* refinements only ever sees the first. If that
chapitre has no exercises at all, clearing the refinements lands them on a
*second* empty state, and only then are they offered "Voir tous les exercices".
Two clicks and two dead ends to get back to a page with results on it.

37 chapitres against 205 exercises — a chapitre with zero tagged exercises is
plausible today and near-certain while the archive is still being filled.

Found during the ticket 12 grilling and deliberately **not** fixed there: ticket
12's acceptance is "behaviour unchanged for a student", and a UX change smuggled
into a refactor is a change nobody reviewed.

## Open questions

1. Show both buttons when both apply, or keep one and make it smarter — clear
   the refinements *and* widen to all chapitres in a single action?
2. If both: which is primary? `design.md` gives the empty state one
   `btn--secondary` reset, so two buttons is a design-system question and not
   only a logic one.
3. Is the real fix upstream — mark or disable a chapitre with zero exercises in
   the sidebar, so the student never walks into the dead end? That trades an
   empty-state problem for a sidebar that changes as refinements change, which
   may be worse.

## Acceptance (provisional — settle the above first)

- [ ] A student who has narrowed to nothing can reach a page with results in one
      click, whatever combination got them there.
- [ ] The choice of hatch is exercised by tests crossing `archive-view`'s
      interface, including the chapitre-with-zero-exercises case.
- [ ] `astro check` clean, all tests pass, verified at desktop and 375px.
