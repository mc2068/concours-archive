# 12: Give the archive view an interface

**What to build:** Pull the page's stateful behaviour — what chapitre is
selected, what the refinements are, what should be on screen — out of the
client `<script>` and behind one module, so the script becomes the adapter that
hands it events and paints its output. Candidate **A** of the architecture
review that produced ticket 11, and its larger prize.

**Blocked by:** None. Ticket 11 landed the Archive seam underneath this.

**Status:** ready to build — grilled 2026-09-21; the decisions below are settled

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

## Decisions

Settled in `/grill-with-docs`. These replace the five open questions this ticket
shipped with. Don't reopen one without a reason the grilling didn't have.

### The module owns the Selection, and flow is one-way

`src/lib/archive-view.ts` exports `createArchiveView(archive)`. It owns the
**Selection** (`CONTEXT.md`) and answers one query, `view()`.

Commands:

- `selectChapitre(id?: string)` — `undefined` means all chapitres
- `refine(patch)` — partial merge over the three refinements
- `clearRefinements()` — drops the refinements, keeps the chapitre
- `setViewport('mobile' | 'desktop')`

Flow is **strictly one-way**: the module holds the state, `view()` says what
every control should show, and the adapter never reads state back out of the
DOM. That is what makes it safe to stop treating the DOM as the state, which is
what it is today (`countrySel.value` *is* the country refinement; `aria-pressed`
*is* the selection) — afterwards there is one source of truth, not two that can
desync.

Rejected: a pure `archiveView(archive, selection)` with the script still holding
the state. It leaves every state transition — which is to say every untested
thing in the Context section above — in the script.

### Strings cross the boundary, `''` means "no constraint"

`refine({ year: sel.value })`, not `refine({ year: Number(sel.value) })`. The
module takes the `<select>` contract verbatim and parses it itself.
`selectChapitre` likewise takes `btn.dataset.chapitreId` (`string | undefined`)
raw.

**`Number('')` is `0`, not `NaN`.** Today `:224` is safe only because of the
`if (yearSel.value)` guard at the call site. Typed inputs would move that guard
into the adapter — the one layer with no tests — so the conversion goes inside
the module, where it can be asserted.

### A fully-resolved view model crosses back

Nothing domain-shaped passes the seam. No `paper.country`, no `ex.chapterIds`,
no `pdfHref` call in the script.

```ts
{
  heading: string;                  // chapitre name, or "Tous les exercices"
  count: string;                    // "205 exercices"
  pressedChapitreId: string | null; // null => "Tous les chapitres" is pressed
  refinements: { country: string; examBrand: string; year: string };
  sheetOpen: boolean;
  results:
    | { kind: 'rows'; rows: Row[] }
    | {
        kind: 'empty';
        escape: { label: string; kind: 'clear-refinements' | 'show-all' } | null;
      };
}
```

`Row` is
`{ id, title, meta: { flag, epreuve, year } | null, chips: { label, primary }[], href: string | null }`.

- `meta` stays an object rather than one flat string because the year is wrapped
  in `<span class="tnum">` (`:254–257`); flattening it would lose the tabular
  numerals.
- The **results union** makes "empty means zero rows" the only representable
  truth.
- The escape hatch carries **both** its French label and its kind, so the
  adapter switches on two cases to pick a command while the *choice* of hatch
  stays tested.
- `refinements` and `pressedChapitreId` come back out because one-way flow
  requires it: without them `clearRefinements()` cannot blank the selects.

This kills `chapitreResetBtn.click()` (`:336`). "Voir tous les exercices" calls
`selectChapitre(undefined)`, `pressedChapitreId` goes `null`, and the adapter's
existing pass repaints `aria-pressed` across all 37 buttons — now as a node
assertion. *(Amended by ticket 13, see Comments: `show-all` must now also
clear the refinements, and the choice of hatch comes from `escapeHatch`.)*

Rejected: DOM-shaped instructions (`[{ op: 'setText', target: 'heading', … }]`).
They make the script an interpreter, with no type safety and an opcode stream to
test instead of behaviour.

### The mobile sheet is inside

`setViewport` is fed by a `matchMedia` **change** listener — there is none
today; `:353` reads `.matches` at click time. The module learns `'mobile'`,
never `767`; the literal stays in the adapter's `matchMedia` call.

`setViewport` only reports; it never opens or closes the sheet. This is not a
student-visible change: `data-open` already persists across a resize today.

Preserve the asymmetry exactly — selecting a chapitre closes the sheet on
mobile, changing a refinement does not.

### The leaf modules stay public neighbours

`filter.ts`, `format.ts` and `pdf.ts` keep their 24 tests. `format.ts` has a
server-side caller regardless: `index.astro:4` imports `FLAGS` for the country
`<option>` labels at `:128`.

The "nothing tested past the interface" rule is scoped to `archive-view`'s **own
state and private helpers**, not to its neighbours. To close the obvious hole,
`archive-view`'s tests assert row-level `href` and `meta` themselves and never
delegate to `pdf.test.ts` — a module that simply never called `pdfHref` would
otherwise pass every test in the repo.

### No DOM in the test harness

`vitest.config.ts` stays `environment: 'node'`. No `jsdom`, no `happy-dom`. The
page's markup is generated by Astro, so a DOM harness would either duplicate
that markup — a new thing that drifts — or render Astro in tests.

The price, and it is binding: **every line in the `<script>` is either
`addEventListener → command` or `view() → DOM`.** A conditional that is not
painting means the seam is in the wrong place.

### Behaviour is preserved; the impossible-state policy is stated once

Ticket 11's `orphan-exercise` rule (`archive-rules.ts:112–114`) makes a dangling
`paperId` unshippable, so the two missing-paper policies — `filter.ts` dropping
the exercise only when a refinement is active, `row()` rendering it meta-less
and Ouvrir-less — are now defensive code for an impossible state. Collapse them
to **one documented rule inside `archive-view`**. This absorbs candidate **C**:
the exercise→paper join happens once, inside.

Keep the missing-`pdfPath` branch: `pdfPath` is a string the gate cannot prove
is *usable*.

Because strings now cross the boundary, `selectChapitre('bogus')` is
representable through the API even though no button produces it. The
`'Exercices'` heading fallback at `:287` therefore stops being dead code and
becomes a test case.

Nothing student-visible changes. Anything the extraction turns up gets named and
ticketed, not slipped in — see tickets 13 and 14.

### Vocabulary

`Selection` and `Refinement` added to `CONTEXT.md`; `Filter axes` trimmed of
what they now say better. `Selection`'s type lives in `types.ts` (it is glossary
vocabulary); `Row` and the view model live in `archive-view.ts` (they are
presentation).

No ADR. This is reversible and unsurprising, so it fails two of the three tests
in `docs/agents/domain.md`.

### Adjacent cleanup (candidate E), decided per item

- **`src/lib/harness.test.ts` — delete.** It asserts `1 + 1 === 2` and promises
  a seam that shipped in ticket 02.
- **`YearRange` — keep, don't wire.** Spec user story 8 says "filter by year (or
  a year range)", so it is not dead code but an unbuilt story whose engine
  already shipped. Deleting it inside a refactor would quietly drop a spec'd
  capability. Ticket 14.
- **767px declared twice — leave it.** CSS cannot import a TS constant. The only
  alternative is the script reading a CSS custom property, which trades a
  two-line comment for indirection.

## Acceptance

- [ ] The page's behaviour is unchanged for a student: same filtering, same
      ordering, same empty states, same mobile sheet, same URLs on "Ouvrir".
- [ ] **Proved by a characterization diff, not by eye alone.** Before touching
      anything, drive the current page and dump `heading`, `count` and
      `results.innerHTML` for all 37 chapitres plus a handful of stacked and
      zero-result combinations; dump again after; diff. One `innerHTML` sweep
      covers ordering, meta, chips and every `#page=` anchor across all 205 rows
      at once. Snapshots live in the scratchpad, never the repo.
- [ ] Selection, refinement and reset semantics are exercised by tests crossing
      `archive-view`'s interface — including both empty-state escape hatches,
      `escape: null` (empty archive), "keep the chapitre, drop the refinements",
      `pressedChapitreId` going `null` after "Voir tous les exercices",
      close-on-selection only when mobile, and an unresolvable chapitre id.
- [ ] No test reaches into `archive-view`'s own state or private helpers, and
      its tests assert row-level `href` and `meta` directly rather than
      delegating to `pdf.test.ts`.
- [ ] The `<script>` holds only `addEventListener → command` and
      `view() → DOM`.
- [ ] `vitest.config.ts` still `environment: 'node'`; no DOM dependency added.
- [ ] `harness.test.ts` deleted; the remaining leaf tests pass unchanged.
- [ ] The client bundle does not grow meaningfully (77,725 bytes at HEAD).
- [ ] `astro check` clean, all tests pass, page verified in the browser at
      desktop and 375px.

## Notes

- `paper.subject` is authored on all 88 papers and read by nothing. Leave it:
  that is the Physique fast-follow, settled in ticket 09.
- Don't reopen ADR 0001 (papers stored whole, exercises as pointers) or ADR 0002
  (Tunisian program as the canonical taxonomy). Neither is in scope.
- The architecture review that produced this was rendered to a temp file, not
  the repo. This ticket is the surviving record of candidate A.

## Comments

**2026-09-21 — grilled.** Two rounds over `/grill-with-docs`. All five open
questions settled, plus five the ticket hadn't asked: where DOM-string parsing
happens, whether the mobile sheet crosses the seam, what becomes of the 24
existing leaf tests, how "behaviour unchanged" is actually proved, and the
glossary gap. Two findings spun off as tickets 13 and 14 rather than absorbed.
`CONTEXT.md` gained `Selection` and `Refinement` in the same pass.

**2026-09-21 — ticket 13 landed first.** Three things this ticket now builds on:

- **The choice of hatch already has a home.** `src/lib/escape-hatch.ts` exports
  `escapeHatch(archive, criteria)`, which returns `{ label, kind } | null`: the
  `escape` field above, verbatim. `archive-view` calls it instead of re-deriving
  the choice. It becomes a public neighbour like `filter.ts`, with its own 7
  tests. `archive-view`'s tests still assert both hatches through its own
  interface.
- **`show-all` now also clears the refinements.** It used to be reachable only
  with no refinements active; now it's also offered when a chapitre with zero
  exercises has refinements on it. So `selectChapitre(undefined)` alone is no
  longer enough for that kind: the adapter must also call `clearRefinements()`,
  or `archive-view` needs one command that does both.
- **Take the characterization baseline after 13, not at 073afb8.** 13 changed
  the empty state for 2,680 selections on purpose. The bundle baseline is now
  77,926 bytes. The `index.astro` line numbers quoted above predate 13 and have
  drifted by a few lines.
