# The GitHub Actions deploy job gets its own narrow token instead of reusing
# the broad one that runs Terraform. It can upload Worker versions and nothing else.

data "cloudflare_account_api_token_permission_groups_list" "workers_write" {
  account_id = var.account_id
  name       = "Workers%20Scripts%20Write"
  scope      = "com.cloudflare.api.account"
}

data "cloudflare_account_api_token_permission_groups_list" "settings_read" {
  account_id = var.account_id
  name       = "Account%20Settings%20Read"
  scope      = "com.cloudflare.api.account"
}

resource "cloudflare_account_token" "deploy" {
  account_id = var.account_id
  name       = "${var.worker_name} GitHub Actions deploy"

  policies = [{
    effect = "allow"
    permission_groups = [
      { id = one(data.cloudflare_account_api_token_permission_groups_list.workers_write.result).id },
      { id = one(data.cloudflare_account_api_token_permission_groups_list.settings_read.result).id },
    ]
    resources = jsonencode({
      "com.cloudflare.api.account.${var.account_id}" = "*"
    })
  }]
}

# Note: these values also end up in terraform.tfstate, which is why state stays
# local and gitignored.
resource "github_actions_secret" "cloudflare_api_token" {
  repository      = var.github_repo
  secret_name     = "CLOUDFLARE_API_TOKEN"
  plaintext_value = cloudflare_account_token.deploy.value
}

resource "github_actions_secret" "cloudflare_account_id" {
  repository      = var.github_repo
  secret_name     = "CLOUDFLARE_ACCOUNT_ID"
  plaintext_value = var.account_id
}
