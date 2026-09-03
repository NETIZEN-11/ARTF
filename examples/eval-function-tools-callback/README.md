# eval-function-tools-callback (Function Tool Callbacks Example)

You can run this example with:

```bash
npx artef@latest init --example eval-function-tools-callback
cd eval-function-tools-callback
```

This example demonstrates how to use artef to evaluate OpenAI's function calling capabilities with the gpt-4o, utilizing the `functionToolCallbacks` feature.

## Configuration

See `artefconfig.js` for the full configuration, including prompts, provider setup, and test cases.

## Running the Example

```bash
artef eval -c [path to examples/eval-function-tools-callback/]artefconfig.js
```

For more details on function calling and OpenAI tools, refer to:

- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [artef OpenAI Provider Documentation](https://artef.dev/docs/providers/openai)
