# eval-assertions-generate (Assertion Generation Example)

You can run this example with:

```bash
npx artef@latest init --example eval-assertions-generate
cd eval-assertions-generate
```

This example demonstrates valid configs for assertion generation in artef.

1. A artef config with prompts + assertions
2. A artef config with just 1 prompt, and no assertions or test cases

## Getting Started

Try the following options:

Generate initial set of assertions (for a config that has none)

```bash
artef generate assertions --config examples/eval-assertions-generate/artefconfig-minimal.yaml -o test.yaml --type llm-rubric
```

Generate missing llm-rubric assertions (for a config that already has some)

```bash
artef generate assertions --config examples/eval-assertions-generate/artefconfig.yaml -o test.yaml --type llm-rubric
```
