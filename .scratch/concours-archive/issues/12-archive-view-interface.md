# 12: Give the archive view an interface

**What to build:** Pull the page's stateful behaviour — what chapitre is
selected, what the refinements are, what should be on screen — out of the
client `<script>` and behind one module, so the script becomes the adapter that
hands it events and paints its output. Candidate **A** of the architecture
review that produced ticket 11, and its larger prize.

**Blocked by:** None. Ticket 11 landed the Archive seam underneath this.

**Status:** done (commit pending)

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

- [x] The page's behaviour is unchanged for a student: same filtering, same
      ordering, same empty states, same mobile sheet, same URLs on "Ouvrir".
- [x] **Proved by a characterization diff, not by eye alone.** Before touching
      anything, drive the current page and dump `heading`, `count` and
      `results.innerHTML` for all 37 chapitres plus a handful of stacked and
      zero-result combinations; dump again after; diff. One `innerHTML` sweep
      covers ordering, meta, chips and every `#page=` anchor across all 205 rows
      at once. Snapshots live in the scratchpad, never the repo.
- [x] Selection, refinement and reset semantics are exercised by tests crossing
      `archive-view`'s interface — including both empty-state escape hatches,
      `escape: null` (empty archive), "keep the chapitre, drop the refinements",
      `pressedChapitreId` going `null` after "Voir tous les exercices",
      close-on-selection only when mobile, and an unresolvable chapitre id.
- [x] No test reaches into `archive-view`'s own state or private helpers, and
      its tests assert row-level `href` and `meta` directly rather than
      delegating to `pdf.test.ts`.
- [x] The `<script>` holds only `addEventListener → command` and
      `view() → DOM`.
- [x] `vitest.config.ts` still `environment: 'node'`; no DOM dependency added.
- [x] `harness.test.ts` deleted; the remaining leaf tests pass unchanged.
- [x] The client bundle does not grow meaningfully (77,725 bytes when this was
      written; 77,926 after ticket 13 — see Comments for the measured result).
- [x] `astro check` clean, all tests pass, page verified in the browser at
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

**2026-09-21 — built.** `src/lib/archive-view.ts` owns the Selection and the
sheet. The `<script>` is now the adapter: `command(() => archiveView.x())` on
every event, and one `paint()` of `view()`. 22 tests cross the interface; the
leaf tests are untouched. `harness.test.ts` is gone (77 tests, all green).

Proof, following the plan above, with the baseline taken on 16acc85 (after 13):

- **Characterization diff: 0 of 12,768 selections changed.** For each chapitre ×
  pays × concours × année it recorded the heading, the count, a 64-bit hash of
  `results.innerHTML`, `aria-pressed`, the select values and `data-open`; for
  every empty result it clicked the escape button and recorded the same again.
  The sweep drives the page only through real `click` / `change` events,
  because the new script never reads state out of the DOM. Snapshots were
  kept in the browser's localStorage, never the repo.
- **Sheet scenario, 12 steps, identical at 1280px and at 375px**: toggle,
  refine, pick a chapitre, both escape hatches. On mobile, picking a chapitre
  or "Voir tous les exercices" closes the sheet; refining or "Réinitialiser"
  does not.
- **Speed: no regression.** Old and new pages timed side by side on identical
  events: 205-row render 5.6 → 5.3 ms, country change 8.7 → 5.7 ms.
- **Bundle 77,926 → 79,089 bytes (+1,163, +1.5%)**, as committed: the module, the row
  objects `view()` builds, and the restored-selects fix. Judged not
  meaningful; flag it if you disagree.

Two commands beyond the four decided above, both forced by the one-way flow:

- `showAll()`: after 13, "show-all" means clear the refinements *and* select
  all chapitres. Folding that into one command keeps the escape switch in the
  adapter at one call per kind, as decided.
- `toggleSheet()`: `sheetOpen` crosses back in the view, so the toggle button
  needs a command. It can't read `data-open` out of the DOM.

One thing for whoever next automates this page: `setViewport` is fed by a
`matchMedia` change listener, as decided. Chrome delivers those events during
a rendering update, so in a **hidden** tab a resize doesn't reach the page until
it's shown again. Students never hit this (a visible tab renders every frame).
But a headless or background test that resizes and then clicks will see desktop
behaviour. Load the page at the target width instead; the startup
`reportViewport()` reads `.matches` synchronously.

**2026-09-21 — reviewed** (`/code-review` against 16acc85, before committing).
No hard violations on either axis. Acted on:

- **Restored selects: fixed, and the old page was wrong too.** A reload or
  back/forward can restore the `<select>`s' values. The first cut of `paint()`
  blanked them, which the sweep couldn't see because every sweep starts from a
  fresh load. Testing the fix showed the restore timing varies: Chrome restores
  *after* the script's startup read. On the old page (served side by side, at
  16acc85) that meant a desync after Back: the selects showed "CNC, 2019" over
  all 205 exercises. The adapter now adopts the selects' values at startup
  *and* on `pageshow`, which fires once restoration is done. After Back it now
  shows the 3 CNC 2019 exercises under "CNC, 2019". Both are events turned
  into commands, so the one-way flow holds. This is the one student-visible
  change in the ticket, and it's a fix: the selects and the results can no
  longer disagree.
- **The missing-paper rule is documented once but enforced in two places.**
  Half of it (a paper-less exercise satisfies no refinement) still runs in
  `filterExercises`, and the paper lookup still happens there as well as in
  `row()`. Moving it would change `filter.ts`, which this ticket keeps as a
  public neighbour with its tests untouched. So `createArchiveView`'s doc now
  says where each half is enforced, and candidate C is only half absorbed.
- `Selection` is derived from `FilterCriteria` (`Omit<…, 'year'>` plus a
  single-year `year`) instead of copying its fields; `Chip` is a named type;
  the adapter's builders are `rowElement` / `chipElement`, so they no longer
  share names with the module's `row()`.

Left as judgement calls: the unchecked `as Country` in `refine` (same cast the
old script had) and `refine`'s three near-identical `if` lines (each parses
differently).
