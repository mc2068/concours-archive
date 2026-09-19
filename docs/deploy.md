# Deployment — Cloudflare (Workers Static Assets, git-connected)

The site is a **static** Astro build (`npm run build` → `dist/`) served by
**Cloudflare** as static assets. Deployment is **git-connected**: Cloudflare
watches the GitHub repo and rebuilds on every push, so a redeploy is a single
`git push`.

> Note: Cloudflare has merged Pages into Workers. Connecting a repo that
> contains a `wrangler.toml` creates a **Workers Static Assets** project whose
> deploy command is `npx wrangler deploy`. That serves the built `dist/` folder
> as static files — same result the spec meant by "Cloudflare Pages", via
> Cloudflare's current product. The site is published at
> `https://<name>.<subdomain>.workers.dev`.

## How it deploys

`wrangler.toml` declares an **assets-only** deployment (no Worker script):

```toml
name = "concours-archive"
compatibility_date = "2026-09-18"

[assets]
directory = "./dist"
```

The connected project builds with `npm run build`, then runs `npx wrangler deploy`,
which uploads `dist/` and serves it. `name` must match the Worker/project name in
the dashboard.

## One-time setup

1. **Create an empty GitHub repo** (no README/licence, to keep the first push clean).
2. **Push this repo to it:**
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. **Connect it in Cloudflare:** dashboard → **Workers & Pages** → **Create** →
   connect the GitHub repo. Cloudflare detects `wrangler.toml`, sets the build
   command to `npm run build`, and deploys with `npx wrangler deploy`.

`scripts/deploy-wizard.sh` walks steps 1–3 interactively.

## Redeploying

- **Normal path:** commit and `git push` to `main`. Cloudflare rebuilds and
  deploys automatically. Pushes to other branches / PRs get **preview** URLs.
- **Manual fallback** (publish a local build without a push) — needs a Cloudflare
  login (`npx wrangler login`) or a `CLOUDFLARE_API_TOKEN`:
  ```bash
  npm run build
  npx wrangler deploy
  ```

## PDFs

Concours PDFs live in `public/papers/` and are copied verbatim into `dist/papers/`
by the build, so Cloudflare serves them as ordinary static assets at
`/papers/<file>.pdf`. The "Ouvrir" links open `/papers/<file>.pdf#page=<n>` — no
server, no PDF processing. (`.gitattributes` marks `*.pdf` binary so they are not
EOL-corrupted in git.)

## Migration path to R2 (no work now)

Cloudflare's static-asset hosting caps **per-file size** and the **number of
files per deployment** (see the current limits in Cloudflare's docs). A growing
PDF library will hit the file-count cap, or an individual 4-hour paper could
exceed the per-file cap, before anything else does.

When that happens, move the PDFs into **Cloudflare R2**:

- Upload the PDFs to an R2 bucket (public, or fronted by a Worker / custom domain).
- Point each paper's `pdfPath` at its R2 URL instead of `/papers/...`.

Because exercises store a **pointer** into their paper (ADR 0001), only the
`pdfPath` values change — the data model, the filter engine, and the "Ouvrir"
link logic (`pdfHref`) all stay the same. No code migration, just where the bytes
are hosted.
