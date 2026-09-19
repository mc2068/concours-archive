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
