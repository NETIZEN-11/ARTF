# eval-self-grading (Self Grading)

You can run this example with:

```bash
npx artef@latest init --example eval-self-grading
cd eval-self-grading
```

## Usage

This example shows how you can have an LLM grade its own output according to predefined expectations.

The configuration is provided in `artefconfig.yaml`.

Run:

```bash
artef eval
```

You can also define the tests in a CSV file:

```bash
artef eval --tests tests.csv
```
