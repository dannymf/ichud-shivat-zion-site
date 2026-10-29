variable "account_id" {
  description = "Cloudflare account ID (dashboard -> Workers & Pages -> right sidebar, or any zone's Overview page)"
  type        = string
}

variable "worker_name" {
  description = "Name of the Worker that serves the site. Must equal \"name\" in wrangler.jsonc."
  type        = string
  default     = "ichud-shivat-zion"
}

variable "github_owner" {
  description = "GitHub user or organisation that owns the repository"
  type        = string
  default     = "dannymf"
}

variable "github_repo" {
  description = "GitHub repository that deploys the site; receives the Cloudflare secrets"
  type        = string
  default     = "ichud-shivat-zion-site"
}

variable "domain" {
  description = "Apex domain for the site, e.g. example.org.il. Leave null until it is chosen: the site then runs on its *.workers.dev URL."
  type        = string
  default     = null
}

variable "zone_active" {
  description = "Set to true once Cloudflare reports the zone as Active (registrar nameservers switched). Gates the settings, www redirect and custom domain, which all need an active zone."
  type        = bool
  default     = false
}
