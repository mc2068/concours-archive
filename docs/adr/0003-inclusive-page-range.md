# 0003 — An exercise's page range is inclusive at both ends

- Status: Accepted
- Date: 2026-09-21

## Context

ADR 0001 stores each paper's PDF whole and models an exercise as a pointer into
it: `{ pageStart, pageEnd }`. `pageStart` has never been ambiguous — it is the
anchor `paper.pdf#page=N` the "Ouvrir" button uses, so it is unmistakably the
first page the exercise appears on.

`pageEnd` was never pinned down, and nothing in the running site reads it, so
the ambiguity cost nothing and went unnoticed. Adding a check of the anchors
against the papers' real page counts exposed it: **55 of 205 exercises had a
`pageEnd` one past the last page of their PDF**. Every one of them was exactly
`pageCount + 1`, and every one was the **last** exercise of its paper, spread
across all four exam brands. The other 33 papers ended exactly *on* the last
page.

So the archive was carrying both conventions at once — exclusive where the
curator thought "and it runs to the end", inclusive everywhere else — and no
rule to say which was right.

It stops being free the moment ADR 0001's noted future enhancement arrives:
cropping an exercise out of its paper reads exactly this field, and a range that
is inclusive for two thirds of the archive and exclusive for the rest would crop
a blank page one time in three.

## Decision

The page range is **inclusive at both ends**. A one-page exercise has
`pageStart === pageEnd`. The last exercise of a paper ends on the paper's final
page.

The 55 records that had recorded an exclusive end were corrected to the paper's
page count, and the rule `anchor-past-end` now fails the build for any exercise
whose `pageEnd` exceeds its PDF's page count.

## Consequences

- **Good:** One record no longer mixes an inclusive start with an exclusive end.
- **Good:** The anchors are now verified against the real PDFs rather than
  assumed, so the pointer model ADR 0001 rests on is checkable.
- **Good:** A future crop feature can read `pageStart..pageEnd` directly.
- **Bad / accepted:** 55 records were rewritten mechanically on the assumption
  that an exercise recorded as ending at `pageCount + 1` really did run to the
  paper's last page. The uniformity of the pattern — every case exactly +1,
  every case the last exercise of its paper, none worse — is what justifies it,
  but they were not each re-read against the paper.
- **Cost of reversal:** Low for the convention, meaningful for the data. Any
  future flip would have to rewrite the same 55 records back.

## Alternatives considered

- **Exclusive end** ("the first page after the exercise") — would have made the
  55 right and the other 33 wrong, and left `pageStart` inclusive and `pageEnd`
  exclusive inside one record, which is the exact trap that produced the split.
- **Leave it undefined and check nothing.** It has been free so far only because
  the field is unread; that ends with the first crop.

## Amendment — 2026-09-22: `pageStart` was ambiguous too

The Context above says `pageStart` "has never been ambiguous". That turned out
to be wrong. Ticket 16 checked every exercise against its paper and found 28
whose `pageStart` sent "Ouvrir" to the wrong page. Some were a page late,
because Centrale's Partie I begins on page 1 and was treated as if page 1 were
a cover. Others were a page early, on a cover page or on the previous
exercise.

The decision here is unchanged: both ends are inclusive. What was missing was
a definition of where an exercise *starts*. That definition now lives in
`CONTEXT.md` under "Page range". Under it, the first page is not always a page
the exercise "appears on" in the narrow sense: a whole-paper notations page
just before the exercise is an acceptable start.

Unlike `pageEnd`'s `anchor-past-end`, no rule can check this. Where an
exercise starts is only visible by reading the paper.
