# 02: Walking skeleton — pick a chapitre, see matching exercises

**What to build:** The tracer bullet through every layer. A student opens the site, picks a **chapitre** from a list, and sees every **exercise** tagged with it, each row showing the exercise label and its parent **concours** paper (exam · year · country). Runs on a small seed dataset; the core filtering logic is the tested seam.

**Blocked by:** 01.

**Status:** done (commits c6fd2f4, e420606)

- [x] A seed dataset exists with the shapes from the spec: Chapitre `{id, name, order}`, Concours paper `{id, examBrand, year, country, subject, pdfPath}`, Exercise `{id, paperId, label, pageStart, pageEnd, chapterIds[], primaryChapterId}` — 5 chapitres, 4 papers, 8 exercises (`src/data/dataset.json`). Chapitre also carries `domain` for sidebar grouping.
- [x] A pure `filterExercises(dataset, criteria)` returns exercises whose `chapterIds` include the selected chapitre (the "touches at all" rule), ordered year-desc then exam brand then label (`src/lib/filter.ts`).
- [x] `filterExercises` has fixture-driven tests: chapter-only match, a multi-chapter exercise appearing under each of its chapters, no-criteria returns everything, deterministic order, empty result, no mutation (`src/lib/filter.test.ts`, 7 tests).
- [x] A French page lists chapitres grouped by domain; selecting one shows the matching exercises with label + `flag · brand · year` (`src/pages/index.astro`).
- [x] No chapter selected shows all exercises ("Tous les chapitres").
