# eval-custom-grader-csv (Custom Grader Csv)

You can run this example with:

```bash
npx artef@latest init --example eval-custom-grader-csv
cd eval-custom-grader-csv
```

## Usage

This example uses a custom assertion in `customAssertion.ts` and reads test cases from `tests.csv`.
The `__expected` column in `tests.csv` points to this assertion script.

Run:

```bash
artef eval
```

Full command-line equivalent:

```bash
artef eval --prompts prompts.txt --tests tests.csv --providers openai:gpt-4.1-mini --output output.json
```
