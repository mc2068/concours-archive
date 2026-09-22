# 18: Source the real CNC 2017 MP Maths 2 paper

**What to build:** Find the genuine CNC 2017 MP Maths 2 subject, bundle it, and
tag its exercises.

**Blocked by:** none

**Status:** done

## Context

Ticket 17 removed `cnc-maths2-2017` because its PDF was the Maths I paper. The
mistake is upstream. groupe-reussite.fr's `cnc-maths2-mp-2017.pdf`, which
mathencpge.ma links to as "Maths 2", is the Maths I subject; it matches the
bundled Maths I apart from indentation.

## To do

- Find a source whose Maths 2 2017 file really is Maths 2. The candidates
  listed in `research/concours-paper-sources.md` §4b are alloschool.com,
  masup.ma, rtc.ma and cpge-paradise.com. Check the content, not the file
  name: its first page must not be Maths I's "Exercice / Problème 1 —
  Opérateur intégral Nₙ".
- Downloading it needs the owner's OK: name the file, the source and its size.
- Add the paper and its exercises following the rule in `CONTEXT.md` ("Page
  range"), and pass `npm run verify`.

## Comments

**2026-09-22 — done.** The real paper is on iamateacher.org (Prof ELAMIRI), under
"2017-2-énoncé": `99b3c9_b5f540b690084c73a15b26ae975b6649.pdf`, 304,174 bytes. It
is 4 pages with no cover page, and each footer reads "Épreuve de Mathématiques II".
It is a single problem in seven parties about matrices. None of it is the Nₙ
operator.

The other candidates carry the same mistake as groupe-reussite. rtc.ma's
`CNC 2017 Math-2 MP.pdf` was downloaded and read, and it is Maths I.
alloschool's Maths 2 file has exactly the same size (720,196 bytes), so it wasn't
downloaded. cpge-paradise.com starts at 2019, masup.ma has no CNC archive, and
cpgemaroc.com is offline. `research/concours-paper-sources.md` §4a now records
this.

The problem is split into two exercises, as `cnc-maths2-2016` is:

- **`-p1`, Parties I–IV, pages 1–3:** norms on Mₙ(K) and their equivalence,
  sequences and series of matrices, the matrix exponential. Primary
  topologie-evn, plus matrices, series-numeriques-complements and
  reduction-endomorphismes (triangular and diagonal exp, det exp = e^Tr).
  Page 1 has no cover, and the Problème opens under the instructions, so the
  start is page 1.
- **`-p2`, Parties V–VII, pages 3–4:** linear differential systems Y′ = AY + B,
  real antisymmetric matrices being diagonalisable over C, and exp/ln between
  nilpotent and unipotent matrices, onto Sₙ⁺⁺(R). Primary
  equations-differentielles, plus reduction-endomorphismes, matrices and
  prehilbertiens-euclidiens-y2. Partie V's own text starts on page 3.

The archive is now 88 papers and 205 exercises. `npm run verify` and `npm test`
pass.
