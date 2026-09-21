# 13: The empty state can dead-end twice

**What to build:** When a chapitre *and* refinements are both active and nothing
matches, give the student a way out that works in one click instead of two.

**Blocked by:** ~~12~~ — landed ahead of 12 instead; see Decision.

**Status:** done (commit pending)

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

## Decision

Settled 2026-09-21.

**The trigger is static data, not the refinements.** Clearing the refinements
leads to a second empty page only when the chapitre has **no exercises
anywhere in the archive**. If it has any, the chapitre-only view is never empty.
Today that is 8 of 37 chapitres, each dead-ending under all 335 refinement
combinations: 2,680 of the page's 12,768 selections.

1. **One button that looks ahead** (question 1). The empty state offers the
   smallest widening that actually lands on results:
   - refinements active and the chapitre alone has exercises → "Réinitialiser
     les filtres" (keeps the chapitre — `CONTEXT.md`, "Refinement", unchanged);
   - otherwise → "Voir tous les exercices", which now clears the chapitre *and*
     the refinements in one click;
   - empty archive → no button.
2. **Moot** (question 2). Still one `btn--secondary`; `design.md` is untouched.
3. **Not upstream** (question 3). Marking or disabling the empty chapitres in
   the sidebar is a separate call: it's a design-system change, and it wouldn't
   remove the need for a correct empty state. Rejected alternative: two buttons.
   On an empty chapitre, "Réinitialiser" would still lead to a dead end; it just
   wouldn't be the only option.

**Why not wait for 12.** The choice lives in `src/lib/escape-hatch.ts` —
`escapeHatch(archive, criteria)` returns `{ label, kind } | null`, exactly the
`escape` field of ticket 12's view model. The script only maps `kind` to a
command. `archive-view` calls it instead of re-deriving the choice, so 12 has
nothing to undo.

## Acceptance

- [x] A student who has narrowed to nothing can reach a page with results in one
      click, whatever combination got them there.
- [x] The choice of hatch is exercised by tests crossing `escapeHatch`'s
      interface (not `archive-view`'s — that doesn't exist yet), including the
      chapitre-with-zero-exercises case and an exhaustive "one click lands on
      results from every empty combination" sweep over the fixture.
- [x] `astro check` clean, all tests pass, verified at desktop and 375px.

## Comments

**2026-09-21 — built.** Proved with a characterization sweep of the live page
over all 12,768 chapitre × pays × concours × année selections. For each empty
result it clicked the escape button and recorded where it landed. Before: 2,680
clicks landed on a second empty page. After: 0. Exactly those 2,680 selections
changed, and only in the button (label, plus where it lands). The other 10,088
are byte-identical, rows included. Client bundle 77,725 → 77,926 bytes.
