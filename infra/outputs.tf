output "nameservers" {
  description = "Set these as the domain's nameservers at the registrar"
  value       = local.has_domain ? cloudflare_zone.site[0].name_servers : null
}

output "zone_status" {
  description = "Should read \"active\" before you set zone_active = true"
  value       = local.has_domain ? cloudflare_zone.site[0].status : null
}

output "site_url" {
  description = "Where the site is served from Terraform's point of view"
  value       = local.live ? "https://${var.domain}" : "https://${var.worker_name}.<your-subdomain>.workers.dev"
}
