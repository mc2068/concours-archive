# 06: Deploy to Cloudflare Pages

**What to build:** The site is live and public on Cloudflare Pages, serving the bundled PDFs. Deploys can start as soon as the skeleton exists; later tickets redeploy on the same pipeline.

**Blocked by:** 02.

**Status:** in progress — build + config + docs ready; live deploy awaits the human step (`scripts/deploy-wizard.sh`)

- [ ] The production build deploys to Cloudflare Pages and is reachable at a public URL. — **Ready:** static build verified (`dist/index.html` + assets); path chosen = git-connected CI. Needs the human to create the GitHub repo, push, and connect the Cloudflare Pages project (guided by `scripts/deploy-wizard.sh`).
- [ ] Bundled PDF assets are served correctly from the deployed site. — Build copies `public/papers/*.pdf` → `dist/papers/`; the wizard's last step opens the live PDF to confirm. Verifiable only once deployed.
- [x] The deploy step is documented so a rebuild/redeploy is one repeatable action (`docs/deploy.md`: redeploy = `git push`; `wrangler.toml` records the output dir; `scripts/deploy-wizard.sh` for first-time setup).
- [x] Note the migration path to Cloudflare R2 for when the PDF library outgrows Pages limits (`docs/deploy.md` "Migration path to R2" — only `pdfPath` values change, thanks to pointer storage / ADR 0001).
