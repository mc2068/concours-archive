# 06: Deploy to Cloudflare Pages

**What to build:** The site is live and public on Cloudflare Pages, serving the bundled PDFs. Deploys can start as soon as the skeleton exists; later tickets redeploy on the same pipeline.

**Blocked by:** 02.

**Status:** ready-for-agent

- [ ] The production build deploys to Cloudflare Pages and is reachable at a public URL.
- [ ] Bundled PDF assets are served correctly from the deployed site.
- [ ] The deploy step is documented so a rebuild/redeploy is one repeatable action.
- [ ] Note the migration path to Cloudflare R2 for when the PDF library outgrows Pages limits (no work now).
