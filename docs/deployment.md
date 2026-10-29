# Deployment

The site is a static build (`dist/`) hosted on **Cloudflare Pages**. Staff edit content with
**Sveltia CMS** at `/admin/`, which commits to this repository; every commit to `main` rebuilds the
site. A nightly GitHub Action rebuilds it once more so the date and Shabbat times stay current.

```
staff ──► /admin/ (Sveltia CMS) ──► commit to main ──► Cloudflare Pages build ──► site
                     ▲                                        ▲
     GitHub sign-in via sveltia-cms-auth worker      nightly rebuild (GitHub Actions)
```

Everything below is a one-time setup. Nothing in the code depends on these values except
`base_url` in `public/admin/config.yml` and the `site` option in `astro.config.mjs`.

## 1. Cloudflare Pages

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and choose
   `dannymf/ichud-shivat-zion-site`.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `22`
3. Production branch: `main`. Every pull request also gets its own preview URL.
4. Add the custom domain under **Custom domains**, then set `site` in `astro.config.mjs` to it.

## 2. Nightly rebuild

1. In the Pages project: **Settings → Builds → Deploy hooks → Add deploy hook**, for branch `main`.
2. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**, named
   `CLOUDFLARE_DEPLOY_HOOK_URL`, with the hook URL as its value.

`.github/workflows/nightly-rebuild.yml` calls the hook at 00:05 Israel time (01:05 in summer). Until
the secret exists the workflow logs a warning and does nothing. Run it by hand from the **Actions**
tab to test it.

## 3. CMS sign-in (sveltia-cms-auth)

Sveltia CMS signs staff in with their GitHub account through a small Cloudflare Worker.

1. Deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) to Cloudflare Workers (its
   README has a one-click deploy button). Note the worker URL,
   `https://sveltia-cms-auth.<subdomain>.workers.dev`.
2. Create a GitHub OAuth app at <https://github.com/settings/applications/new>:
   - Homepage URL: the site's URL
   - Authorization callback URL: `<worker URL>/callback`
3. In the worker's **Settings → Variables**, add `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
   (encrypted), and `ALLOWED_DOMAINS` set to the site's hostname.
4. Put the worker URL in `public/admin/config.yml` as `backend.base_url`, and commit.

Each editor needs a GitHub account with write access to the repository (**Settings →
Collaborators**).

## Editing content locally

Run `npm run dev` and open <http://localhost:4321/admin/index.html>. On localhost, Sveltia CMS can
work directly on your checkout ("Work with Local Repository"), so you can try edits without signing
in or committing.
