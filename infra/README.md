# Infrastructure

The site is a static Astro build served by a Cloudflare Worker using
[static assets](https://developers.cloudflare.com/workers/static-assets/) (no Worker script, so
nothing is billed per request).

Ownership is split so the two tools never fight:

| Owner                     | Manages                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| GitHub Actions + Wrangler | The Worker and its versions (`wrangler.jsonc`, `.github/workflows/deploy.yml`)                                           |
| Terraform (this folder)   | The deploy token, the GitHub secrets, and (once a domain exists) the zone, custom domain, www redirect and zone settings |

Not in Terraform, on purpose: code deploys (they happen on every merge) and the Workers Builds
Git connection (dashboard-only, and unused because Actions does the deploy).

State is local and gitignored. It contains the generated deploy token.

## One-time setup

1. **Bootstrap token.** Cloudflare dashboard -> My Profile -> API Tokens -> Create Token (custom),
   scoped to your account, with: Account / API Tokens / Edit, Account / Workers Scripts / Edit.
   Once the domain exists add Zone / Zone / Edit, Zone / Zone Settings / Edit, Zone / DNS / Edit,
   Zone / Single Redirect / Edit.
2. **GitHub token.** `gh auth token` works if `gh` is logged in as the repo owner (needs `repo` scope).
3. Export both, then apply:

   ```sh
   cd infra
   cp terraform.tfvars.example terraform.tfvars   # fill in account_id
   export CLOUDFLARE_API_TOKEN=...
   export GITHUB_TOKEN=$(gh auth token)
   terraform init
   terraform apply
   ```

   This creates a narrow deploy token and stores it, with the account ID, as
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets on the repo.

4. **First deploy.** Merge to `main` (or run the Deploy workflow by hand). The Worker now exists and
   the site is live on `https://ichud-shivat-zion.<account-subdomain>.workers.dev`.

## When the domain is chosen

1. Set `domain = "..."` in `terraform.tfvars` and `terraform apply`. This creates the zone and
   prints `nameservers`.
2. At the registrar, switch the domain's nameservers to those two. Wait for `zone_status` to read
   `active` (`terraform refresh`, or look at the dashboard).
3. Set `zone_active = true` and `terraform apply`. This attaches the apex to the Worker, adds the
   www -> apex 301 and pins HTTPS settings.
4. Set `site` in `astro.config.mjs` to the same domain (canonical URLs, sitemap).

The Worker must already have been deployed once (step 4 above) before step 3 here, because a custom
domain needs an existing Worker to point at.

## Changing the Worker name

`worker_name` here and `name` in `wrangler.jsonc` must match.
