# 0002 — Tunisian MP program is the canonical chapter taxonomy; unmappable foreign topics are excluded

- Status: Accepted
- Date: 2026-09-18

## Context

The archive aggregates concours from three countries (France, Tunisia, Morocco)
whose MP programs do **not** share the same chapter breakdown. The headline
feature is "filter by chapter", so there must be **one** chapter vocabulary a
student filters by — otherwise the same topic appears under three different names
and the filter fractures.

The audience is **Tunisian 2ème prépa MP students**, who think and are examined in
*their* program's chapters.

## Decision

The **Tunisian 2ème prépa MP program** is the single canonical chapter list. Every
exercise from any country is tagged with **Tunisian** chapter names, mapped by the
curator. A foreign exercise whose topic has **no Tunisian equivalent is excluded**
from the archive in v1 (not tagged to a "nearest" chapter, not kept in a separate
bucket).

## Consequences

- **Good:** One clean vocabulary; the filter always means the same thing to the
  student it's built for.
- **Good:** No confusing "hors-programme" material a Tunisian student can't be
  tested on.
- **Bad / accepted:** Some genuinely useful foreign exercises are dropped because
  they straddle a non-Tunisian topic. Content loss is deliberate.
- **Cost of reversal:** Meaningful. Re-including excluded material later means
  revisiting papers already processed, and introducing a "nearest chapter" or a
  "hors-programme" bucket changes the tagging rules. Hence this record.

## Alternatives considered

- **Nearest-chapter tagging** — keeps more content but silently mis-files
  exercises under a chapter they aren't really about, polluting the filter.
- **Separate "hors-programme tunisien" bucket** — loses nothing, but adds UI and
  curation surface for material the core audience won't use. Reconsider if
  students ask for it.
- **Three separate program taxonomies with a country switch** — rejected: it
  splits the archive and defeats cross-country filtering, the whole point.

## Amendment — 2026-09-22: which Tunisian program

"The Tunisian program" was not specific enough. Two versions circulate. The
**pre-reform** list is still on institute pages such as IPEIT's and is passed
between students. It has Séries de Fourier, formes quadratiques, espaces
hermitiens and multiple integrals, but no probability. The **reformed** program
is close to the French MPSI→MP program and includes probability. myprepa.tn
publishes it chapter by chapter, citing the ministry's `programme 2mp.pdf`.

The canonical list is the **reformed** program, with **myprepa.tn** as the
reference for its chapitres. The current concours tests it: `tn-maths1-2025`
opens with an exercise on discrete random variables, which the old list has no
place for. Topics found only in the pre-reform list have no Tunisian
equivalent under this ADR.

Switching versions would mean re-tagging the whole archive, which is why this
is recorded. `CONTEXT.md` ("Chapitre") says the same in glossary terms. It also
records that a topic split across the two years, such as integration or
séries numériques, is several chapitres, and an exercise takes the one it
really uses.

## Amendment — 2026-09-28: pre-reform Tunisian papers

The archive now takes in Tunisian concours papers back to 2000. The ones set
before the reform, up to about 2016, were written for the pre-reform
program. The decision above covers their pre-reform topics: they have no
Tunisian equivalent. It did not say how much of such a paper that removes.

Each **exercise** is judged on its own, not the paper as a whole. An exercise
is kept when a student of the reformed program can answer it, and it is tagged
with the chapitre it really uses. Results stated earlier in the paper count as
given; the papers themselves say "tout résultat énoncé peut être utilisé". It
is excluded only when answering needs a pre-reform notion: Fourier's theorems,
hermitian products, the signature of a quadratic form, multiple integrals. A
problem can therefore lose its first partie and keep the rest. A paper with
nothing left is not added at all.

We chose this over dropping every pre-reform paper, or keeping only the
papers where nothing needs excluding. Twenty years of Tunisian exercises on
réduction, séries and intégrales are exactly what the audience trains on. The
cost is judgement per exercise, and a reader may wonder why a 2012 Fourier
problem is half in the archive. Changing the rule later means re-reading about
47 papers, which is why it is recorded. `CONTEXT.md` ("Mapping") says the same
in glossary terms.
