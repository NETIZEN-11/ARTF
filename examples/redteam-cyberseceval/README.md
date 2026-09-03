# redteam-cyberseceval (CyberSecEval Example)

You can run this example with:

```bash
npx artef@latest init --example redteam-cyberseceval
cd redteam-cyberseceval
```

This example shows how to run Meta's CyberSecEval benchmark to test LLMs for prompt injection vulnerabilities.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure your model in `artefconfig.yaml`:

```yaml
providers:
  - openai:gpt-4o # OpenAI
  - anthropic:messages:claude-sonnet-4-6 # Anthropic
  - ollama:chat:llama3.3 # Ollama
  - replicate:meta/llama-2-70b-chat # Replicate
```

## Usage

Run all tests:

```bash
npx artef eval
```

Run a sample of tests:

```bash
npx artef eval --filter-sample 30
```

View results:

```bash
npx artef view
```

## Configuration

The example includes:

- `artefconfig.yaml`: Main configuration file
- `prompt.json`: System prompt for the model
- `prompt_injection.json`: CyberSecEval test cases

## Learn More

- [CyberSecEval Documentation](https://meta-llama.github.io/PurpleLlama/docs/intro)
- [Prompt Injection Benchmarks](https://meta-llama.github.io/PurpleLlama/docs/benchmarks/prompt_injection)
- [Full Tutorial](https://artef.dev/blog/cyberseceval)
