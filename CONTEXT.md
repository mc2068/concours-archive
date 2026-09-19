# Context — Concours archive for 2ème prépa MP (Tunisia)

A glossary for a website that lets Tunisian 2ème année préparatoire (section MP)
students find past competitive-exam material by curriculum chapter, across the
French, Tunisian, and Moroccan systems.

## Glossary

### Concours (paper)
An archived past **exam paper** (épreuve) from a competitive-entrance exam — e.g.
"Centrale-Supélec Maths 1, 2023". A concours paper belongs to one country, one
year, one exam brand, and one subject. It is the *container*, not the unit a
student filters by. NOT the live exam event; NOT a single exercise.

### Exercise (exercice / problème)
The **taggable unit** of the site: a single exercise or problème extracted from a
concours paper. This is what gets tagged with chapters and what a chapter filter
returns. Every exercise remembers its parent paper, so a student can see "this
came from Mines 2019". An exercise may carry **more than one** chapter tag.

### Chapitre (chapter)
A topic in the curriculum, drawn from the **Tunisian 2ème prépa MP program**,
which is the *canonical* chapter list. Chapters are the primary filter axis:
choosing chapter X returns every exercise tagged with X, regardless of the
exercise's country of origin.

### Domain
The broad area of the program a **chapitre** belongs to — Analyse, Algèbre,
Géométrie, Probabilités. Domains group the chapitre list in the sidebar; they are
a presentation grouping, not a filter axis.

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
optional stackable **country** (🇫🇷/🇹🇳/🇲🇦), **exam brand**, and **year**,
combined with AND logic.

## Scope of the MVP

- **Subject:** Maths only at launch; Physique is the planned fast-follow.
- **Content ownership:** curated and tagged by the site owner. No student uploads
  in v1 (mistagged uploads would break the one feature that matters).
- **Feature:** a pure filterable **archive** — browse, filter by chapter, open the
  exercise. Solutions/corrections are a fast-follow, not v1. Accounts and forum
  are later, if ever.
