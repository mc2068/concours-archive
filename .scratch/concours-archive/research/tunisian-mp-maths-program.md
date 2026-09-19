# Tunisian préparatoire MP — full Mathematics program spine (research)

> Research for ticket 07 (author the Tunisian MP Maths chapter list) and ticket 08
> (cross-program mapping). Background reading only; the payload in section 2 is what
> seeds `{id, name, order, domain}` (+ `year`) in `src/data/dataset.json`.
> The concours tests **both years**, so this file now covers the **full program**
> (1ère + 2ème année).
> Date of research: 2026-09-19.

## 1. Summary

The Tunisian *classes préparatoires* run a two-year cycle whose **MP**
(Mathématiques–Physique) stream prepares for the **Concours National d'entrée aux cycles
de formation d'ingénieurs**. The first year is the MPSI-equivalent common foundation and
the second year is the MP specialisation; the concours examines both. Since the last
reform the MP mathematics program is essentially a re-adoption of the **French CPGE
MPSI→MP program**, organised into two parallel volumes each year — **Mathématiques I —
Analyse** (which also carries the dénombrement/probability chapters) and **Mathématiques
II — Algèbre**. Geometry is **not** a standalone domain: affine geometry sits inside the
Algèbre volume, differential geometry (arcs paramétrés, calcul différentiel) and
Euclidean/Hermitian geometry inside Analyse/Algèbre chapters.

**The full MP Maths spine is 42 chapters: 28 in 1ère année + 14 in 2ème année.**
By domain across both years: Analyse 18, Algèbre 21, Probabilités 3 (Dénombrement +
Probabilités in Y1, Variables aléatoires discrètes in Y2). **Overall confidence: High**
for the chapter *lists* and domain grouping; **Medium** for the exact intra-domain
*ordering* and for a few granularity cuts (see §5). Best source located: **myprepa.tn**,
which publishes both years chapter by chapter, cites the official ministry PDF
(`programme 2mp.pdf`, 165 p, via IPEIK) and cross-references concours sessions 2018–2025;
corroborated for structure by the official institute page **IPEIT** (`ipeit.rnu.tn`, a
government `.rnu.tn` domain). The ministry PDF itself could not be extracted this session
(Scribd copies paywalled/vector; WebSearch/WebFetch tools failed all session), so ordering
follows myprepa's rendering rather than a byte-verified official document.

## 2. Chapitres — full MP Maths spine (payload)

`order` is a single global sequence across both years (Y1 before Y2; within a year, the
Analyse volume then the Algèbre volume, preserving myprepa's within-volume order).
Probabilités is broken out as its own `domain` even though the official document files
those chapters inside the *Analyse* volume (see §3/§5).

| year | domain        | order | French chapter name |
|------|---------------|-------|---------------------|
| 1    | Analyse       | 1     | Techniques fondamentales de calcul en analyse |
| 1    | Analyse       | 2     | Nombres réels et suites numériques |
| 1    | Analyse       | 3     | Limites, continuité |
| 1    | Analyse       | 4     | Dérivation |
| 1    | Analyse       | 5     | Fonctions convexes |
| 1    | Analyse       | 6     | Analyse asymptotique |
| 1    | Analyse       | 7     | Intégration |
| 1    | Analyse       | 8     | Séries numériques |
| 1    | Probabilités  | 9     | Dénombrement |
| 1    | Probabilités  | 10    | Probabilités |
| 1    | Algèbre       | 11    | Nombres complexes et trigonométrie |
| 1    | Algèbre       | 12    | Calculs algébriques |
| 1    | Algèbre       | 13    | Arithmétique dans l'ensemble des entiers relatifs |
| 1    | Algèbre       | 14    | Vocabulaire ensembliste |
| 1    | Algèbre       | 15    | Structures algébriques usuelles |
| 1    | Algèbre       | 16    | Polynômes et fractions rationnelles |
| 1    | Algèbre       | 17    | Calcul matriciel |
| 1    | Algèbre       | 18    | Espaces vectoriels |
| 1    | Algèbre       | 19    | Espaces de dimension finie |
| 1    | Algèbre       | 20    | Applications linéaires |
| 1    | Algèbre       | 21    | Sous-espaces affines d'un espace vectoriel |
| 1    | Algèbre       | 22    | Matrices — Opérations sur les matrices |
| 1    | Algèbre       | 23    | Matrices et applications linéaires |
| 1    | Algèbre       | 24    | Changements de bases, équivalence et similitude |
| 1    | Algèbre       | 25    | Opérations élémentaires et systèmes linéaires |
| 1    | Algèbre       | 26    | Groupe symétrique |
| 1    | Algèbre       | 27    | Déterminants |
| 1    | Algèbre       | 28    | Espaces préhilbertiens réels |
| 2    | Analyse       | 29    | Suites et séries de fonctions |
| 2    | Analyse       | 30    | Fonctions vectorielles, arcs paramétrés |
| 2    | Analyse       | 31    | Séries entières |
| 2    | Analyse       | 32    | Équations différentielles linéaires |
| 2    | Analyse       | 33    | Calcul différentiel |
| 2    | Analyse       | 34    | Intégration sur un intervalle quelconque |
| 2    | Analyse       | 35    | Séries numériques (compléments de 2ème année) |
| 2    | Analyse       | 36    | Topologie des espaces vectoriels normés |
| 2    | Analyse       | 37    | Intégrales à paramètre |
| 2    | Analyse       | 38    | Familles sommables de nombres complexes |
| 2    | Probabilités  | 39    | Variables aléatoires discrètes |
| 2    | Algèbre       | 40    | Réduction des endomorphismes et des matrices carrées |
| 2    | Algèbre       | 41    | Espaces préhilbertiens réels. Endomorphismes des espaces euclidiens |
| 2    | Algèbre       | 42    | Structures algébriques usuelles |

Notes on domains:
- **Géométrie** is *not* a standalone domain in either year. "Sous-espaces affines"
  (order 21) is filed inside the Algèbre volume; Euclidean/Hermitian geometry lives in
  the préhilbertien chapters (28, 41); differential geometry lives in "Fonctions
  vectorielles, arcs paramétrés" (30) and "Calcul différentiel" (33). No `Géométrie`
  domain is emitted.
- **Probabilités** chapters are physically filed at the end of the *Analyse* volume in
  the official document; modelled as their own `domain` here for ticket-08 mapping. If
  the dataset prefers to mirror the official filing, tag them `Analyse` instead.

## 3. 1ère↔2ème boundary subtleties (affects how exercises tag)

Several topics are **introduced in 1ère année and deepened in 2ème année**, and myprepa
exposes each as a **separate chapitre with the same or near-same name**. These must get
**distinct stable ids** (e.g. year-suffixed) so an exercise tags to the year-correct
chapter, and ticket-08 must map them as two nodes, not one:

- **Structures algébriques usuelles** — Y1 (order 15, intro: lois, groupes/anneaux/corps
  basics) *and* Y2 (order 42, deepened: arithmétique des anneaux, polynômes
  d'endomorphisme, etc.). Two chapitres, same name.
- **Séries numériques** — Y1 (order 8, first pass) *and* Y2 (order 35, compléments:
  comparaison série–intégrale, familles/summation refinements). Two chapitres, same name.
- **Espaces préhilbertiens réels** — Y1 (order 28) vs **Espaces préhilbertiens réels.
  Endomorphismes des espaces euclidiens** Y2 (order 41). Same root topic, the Y2 chapter
  adds the endomorphism/spectral theory. Distinct names, distinct nodes.
- **Probabilités → Variables aléatoires discrètes** — Y1 "Probabilités" (order 10, finite
  universes) leads into Y2 "Variables aléatoires discrètes" (order 39, countable
  universes, générating functions, loi faible des grands nombres). Progression across
  years, two chapitres.
- **Dénombrement** (order 9) is the combinatorics chapter that props up probability;
  tagged `Probabilités` here though it is content-neutral (some datasets file it under
  Algèbre/Analyse).

## 4. Differences vs. the French MPSI→MP program (for ticket-08 mapping)

The reformed Tunisian MP Maths program is **near-identical** to the French CPGE
MPSI→MP program. Deltas that matter for cross-program mapping:

Second year (unchanged from previous revision):
- **SPLIT — Séries numériques / Familles sommables.** France has one Y2 chapter "Séries
  numériques et familles sommables"; Tunisia (myprepa) exposes two (orders 35 and 38).
- **RENAME — Topologie des espaces vectoriels normés** (order 36) vs French "Espaces
  vectoriels normés". Same content.
- **RENAME — Variables aléatoires discrètes** (order 39) vs the French part often labelled
  "Probabilités".
- **Espaces préhilbertiens / euclidiens** (order 41): France may present the
  préhilbertien and euclidean-endomorphism material as one or two chapters by edition.

First year (new — mostly mirrors French MPSI, but note finer granularity):
- **Finer granularity in linear algebra.** Tunisia (myprepa) exposes matrices/systems as
  several standalone chapters — "Calcul matriciel" (17), "Matrices — Opérations sur les
  matrices" (22), "Matrices et applications linéaires" (23), "Changements de bases,
  équivalence et similitude" (24), "Opérations élémentaires et systèmes linéaires" (25) —
  where the French MPSI program packs matrices/systems into fewer chapters. Expect several
  Tunisian chapters to map onto one French chapter (a SPLIT).
- **Standalone "Sous-espaces affines d'un espace vectoriel"** (21): France folds affine
  subspaces into the vector-spaces chapter rather than exposing a separate one.
- Otherwise the Y1 names track French MPSI ("Techniques fondamentales de calcul en
  analyse", "Analyse asymptotique", "Fonctions convexes", "Dénombrement", "Groupe
  symétrique", "Espaces préhilbertiens réels", etc.).

Intra-Tunisia version drift (flag, not a France diff):
- The *older* IPEIT page for 2ème année still lists **"Séries de Fourier"**, has **no
  probability chapter** and **no familles sommables** — pre-reform curriculum. The current
  program (myprepa, aligned to the live concours) **drops Séries de Fourier** and **adds
  Variables aléatoires discrètes / Familles sommables**, matching France. Any legacy
  exercise referencing Fourier belongs to the old program.

## 5. Sources

- **myprepa.tn — MP Mathématiques I (Analyse) & II (Algèbre)** —
  <https://myprepa.tn/programmes/MP/mathematiques-1> ,
  <https://myprepa.tn/programmes/MP/mathematiques-2> , chapter example
  <https://myprepa.tn/programmes/MP/mathematiques-1/MP-N2-mathematiques-analyse-3982d603>.
  *Authoritative-secondary:* dedicated Tunisian prépa program tracker covering **both
  years** of the MP filière; states it publishes "programmes officiels des classes
  préparatoires tunisiennes", cites the official ministry PDF `programme 2mp.pdf`
  (165 p, IPEIK) as source, and rattaches chapters to real concours épreuves (2018–2025).
  Primary basis for §2 (both years).
- **IPEIT — "Programme - 2ème année MP"** —
  <http://www.ipeit.rnu.tn/fr/content/programme-2-me-ann-e-mp>.
  *Primary (official institute), older curriculum:* government `.rnu.tn` domain (Institut
  Préparatoire aux Études d'Ingénieurs de Tunis). Confirms the two-volume Analyse/Algèbre
  structure and 2ème-année names; is the pre-reform version (Séries de Fourier, no
  probabilités, Maple). No separate 1ère-année MP page exists (the first year is the
  common MPSI-equivalent foundation), so Y1 could not be corroborated here.
- **IPEIT — "Nouveaux programmes de classes préparatoires"** —
  <http://www.ipeit.rnu.tn/fr/content/nouveaux-programmes-de-classes-pr-paratoires>.
  *Primary:* relays "les programmes officiels diffusés par le ministère" (pointer to the
  ministry PDFs; not extracted).
- **IPEIN — Cycle Préparatoire: Programmes** —
  <https://ipein.rnu.tn/fra/s1324/pages/5/Cycle-Préparatoire-Programmes>.
  *Primary (official institute):* hosts downloadable ministry program PDFs per
  year/subject. The Maths 2ème-année PDF exposed on the page was the **PC** track, not MP,
  so not used for MP names; listed as a channel to the official PDFs.
- **Scribd — "Programme Mathématiques MP 2023" / "Programme MP"** —
  <https://fr.scribd.com/document/728208496/> , <https://www.scribd.com/document/923581594/Programme-MP>.
  *Copies of the official ministry MP program:* titles/snippets match, but content is
  paywalled/vector — an ordered chapter list could not be extracted.
- **mathlvl.fr — Maths Prépa MP/MPI (2e année)** — <https://mathlvl.fr/prepa-mp-mpi>.
  *French reference (comparison only):* used for the §4 France diff.

## 6. Open questions / confidence

- **Chapter lists & domain grouping — High (both years).** 42 chapters (28 Y1 + 14 Y2)
  from myprepa (official-PDF-cited, concours-mapped); Y2 additionally corroborated for
  structure by IPEIT; all names match the reformed French MPSI→MP program.
- **Exact official ordering — Medium.** §2 order follows myprepa's within-volume sequence,
  not a byte-verified reading of the ministry PDF (Scribd paywalled; WebSearch/WebFetch
  failed all session — retrieval was browser-only). Confirm intra-domain order against the
  ministry `programme 2mp.pdf`, especially the Y2 analysis block (topologie vs.
  séries/familles) and the Y1 linear-algebra block.
- **1ère-année additions — High for the list, Medium for granularity/ordering.** The Y1
  list is from the same myprepa source but was **not** independently corroborated (no
  1ère-année MP page on IPEIT). myprepa's Y1 linear-algebra chapters are cut more finely
  than a typical ministry document, so some Y1 "chapters" may be sub-sections in the
  official PDF (see §4). Verify the Y1 chapter boundaries before assigning stable ids.
- **Duplicated-name chapters need distinct ids.** See §3 — Structures algébriques usuelles,
  Séries numériques, and the préhilbertien/probabilité pairs each appear in both years and
  must be seeded as separate `{id, year}` nodes.
- **Probabilités as domain vs. sub-section of Analyse — decision, not fact.** Officially
  filed inside the Analyse volume; broken out here. Confirm which the dataset wants.
- **Stable ids.** Names are stable; assign slug ids (year-suffixed for the duplicates,
  e.g. `structures-algebriques-usuelles-y1` / `-y2`) at seeding time — none are provided
  by the sources.
