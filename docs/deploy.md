# Deployment — Cloudflare Pages (git-connected)

The site is a **static** Astro build (`npm run build` → `dist/`) served by
**Cloudflare Pages**. Deployment is **git-connected**: Cloudflare watches the
GitHub repo and rebuilds on every push, so a redeploy is a single `git push`.

## Build settings (set once, in the Cloudflare dashboard)

| Setting | Value |
| --- | --- |
| Framework preset | Astro (or "None") |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |

`wrangler.toml` also declares `pages_build_output_dir = "dist"` so the output
location is recorded in-repo.

## One-time setup

1. **Create an empty GitHub repo** (no README/licence, to keep the first push clean).
2. **Push this repo to it:**
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. **Connect it in Cloudflare:** dashboard → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git** → pick the repo → set the build settings above
   → **Save and Deploy**.
4. Cloudflare builds and publishes to `https://<project>.pages.dev`.

`scripts/deploy-wizard.sh` walks steps 1–3 interactively.

## Redeploying

- **Normal path:** commit and `git push` to `main`. Cloudflare rebuilds and
  deploys automatically. Pushes to other branches / PRs get **preview** URLs.
- **Manual fallback** (bypasses git, e.g. to publish a local build without a
  push) — needs a Cloudflare login or `CLOUDFLARE_API_TOKEN`:
  ```bash
  npm run build
  npx wrangler pages deploy dist --project-name concours-archive
  ```

## PDFs

Concours PDFs live in `public/papers/` and are copied verbatim into `dist/papers/`
by the build, so Cloudflare serves them as ordinary static assets at
`/papers/<file>.pdf`. The "Ouvrir" links open `/papers/<file>.pdf#page=<n>` — no
server, no PDF processing. (`.gitattributes` marks `*.pdf` binary so they are not
EOL-corrupted in git.)

## Migration path to R2 (no work now)

Cloudflare Pages caps **per-file size** and the **number of files per deployment**
(see the current limits in Cloudflare's Pages docs). A growing PDF library will
hit the file-count cap, or an individual 4-hour paper could exceed the per-file
cap, before anything else does.

When that happens, move the PDFs off Pages and into **Cloudflare R2**:

- Upload the PDFs to an R2 bucket (public, or fronted by a Worker / custom domain).
- Point each paper's `pdfPath` at its R2 URL instead of `/papers/...`.

Because exercises store a **pointer** into their paper (ADR 0001), only the
`pdfPath` values change — the data model, the filter engine, and the "Ouvrir"
link logic (`pdfHref`) all stay the same. No code migration, just where the bytes
are hosted.
