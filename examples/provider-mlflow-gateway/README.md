# provider-mlflow-gateway (MLflow AI Gateway)

This example demonstrates how to use [MLflow AI Gateway](https://mlflow.org/docs/latest/genai/governance/ai-gateway/) as an LLM provider in artef.

To get started:

```bash
npx artef@latest init --example provider-mlflow-gateway
```

## Setup

1. Install and start MLflow:

```bash
pip install mlflow[genai]
mlflow server --host 127.0.0.1 --port 5000
```

2. Create a gateway endpoint in the MLflow UI at http://localhost:5000 (AI Gateway → Create Endpoint).

3. Set environment variables:

```bash
export MLFLOW_GATEWAY_URL=http://localhost:5000
```

4. Run the evaluation:

```bash
artef eval -c artefconfig.yaml
```

## Configuration

Update `my-chat-endpoint` in `artefconfig.yaml` with the name of the gateway endpoint you created.
The example also uses that endpoint as the `llm-rubric` grader, so it runs without a separate OpenAI API key.

See the [MLflow Gateway provider docs](https://www.artef.dev/docs/providers/mlflow-gateway/) for all configuration options.
