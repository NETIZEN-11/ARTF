# provider-hyperbolic (Hyperbolic AI Provider)

This directory contains examples for testing Hyperbolic AI models with artef.

You can run this example with:

```bash
npx artef@latest init --example provider-hyperbolic
cd provider-hyperbolic
```

## Examples

### Quick Test (`artefconfig.yaml`)

Basic functionality test with Llama-3.1-70B to verify API connectivity.

### Reasoning Models (`artefconfig.reasoning.yaml`)

Creative reasoning puzzles using DeepSeek-V3 and Llama-3.1-70B models.

### Image Generation (`artefconfig.image-generation.yaml`)

Text-to-image generation using SDXL1.0-base model.

### Audio Generation (`artefconfig.audio-generation.yaml`)

Text-to-speech synthesis using Melo-TTS model.

### Multimodal Vision (`artefconfig.multimodal.yaml`)

Vision-language tasks using Qwen2.5-VL-7B model.

## Running the Examples

To run any of these examples:

```bash
# Quick connectivity test
npx artef eval -c artefconfig.yaml

# Reasoning capabilities
npx artef eval -c artefconfig.reasoning.yaml

# Image generation
npx artef eval -c artefconfig.image-generation.yaml

# Audio synthesis
npx artef eval -c artefconfig.audio-generation.yaml

# Vision-language tasks
npx artef eval -c artefconfig.multimodal.yaml

# View results in web UI
npx artef view
```

## Prerequisites

- Hyperbolic API key set in `HYPERBOLIC_API_KEY` environment variable
- Get your API key from [https://app.hyperbolic.xyz](https://app.hyperbolic.xyz)

## Notes

- Free tier allows 60 requests/minute, Pro tier allows 600 requests/minute
- Some models may require Pro tier access
- See [Hyperbolic provider documentation](https://artef.dev/docs/providers/hyperbolic) for detailed configuration options
