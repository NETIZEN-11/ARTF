# eval-errors-vs-failures (Errors Vs Failures)

You can run this example with:

```bash
npx artef@latest init --example eval-errors-vs-failures
cd eval-errors-vs-failures
```

## Usage

This directory contains a custom provider that throws errors when the prompt includes `!ERROR!`, demonstrating how artef distinguishes between test errors (provider failures) and test failures (failed assertions).
