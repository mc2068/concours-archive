# Spec: Concours archive with chapter filtering

Status: ready-for-agent

## Problem Statement

A Tunisian 2ème prépa MP (Maths) student revising a specific topic has no single
place to find past-concours practice on *that topic*. The concours they care
about are scattered across three countries (France, Tunisia, Morocco), each
program organised differently, and each paper mixes several chapters over four
hours. To drill "séries numériques", the student today must know which papers
touch it, open each 4-hour PDF, and hunt for the relevant exercise. There is no
way to say "show me every exercise on this chapter."

## Solution

A free, public, French-language website that is a **filterable archive** of
concours **exercises**. The student picks a **chapitre** from the Tunisian MP
program and immediately sees every **exercise** — from any of the three countries
— tagged with that chapter, each labelled with its parent **concours** paper
(exam · year · country). Optional stackable filters (country, exam brand, year)
narrow the list further. Opening an exercise opens its parent paper's PDF at the
right page.

The exercise, not the whole paper, is the unit the student browses; the chapter
filter is the front door.

## User Stories

1. As a 2ème prépa MP student, I want to pick a chapitre from a list of Tunisian
   MP Maths chapters, so that I can revise one topic at a time.
2. As a student, I want to see every exercise tagged with the chosen chapitre, so
   that I get all available practice on that topic in one place.
3. As a student, I want each result to show which concours paper it came from
   (exam brand, year, country), so that I know the source and difficulty context.
4. As a student, I want exercises from France, Tunisia, and Morocco to appear
   together under the same chapitre, so that I am not limited to one country's
   papers.
5. As a student, I want the foreign exercises expressed in *my* program's chapter
   names, so that I don't have to learn three different program vocabularies.
6. As a student, I want to further filter the results by country, so that I can
   focus on (say) only Tunisian concours if I choose.
7. As a student, I want to further filter by exam brand (Centrale, Mines, X-ENS,
   CNC, Concours tunisien…), so that I can target a specific exam I'm preparing.
8. As a student, I want to further filter by year (a single year), so that I
   can work a given year's papers. (A year range was dropped in ticket 14:
   results are already newest first.)
9. As a student, I want to stack these filters together (chapitre AND country AND
   exam AND year), so that I can precisely target my revision.
10. As a student, I want the extra filters to be optional, so that the simple case
    (just pick a chapitre) stays one click.
11. As a student, I want to open an exercise and land on the exact page of its
    paper, so that I don't scroll a 4-hour PDF to find it.
12. As a student, I want the interface in French, so that it matches the concours
    content and how I talk about these topics.
13. As a student, I want the site to be free and require no account, so that I can
    use it immediately.
14. As a student, I want to see a clear "no results" state when no exercise
    matches my filters, so that I know the archive is empty for that combination
    rather than broken.
15. As a student, I want to see how many exercises match my current filters, so
    that I gauge how much practice is available.
16. As a student, I want to clear or change my filters easily, so that I can move
    between topics quickly.
17. As a student on a phone, I want the archive to be usable on a small screen, so
    that I can revise anywhere.
18. As a student, I want an exercise that spans several chapters to appear under
    each of those chapters, so that I still find it whichever topic I'm revising.
19. As the curator, I want to add a concours paper once and then attach several
    exercises to it, so that I don't duplicate paper metadata per exercise.
20. As the curator, I want to record each exercise as a pointer into its paper
    (page range) rather than cutting up PDFs, so that populating the archive is
    data entry, not desktop publishing.
21. As the curator, I want to tag each exercise with one or more Tunisian
    chapters and mark one as primary, so that filtering works and a future
    "mainly about X" view is possible without re-tagging.
22. As the curator, I want to omit a foreign exercise whose topic has no Tunisian
    equivalent, so that the archive stays relevant to my audience (ADR 0002).
23. As the curator, I want to edit one data file to manage all content, so that I
    don't need an admin UI or database at launch.

## Implementation Decisions

- **Architecture:** static site, no server, no database, no accounts. All
  filtering happens client-side over a dataset loaded in the browser. Built with
  **Astro**; deployed to **Cloudflare Pages** (PDFs bundled as static assets;
  migrate to Cloudflare R2 if the library outgrows Pages limits).

- **Data model (from ADR 0001 — pointer storage):** two related record types in a
  single JSON dataset committed to the repo.
  - **Concours paper:** `{ id, examBrand, year, country, subject, pdfPath }`.
    One record per paper; the PDF is stored once.
  - **Exercise:** `{ id, paperId, label, pageStart, pageEnd, chapterIds[],
    primaryChapterId }`. Points into its paper; carries its chapter tags.
  - **Chapitre:** `{ id, name, order }` — the canonical Tunisian MP Maths chapter
    list (ADR 0002). This list is the taxonomy spine; authoring it is a
    prerequisite content task, tracked separately from this feature.

- **Filter engine (the one seam):** a pure function
  `filterExercises(dataset, selection) -> Exercise[]`. `selection` = an optional
  primary `chapterId` plus optional `country`, `examBrand`, and a single `year`.
  Semantics:
  - An exercise matches a chapter when that chapter is in its `chapterIds` (the
    "touches at all" rule, not "primary only").
  - Multiple axes combine with **AND**.
  - Absent fields don't constrain (no chapter selected ⇒ all chapters).
  - Result ordering is deterministic (e.g. year descending, then paper, then
    exercise label) so the UI and tests agree.

- **Filter UX:** chapitre is a single-select primary control (front door);
  country, exam brand, and year are optional stackable refinements. The UI shows a
  live match count, a "no results" state, and an easy clear/change.

- **Opening an exercise:** link to the parent paper's PDF anchored to the page —
  `<pdfPath>#page=<pageStart>` — opened in a new tab. No embedded viewer, no PDF
  segmentation in v1 (ADR 0001).

- **Scope of taxonomy mapping (ADR 0002):** foreign exercises are tagged with
  Tunisian chapter ids by the curator; an exercise with no valid Tunisian chapter
  is simply absent from the dataset.

- **Language:** French UI strings and chapter names.

## Testing Decisions

- **What a good test is here:** it exercises **external behavior** — "given this
  dataset and these selected filters, these exercises come back, in this order" —
  and never reaches into how filtering is implemented. Tests use small in-memory
  dataset **fixtures**; no DOM, no real PDFs, no network.

- **Module under test:** the filter engine (`filterExercises`) — the single seam.
  It is pure and deterministic, so it is fully testable in isolation and is where
  every correctness-critical rule lives.

- **Cases to cover:**
  - chapter-only filter returns exactly the exercises whose `chapterIds` include
    it (including multi-chapter exercises appearing under each of their chapters);
  - stacked filters combine with AND;
  - an exercise is excluded when any active axis doesn't match;
  - the empty selection `{}` (or none passed) returns everything;
  - a filter combination with no matches returns an empty list (drives the
    "no results" UI state);
  - result ordering is the specified deterministic order.

- **Prior art:** none — this is a greenfield repo. Establish the fixture-driven
  pure-function test as the pattern the codebase follows. Keep DOM/rendering
  concerns out of these tests; if the rendering layer is tested later, it is a
  separate, lower seam.

## Out of Scope

- Solutions / corrections to exercises (planned fast-follow).
- Subjects other than Maths (Physique is next).
- Student accounts, favorites, progress tracking, discussion/forum.
- Student-submitted content or any upload flow.
- An admin UI / CMS; content is hand-edited in the JSON data file.
- Cropped per-exercise images or an in-site PDF viewer.
- A "hors-programme tunisien" bucket or nearest-chapter tagging for unmappable
  foreign topics (excluded per ADR 0002).
- Difficulty ratings as a filter axis.
- Authoring the actual Tunisian MP Maths chapter list — a prerequisite content
  task, not part of building this feature.

## Further Notes

- Depends on ADR 0001 (pointer storage for exercises) and ADR 0002 (Tunisian
  program as canonical taxonomy; unmappable foreign topics excluded). Both are
  currently **Proposed** — this spec assumes they are accepted.
- The `primaryChapterId` is stored but not yet used by the filter (which matches
  on any tag); it exists so a later "mainly about X" view needs no re-tagging.
- Repo is not yet under git; initialising it would put `CONTEXT.md`, the ADRs, and
  this spec under version control.
