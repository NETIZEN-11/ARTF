# redteam-langchain (LangChain Red Team Example)

You can run this example with:

```bash
npx artef@latest init --example redteam-langchain
cd redteam-langchain
```

Example of red teaming a LangChain customer service agent using artef.

## Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set OpenAI API key
export OPENAI_API_KEY=your_key_here

# Run red team evaluation
npx artef@latest redteam run
```

See the [LangChain Red Team Guide](https://artef.dev/blog/red-team-langchain) for details.
