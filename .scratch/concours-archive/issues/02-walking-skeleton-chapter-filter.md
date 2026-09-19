# 02: Walking skeleton — pick a chapitre, see matching exercises

**What to build:** The tracer bullet through every layer. A student opens the site, picks a **chapitre** from a list, and sees every **exercise** tagged with it, each row showing the exercise label and its parent **concours** paper (exam · year · country). Runs on a small seed dataset; the core filtering logic is the tested seam.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] A seed dataset exists with the shapes from the spec: Chapitre `{id, name, order}`, Concours paper `{id, examBrand, year, country, subject, pdfPath}`, Exercise `{id, paperId, label, pageStart, pageEnd, chapterIds[], primaryChapterId}` — a few chapitres, 1–2 papers, several exercises.
- [ ] A pure `filterExercises(dataset, criteria)` returns exercises whose `chapterIds` include the selected chapitre (the "touches at all" rule), in the spec's deterministic order.
- [ ] `filterExercises` has fixture-driven tests: chapter-only match, a multi-chapter exercise appearing under each of its chapters, and no-criteria returns everything.
- [ ] A French page lists chapitres; selecting one shows the matching exercises with label + parent paper (exam · year · country).
- [ ] No chapter selected shows all exercises (or a clear prompt to choose).
