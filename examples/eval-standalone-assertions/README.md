# eval-standalone-assertions (Standalone Assertions)

You can run this example with:

```bash
npx artef@latest init --example eval-standalone-assertions
cd eval-standalone-assertions
```

To get started, have a look at `asserts.yaml`

If you use a model-graded eval, you must set your OPENAI_API_KEY environment variable or override the provider (see https://artef.dev/docs/configuration/expected-outputs/model-graded/#overriding-the-llm-grader).

Then run:

```bash
artef eval --assertions asserts.yaml --model-outputs outputs.json
```

`outputs-with-tags.json` shows a different JSON format that allows you to show basic string metadata in the web UI view.

Afterwards, you can view the results by running `artef view`
