# 0001 — Store papers whole; model exercises as pointers, not cut-up files

- Status: Accepted
- Date: 2026-09-18

## Context

The site's unit of value is the **exercise**: a student filters by chapter and
gets exercises. But exercises live inside multi-exercise concours **papers** (a
4-hour épreuve spanning several chapters). We had to decide how an exercise is
physically stored.

Cutting each exercise out of its source PDF into its own file gives the cleanest
per-exercise view, but it is heavy, error-prone manual work for a solo curator —
and that work stands between the project and ever launching.

## Decision

Store each **paper's PDF once**. Model an exercise as a **record that points into
its paper**: `{ parent paper, page/position range, chapter tags, primary chapter,
country, year, exam }`. Filtering returns these records; "Ouvrir" opens the
paper's PDF in a new tab anchored to the exercise's page (`paper.pdf#page=N`).

No PDF is ever segmented in v1.

## Consequences

- **Good:** The entire chapter-filtering feature works without cutting a single
  PDF. Populating the archive is data entry, not desktop publishing.
- **Good:** One canonical file per paper — no drift between a paper and clips of
  it.
- **Bad / accepted:** The student sees the whole paper opened at the right page,
  not the exercise in isolation. Acceptable; the page anchor gets them there.
- **Reversible-ish:** Adding cropped per-exercise images later (option c) is a
  pure enhancement on top of the same records — the page range already tells us
  where to crop.

## Alternatives considered

- **Segment every exercise into its own file** — best view, rejected as too much
  manual work to launch.
- **Hybrid: pointers now, crop popular ones later** — still on the table as a
  future enhancement; the pointer model is a strict prerequisite for it anyway.
