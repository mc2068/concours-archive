# 16: "Ouvrir" lands on the wrong page for 28 exercises

**What to build:** Make every exercise's `pageStart` the page its content really
begins on, so "Ouvrir" (`paper.pdf#page=N`) opens at the exercise.

**Blocked by:** none

**Status:** done

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

## Found, not fixed (need the curator)

- **`cnc-maths2-2017.pdf` looks like a second copy of Maths I.** Both files
  carry the PDF title "CNC Maths I MP 2017", and their pages have the same
  structure. If so, the real Maths 2 paper is missing and
  `cnc-maths2-2017-*` points at Maths I content.
- **Labels that don't match the pages:**
  - `cnc-maths2-2019-p` says "Endomorphismes d'un espace euclidien"; the
    Problème is "Déterminants de Cauchy et de Gram".
  - `cnc-maths2-2018-p` says "Famille de vecteurs d'un espace euclidien"; the
    Problème is about endomorphisms where (x, f(x), …) is bound (Aupetit).
  - `centrale-maths1-2026-i` says "Matrices symétriques positives…"; its
    Partie A is "Sous-groupes finis de On(R)".

  If the labels are wrong, the chapter tags may be wrong too, and that
  affects the filter.
- **Partie III of tn-maths1-2026** (pages 18–23, a normed space of functions)
  now falls inside `-i`'s range, but none of `-i`'s tags covers it.
- **No rule enforces this.** The gate can't know where an exercise starts
  without reading the PDF. The rule now lives in `CONTEXT.md`, and this ticket
  records the method.
