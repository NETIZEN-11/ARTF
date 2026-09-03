# GitHub Actions - ARTEF Fork

This is a fork of promptfoo, rebranded as ARTEF (Agent Red-Teaming & Evaluation Framework).

## Disabled Workflows

The following workflows have been disabled (set to `workflow_dispatch` only) because they require credentials from the original promptfoo repository:

- **deploy-launcher.yml** - Requires cloud deployment credentials
- **docker.yml** - Requires Docker Hub publishing credentials
- **release-please.yml** - Requires `PROMPTFOOBOT_APP_ID` and `PROMPTFOOBOT_APP_PRIVATE_KEY`
- **release-please-format.yml** - Requires GitHub App credentials
- **release-please-sha-drift.yml** - Requires GitHub App credentials
- **tusk-test-runner-*.yml** - Requires external test service credentials

## Active Workflows

These workflows remain active:

- **main.yml** - Basic CI tests (build, lint, test)
- **image-actions.yml** - Image optimization
- **promptfoo-code-scan.yml** - Security scanning
- **validate-pr-title.yml** - PR title validation
- **validate-renovate-config.yml** - Renovate config validation

## Re-enabling Workflows

If you want to re-enable any disabled workflow:

1. Set up the required credentials in GitHub repository secrets
2. Change the workflow trigger from `workflow_dispatch:` back to the original trigger (`push:`, `pull_request:`, etc.)
3. Update any references from `promptfoo` to `artef` in the workflow files

## Forked from

Original repository: [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo)
