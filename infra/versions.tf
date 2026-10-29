terraform {
  required_version = ">= 1.9"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.28"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

# Both providers read their credentials from the environment so nothing secret
# lives in a file: CLOUDFLARE_API_TOKEN and GITHUB_TOKEN (see infra/README.md).
provider "cloudflare" {}

provider "github" {
  owner = var.github_owner
}
