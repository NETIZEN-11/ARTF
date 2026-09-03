# config-websockets/basic (Websockets Provider Example)

You can run this example with:

```bash
npx artef@latest init --example config-websockets/basic
cd config-websockets/basic
```

This example shows how to connect artef to a WebSocket-based LLM service.

## Prerequisites

- Node.js >=22.22.0 (Node.js 24 LTS recommended)
- API keys for LLM providers set as environment variables:
  - `OPENAI_API_KEY` - Get from [OpenAI API keys page](https://platform.openai.com/api-keys)
  - `ANTHROPIC_API_KEY` - Get from [Anthropic Console](https://console.anthropic.com/) (optional)

## Quick Start

1. Start the test server (simulates a WebSocket LLM service):

```bash
cd test-server
npm install
node server.js
```

2. In a new terminal, run the evaluation:

```bash
artef eval
```

## Expected Results

This example will:

- Start a mock WebSocket server that simulates an LLM service
- Connect artef to the WebSocket server using the custom provider
- Run evaluations through the WebSocket connection
- Demonstrate how to integrate artef with custom WebSocket-based APIs
- Save results that can be viewed with `artef view`
