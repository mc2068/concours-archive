# 11: Give the Archive a verification gate

**What to build:** Make loading the hand-authored archive a module with rules
behind it, and put those rules in the build path, so a bad edit to the data
cannot deploy. Came out of an architecture review as its top candidate: the
data file is by far the most-touched in the repo, and the one place where a
mistake was silent all the way to production.

**Blocked by:** None.

**Status:** done (commit 3e1317a)

## Context

- `dataset.json` had 21 touches in the last 60 commits, all by hand. The only
  guard was `dataset.integrity.test.ts`, and `npm run build` never ran it —
  Cloudflare builds with `npm run build`, so a bad edit shipped.
- `dataset.ts` asserted `raw as unknown as Dataset`: a seam that named the type
  and checked nothing.
- The existing guard matched PDFs on **file name only**, so a wrong directory
  passed; `domain` and `country` were unvalidated; `order` uniqueness was
  unchecked; and nothing compared a page anchor to the paper it points into.

## Acceptance

- [x] `archive-rules.ts` holds every rule as one pure pass —
      `checkArchive(archive, pageCounts): Violation[]`. Reads nothing, throws
      nothing, returns **all** violations. `formatViolations` groups them by
      rule so one mistake across 55 exercises reads as one heading.
- [x] Two adapters cross that seam: the gate (`npm run verify`, wired into
      `npm run build` ahead of `astro build`) and the fixture tests. The
      filesystem lives in `pdf-page-counts.ts`, never in the rules.
- [x] Page anchors are checked against the **real PDFs**. Node's `zlib` opens
      the compressed object streams that defeat a plain byte scan, so all 88
      papers report a page count — no PDF-parsing dependency.
- [x] 13 rules, each with a fixture test naming it; plus one test that the real
      Archive breaks none, and one that every paper's page count is readable
      (so the anchor rule can never fall silent).
- [x] `dataset.integrity.test.ts` **replaced**, not layered: the rules are
      stated once, in the rules module.
- [x] `Dataset` → `Archive` everywhere — type, module, data file —
      and `Archive` and `page range` added to `CONTEXT.md`.
- [x] `domain` is a closed `Domain` union; the typecheck immediately caught a
      placeholder `'D'` in an unrelated fixture.
- [x] Nothing shipped to the student: the client bundle is byte-identical at
      77,725 bytes. `archive.ts` still casts, and its doc comment now says what
      makes the cast true.
- [x] **Found and fixed a live bug:** 55 of 205 exercises had a `pageEnd` one
      past the last page of their PDF — every case exactly `pageCount + 1`,
      every case the last exercise of its paper. Two conventions in one file.
      Settled as inclusive in ADR 0003 and corrected.
- [x] `astro check` clean, 49 tests pass, build succeeds, page verified in the
      browser: 205 rows, 37 chapitres, 88 papers, anchors correct.

## Notes

- Gate cost: the whole-archive PDF scan is ~240 ms against a ~4.8 s build. A
  committed page-count file was rejected — it would be a second thing that can
  drift from the PDFs, which is the failure class this closes.
- `@types/node` added as a devDependency: the repo now has typechecked
  build-time code that reads the filesystem.
- No validation library. The shape checks are a handful of predicates; the rules
  that matter — cross-references, primary ∈ tags, order uniqueness, page anchors
  — are relational, and a schema library expresses those badly.
- Candidate **A** from the same review (the page's client script has ~196 lines
  of untested stateful behaviour and no interface) is the next one to take.
