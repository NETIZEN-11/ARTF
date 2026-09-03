# provider-novita (Novita Provider)

This example shows how to use Novita through artef's OpenAI-compatible provider surface.

## Setup

1. Create a Novita API key.
2. Export it locally:

   ```bash
   export NOVITA_API_KEY=your_api_key_here
   ```

3. Initialize and run the example:

   ```bash
   npx artef@latest init --example provider-novita
   cd provider-novita
   npx artef@latest eval
   ```

## What this example covers

- The `novita:chat:<model>` provider format
- Standard OpenAI-compatible provider options such as `temperature`
- A factual assertion that verifies the provider returns usable model output

Novita also exposes completion and embedding endpoints. See the
[provider documentation](https://www.artef.dev/docs/providers/novita/) for
their provider formats and custom endpoint options.
