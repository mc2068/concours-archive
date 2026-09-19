# 06: Deploy to Cloudflare Pages

**What to build:** The site is live and public on Cloudflare Pages, serving the bundled PDFs. Deploys can start as soon as the skeleton exists; later tickets redeploy on the same pipeline.

**Blocked by:** 02.

**Status:** done — live at https://concours-archive.mohamed-chakroun.workers.dev

Deployed via Cloudflare **Workers Static Assets** (git-connected), not classic Pages — Cloudflare folded Pages into Workers, and a repo with a `wrangler.toml` becomes a Workers assets-only project (`npx wrangler deploy`). Same outcome the spec meant; served at `*.workers.dev`.

- [x] The production build deploys to Cloudflare and is reachable at a public URL (https://concours-archive.mohamed-chakroun.workers.dev) — verified in-browser: app renders, 8 exercises listed.
- [x] Bundled PDF assets are served correctly from the deployed site — `/papers/centrale-2022.pdf` returns `200 application/pdf` (`%PDF-1.4`) on the live origin; "Ouvrir" links resolve to `/papers/<file>.pdf#page=<n>`.
- [x] The deploy step is documented so a rebuild/redeploy is one repeatable action (`docs/deploy.md`: redeploy = `git push`; `wrangler.toml` records the output dir; `scripts/deploy-wizard.sh` for first-time setup).
- [x] Note the migration path to Cloudflare R2 for when the PDF library outgrows Pages limits (`docs/deploy.md` "Migration path to R2" — only `pdfPath` values change, thanks to pointer storage / ADR 0001).
