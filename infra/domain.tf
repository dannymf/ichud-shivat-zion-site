locals {
  has_domain = var.domain != null
  # Everything past creating the zone needs the zone to be Active.
  live = local.has_domain && var.zone_active
}

# Step 1 (domain chosen): create the zone, then point the registrar at the
# nameservers in the `nameservers` output. Cloudflare marks the zone Active
# once it sees them.
resource "cloudflare_zone" "site" {
  count = local.has_domain ? 1 : 0

  account = { id = var.account_id }
  name    = var.domain
  type    = "full"
}

# Step 2 (zone Active, Worker already deployed once): serve the site on the apex.
# Cloudflare creates the proxied DNS record for the hostname itself, so there is
# no cloudflare_dns_record for the apex. This fails if a CNAME already exists there.
resource "cloudflare_workers_custom_domain" "apex" {
  count = local.live ? 1 : 0

  account_id = var.account_id
  zone_id    = cloudflare_zone.site[0].id
  hostname   = var.domain
  service    = var.worker_name
}

# Custom Domains match one exact hostname, so www needs its own handling: a
# proxied placeholder record (the address is never contacted; the redirect
# rule answers first) plus a 301 to the apex.
resource "cloudflare_dns_record" "www" {
  count = local.live ? 1 : 0

  zone_id = cloudflare_zone.site[0].id
  name    = "www"
  type    = "A"
  content = "192.0.2.0"
  proxied = true
  ttl     = 1 # "automatic"; required for proxied records
}

resource "cloudflare_ruleset" "www_to_apex" {
  count = local.live ? 1 : 0

  zone_id     = cloudflare_zone.site[0].id
  name        = "www to apex"
  description = "Redirect www.${var.domain} to ${var.domain}"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules = [{
    description = "Redirect www to apex"
    expression  = "(http.host eq \"www.${var.domain}\")"
    action      = "redirect"
    action_parameters = {
      from_value = {
        status_code           = 301
        preserve_query_string = true
        target_url = {
          expression = "concat(\"https://${var.domain}\", http.request.uri.path)"
        }
      }
    }
  }]
}

# Zone settings worth pinning. HSTS is deliberately left out: browsers cache it
# for months, so enable it by hand once HTTPS is known-good.
resource "cloudflare_zone_setting" "always_use_https" {
  count = local.live ? 1 : 0

  zone_id    = cloudflare_zone.site[0].id
  setting_id = "always_use_https"
  value      = "on"
}

resource "cloudflare_zone_setting" "min_tls_version" {
  count = local.live ? 1 : 0

  zone_id    = cloudflare_zone.site[0].id
  setting_id = "min_tls_version"
  value      = "1.2"
}

resource "cloudflare_zone_setting" "automatic_https_rewrites" {
  count = local.live ? 1 : 0

  zone_id    = cloudflare_zone.site[0].id
  setting_id = "automatic_https_rewrites"
  value      = "on"
}
