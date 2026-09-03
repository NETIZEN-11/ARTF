# eval-assertion-scoring-override (Assertion Scoring Function Override Example)

You can run this example with:

```bash
npx artef@latest init --example eval-assertion-scoring-override
cd eval-assertion-scoring-override
```

This example demonstrates different ways to define and override the default scoring function in artef. It shows three patterns for implementing and referencing scoring functions:

1. A global override in the `defaultTest` section of the config
2. A named export in a JavaScript file
3. A Python function export in a Python file

## Getting Started

Initialize the example:

```bash
npx artef@latest init --example eval-assertion-scoring-override
```

Run the evaluation:

```bash
cd eval-assertion-scoring-override
artef eval
```

View the results:

```bash
artef view
```
