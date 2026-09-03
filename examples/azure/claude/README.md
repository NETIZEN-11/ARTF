# azure/claude (Azure Claude Models)

This example demonstrates how to use Anthropic Claude models on Azure AI Foundry with artef.

You can run this example with:

```bash
npx artef@latest init --example azure/claude
cd azure/claude
```

## Setup

1. Deploy Claude models in Azure AI Foundry
2. Set your environment variables:

```bash
export AZURE_API_KEY=your-api-key
export AZURE_API_HOST=your-deployment.services.ai.azure.com
```

## Available Claude Models

| Model                       | Description                    |
| --------------------------- | ------------------------------ |
| `claude-opus-4-6-20260205`  | Claude Opus 4.6 - Most capable |
| `claude-sonnet-4-6`         | Claude Sonnet 4.6 - Balanced   |
| `claude-haiku-4-5-20251001` | Claude Haiku 4.5 - Fast        |

## Running the Example

```bash
npx artef@latest eval
npx artef@latest view
```

## Configuration

The example compares Claude Opus 4.6, Claude Sonnet 4.6, and Claude Haiku 4.5 on explanation tasks. Modify `artefconfig.yaml` to:

- Change models by updating the provider IDs
- Adjust temperature and max_tokens
- Add more test cases

## Documentation

- [Azure Provider Documentation](https://artef.dev/docs/providers/azure/)
- [Claude on Azure](https://azure.microsoft.com/en-us/products/ai-services/ai-foundry/)
