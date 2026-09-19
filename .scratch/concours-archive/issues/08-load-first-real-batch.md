# 08: Load the first real batch of concours and exercises (content)

**What to build:** Enough real, correctly tagged content that the archive is genuinely useful at launch: a first batch of concours papers (across FR/TN/MA) with their exercises entered as pointers and mapped onto Tunisian chapitres. Unmappable foreign exercises are omitted (ADR 0002).

**Blocked by:** 04, 07.

**Status:** in progress — first real paper loaded end-to-end on branch `ticket-08-first-batch` (template for the batch); more papers (TN/MA) to follow

- [~] A first set of concours papers added with full metadata and bundled PDFs. — **1 of the batch:** Centrale Maths 1 2022 (`public/papers/centrale-maths1-2022.pdf`, FR). The 4 placeholder papers + their sample PDFs are removed. More FR/TN/MA papers extend the batch.
- [x] Exercises entered as pointer records (paper + page range) with chapitre tags + primary — the 4-hour problème *"Exemples de contraintes symplectiques linéaires"* modelled as its 3 substantial parts: II Objets symplectiques (p1–3), III Déterminant/décomposition polaire/génération (p3–5), IV Injections symplectiques (p5–6).
- [x] Foreign exercise mapped to Tunisian chapitres — symplectic isn't a Tunisian chapter, but the problème maps via the tools it uses (matrices, déterminants, endomorphismes euclidiens/décomposition polaire, réduction, topologie des EVN). Nothing unmappable here to exclude.
- [x] Spot-check (this paper): Matrices → Partie II; Déterminants → III + IV; Topologie EVN → III + IV; Préhilbertiens/euclidiens → III; an untouched chapitre → empty state; each "Ouvrir" opens the paper at the part's page (verified in browser).
