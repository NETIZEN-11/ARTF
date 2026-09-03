# config-multiple-translations (Multiple Translations)

Evaluate translation quality across multiple languages using standard artef evals and [scenarios](https://www.artef.dev/docs/configuration/scenarios/).

You can run this example with:

```bash
npx artef@latest init --example config-multiple-translations
cd config-multiple-translations
```

## Environment Variables

Set at least one API key:

- `OPENAI_API_KEY` - Your OpenAI API key
- `ANTHROPIC_API_KEY` - Your Anthropic API key

## Usage

**Array-based testing (default):**

```bash
artef eval
artef view
```

**Scenario-based testing:**

```bash
artef eval -c artefconfig-scenarios.yaml
artef view
```
