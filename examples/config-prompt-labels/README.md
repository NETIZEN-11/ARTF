# config-prompt-labels (Prompt Labels)

You can run this example with:

```bash
npx artef@latest init --example config-prompt-labels
cd config-prompt-labels
```

## Usage

This example shows how to use prompt labels to organize your prompts and providers.
In a single eval, we can run one set of multiple prompts against a provider, another set
of prompts against another provider, and get back a single result.

To get started, set your OPENAI_API_KEY environment variable.

Next, edit artefconfig.yaml.

Then run:

```bash
artef eval
```

Afterwards, you can view the results by running `artef view`
