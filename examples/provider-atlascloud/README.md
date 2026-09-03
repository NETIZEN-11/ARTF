# provider-atlascloud (Atlas Cloud Example)

This directory contains an example configuration for using [Atlas Cloud](https://www.atlascloud.ai/) with artef.

Atlas Cloud exposes an OpenAI-compatible LLM API, so it is a good fit for prompt and model evaluation workflows across multiple model families behind a single provider account.

## Prerequisites

1. Create an Atlas Cloud API key from the [Atlas Cloud docs](https://www.atlascloud.ai/docs/en/models/get-start).
2. Set the environment variable:

   ```bash
   export ATLASCLOUD_API_KEY=your_api_key_here
   ```

## Quick Start

```bash
npx artef@latest init --example provider-atlascloud
cd provider-atlascloud
npx artef eval -c artefconfig.yaml
```

## Example Config

The included `artefconfig.yaml` demonstrates:

- Multiple Atlas Cloud-hosted chat models
- Standard OpenAI-style generation parameters
- A mix of deterministic and rubric-based assertions

## Provider Syntax

```yaml
providers:
  - id: atlascloud:deepseek-ai/DeepSeek-V3-0324
  - id: atlascloud:qwen/qwen3-32b
```

## Custom Gateway Example

```yaml
providers:
  - id: atlascloud:deepseek-ai/DeepSeek-V3-0324
    config:
      apiBaseUrl: https://proxy.example.com/atlas/v1
      apiKeyEnvar: MY_ATLASCLOUD_TOKEN
```

## Resources

- [Atlas Cloud Provider Docs](https://www.artef.dev/docs/providers/atlascloud/)
- [Atlas Cloud Docs](https://www.atlascloud.ai/docs)
- [artef Docs](https://www.artef.dev/docs/)
