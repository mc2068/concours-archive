# 18: Source the real CNC 2017 MP Maths 2 paper

**What to build:** Find the genuine CNC 2017 MP Maths 2 subject, bundle it, and
tag its exercises.

**Blocked by:** none

**Status:** open

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
