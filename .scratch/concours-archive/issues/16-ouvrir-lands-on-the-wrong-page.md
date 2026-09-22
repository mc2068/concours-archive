# 16: "Ouvrir" lands on the wrong page for 28 exercises

**What to build:** Make every exercise's `pageStart` the page its content really
begins on, so "Ouvrir" (`paper.pdf#page=N`) opens at the exercise.

**Blocked by:** none

**Status:** done (commit 573ff97)

## Context

Checked 2026-09-22, on the question "does Ouvrir take a student to the exercise?"

- **The browser side works on PC.** In real desktop Chrome,
  `mines-ponts-maths1-2024.pdf#page=4` opens at page 4 of 6, on Partie III.
  Firefox and Safari (macOS 15.2+) honour `#page=` according to their source
  code. See `research/pdf-page-anchor-on-phones.md`. Phones are a separate,
  known gap.
- **The data side didn't.** Ticket 11's gate checks that `pageEnd` doesn't run
  past the PDF (ADR 0003). Nothing checked that `pageStart` is where the
  exercise is. In real Chrome, `centrale-maths1-2019.pdf#page=2` opened on Q6,
  in the middle of Partie I, whose Q1–Q5 are on page 1.

## How it was checked

All 205 exercises in all 88 papers were checked. For the 79 papers with a text
layer, each page's headings and question numbers came from `pdftotext`. For the
9 scanned papers, and for the text papers whose headings didn't come through,
the pages were rendered and read by eye. Each `pageStart` was compared against
the rule now written under "Page range" in `CONTEXT.md`.

## What was wrong

**21 opened too late, so the student misses the start of the exercise:**

- Centrale, 14 exercises. Partie I (or A) begins on page 1, but the link went
  to page 2. The curator probably treated page 1 as a cover, which is true for
  Mines and CCINP but not for Centrale. The 14 are 2019 m1-i and m2-p,
  2020 m1-i and m2-i, 2021 m2-i, 2022 m2-i, 2023 m1-i and m2-i, 2024 m2-i and
  m2-ii (3 → 2), 2025 m1-i and m1-ii (4 → 3), and 2026 m1-i and m2-i.
- CNC, 6 exercises. Five Problèmes start near the bottom of the previous page
  with their title and "Notations": 2023 m1, 2023 m2, 2024 m2, 2019 m2, and
  2018 m2 (3 → 2). The sixth is 2015 m2 p2 (4 → 3), where its 2ème Partie
  begins on page 3.
- CCINP 2020 m1 p2 (5 → 4): PARTIE III is on page 4.

**7 opened too early, on a cover page or on another exercise:**

- Cover page: mines-ponts 2026 m1-i and m2-i, ccinp 2025 m1-e1, and ccinp 2020
  m1-p1, all 1 → 2.
- cnc-maths2-2022-p (1 → 2): page 1 is the exercise, which isn't in the
  archive. The Problème starts on page 2.
- mines-ponts-maths2-2021-ii (4 → 5): page 4 is still the previous exercise's
  questions. Its `-i` sibling's `pageEnd` moves 4 → 5, because Q11 is on page 5.
- tn-maths1-2026-ii (16 → 23): the random-variables part (Partie IV) starts on
  page 23 of the answer booklet. Page 16 is still Partie II. The `-i` sibling's
  `pageEnd` moves 16 → 23.

That makes 30 field edits in `archive.json`. The gate passes and all 79 tests
pass.

## Found, not fixed

Moved to ticket 17. They need the curator, not a page fix.

## Comments

**2026-09-22 — review (`/code-review` against `origin/main`).**

- **Standards:** no hard violations. ADR 0003's Context claimed `pageStart`
  "has never been ambiguous", which this ticket disproves. It now has a dated
  amendment that points to the rule in `CONTEXT.md`, rather than a rewrite.
  The `CONTEXT.md` entry was tightened: the rationale sentence came out, and
  "the first and last page it appears on" became "a first and a last page",
  so it no longer clashes with the notations-page allowance.
- **Spec:** the 30 edits match exactly. The reviewer independently re-checked
  14 of them (by text and by image) and 8 exercises that were left alone.
- **`cnc-maths1-2020-p` stays on page 2.** Only the Problème's bare title sits
  at the foot of page 1. Page 1 would open on Exercice 1, so the rule now says
  a bare heading doesn't count.
- The reviewer also found that `tn-maths2-2024`'s ranges are wrong, a problem
  from before this branch. It went to ticket 17.
