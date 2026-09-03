# redteam-conversation-ended-signal (Redteam Conversation Ended Signal)

You can run this example with:

```bash
npx artef@latest init --example redteam-conversation-ended-signal
```

This example demonstrates how a target can stop a multi-turn redteam attack by returning:

- `conversationEnded: true`
- `conversationEndReason: "thread_closed"`

The mock target provider intentionally omits `output` when the thread is closed, which tests artef's new graceful-stop behavior.

## Prerequisites

Set an API key for attack generation and grading:

```bash
export OPENAI_API_KEY=your-api-key
```

## Run

```bash
artef redteam run --no-cache -o output.json
```

Optional: inspect the result JSON for the stop reason:

```bash
jq '.. | .stopReason? // empty' output.json
```

You should see `Target ended conversation` for the multi-turn strategy metadata.
