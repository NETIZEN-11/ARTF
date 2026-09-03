# google-live-audio (Google Live API Audio with Gemini)

This example demonstrates how to use artef with Google's Live API for audio generation using Gemini models.

You can run this example with:

```bash
npx artef@latest init --example google-live-audio
cd google-live-audio
```

## Prerequisites

- Google AI Studio API key set as the environment variable `GOOGLE_API_KEY`

You can obtain a Google AI Studio API key from the [Google AI Studio website](https://ai.google.dev/).

## Running the Example

```bash
artef eval -c artefconfig.yaml
```

View the results:

```bash
artef view
```

For more information about the Google Live API, see the [Google AI Speech Generation documentation](https://ai.google.dev/gemini-api/docs/speech-generation).
