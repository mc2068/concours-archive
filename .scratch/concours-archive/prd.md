# Concours archive — Product Requirements Document

| | |
| --- | --- |
| **Product** | Concours archive |
| **Live URL** | https://concours-archive.mohamed-chakroun.workers.dev |
| **Type** | Static single-page website. No backend, no API, no database. |
| **Authentication** | None. No accounts, no login, no credentials needed. |
| **UI language** | French. Every UI string quoted below is verbatim. |
| **Viewports** | Desktop, and mobile down to 375 px wide |
| **Data snapshot** | `main` @ `c8e0fc5`, 2026-09-21: 205 exercises, 88 papers, 37 chapitres |

Numbers in this document are a snapshot of the data at the commit above. They
will change when exercises are added. The **invariants** (marked *Invariant*)
hold regardless of the data.

---

## 1. Summary

A free, public archive of past competitive-exam ("concours") maths exercises for
Tunisian 2ème année préparatoire (MP section) students. The student picks a
chapter of their curriculum (a **chapitre**) and sees every exercise tagged with
it, drawn from French 🇫🇷, Tunisian 🇹🇳 and Moroccan 🇲🇦 exam papers. Optional
filters narrow the list by country, exam brand and year. Each result opens the
original exam PDF at the page where that exercise starts.

The unit the student browses is the **exercise**, not the whole paper. The
chapitre list is the front door.

## 2. Users and goals

Primary user: a student revising one topic at a time, often on a phone.

1. Find all past-exam practice for one chapitre in one place.
2. Narrow it by country, exam, or year.
3. See where each exercise came from (exam, épreuve, year, country).
4. Open the exercise directly at the right page of its PDF.
5. Do all of the above on a small screen.

## 3. Vocabulary

| Term | Meaning |
| --- | --- |
| **Chapitre** | A chapter of the Tunisian MP maths program. The primary filter. Single-select. |
| **Domain** | A group of chapitres in the sidebar: Analyse, Algèbre, Probabilités. A heading only — not clickable, not a filter. |
| **Exercise** | One exercise or problem extracted from an exam paper. Each result row is one exercise. |
| **Paper / épreuve** | One past exam paper, e.g. "Mines-Ponts Maths 1, 2025". One PDF, several exercises. |
| **Tag** | An exercise is tagged with one or more chapitres. Exactly one tag is its **primary** chapitre. |
| **Refinement** | An optional filter stacked on the chapitre: country (Pays), exam brand (Concours), or year (Année). |

## 4. Page structure and selectors

One page, at `/`. Stable hooks for automation:

| Region | Selector | Notes |
| --- | --- | --- |
| Site title | `h1.masthead__title` | "Concours archive" |
| Masthead stats | `.masthead__stat-value` | Two values, labelled "Exercices" and "Épreuves" |
| Mobile sheet toggle | `#sidebar-toggle` | "Chapitres & filtres". Hidden at ≥ 768 px. |
| Sidebar | `#sidebar` | Holds the chapitres and the refinements. Has a `data-open` attribute. |
| "All chapitres" button | `[data-chapitre-reset]` | "Tous les chapitres" |
| Chapitre buttons | `[data-chapitre-id]` | 37 buttons, each with `aria-pressed` |
| Domain headings | `nav .domain-label` | Analyse, Algèbre, Probabilités |
| Country select | `#filter-country` | Label "Pays" |
| Exam brand select | `#filter-brand` | Label "Concours" |
| Year select | `#filter-year` | Label "Année" |
| Sidebar reset | `#filter-reset` | "Réinitialiser les filtres" |
| Results heading | `#heading` | |
| Match count | `#count` | |
| Results list | `#results` | One `li.result-row` per exercise, or a single `li.empty-state` |
| Row title | `.result-row__title` | |
| Row source line | `.result-row__meta` | Flag, exam, épreuve, year |
| Row chapitre chips | `.result-row__chips .chip` | The primary chip also has `.chip--primary` |
| Row open link | `.result-row a.btn--primary` | "Ouvrir" |
| Empty-state button | `.empty-state__reset` | Label depends on state (FR-9) |

---

## 5. Functional requirements

### FR-1 — Initial state

On load, before any interaction:

- `#heading` reads **"Tous les exercices"**.
- `#count` reads **"205 exercices"**.
- `#results` contains **205** `li.result-row`.
- "Tous les chapitres" has `aria-pressed="true"`; all 37 chapitre buttons have
  `aria-pressed="false"`.
- Pays shows "Tous", Concours shows "Tous", Année shows "Toutes".
- Masthead shows **Exercices 205** and **Épreuves 88**.
- *Invariant:* the masthead "Exercices" value equals the default `#count`.

### FR-2 — Chapitre list

- 37 chapitre buttons, grouped under domain headings in this order:
  **Analyse** (18), **Algèbre** (16), **Probabilités** (3).
- There is **no "Géométrie" heading**. The program defines that domain, but it
  has no chapitres yet. This is correct.
- Within a domain, chapitres appear in program order (Appendix A).
- "Tous les chapitres" sits above all the groups.

### FR-3 — Selecting a chapitre

Clicking a chapitre button:

- sets its `aria-pressed` to `"true"`, and every other button — including
  "Tous les chapitres" — to `"false"`. *Invariant:* exactly one button is
  pressed at all times.
- sets `#heading` to the chapitre's name, exactly as written on the button;
- lists only exercises tagged with that chapitre. **Any** tag counts, not only
  the primary one;
- updates `#count`.

Also:

- An exercise tagged with several chapitres appears under **each** of them.
- Clicking "Tous les chapitres" restores the full list and the heading "Tous les
  exercices".
- Switching chapitre **keeps** any active refinements; they apply to the new
  chapitre.
- Filtering happens in the browser. It makes **no network request**.

### FR-4 — Refinements

The options offered are only values that exist in the data:

| Control | Options, in order |
| --- | --- |
| Pays | Tous · 🇫🇷 France · 🇹🇳 Tunisie · 🇲🇦 Maroc |
| Concours | Tous · CCINP · Centrale · CNC · Concours tunisien · Mines-Ponts |
| Année | Toutes · 2026 · 2025 · … · 2014 (descending) |

- A refinement applies as soon as its value changes. There is no "apply"
  button.
- Refinements combine with each other and with the chapitre by **AND**.
- Année selects a **single year**. There is no year-range control.
- `#heading` names the chapitre only. It does not change when refinements
  change.

### FR-5 — Resetting refinements

`#filter-reset` ("Réinitialiser les filtres"):

- sets all three selects back to "Tous" / "Tous" / "Toutes";
- **keeps the selected chapitre**: the same button stays pressed and `#heading`
  is unchanged. It returns the student to the chapitre-only view, never to the
  whole archive;
- changes nothing when no refinement is active.

### FR-6 — Result rows

Each `li.result-row` shows:

- **Title**: the exercise's label, e.g. "Exercice II — Analyse".
- **Source line**: `<flag> <brand> <épreuve> · <year>`, e.g.
  "🇫🇷 CCINP Maths 1 · 2026". Every paper currently has an épreuve of either
  "Maths 1" or "Maths 2".
- **Chips**: one per chapitre the exercise is tagged with, showing chapitre
  names. *Invariant:* exactly one chip per row has `.chip--primary`. The primary
  chip is **not** guaranteed to be the first one.
- **"Ouvrir" link**:
  - `href` matches `/papers/<file>.pdf#page=<n>`, where `n` is the exercise's
    first page and is ≥ 1;
  - `target="_blank"` and `rel="noopener noreferrer"`;
  - the PDF answers HTTP 200 with `Content-Type: application/pdf`.

Several exercises may open at the same page.

### FR-7 — Result ordering

Every list, whatever the filters, is ordered by:

1. **Year**, newest first.
2. **Exam brand**, French alphabetical: CCINP, Centrale, CNC, Concours tunisien,
   Mines-Ponts.
3. **Paper.** *Invariant:* the exercises of one paper are always contiguous. In
   the current data, Maths 1 comes before Maths 2 for the same brand and year.
4. **Exercise label**, compared as text with numbers ordered numerically —
   **not page order.** For example, within Mines-Ponts Maths 1 2014 the order is
   "Partie A…" (page 2), "Partie D…" (page 4), "Parties B–C…" (page 3), because
   "Partie " sorts before "Parties". Tests must assert label order here, not
   page order. See §7.

### FR-8 — Match count

- `#count` reads "N exercices", with the singular **"1 exercice"** when N = 1,
  and "0 exercices" when N = 0.
- *Invariant:* the number in `#count` equals the number of `li.result-row`.

### FR-9 — Empty state

When nothing matches:

- `#count` reads "0 exercices".
- `#results` holds exactly one `li.empty-state`, containing a decorative image
  (`alt=""`), the title **"Aucun résultat"**, the hint **"Aucun exercice ne
  correspond à ces filtres."**, and at most one button:

The button offers the smallest widening that actually brings results back:

| Condition | Button | Clicking it |
| --- | --- | --- |
| At least one refinement is active, **and** clearing the refinements would leave results — the selected chapitre has exercises, or no chapitre is selected | **Réinitialiser les filtres** | Clears the refinements and keeps the chapitre (same as FR-5) |
| The selected chapitre has **no exercises at all**, whether or not refinements are active | **Voir tous les exercices** | Clears the chapitre **and** the refinements in one click: "Tous les chapitres" is pressed, the heading becomes "Tous les exercices", the selects read Tous / Tous / Toutes, and all 205 exercises show |
| The archive holds no exercises | *(no button)* | Unreachable with the current data |

- *Invariant:* clicking the empty-state button always lands on at least one
  result. It never leads to a second empty state.
- The results area is never blank without an explanation.

### FR-10 — Mobile layout (viewport below 768 px)

- `#sidebar-toggle` is visible, labelled "Chapitres & filtres", with
  `aria-controls="sidebar"` and initially `aria-expanded="false"`. The sidebar
  is hidden, so the results come first.
- Tapping the toggle opens the sidebar (`aria-expanded="true"`). Tapping it
  again closes it.
- **Selecting a chapitre closes the sidebar** (`aria-expanded="false"`), so the
  student lands on the results. The empty state's "Voir tous les exercices"
  counts as selecting a chapitre ("Tous les chapitres"), so it closes the
  sidebar too.
- Changing a refinement, or clicking "Réinitialiser les filtres" (in the
  sidebar or in the empty state), does **not** close the sidebar.
- No horizontal scrolling at 375 px. Every control is reachable and tappable.

At 768 px and wider, the sidebar is a permanent left column and the toggle is
hidden. Selecting a chapitre does not change `data-open` there.

*For automation:* open the page **at** the target width rather than resizing an
already-open page. The page learns the layout from a `matchMedia` change
event, and a hidden or background browser tab may not deliver that event until
it is shown. A test that resizes a hidden tab and then clicks can see desktop
behaviour at 375 px.

### FR-12 — Restored selects after Back or reload

A browser may refill the three selects itself when the student comes back to
the page (Back button, or reload in some browsers). The chapitre is never
restored: it always starts at "Tous les chapitres".

- *Invariant:* whatever the selects show once the page has settled, the results
  match them. If the selects come back as Concours = CNC, Année = 2019, the list
  is those 3 exercises, not all 205.

### FR-11 — Page basics

- `<html lang="fr">`.
- Title: "Concours archive — exercices de concours par chapitre".
- A meta description and a favicon are present.
- With JavaScript disabled, the results panel shows "Ce site a besoin de
  JavaScript pour filtrer les exercices."
- No console errors on load or while filtering.

---

## 6. Test scenarios with expected results

Unless a step says otherwise, each scenario starts from a fresh page load.

| ID | Steps | Expected |
| --- | --- | --- |
| S1 | Load the page | Heading "Tous les exercices", count "205 exercices". First row "Exercice II — Analyse", source "🇫🇷 CCINP Maths 1 · 2026", Ouvrir → `/papers/ccinp-maths1-2026.pdf#page=2`. Last row "Parties D–E — Généralisation et intégrales de Fredholm", source "🇫🇷 Mines-Ponts Maths 2 · 2014". |
| S2 | Click "Matrices" | Heading "Matrices", count "72 exercices", only "Matrices" pressed. First row "Exercices 1 et 2 — Matrices", source "🇫🇷 CCINP Maths 2 · 2026". |
| S3 | Click "Fonctions vectorielles, arcs paramétrés" | **"1 exercice"** (singular). Row "Parties III–IV — Géodésiques : ligne droite et cycloïde", source "🇫🇷 Mines-Ponts Maths 1 · 2026". Chips: "Fonctions vectorielles, arcs paramétrés" (primary), "Calcul différentiel", "Intégration". Ouvrir → `/papers/mines-ponts-maths1-2026.pdf#page=4`. |
| S4 | Click "Calcul différentiel", then "Intégration" | The S3 exercise is in both lists (multi-tag rule). |
| S5 | Click "Séries numériques", then set Pays = Tunisie | "42 exercices", then "3 exercices". Every row shows 🇹🇳. First row's Ouvrir → `/papers/tn-maths1-2026.pdf#page=16`. |
| S6 | Continue S5: set Année = 2024 | "1 exercice": "Parties III–IV — Coefficients de Fourier et noyau de Dirichlet", source "🇹🇳 Concours tunisien Maths 1 · 2024". |
| S7 | Click "Matrices", set Pays = France, then click sidebar "Réinitialiser les filtres" | "50 exercices", then back to "72 exercices". Heading stays "Matrices", "Matrices" stays pressed, selects read Tous / Tous / Toutes. |
| S8 | Click "Matrices", set Concours = Mines-Ponts, set Année = 2025 | "2 exercices": "Partie C — Expression matricielle J(p) = VᵀDV", then "Parties D–E — Critère de Schur-Cohn et inversibilité de J(p)". Both open `/papers/mines-ponts-maths2-2025.pdf#page=5`. |
| S9 | Set Pays = Tunisie, click "Séries numériques", then click "Matrices" | "20 exercices" → "3 exercices" → "4 exercices". Pays stays "Tunisie" throughout: refinements survive chapitre changes. |
| S10 | With no chapitre, apply one refinement at a time, reloading between | Pays = Tunisie → "20 exercices". Concours = CNC → "47 exercices", every row 🇲🇦. Année = 2014 → "5 exercices", every row Mines-Ponts. |
| S11 | Set Pays = Tunisie and Concours = Mines-Ponts | "0 exercices". Empty state "Aucun résultat" with button "Réinitialiser les filtres". Click it → "205 exercices", heading "Tous les exercices". |
| S12 | Click "Nombres réels et suites numériques", set Pays = Tunisie | "0 exercices", button "Réinitialiser les filtres". Click it → "5 exercices", and the heading is still "Nombres réels et suites numériques". |
| S13 | Click "Limites, continuité" | "0 exercices", button "Voir tous les exercices". Click it → "205 exercices", heading "Tous les exercices", "Tous les chapitres" pressed, "Limites, continuité" not pressed. |
| S14 | Click "Limites, continuité", set Pays = France | "0 exercices", button **"Voir tous les exercices"** (not "Réinitialiser les filtres"). Click it once → "205 exercices", heading "Tous les exercices", "Tous les chapitres" pressed, selects read Tous / Tous / Toutes. |
| S15 | In any view, inspect every row | `#count` equals the row count. Every row has exactly one `.chip--primary`. Every Ouvrir `href` matches `^/papers/[^/]+\.pdf#page=[1-9][0-9]*$`, with `target="_blank"` and `rel="noopener noreferrer"`. |
| S16 | Request any Ouvrir URL (without the fragment) | HTTP 200, `Content-Type: application/pdf`. |
| S17 | Set Année = 2025 | Rows run in brand order CCINP, Centrale, CNC, Concours tunisien, Mines-Ponts. |
| S18 | Set Année = 2014 | Exactly: "Partie A — La représentation z ↦ e^z dans C", "Partie D — Représentation A ↦ e^A dans Mₙ(C)", "Parties B–C — Bloc de Jordan et forme de Jordan d'une matrice nilpotente" (all Mines-Ponts Maths 1), then "Parties A–C — Théorème du point fixe et invariance par homotopie", "Parties D–E — Généralisation et intégrales de Fredholm" (both Mines-Ponts Maths 2). |
| S19 | At 375 × 812 | Toggle visible, sidebar hidden, `aria-expanded="false"`. Tap the toggle → sidebar open, `"true"`. Set Pays = France → sidebar still open. Tap "Matrices" → sidebar closes, `"false"`, heading "Matrices". No horizontal scroll at any point. |
| S20 | At 1280 × 800 | Sidebar visible as a left column. Toggle not visible. |
| S21 | At 375 × 812 (loaded at that width): tap the toggle, tap "Limites, continuité", tap the toggle again, set Pays = France, then click "Voir tous les exercices" | The sidebar closes on the chapitre tap, reopens on the toggle, stays open through the Pays change, and closes on "Voir tous les exercices" (FR-10). Ends on "205 exercices". |
| S22 | Set Concours = CNC and Année = 2019 ("3 exercices"), navigate to another URL, then press Back | The chapitre is "Tous les chapitres". If the browser restored the selects to CNC / 2019, the list shows "3 exercices", all "🇲🇦 CNC … · 2019". If it did not, the selects read Tous / Tous / Toutes and the list shows "205 exercices". Never restored selects over an unfiltered list (FR-12). |

### Notes for automated tests

Traps that have produced false failures before:

- **Scope flag checks to the results.** The Pays `<option>`s contain 🇫🇷 🇹🇳 🇲🇦
  too, so a whole-page search after "Pays = France" finds one 🇹🇳 and one 🇲🇦 in
  the dropdown. Check `#results .result-row__meta` only.
- **Know which country each brand belongs to.** CNC is Moroccan (🇲🇦), and
  "Concours tunisien" is the only Tunisian brand. "Tunisie + CNC", or "Tunisie +
  Mines-Ponts", is empty **by design**. For a non-empty stacked combination,
  use e.g. Maroc + CNC + 2026 ("4 exercices") or France + CCINP + 2025
  ("5 exercices").
- **Pick select options by value or label, not by position** in the page. Every
  filter change renders in a few milliseconds, so a timeout means the test is
  searching, not that the page is slow.
- **The two empty-state buttons do different things** (FR-9). Only
  "Réinitialiser les filtres" keeps the chapitre. "Voir tous les exercices"
  leaves it on purpose, because the chapitre has no exercises to go back to.
- **Read `target` / `rel` from the Ouvrir anchor itself**
  (`.result-row a.btn--primary`). Reading them from the row, the title, or any
  element that isn't that anchor returns `null`.

---

## 7. Known behaviours — expected, not bugs

Tests should **pass** on these. Some are tracked as future UX improvements.

- **No URL state.** The URL never changes, the browser Back button does not
  undo a filter, and a filtered view cannot be linked or bookmarked. A reload
  returns to "Tous les chapitres". Only the selects may come back, if the
  browser restores them (FR-12).
- **8 chapitres have no exercises yet**: Techniques fondamentales de calcul en
  analyse · Limites, continuité · Séries numériques (compléments de 2ème année) ·
  Familles sommables de nombres complexes · Calculs algébriques · Vocabulaire
  ensembliste · Structures algébriques usuelles · Systèmes linéaires et
  opérations élémentaires. Selecting one shows the empty state with "Voir tous
  les exercices", with or without refinements active.
- **Label order is not page order** within a paper (FR-7). In the current data,
  21 neighbouring pairs of exercises from the same paper appear out of page
  order. This is the specified rule.
- **Single year only.** No year-range control is offered.
- **The heading shows the chapitre only**, never the refinements.
- **The `#page=` anchor** is honoured by the browser's built-in PDF viewer. If a
  browser is set to download PDFs rather than display them, the page anchor is
  lost. That is browser behaviour, not a site defect.

## 8. Out of scope — do not test for

Accounts, login, sign-up · a search box · favourites or history · exercise
solutions or corrections · uploads · comments or a forum · an admin UI · an
in-site PDF viewer · dark mode · pagination or infinite scroll (every match
renders in one list) · backend or API endpoints (there are none) · languages
other than French · subjects other than maths.

---

## Appendix A — Exercises per chapitre (snapshot)

| # | Domain | Chapitre | Exercises |
| ---: | --- | --- | ---: |
| 1 | Analyse | Techniques fondamentales de calcul en analyse | 0 |
| 2 | Analyse | Nombres réels et suites numériques | 5 |
| 3 | Analyse | Limites, continuité | 0 |
| 4 | Analyse | Dérivation | 7 |
| 5 | Analyse | Fonctions convexes | 9 |
| 6 | Analyse | Analyse asymptotique | 27 |
| 7 | Analyse | Intégration | 15 |
| 8 | Analyse | Séries numériques | 42 |
| 9 | Analyse | Suites et séries de fonctions | 36 |
| 10 | Analyse | Fonctions vectorielles, arcs paramétrés | 1 |
| 11 | Analyse | Séries entières | 15 |
| 12 | Analyse | Équations différentielles linéaires | 10 |
| 13 | Analyse | Calcul différentiel | 12 |
| 14 | Analyse | Intégration sur un intervalle quelconque | 29 |
| 15 | Analyse | Séries numériques (compléments de 2ème année) | 0 |
| 16 | Analyse | Topologie des espaces vectoriels normés | 29 |
| 17 | Analyse | Intégrales à paramètre | 18 |
| 18 | Analyse | Familles sommables de nombres complexes | 0 |
| 19 | Algèbre | Nombres complexes et trigonométrie | 3 |
| 20 | Algèbre | Calculs algébriques | 0 |
| 21 | Algèbre | Arithmétique dans l'ensemble des entiers relatifs | 2 |
| 22 | Algèbre | Vocabulaire ensembliste | 0 |
| 23 | Algèbre | Structures algébriques usuelles | 0 |
| 24 | Algèbre | Polynômes et fractions rationnelles | 20 |
| 25 | Algèbre | Espaces vectoriels et applications linéaires | 3 |
| 26 | Algèbre | Espaces vectoriels de dimension finie | 13 |
| 27 | Algèbre | Matrices | 72 |
| 28 | Algèbre | Systèmes linéaires et opérations élémentaires | 0 |
| 29 | Algèbre | Groupe symétrique | 4 |
| 30 | Algèbre | Déterminants | 8 |
| 31 | Algèbre | Espaces préhilbertiens réels | 7 |
| 32 | Algèbre | Réduction des endomorphismes et des matrices carrées | 61 |
| 33 | Algèbre | Espaces préhilbertiens réels. Endomorphismes des espaces euclidiens | 33 |
| 34 | Algèbre | Structures algébriques usuelles (2ème année) | 5 |
| 35 | Probabilités | Dénombrement | 6 |
| 36 | Probabilités | Probabilités | 10 |
| 37 | Probabilités | Variables aléatoires discrètes | 35 |

These add up to more than 205 because an exercise can carry several tags (199 of
the 205 do).

## Appendix B — Exercises per refinement value (snapshot)

| Pays | Exercises | Papers |
| --- | ---: | ---: |
| 🇫🇷 France | 138 | 58 |
| 🇹🇳 Tunisie | 20 | 7 |
| 🇲🇦 Maroc | 47 | 23 |

| Concours | Exercises |
| --- | ---: |
| CCINP | 33 |
| Centrale | 33 |
| CNC | 47 |
| Concours tunisien | 20 |
| Mines-Ponts | 72 |

| Année | 2026 | 2025 | 2024 | 2023 | 2022 | 2021 | 2020 | 2019 | 2018 | 2017 | 2016 | 2015 | 2014 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Exercises | 22 | 23 | 26 | 26 | 18 | 17 | 16 | 16 | 10 | 10 | 8 | 8 | 5 |
