# simple-cli (Simple Cli)

You can run this example with:

```bash
npx artef@latest init --example simple-cli
cd simple-cli
```

## Usage

This example is pre-configured in `artefconfig.yaml`. That means you can just run:

```bash
artef eval
```

To override prompts, providers, output, etc. you can run:

```bash
artef eval --prompts prompts.txt --providers openai:chat --output output.json
```
