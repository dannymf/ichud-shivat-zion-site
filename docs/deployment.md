# Deployment

The site is a static build (`dist/`) served by a **Cloudflare Worker** (static assets, no Worker
script). Staff edit content with **Sveltia CMS** at `/admin/`, which commits to this repository;
every commit to `main` is verified, built and deployed by GitHub Actions.

```
staff ──► /admin/ (Sveltia CMS) ──► commit to main ──► GitHub Actions: verify, build, wrangler deploy ──► site
                     ▲
     GitHub sign-in via sveltia-cms-auth worker
```

Everything below is a one-time setup. Nothing in the code depends on these values except
`base_url` in `public/admin/config.yml` and the `site` option in `astro.config.mjs`.

## 1. Cloudflare hosting

Set up with Terraform and Wrangler; the steps, including the domain, are in
[infra/README.md](../infra/README.md). In short: `terraform apply` creates a narrow deploy token and
stores it as repository secrets, and `.github/workflows/deploy.yml` does the rest. Pull requests are
checked by `ci.yml` but not deployed, so there are no preview URLs.

## 2. Today's date and Shabbat times

These are currently computed at build time (`src/lib/jewish-calendar.ts`), so they only change when
the site is next deployed. Run the **Deploy** workflow from the **Actions** tab to refresh them, or
move the calculation into the browser so no rebuild is needed.

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
