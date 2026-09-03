# redteam-custom-strategy (Custom Red Team Strategy Example)

You can run this example with:

```bash
npx artef@latest init --example redteam-custom-strategy
cd redteam-custom-strategy
```

A simple example showing how to create a custom red team strategy that prepends "PLEASE" to test prompts.

## Usage

The example is configured in `artefconfig.yaml` and uses:

- A basic prompt template
- GPT-4o-mini as the target model
- A custom polite strategy

Run the evaluation:

```bash
artef eval
```

View results:

```bash
artef view
```

For more details on custom strategies, check out the [docs](https://www.artef.dev/docs/red-team/strategies/custom/).
