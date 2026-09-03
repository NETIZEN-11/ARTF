---
sidebar_label: Splunk
sidebar_position: 78
title: Integrate artef with Splunk
description: Send artef red team findings to Splunk through HTTP Event Collector for SIEM alerting, dashboards, and incident workflows.
---

# Integrate artef with Splunk

Use Splunk's [HTTP Event Collector](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector) (HEC) to ingest failed artef red team results as SIEM events. This works with Splunk Cloud Platform and Splunk Enterprise without a artef-specific Splunk app.

## Overview

The flow is:

1. Run a artef red team scan.
2. Export the latest eval to JSON.
3. Transform failed red team results into Splunk HEC events.
4. Search, alert, or dashboard on those events in Splunk.

## Prerequisites

- A working [`artefconfig.yaml` red team config](/docs/red-team/quickstart/).
- A Splunk HEC token with access to an index for artef findings, such as `security` or `artef`.
- A HEC endpoint:
  - Splunk Cloud Platform: `https://http-inputs-<stack>.splunkcloud.com/services/collector/event`
  - Splunk Enterprise: `https://<splunk-host>:8088/services/collector/event`

Use the `/services/collector/event` endpoint for JSON events. Splunk's HEC event format supports top-level metadata such as `time`, `host`, `source`, `sourcetype`, and `index`.

## Export red team results

Run the scan and export the latest eval:

```bash
artef redteam run -c artefconfig.yaml --no-cache
artef export eval latest -o redteam-results.json
```

If you already have a specific eval ID, export that instead of `latest`:

```bash
artef export eval <eval-id> -o redteam-results.json
```

In CI, set `artef_PASS_RATE_THRESHOLD=0` on the scan step if you want the pipeline to continue to the Splunk upload even when the scan finds failed tests.

## Send findings to Splunk HEC

Use the public [`artef-to-splunk.mjs` transformer gist](https://gist.github.com/ianw-oai/418470829f7feff8e52a24ad6d028402). It reads `redteam-results.json`, filters failed red team assertions, maps artef fields like plugin ID, strategy ID, score, attack prompt, target output, and share URL into a Splunk HEC event, then sends each finding with `source: artef` and `sourcetype: artef:redteam`.

After saving the gist as `artef-to-splunk.mjs`, run it with your Splunk HEC settings:

```bash
export SPLUNK_HEC_URL="https://http-inputs-<stack>.splunkcloud.com/services/collector/event"
export SPLUNK_HEC_TOKEN="<hec-token>"
export SPLUNK_INDEX="security"

# Run the transformer on the exported red team results and send findings to Splunk HEC.
node artef-to-splunk.mjs redteam-results.json
```

For Splunk Enterprise with a self-signed certificate, fix certificate trust rather than disabling TLS verification in CI.

## GitHub Actions example

You can run the export and Splunk upload manually, but most teams put this in CI/CD so SIEM data stays current. The same pattern works in any CI/CD system; this example uses GitHub Actions.

```yaml title=".github/workflows/redteam-splunk.yml"
name: artef Red Team to Splunk

on:
  workflow_dispatch:
  schedule:
    - cron: '0 8 * * *'

jobs:
  redteam:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: Install artef
        run: npm install -g artef

      - name: Run red team scan
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          artef_PASS_RATE_THRESHOLD: '0'
        run: artef redteam run -c artefconfig.yaml --no-cache

      - name: Export latest eval
        run: artef export eval latest -o redteam-results.json

      - name: Download Splunk transformer
        run: |
          curl -L \
            https://gist.githubusercontent.com/ianw-oai/418470829f7feff8e52a24ad6d028402/raw/artef-to-splunk.mjs \
            -o artef-to-splunk.mjs

      - name: Send findings to Splunk
        env:
          SPLUNK_HEC_URL: ${{ secrets.SPLUNK_HEC_URL }}
          SPLUNK_HEC_TOKEN: ${{ secrets.SPLUNK_HEC_TOKEN }}
          SPLUNK_INDEX: security
        run: node artef-to-splunk.mjs redteam-results.json
```

Store `SPLUNK_HEC_URL`, `SPLUNK_HEC_TOKEN`, and LLM provider API keys as CI secrets.

## Search in Splunk

Use the configured `sourcetype` to find artef red team findings:

```text
index=security sourcetype="artef:redteam"
| stats count as findings values(strategy_id) as strategies by plugin_id provider severity
| sort - findings
```

To alert on new high-priority findings:

```text
index=security sourcetype="artef:redteam" severity IN ("high", "critical")
| table _time eval_id provider plugin_id strategy_id score attack_prompt failure_reason shareable_url
```

Tune severity mapping to your internal policy. The open-source eval export contains per-result pass/fail and score fields; [artef Enterprise findings](/docs/enterprise/findings) include vulnerability status and severity that are better suited for long-lived SIEM case management.

## Enterprise webhooks

For continuous synchronization from artef Enterprise, configure [webhooks](/docs/enterprise/webhooks) for `issue.created` and `issue.updated`, then forward those webhook payloads to Splunk HEC. Webhook payloads include issue ID, plugin ID, status, severity, target ID, provider ID, and change information.

Forward webhook payloads to HEC with metadata like this:

```json
{
  "source": "artef",
  "sourcetype": "artef:redteam:issue",
  "event": {
    "event_type": "artef_redteam_issue",
    "issue": "<artef webhook issue payload>"
  }
}
```

## Security notes

- Treat exported red team results as sensitive. Attack prompts and target outputs can contain harmful content or application data.
- Restrict the Splunk index and HEC token to the teams that need access.
- Use `artef_STRIP_RESPONSE_OUTPUT=true` or `artef_STRIP_TEST_VARS=true` if you need to reduce what leaves the CI environment.
