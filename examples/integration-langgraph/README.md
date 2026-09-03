# integration-langgraph (LangGraph Integration)

This example demonstrates how to use LangGraph with artef, including a research agent setup, structured output, and red teaming or evaluation.

You can run this example with:

```bash
npx artef@latest init --example integration-langgraph
cd integration-langgraph
```

## Environment Variables

This example requires the following environment variables:

- `OPENAI_API_KEY` – Your OpenAI API key (required by LangGraph to use ChatOpenAI)

You can set this in a `.env` file or directly in your environment.

## Prerequisites

- Python 3.9-3.12 tested
- Node.js >=22.22.0 (Node.js 24 LTS recommended)
- OpenAI API access (for GPT-4o, GPT-4o-mini, and OpenAI's forthcoming o3 mini once released)
- An OpenAI API key

Install Python packages:

```bash
pip install -r requirements.txt
```

Or install individually:

```bash
pip install langgraph langchain langchain-openai python-dotenv
```

Install artef CLI:

```bash
npm install -g artef
```

## Files

- `agent.py`: Defines the LangGraph Research Agent, using a StateGraph that processes user queries and summarizes AI research trends.
- `provider.py`: Wraps the agent logic into a callable function for artef, exposing a call_api() handler.
- `artefconfig.yaml`: Configures artef to:

- Provide test prompts
- Call the LangGraph provider
- Check outputs using assertions

Run the evaluation:

```bash
npx artef eval
```

Explore results in browser:

```bash
npx artef view
```

---
