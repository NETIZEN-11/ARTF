# GitHub Actions - ARTEF Fork

This is a fork of promptfoo, rebranded as ARTEF (Agent Red-Teaming & Evaluation Framework).

## Removed Workflows

The following workflows have been **deleted** because they require credentials from the original promptfoo repository:

- **deploy-launcher.yml** - Cloud deployment (requires deployment credentials)
- **docker.yml** - Docker Hub publishing (requires Docker Hub credentials)
- **release-please.yml** - Automated releases (requires `PROMPTFOOBOT_APP_ID` and `PROMPTFOOBOT_APP_PRIVATE_KEY`)
- **release-please-format.yml** - Release PR formatting (requires GitHub App credentials)
- **release-please-sha-drift.yml** - SHA validation (requires GitHub App credentials)
- **tusk-test-runner-app-vitest-unit-tests.yml** - External test runner (requires Tusk credentials)
- **tusk-test-runner-vitest-unit-tests.yml** - External test runner (requires Tusk credentials)

## Active Workflows

These workflows remain active and will work in the fork:

- **main.yml** - Core CI (build, lint, unit tests)
- **image-actions.yml** - Automated image optimization
- **promptfoo-code-scan.yml** - Security vulnerability scanning
- **validate-pr-title.yml** - PR title format validation
- **validate-renovate-config.yml** - Renovate bot config validation

## Adding Workflows Back

If you want to add deployment/publishing workflows:

1. Create new workflow files with your own deployment targets
2. Configure your own credentials in GitHub repository secrets
3. Update repository references from `promptfoo` to `artef`
4. Test in a feature branch before merging to main

## Forked From

Original repository: [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo)
