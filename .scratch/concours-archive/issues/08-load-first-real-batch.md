# 08: Load the first real batch of concours and exercises (content)

**What to build:** Enough real, correctly tagged content that the archive is genuinely useful at launch: a first batch of concours papers (across FR/TN/MA) with their exercises entered as pointers and mapped onto Tunisian chapitres. Unmappable foreign exercises are omitted (ADR 0002).

**Blocked by:** 04, 07.

**Status:** in progress — first real paper loaded end-to-end on branch `ticket-08-first-batch` (template for the batch); more papers (TN/MA) to follow

### Progress log

- **Mines-Ponts back-catalogue grabbed (2014–2026).** All 26 MP Maths papers (Maths 1 + Maths 2 × 13 years) downloaded from the official CCMP annales (CC BY-NC-ND) into `public/papers/` and registered in `dataset.json`. See `research/concours-paper-sources.md` §2b.
- **Exercises tagged — Mines-Ponts 2024 & 2025 (4 papers, 14 exercises).** Each modelled as its own parties/sections with page ranges and Tunisian chapter tags (+ primary). Nothing unmappable to exclude (ADR 0002).
  - 2025 Maths 1 (Inégalités de Khintchine): 3 exercises — Hölder/déviation, Khintchine, conséquences (produit scalaire / normes équivalentes).
  - 2025 Maths 2 (critère de Schur-Cohn): 4 exercises — A–B polynômes, C matrices, D–E critère euclidien, F–G asymptotique.
  - 2024 Maths 1 (intégrale de Dirichlet généralisée): 4 exercises — I intégrale à paramètre, II série pour sinus, III Dirichlet, IV espérance E(|Sₙ|).
  - 2024 Maths 2 (phénomènes de seuil dans les graphes): 3 exercises — I matrices d'adjacence, II fonction de seuil, III copie d'un graphe.
- **Data-integrity guard added** (`src/data/dataset.integrity.test.ts`): every exercise's paper/chapters resolve, primary ∈ tags, sane page ranges, unique ids, every `pdfPath` bundled. Protects hand-entered content.
- **Exercises tagged — Mines-Ponts 2021, 2022, 2023 (6 papers, 17 exercises).**
  - 2023 Maths 1 (théorème de stabilité de Liapounov): 3 — A norme sur L(E), B système différentiel linéaire, C démonstration.
  - 2023 Maths 2 (fonction de Wallis): 4 — ζ(1), régularité/équivalents, série entière, convexité logarithmique.
  - 2022 Maths 1 (formule de Hardy-Ramanujan): 2 — A–B partitions/série entière, C–D estimations. **Parties E–G excluded** (fonctions caractéristiques → convergence vers une gaussienne: loi normale / TCL, hors-programme tunisien — ADR 0002).
  - 2022 Maths 2 (exponentielles de matrices): 4 — préliminaires, Trotter-Kato, algèbres de Lie, comportement asymptotique.
  - 2021 Maths 1 (théorème de De Moivre-Laplace): **1 only** — the in-programme opening (Stirling + convergence de l'intégrale de Gauss). The rest (convergence en loi vers la gaussienne) is **excluded** as hors-programme tunisien (ADR 0002).
  - 2021 Maths 2 (fonctions de matrices symétriques): 3 — définition (calcul fonctionnel), continuité du spectre, convexité.
- **Exercises tagged — Mines-Ponts 2018, 2019, 2020 (6 papers, 17 exercises).** All mapped cleanly; nothing unmappable this batch.
  - 2020 Maths 1 (endomorphismes nilpotents, th. de Gerstenhaber): 2 — I–III préliminaires, IV démonstration.
  - 2020 Maths 2 (nombre de sites visités par une marche aléatoire): 3 — A–B récurrence, C–D marches de Bernoulli, E marche sur Z².
  - 2019 Maths 1 (asymptotique de séries entières, équation d'Airy): 3 — A séries entières, B démonstration probabiliste, C Airy.
  - 2019 Maths 2 (rayon spectral de la matrice de Hilbert): 3 — A Perron-Frobenius, B–C inégalité de Hilbert, D majoration.
  - 2018 Maths 1 (lemme de Fekete, th. d'Erdős-Szekeres): 3 — A–B Fekete, C–D Erdős-Szekeres, E suite aléatoire.
  - 2018 Maths 2 (racines carrées de matrices complexes, Newton): 3 — A–B existence, C algorithme de Newton, D–E stabilité.
- **Exercises tagged — Mines-Ponts 2014, 2015, 2016, 2017 (8 papers, 18 exercises).**
  - 2017 Maths 1 (endomorphisme d'un espace de fonctions): 2 — séries entières, réduction.
  - 2017 Maths 2 (sous-groupes compacts du groupe linéaire): 3 — matrices symétriques, compacité/Markov-Kakutani, sous-groupes de GLₙ.
  - 2016 Maths 1 (inégalité de Hoffman-Wielandt): 2 — Birkhoff-Von Neumann, Hoffman-Wielandt.
  - 2016 Maths 2 (théorème taubérien de Hardy-Littlewood-Karamata): 2 — intégrale à paramètre/séries de fonctions, théorème taubérien.
  - 2015 Maths 1 (opérateur de Volterra): 2 — Volterra, Weierstrass/série trigonométrique.
  - 2015 Maths 2 (norme d'une matrice aléatoire): 2 — norme d'opérateur/VA sous-gaussiennes, recouvrements de la sphère. **Borderline (kept):** "sous-gaussiennes" leans on Gaussian comparison, but the subject is an operator-norm concentration bound built from in-programme tools (MGF/Markov, ε-nets/compacité, norme d'opérateur), so tagged to variables-aleatoires-discretes + topologie-evn rather than excluded. Revisit if it feels hors-programme.
  - 2014 Maths 1 (représentation A ↦ eᴬ): 3 — z↦eᶻ dans C, forme de Jordan, eᴬ dans Mₙ(C).
  - 2014 Maths 2 (points fixes et opérateurs à noyau): 2 — point fixe/homotopie, intégrales de Fredholm.
- **Mines-Ponts complete:** all 26 papers (2014–2026, both épreuves) now tagged; 2021 M1 and 2022 M1 partial per ADR 0002.
- **TN/MA grabbed:** +6 Tunisian (official, 2023/2024/2026) and +12 Moroccan CNC (groupe-reussite, 2015–2021). Archive now 🇫🇷 29 · 🇹🇳 7 · 🇲🇦 13.
- **Exercises tagged — Tunisia 2023 & 2024 (4 papers, 13 exercises).**
  - 2023 Maths 1 (Stirling, partie dense, marche aléatoire): 4 — I–II Stirling, III partie dense, IV marche aléatoire, V série de fonctions.
  - 2023 Maths 2 (endomorphismes qui commutent, matrices M₃): 3 — I diagonalisables qui commutent, II diagonalisabilité de xA+yB, III matrices symétriques.
  - 2024 Maths 1 (fonction intégrale, Fourier): 3 — I–II intégrale à paramètre, III–IV Fourier/Dirichlet, V variable aléatoire discrète.
  - 2024 Maths 2 (matrices symétriques, fonction C^∞ sur la sphère): 3 — I racine carrée, II fonction matricielle C^∞, III extrema sur la sphère unité.
  - **Page anchors verified** (poppler installed). These four source PDFs turned out to be **2-up A3 booklet impositions** — each physical PDF page holds two logical pages side by side, in booklet order (PDF1 = [logical p4 | p1], PDF2 = [p2 | p3], PDF3 = [p5 | blank]), which is why plain text extraction looked scrambled. Anchors now point to the physical PDF page whose imposed layout contains each part's header (verified by rendering pages and by the "Page N sur M" footers). A consequence of the imposition: consecutive parts can sit on non-consecutive PDF pages (e.g. 2023 M1: Partie IV→PDF p1, Partie V→PDF p3). Cleaner still would be to **de-impose** these into sequential PDFs (uniform mapping p1=PDF1-right, p2=PDF2-left, p3=PDF2-right, p4=PDF1-left, p5=PDF3-left) — deferred; `pdftocairo` crop dropped the (already-garbage) OCR text layer, so it needs an image-rebuild approach.
  - **Deferred — TN 2026 Maths 1 & 2:** now renderable (poppler), but they are the **modern answer-booklet format** — 46 and 38 A4 pages with answer spaces — so tagging means mapping parts across ~40 pages each. Confirmed legit (MP Maths I/II, Session 2026). Left untagged pending that larger pass.
- **Remaining:** tag the Moroccan CNC batch (12 papers); grab recent CNC 2022+ (hashed host); tag TN 2026 (answer-booklet); continue Centrale/CCINP.

- [~] A first set of concours papers added with full metadata and bundled PDFs. — **1 of the batch:** Centrale Maths 1 2022 (`public/papers/centrale-maths1-2022.pdf`, FR). The 4 placeholder papers + their sample PDFs are removed. More FR/TN/MA papers extend the batch.
- [x] Exercises entered as pointer records (paper + page range) with chapitre tags + primary — the 4-hour problème *"Exemples de contraintes symplectiques linéaires"* modelled as its 3 substantial parts: II Objets symplectiques (p1–3), III Déterminant/décomposition polaire/génération (p3–5), IV Injections symplectiques (p5–6).
- [x] Foreign exercise mapped to Tunisian chapitres — symplectic isn't a Tunisian chapter, but the problème maps via the tools it uses (matrices, déterminants, endomorphismes euclidiens/décomposition polaire, réduction, topologie des EVN). Nothing unmappable here to exclude.
- [x] Spot-check (this paper): Matrices → Partie II; Déterminants → III + IV; Topologie EVN → III + IV; Préhilbertiens/euclidiens → III; an untouched chapitre → empty state; each "Ouvrir" opens the paper at the part's page (verified in browser).
