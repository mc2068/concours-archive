# 04: Open an exercise at its exact page

**What to build:** Clicking a result opens its parent paper's PDF in a new tab, anchored to the exercise's start page, so the student lands on the exercise instead of scrolling a 4-hour paper. No PDF segmentation and no in-site viewer (ADR 0001).

**Blocked by:** 02.

**Status:** ready-for-agent

- [ ] Each result has an "Ouvrir" action linking to `<pdfPath>#page=<pageStart>`, opening in a new tab.
- [ ] At least one real sample concours PDF is bundled as a static asset and served by the built site.
- [ ] The page anchor lands the browser's PDF viewer on the exercise's page for the sample.
- [ ] Missing/invalid `pdfPath` degrades gracefully (no broken action).
