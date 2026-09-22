# Context — Concours archive for 2ème prépa MP (Tunisia)

A glossary for a website that lets Tunisian 2ème année préparatoire (section MP)
students find past competitive-exam material by curriculum chapter, across the
French, Tunisian, and Moroccan systems.

## Glossary

### Archive
The whole curated body the site serves: every **chapitre** of the program, every
**concours paper**, and every **exercise** tagged into it. One archive, curated
by the site owner — it is what a student browses and what the filter searches.
NOT a single paper, and NOT the files on disk that happen to hold it.

### Concours (paper)
An archived past **exam paper** (épreuve) from a competitive-entrance exam — e.g.
"Centrale-Supélec Maths 1, 2023". A concours paper belongs to one country, one
year, one exam brand, and one subject (the discipline, e.g. Maths). When a brand
runs more than one maths épreuve in a year (Maths 1 / Maths 2), a paper's
**label** names which one, so same-brand/year papers stay distinguishable. It is
the *container*, not the unit a student filters by. NOT the live exam event; NOT
a single exercise.

### Exercise (exercice / problème)
The **taggable unit** of the site: a single exercise or problème extracted from a
concours paper. This is what gets tagged with chapters and what a chapter filter
returns. Every exercise remembers its parent paper, so a student can see "this
came from Mines 2019". An exercise may carry **more than one** chapter tag.

### Page range
Where an **exercise** sits inside its parent paper's PDF: a first and a last
page. **Both ends are inclusive** — a one-page exercise starts and ends on the
same page, and the last exercise of a paper ends on the paper's final page,
never one past it (ADR 0003).

The first page is the first one holding any of the exercise's **own** text:
its introduction, its definitions, or its first question. A bare heading at
the foot of a page, with none of that under it, doesn't count. The first page
is never a cover or instructions page, and never a page that holds only an
earlier exercise. A page of notations for the whole paper, sitting just before
the exercise, is also an acceptable start.

### Chapitre (chapter)
A topic in the curriculum, drawn from the **Tunisian 2ème prépa MP program**,
which is the *canonical* chapter list. Chapters are the primary filter axis:
choosing chapter X returns every exercise tagged with X, regardless of the
exercise's country of origin.

The program meant here is the **reformed** one that the current concours
tests, and it includes probability. It is NOT the pre-reform list, which still
circulates and has Séries de Fourier, formes quadratiques, espaces hermitiens
and multiple integrals, but no probability. Its topics count as having no
Tunisian equivalent.

A topic the program teaches in both years is **several chapitres, not one**,
and an exercise is tagged with the one it actually uses, not the first-year
one by default. Integration is three: on a segment (1ère année), on an
arbitrary interval, and integrals with a parameter (both 2ème année). The same
goes for séries numériques and their 2ème-année compléments, the two
structures algébriques chapitres, and the two préhilbertien chapitres.

### Domain
The broad area of the program a **chapitre** belongs to. The list is **closed**:
Analyse, Algèbre, Géométrie, Probabilités are the whole program, and a fifth
value is a mistake, not a new area. A domain with no chapitre yet is normal —
Géométrie has none today. Domains group the chapitre list in the sidebar; they
are a presentation grouping, not a filter axis.

### Primary chapter
Of an exercise's chapter tags, the **one** marked as its main subject. Filtering
matches *any* tag ("touches this chapter at all"), but the primary chapter is
stored so a "mainly about X" view can be offered later without re-tagging.

### Mapping (cross-program)
Because the French and Moroccan MP programs differ from the Tunisian one, each
foreign exercise is **mapped onto Tunisian chapters** rather than carrying its
own country's chapter names. The Tunisian program is the spine everything hangs
on. A foreign exercise whose topic has **no Tunisian equivalent is excluded**
from the archive in v1 (see ADR 0002) — it is noise for a Tunisian student.

### Filter axes
The dimensions a student narrows by: **chapitre** (primary, single-select) plus
the optional **refinements** — country (🇫🇷/🇹🇳/🇲🇦), exam brand, and year.

### Selection
What the student has currently narrowed the **archive** to: one **chapitre** (or
all of them) plus whatever **refinements** are active. A selection always
exists — "all chapitres, no refinements" is one, not the absence of one. It is
what a student browses *from*; the matching **exercises** are what it produces.
NOT the results themselves.

### Refinement
An optional narrowing stacked on top of the **chapitre**: country, exam brand,
or year (a single year, not a range). Refinements combine with the chapitre
and with each other by AND, and they are **clearable without losing the
chapitre** — "réinitialiser les filtres" returns a student to the chapitre-only
view, never to the whole archive.

## Scope of the MVP

- **Subject:** Maths only at launch; Physique is the planned fast-follow.
- **Content ownership:** curated and tagged by the site owner. No student uploads
  in v1 (mistagged uploads would break the one feature that matters).
- **Feature:** a pure filterable **archive** — browse, filter by chapter, open the
  exercise. Solutions/corrections are a fast-follow, not v1. Accounts and forum
  are later, if ever.
