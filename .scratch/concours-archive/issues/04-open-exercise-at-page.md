# 04: Open an exercise at its exact page

**What to build:** Clicking a result opens its parent paper's PDF in a new tab, anchored to the exercise's start page, so the student lands on the exercise instead of scrolling a 4-hour paper. No PDF segmentation and no in-site viewer (ADR 0001).

**Blocked by:** 02.

**Status:** done (commit f960a62)

- [x] Each result has an "Ouvrir" action linking to `<pdfPath>#page=<pageStart>`, `target="_blank"` + `rel="noopener noreferrer"` (`src/pages/index.astro`, href built by the tested `pdfHref` seam in `src/lib/pdf.ts`).
- [x] A sample multi-page PDF is bundled for **every** seed paper under `public/papers/` and served (`200`, `application/pdf`, no attachment disposition → renders inline), so no "Ouvrir" is a broken link. Each is sized to cover its exercises' pages; real concours replace these placeholders in ticket 08.
- [x] Each sample is a valid labelled multi-page PDF, so the row's `#page=N` lands the viewer on the exercise's page; verified served + structurally correct, and each anchored page present (the browser pane can't render PDFs to screenshot the jump, but `#page=` is a standard viewer fragment).
- [x] Missing/invalid `pdfPath` degrades gracefully — `pdfHref` returns `null` and the action is omitted (unit tests in `src/lib/pdf.test.ts`: undefined/null/empty/whitespace → no link; non-positive/non-integer page → link without anchor).
