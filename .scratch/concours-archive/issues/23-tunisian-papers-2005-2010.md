# 23: Add the Tunisian MP papers 2005–2010

**What to build:** Bundle the 12 Tunisian MP maths papers of 2005–2010 (Maths 1
and Maths 2 each year), trimmed to their sujets, and tag the exercises that
survive mapping.

**Blocked by:** 22

**Status:** open

## Context

Part of the Tunisian backfill that ticket 21 starts, newest first. Ticket 21
has the facts about the IPEIS files (URL pattern, sujet + corrigé, scans) and
the procedure. Follow it as written.

These papers were set on the **pre-reform** program. Judge every exercise by
the rule in `CONTEXT.md` ("Mapping") and ADR 0002's 2026-09-28 amendment:
it is kept when a student of the reformed program can answer it, with earlier
results taken as given, and excluded only when it needs a pre-reform notion.
Expect some parties, and possibly whole papers, to drop out.

Already seen on the cover pages: 2009 Maths 1 is on séries trigonométriques
(a Dirichlet problem), and 2010 Maths 1 on Borel summability of series.

## Acceptance

- [ ] Each of the 12 papers is bundled and trimmed to its sujet, or
      recorded below as not added because nothing survived mapping.
- [ ] Each excluded exercise is listed below with the pre-reform notion it
      needs, so the exclusions can be reviewed.
- [ ] For each paper, the comments record its IPEIS URL and the page where
      the corrigé starts in the original file.
- [ ] New exercises' start pages and tags are audited, as in ticket 16.
- [ ] The PRD's counts match the archive; `npm run verify` and `npm test` pass.

## Comments
