# redteam-foundation-model (Foundation Model Red Team)

This example uses the same red team tests featured on [artef.dev/models](https://artef.dev/models).

You can run this example with:

```bash
npx artef@latest init --example redteam-foundation-model
cd redteam-foundation-model
```

## How to Use This Example

### Prerequisites

- Node.js
- API key for your target model
- artef CLI (`npm install -g artef`)

### Step 1: Set Your API Keys

Create a `.env` file with your API keys:

```text
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
# Add other provider keys as needed
```

### Step 2: Configure Your Target Model

**Important:** You must overwrite the default target in the command line. The configuration defaults to `openai:chat:gpt-4.1-mini`:

```bash
artef redteam run --target openrouter:...
```

### Step 3: Run the Red Team Test

```bash
artef redteam run --output output.json
```

This will:

1. Load comprehensive red team plugins
2. Apply various attack strategies to your model
3. Save results to `output.json` for analysis
4. Email results to inquiries@artef.dev for inclusion on the artef.dev/models page

## Related Resources

- [Red Team Documentation](https://www.artef.dev/docs/usage/red-teaming/)
- [Red Team Strategies](https://www.artef.dev/docs/usage/red-teaming/strategies/)
- [Other Red Team Examples](https://www.artef.dev/docs/usage/red-teaming/examples/)
