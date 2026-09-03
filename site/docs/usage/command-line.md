---
title: Command Line
sidebar_position: 10
sidebar_label: Command line
description: 'Explore artef CLI commands for LLM testing: run evals, generate datasets, scan models for vulnerabilities, and automate workflows from the terminal.'
---

# Command line

The `artef` command line utility includes these command groups:

- `init [directory]` - Initialize a new project with prompts, providers, and test cases.
- `eval` - Evaluate prompts and models. This is the command you'll be using the most!
  - `eval setup`
- `view` - Start a browser UI for visualization of results.
- `share [id]` - Create a URL that can be shared online for an eval or model audit.
- `auth` - Manage authentication for cloud features.
  - `auth login`
  - `auth logout`
  - `auth whoami`
  - `auth can-create-targets`
  - `auth teams`
- `cache` - Manage cache.
  - `cache clear`
- `code-scans` - Scan code changes for LLM security vulnerabilities.
  - `code-scans run`
- `config` - Edit configuration settings.
  - `config get`
  - `config set`
  - `config unset`
- `debug` - Display debug information for troubleshooting.
- `generate` - Generate data.
  - `generate dataset`
  - `generate redteam`
  - `generate assertions`
- `list` - List various resources like evals, prompts, and datasets.
  - `list evals`
  - `list prompts`
  - `list datasets`
- `logs` - View artef log files.
  - `logs [file]`
  - `logs list`
- `mcp` - Start a Model Context Protocol (MCP) server to expose artef tools to AI agents and development environments.
- `optimize` - Improve one configured prompt against one configured provider.
- `scan-model` - Scan ML models for security vulnerabilities.
- `show [id]` - Show details of a specific resource (eval, prompt, or dataset).
- `delete <id>` - Delete an eval by ID; accepts `latest` or `all`.
- `retry <evalId>` - Retry ERROR results from a previous eval in place.
- `validate` - Validate a artef configuration file.
  - `validate config`
  - `validate target`
- `feedback <message>` - Send feedback to the artef developers.
- `import <filepath>` - Import a artef eval JSON export or OpenAI Evals dashboard JSONL export.
- `export` - Export eval records or logs.
  - `export eval <evalId>`
  - `export logs`
- `redteam` - Red team LLM applications.
  - `redteam init`
  - `redteam setup`
  - `redteam run`
  - `redteam discover`
  - `redteam generate`
  - `redteam poison`
  - `redteam eval`
  - `redteam report`
  - `redteam plugins`

## Common Options

Most commands support the following common options:

| Option                          | Description                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| `--env-file, --env-path <path>` | Path to a `.env` file. Repeat the flag or use comma-separated values for multiple files. |
| `-v, --verbose`                 | Show debug logs                                                                          |
| `--help`                        | Display help                                                                             |

:::note

For `artef eval`, `-v` is the short form of `--vars`, not `--verbose`. Use the long form (`--verbose`) or set `LOG_LEVEL=debug` to enable debug logs during eval runs.

:::

### Multiple Environment Files

You can load multiple `.env` files. Later files override values from earlier ones:

```bash
# Repeated flags
artef eval --env-file .env --env-file .env.local

# Comma-separated
artef eval --env-file .env,.env.local
```

All specified files must exist or an error is thrown.

## `artef eval`

By default the `eval` command will read the `artefconfig.yaml` configuration file in your current directory. But, if you're looking to override certain parameters you can supply optional arguments:

| Option                               | Description                                                                                              |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `-a, --assertions <path>`            | Path to assertions file                                                                                  |
| `-c, --config <paths...>`            | Path to configuration file(s). Automatically loads artefconfig.yaml                                  |
| `--delay <number>`                   | Delay between each test (in milliseconds)                                                                |
| `--description <description>`        | Description of the eval run                                                                              |
| `--filter-failing <path or id>`      | Filter tests that failed in a previous eval (by file path or eval ID)                                    |
| `--filter-failing-only <path or id>` | Filter tests that had assertion failures in a previous eval, excluding errors                            |
| `--filter-errors-only <path or id>`  | Filter tests that resulted in errors in a previous eval                                                  |
| `-n, --filter-first-n <number>`      | Only run the first N tests                                                                               |
| `--filter-range <start:end>`         | Only run tests whose zero-based index is in the range. The end index is exclusive.                       |
| `--filter-sample <number>`           | Only run a random sample of N tests                                                                      |
| `--filter-sample-seed <number>`      | Numeric seed used to make `--filter-sample` select the same tests on repeated runs                       |
| `--filter-metadata <key=value>`      | Only run tests whose metadata matches the key=value pair. Can be specified multiple times for AND logic. |
| `--filter-pattern <pattern>`         | Only run tests whose description matches the regex pattern                                               |
| `--filter-prompts <pattern>`         | Only run tests with prompts whose id or label matches the regex pattern                                  |
| `--filter-providers <providers>`     | Only run tests with these providers (regex match on provider `id` or `label`)                            |
| `--filter-targets <targets>`         | Only run tests with these targets (alias for --filter-providers)                                         |
| `--grader <provider>`                | Model that will grade outputs                                                                            |
| `-j, --max-concurrency <number>`     | Maximum number of concurrent API calls                                                                   |
| `--model-outputs <path>`             | Path to JSON containing list of LLM output strings                                                       |
| `--no-cache`                         | Do not read or write results to disk cache                                                               |
| `--no-progress-bar`                  | Do not show progress bar                                                                                 |
| `--no-table`                         | Do not output table in CLI                                                                               |
| `--no-write`                         | Do not write results to artef directory                                                              |
| `--resume [evalId]`                  | Resume a paused/incomplete eval. If `evalId` is omitted, resumes latest                                  |
| `--retry-errors`                     | Retry all ERROR results from the latest eval                                                             |
| `-o, --output <paths...>`            | Path(s) to output file (csv, txt, json, jsonl, yaml, yml, html, xml, junit.xml)                          |
| `-p, --prompts <paths...>`           | Paths to prompt files (.txt)                                                                             |
| `--prompt-prefix <path>`             | Prefix prepended to every prompt                                                                         |
| `--prompt-suffix <path>`             | Suffix appended to every prompt                                                                          |
| `-r, --providers <name or path...>`  | Provider names or paths to custom API caller modules                                                     |
| `--remote`                           | Force remote inference wherever possible (used for red teams)                                            |
| `--repeat <number>`                  | Number of times to run each test                                                                         |
| `--share`                            | Create a shareable URL                                                                                   |
| `--no-share`                         | Do not create a shareable URL, this overrides the config file                                            |
| `--suggest-prompts <number>`         | Generate N new prompts and append them to the prompt list                                                |
| `--tag <key=value>`                  | Set an eval tag. Can be specified multiple times; CLI tags override config tags.                         |
| `--table`                            | Output table in CLI                                                                                      |
| `--table-cell-max-length <number>`   | Truncate console table cells to this length                                                              |
| `-t, --tests <path>`                 | Path to CSV with test cases                                                                              |
| `--var <key=value>`                  | Set a variable in key=value format                                                                       |
| `-v, --vars <path>`                  | Path to CSV with test cases (alias for --tests)                                                          |
| `-w, --watch`                        | Watch for changes in config and re-run                                                                   |
| `-x, --extension <paths...>`         | Extension hooks to run, such as `file://handler.js:afterAll`                                             |

Use `--tag` for run-specific eval tags that should not change `artefconfig.yaml`:

```sh
artef eval --tag env=ci --tag run-id=$CI_RUN_ID
```

For export examples and format-specific guidance, see [output formats](/docs/configuration/outputs).

Use `--filter-range` to shard or rerun a stable slice of test cases by index. The first test has index `0`, the `start` index is included, and the `end` index is excluded:

```sh
artef eval --filter-range 0:100   # tests 0 through 99
artef eval --filter-range 100:200 # tests 100 through 199
artef eval --filter-range 200:    # tests 200 through the end
artef eval --filter-range :50     # first 50 tests
```

Range is applied before `--repeat` expansion, so `--filter-range 0:5 --repeat 3` runs 15 evaluations across the same 5 tests. When combined with other filters (`--filter-pattern`, `--filter-metadata`, etc.), range slices the post-filter list.

When resuming an eval, artef reuses the range saved with the original run so test indices stay stable. A `--filter-range` flag passed on resume is ignored (with a warning) and other transient filters from the original run are not restored, so resume is most predictable when range was the only selection filter.

The `eval` command will return exit code `100` when there is at least 1 test case failure or when the pass rate is below the threshold set by `artef_PASS_RATE_THRESHOLD`. It will return exit code `1` for any other error. The exit code for failed tests can be overridden with environment variable `artef_FAILED_TEST_EXIT_CODE`.

## `artef optimize`

Improve one configured prompt against one configured provider. The optimizer runs a baseline eval, proposes prompt candidates from observed failures and prior scores, evaluates those candidates, and prints the strongest prompt it found.

```sh
artef optimize
artef optimize -c path/to/artefconfig.yaml
artef optimize --prompt-index 1 --provider-index 0
artef optimize --validation-split 0.2
```

The default config is loaded implicitly when `-c` is omitted. Optimization
targets one resolved prompt/provider pair at a time.

| Option                          | Description                                                                                                  | Default                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------- |
| `-c, --config <path>`           | Path to the configuration file                                                                               | `artefconfig.yaml` |
| `--prompt-index <index>`        | Zero-based resolved prompt index to optimize                                                                 | `0`                    |
| `--provider-index <index>`      | Zero-based resolved provider index to optimize against                                                       | `0`                    |
| `--validation-split <fraction>` | Hold out up to half of the configured test cases for validation scoring while search uses the remaining set. | none                   |

When `--validation-split` is omitted, optimization uses the full eval set and
may overfit to the configured cases.
Validation splitting requires explicit `tests`; configs that use `scenarios`
must be expanded into explicit test cases first.

See [Prompt Optimization](/docs/usage/prompt-optimization) for workflow guidance,
target selection details, and validation split recommendations.

### Pause and Resume

```sh
artef eval --resume            # resumes the latest eval
artef eval --resume <evalId>   # resumes a specific eval
```

- On resume, artef reuses the original run's effective runtime options (e.g., `--delay`, `--no-cache`, `--max-concurrency`, `--repeat`), skips completed test/prompt pairs, ignores CLI flags that change test ordering to keep indices aligned, and disables watch mode.

### Retry Errors

```sh
artef eval --retry-errors      # retries all ERROR results from the latest eval
```

- The retry errors feature automatically finds ERROR results from the latest eval and re-runs only those test cases. This is useful when evals fail due to temporary network issues, rate limits, or API errors.
- **Data safety**: If the retry fails, your original ERROR results are preserved. Old ERROR results are only removed after the retry succeeds. You can safely run `--retry-errors` again if it fails.
- Cannot be used together with `--resume` or `--no-write` flags.
- Uses the original eval's configuration and runtime options to ensure consistency.

## `artef init [directory]`

Set up a new artef project with prompts, providers, and test cases.

| Option             | Description                    |
| ------------------ | ------------------------------ |
| `directory`        | Directory to create files in   |
| `--no-interactive` | Do not run in interactive mode |
| `--example [name]` | Download an example project    |

## `artef view`

Start a browser UI for visualization of results.

| Option                         | Description                               |
| ------------------------------ | ----------------------------------------- |
| `[directory]`                  | artef output/config directory to view |
| `-p, --port <number>`          | Port number for the local server          |
| `-y, --yes`                    | Skip confirmation and auto-open the URL   |
| `-n, --no`                     | Skip confirmation and do not open the URL |
| `--filter-description <regex>` | Deprecated; accepted but ignored          |

If you've used `artef_CONFIG_DIR` to override the artef output directory, run `artef view [directory]`.

## `artef share [id]` {#artef-share-evalid}

Create a URL that can be shared online. If no ID is provided, artef shares the most recent eval or model audit.

| Option        | Description                         |
| ------------- | ----------------------------------- |
| `--show-auth` | Include auth info in the shared URL |

## `artef cache`

Manage cache.

| Option  | Description     |
| ------- | --------------- |
| `clear` | Clear the cache |

## `artef feedback <message>`

Send feedback to the artef developers.

| Option    | Description      |
| --------- | ---------------- |
| `message` | Feedback message |

## `artef list`

List various resources like evals, prompts, and datasets.

| Subcommand | Description   |
| ---------- | ------------- |
| `evals`    | List evals    |
| `prompts`  | List prompts  |
| `datasets` | List datasets |

| Option       | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| `-n`         | Show the first n records, sorted by descending date of creation |
| `--ids-only` | Show only IDs without descriptions                              |

## `artef logs`

View artef log files directly from the command line.

| Option                 | Description                                | Default |
| ---------------------- | ------------------------------------------ | ------- |
| `[file]`               | Log file to view (name, path, or partial)  | latest  |
| `--type <type>`        | Log type: `debug`, `error`, or `all`       | `all`   |
| `-n, --lines <num>`    | Number of lines to display from end (tail) |         |
| `--head <num>`         | Number of lines to display from start      |         |
| `-f, --follow`         | Follow log file in real-time               | `false` |
| `-l, --list`           | List available log files                   | `false` |
| `-g, --grep <pattern>` | Filter lines matching pattern (regex)      |         |
| `--no-color`           | Disable syntax highlighting                |         |

### `artef logs list`

List available log files in the logs directory.

| Option          | Description                          | Default |
| --------------- | ------------------------------------ | ------- |
| `--type <type>` | Log type: `debug`, `error`, or `all` | `all`   |

### Examples

```sh
# View most recent log file (or current session's log if run during a CLI session)
artef logs

# View last 50 lines
artef logs -n 50

# View first 20 lines
artef logs --head 20

# Follow log in real-time (like tail -f)
artef logs -f

# List all available log files
artef logs --list

# View a specific log file by name or partial match
artef logs artef-debug-2024-01-15_10-30-00.log
artef logs 2024-01-15

# View error logs only
artef logs --type error

# Filter logs by pattern (case-insensitive regex)
artef logs --grep "error|warn"
artef logs --grep "openai"
```

Log files are stored in `~/.artef/logs` by default. Set `artef_LOG_DIR` to use a custom directory.

## `artef code-scans run [repo-path]`

Scan code changes for LLM security vulnerabilities.

| Option                            | Description                                              |
| --------------------------------- | -------------------------------------------------------- |
| `[repo-path]`                     | Repository path to scan                                  |
| `--api-key <key>`                 | artef API key for authentication                     |
| `--base <ref>`                    | Base branch or commit to compare against                 |
| `--compare <ref>`                 | Compare branch or commit                                 |
| `-c, --config <path>`             | Path to code scan config file                            |
| `--api-host <url>`                | artef API host URL                                   |
| `--diffs-only`                    | Scan only PR diffs, skip filesystem exploration          |
| `--json`                          | Output results as JSON                                   |
| `-f, --format <format>`           | Output format: `text`, `json`, or `sarif`                |
| `--github-pr <owner/repo#number>` | GitHub PR to post comments to                            |
| `--min-severity <level>`          | Minimum severity: `low`, `medium`, `high`, or `critical` |
| `--minimum-severity <level>`      | Alias for `--min-severity`                               |
| `--guidance <text>`               | Custom guidance for the security scan                    |
| `--guidance-file <path>`          | Path to a file containing custom guidance                |

For complete setup and JSON output details, see the [code scanning CLI docs](/docs/code-scanning/cli).

## `artef mcp`

Start a Model Context Protocol (MCP) server to expose artef's eval and testing capabilities as tools that AI agents and development environments can use.

| Option                | Description                       | Default |
| --------------------- | --------------------------------- | ------- |
| `-p, --port <number>` | Port number for HTTP transport    | 3100    |
| `--transport <type>`  | Transport type: "http" or "stdio" | http    |

### Transport Types

- **STDIO**: Best for desktop AI tools like Cursor, Claude Desktop, and local AI agents that communicate via standard input/output
- **HTTP**: Best for web applications, APIs, and remote integrations that need HTTP endpoints

### Examples

```sh
# Start MCP server with STDIO transport (for Cursor, Claude Desktop, etc.)
npx artef@latest mcp --transport stdio

# Start MCP server with HTTP transport on default port
npx artef@latest mcp --transport http

# Start MCP server with HTTP transport on custom port
npx artef@latest mcp --transport http --port 8080
```

### Available Tools

The MCP server provides 14 tools for AI agents:

**Core Eval Tools:**

- **`list_evaluations`** - Browse your eval runs with optional dataset filtering
- **`get_evaluation_details`** - Get comprehensive results, metrics, and test cases for a specific eval
- **`run_evaluation`** - Run evals with custom parameters, test case filtering, and concurrency control
- **`share_evaluation`** - Generate publicly shareable URLs for eval results

**Redteam Security Tools:**

- **`redteam_run`** - Execute comprehensive security testing against AI applications with dynamic attack probes
- **`redteam_generate`** - Generate adversarial test cases for redteam security testing with configurable plugins and strategies

**Configuration & Testing:**

- **`validate_artef_config`** - Validate configuration files using the same logic as the CLI
- **`test_provider`** - Test AI provider connectivity, credentials, and response quality
- **`run_assertion`** - Test individual assertion rules against outputs for debugging

**Generation Tools:**

- **`generate_dataset`** - Generate test datasets using AI
- **`generate_test_cases`** - Generate test cases with assertions for existing prompts
- **`compare_providers`** - Compare multiple AI providers side-by-side

**Debugging Tools:**

- **`list_logs`** - List artef log files with metadata
- **`read_logs`** - Read artef log file contents with filtering options

For detailed setup instructions and integration examples, see the [MCP Server documentation](/docs/integrations/mcp-server).

## `artef show <id>`

Show details of a specific resource. If no ID is provided, artef shows the most recent eval.

| Option         | Description                        |
| -------------- | ---------------------------------- |
| `eval <id>`    | Show details of a specific eval    |
| `prompt <id>`  | Show details of a specific prompt  |
| `dataset <id>` | Show details of a specific dataset |

## `artef delete <id>`

Deletes a specific resource.

| Option      | Description                                     |
| ----------- | ----------------------------------------------- |
| `eval <id>` | Delete an eval by ID; accepts `latest` or `all` |

## `artef retry <evalId>`

Retry all ERROR results from a specific eval. This command finds test cases that resulted in errors (e.g., from network issues, rate limits, or API failures) and re-runs only those test cases. The results are updated in place in the original eval.

| Option                       | Description                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `-c, --config <path>`        | Path to configuration file (optional, uses original eval config if not provided)       |
| `-v, --verbose`              | Verbose output                                                                         |
| `--max-concurrency <number>` | Maximum number of concurrent evals                                                     |
| `--delay <number>`           | Delay between evals in milliseconds                                                    |
| `--share/--no-share`         | Share results to cloud (auto-shares when cloud is configured, disable with --no-share) |

Examples:

```sh
# Retry errors from a specific eval
artef retry eval-abc123

# Retry with a different config file
artef retry eval-abc123 -c updated-config.yaml

# Retry with verbose output and limited concurrency
artef retry eval-abc123 -v --max-concurrency 2

# Retry and share results to cloud
artef retry eval-abc123 --share
```

:::tip Data Safety
If the retry operation fails (network error, API timeout, etc.), your original ERROR results are preserved. You can simply run the retry command again to continue. Old ERROR results are only removed after the retry succeeds.
:::

:::tip
Unlike `--filter-errors-only` which creates a new eval, `artef retry` updates the original eval in place. Use `retry` when you want to fix errors in an existing eval without creating duplicates.
:::

## `artef import <filepath>`

Import a artef eval file from JSON format, or import an OpenAI Evals dashboard
`eval_items_*.jsonl` export.

| Option     | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `--new-id` | Generate a new eval ID instead of preserving the original (creates a duplicate eval) |
| `--force`  | Replace an existing eval with the same ID                                            |

When importing a artef eval export, the following data is preserved:

- **Eval ID** - Preserved by default. Use `--new-id` to generate a new ID, or `--force` to replace an existing eval.
- **Timestamp** - The original creation timestamp is always preserved (even with `--new-id` or `--force`)
- **Author** - The original author is always preserved (even with `--new-id` or `--force`)
- **Config, results, prompts, variables, runtime options, and durations** - Preserved for current exports. Config secrets are redacted during export.
- **Traces** - Preserved for current exports with sensitive trace attributes redacted by the trace store.
- **Referenced blob media** - Restored when the export includes embedded media assets. Create a portable export with `artef export eval <evalId> --include-media`.

Older exports that do not include newer parity fields still import normally. Local relationships such as tags, dataset links, cache entries, and share state are not reconstructed from an eval export.

If an eval with the same ID already exists, the import will fail with an error unless you specify `--new-id` (to create a duplicate with a new ID) or `--force` (to replace the existing eval).

Example:

```sh
# Import an eval, preserving the original ID
artef import my-eval.json

# Import even if an eval with this ID exists (creates duplicate with new ID)
artef import --new-id my-eval.json

# Replace an existing eval with updated data
artef import --force my-eval.json
```

OpenAI Evals dashboard exports such as `eval_items_*.jsonl` are imported as historical
artef eval records. artef keeps each OpenAI source item under `vars.item` and
preserves raw source item data, grader values, available pass/fail states, and grader
samples in imported result metadata. When the export includes OpenAI `sample` data,
artef also preserves it and surfaces available model output, errors, and token usage on
the imported result. Grader rows with scores but no pass/fail states stay score-only:
artef preserves the grader scores without turning the missing pass state into a failed
assertion. If an export includes multiple OpenAI runs, artef imports them as prompt
columns in one eval and aligns them on both the OpenAI data-source index and source item
content. Rows with the same run-local index but different source items stay separate.

For source fidelity, imported results keep the raw dashboard output-item row with its
dashboard field names at `metadata.openai.outputItem`. The stored artef config records
the dashboard import format and imported run IDs in `metadata.openaiEvalsImport`.

The dashboard JSONL contains output-item rows, not the OpenAI eval definition, data-source
config, run config, or testing-criteria definitions. It only keeps grader results keyed by
grader name. The import is for historical results; it does not infer artef assertions
or reconstruct a runnable artef config from the OpenAI eval.

This import path supports the dashboard JSONL export, not the OpenAI API output-items list
response.

```sh
artef import eval_items_OutputDataItemStatusParam.ALL.jsonl
```

## `artef export`

Export eval records or logs.

### `artef export eval <evalId>`

Export an eval record to JSON format. To export the most recent, use `latest`.

| Option                    | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `-o, --output <filepath>` | File to write. Writes to stdout by default.             |
| `--include-media`         | Embed referenced blob media bytes for portable imports. |

Exports always redact config secrets before writing. Media bytes are opt-in because they can make the export much larger and may contain sensitive user content. Without `--include-media`, blob references remain in the exported results and resolve only when the target artef data directory already has the referenced blobs.

:::warning
Eval exports can still contain user data in prompts, outputs, variables, traces, and opt-in media. Inspect an export before sharing it.
:::

### `artef export logs`

Collect and zip log files for debugging purposes.

| Option                    | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| `-n, --count <number>`    | Number of recent log files to include (default: all) |
| `-o, --output <filepath>` | Output path for the compressed log file              |

This command creates a compressed tar.gz archive containing your artef log files, making it easy to share them for debugging purposes. If no output path is specified, it will generate a timestamped filename automatically.

Log files are stored in `~/.artef/logs` by default. To use a custom log directory, set the `artef_LOG_DIR` environment variable.

## `artef validate`

Validate a artef configuration file to ensure it follows the correct schema and structure.

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `validate config` | Validate a artef configuration file         |
| `validate target` | Test provider connectivity from config or cloud |

### `artef validate config`

| Option                    | Description                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| `-c, --config <paths...>` | Path to configuration file(s). Automatically loads artefconfig.yaml |

This command validates both the configuration file and the test suite to ensure they conform to the expected schema. It will report any validation errors with detailed messages to help you fix configuration issues.

Examples:

```sh
# Validate the default artefconfig.yaml
artef validate

# Validate a specific configuration file
artef validate -c my-config.yaml

# Validate multiple configuration files
artef validate -c config1.yaml config2.yaml
```

The command will exit with code `1` if validation fails, making it useful for CI/CD pipelines to catch configuration errors early.

### `artef validate target`

| Option                | Description                                      |
| --------------------- | ------------------------------------------------ |
| `-t, --target <id>`   | Provider ID or cloud UUID to test                |
| `-c, --config <path>` | Path to configuration file to test all providers |

Examples:

```sh
# Test all providers in a config
artef validate target -c artefconfig.yaml

# Test one provider by ID or cloud UUID
artef validate target -t openai:gpt-5-mini
```

## `artef scan-model`

Scan ML models for security vulnerabilities. Provide one or more paths to model files or directories.

| Option                          | Description                                                          | Default |
| ------------------------------- | -------------------------------------------------------------------- | ------- |
| `[paths...]`                    | Model files or directories to scan                                   |         |
| `-b, --blacklist <patterns...>` | Additional blacklist patterns to check against model names           |         |
| `-f, --format <format>`         | Output format: `text`, `json`, or `sarif`                            | `text`  |
| `-o, --output <path>`           | Output file path (prints to stdout if not specified)                 |         |
| `--sbom <path>`                 | Write a CycloneDX SBOM to the specified file                         |         |
| `--no-write`                    | Do not write results to database                                     |         |
| `--name <name>`                 | Name for the audit when saving to database                           |         |
| `-t, --timeout <seconds>`       | Scan timeout in seconds                                              | `300`   |
| `--max-size <size>`             | Override auto-detected size limits, such as `500MB` or `10GB`        |         |
| `--strict`                      | Fail on warnings, scan all file types, and use strict license checks |         |
| `--dry-run`                     | Preview what would be scanned/downloaded                             |         |
| `--no-cache`                    | Disable model download/cache reuse                                   |         |
| `--quiet`                       | Silence detection messages                                           |         |
| `--progress`                    | Force progress reporting                                             |         |
| `--stream`                      | Scan and delete downloaded files immediately after scan              |         |
| `--scanners <scanner>`          | Only run selected ModelAudit scanners; comma-separated or repeated   |         |
| `--exclude-scanner <scanner>`   | Exclude a ModelAudit scanner; comma-separated or repeated            |         |
| `--list-scanners`               | List registered ModelAudit scanners and exit                         |         |
| `--force`                       | Force scan even if the model was already scanned                     |         |
| `--share` / `--no-share`        | Share or suppress sharing for model audit results                    |         |

By default, `scan-model` saves model audit records to the artef database. In that mode, `--output` writes artef's JSON result payload even when `--format sarif` is selected. Use `--no-write --format sarif --output results.sarif` for raw ModelAudit SARIF output.

For model source examples, scanner IDs, SBOM output, and SARIF workflows, see the [ModelAudit docs](/docs/model-audit).

## `artef auth`

Manage authentication for cloud features.

### `artef auth login`

Login to the artef cloud.

| Option                | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| `-o, --org <orgId>`   | The organization ID to log in to                                           |
| `-h, --host <host>`   | The host of the artef instance (API URL if different from the app URL) |
| `-k, --api-key <key>` | Log in using an API key                                                    |
| `-t, --team <team>`   | Team name, slug, or ID to use after login                                  |

After login, if you have multiple teams, you can switch between them using the `teams` subcommand.

### `artef auth logout`

Logout from the artef cloud.

### `artef auth whoami`

Display current authentication status including user, organization, and active team.

**Output includes:**

- User email
- Organization name
- Current team (if logged in to a multi-team organization)
- App URL

Example:

```sh
artef auth whoami
```

Output:

```
Currently logged in as:
User: user@company.com
Organization: Acme Corp
Current Team: Engineering Team
App URL: https://www.artef.app
```

### `artef auth can-create-targets`

Check whether the current user can create cloud targets.

| Option                   | Description                      |
| ------------------------ | -------------------------------- |
| `-t, --team-id <teamId>` | Team ID to check permissions for |

### `artef auth teams`

Manage team switching for organizations with multiple teams.

#### `artef auth teams list`

List all teams you have access to in the current organization.

#### `artef auth teams current`

Show the currently active team.

#### `artef auth teams set <teamIdentifier>`

Switch to a specific team. The team identifier can be:

- Team name (e.g., "Engineering")
- Team slug (e.g., "engineering")
- Team ID (e.g., "team_12345")

Examples:

```sh
# Switch to team by name
artef auth teams set "Engineering Team"

# Switch to team by slug
artef auth teams set engineering

# Switch to team by ID
artef auth teams set team_12345
```

Your team selection is remembered across CLI sessions and applies to all artef operations including evals and red team testing.

#### Team Selection Across Organizations

If you have access to multiple organizations, team selections are **isolated per organization**. This means:

- Each organization remembers its own team selection
- Switching between organizations preserves your team choice in each org
- When you log into an organization, your previously selected team is automatically restored

Example workflow:

```sh
# Login to Organization A
artef auth login --api-key <org-a-key>
artef auth teams set "Engineering"     # Set team in Org A

# Login to Organization B
artef auth login --api-key <org-b-key>
artef auth teams set "Marketing"       # Set team in Org B

# Login back to Organization A
artef auth login --api-key <org-a-key>
artef auth teams current              # Shows "Engineering" (preserved!)
```

Your team selection persists across login sessions within the same organization.

## `artef config`

Edit configuration settings.

### `artef config get email`

Get the user's email address.

### `artef config set email <email>`

Set the user's email address.

### `artef config unset email`

Unset the user's email address.

| Option        | Description                      |
| ------------- | -------------------------------- |
| `-f, --force` | Force unset without confirmation |

## `artef debug`

Display debug information for troubleshooting.

| Option                | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `-c, --config [path]` | Path to configuration file. Defaults to artefconfig.yaml |

## `artef generate dataset`

BETA: Generate synthetic test cases based on existing prompts and variables.

| Option                              | Description                                                | Default              |
| ----------------------------------- | ---------------------------------------------------------- | -------------------- |
| `-c, --config <path>`               | Path to the configuration file                             | artefconfig.yaml |
| `-w, --write`                       | Write the generated test cases directly to the config file | false                |
| `-i, --instructions <text>`         | Custom instructions for test case generation               |                      |
| `-o, --output <path>`               | Path to write the generated test cases                     | stdout               |
| `--numPersonas <number>`            | Number of personas to generate                             | 5                    |
| `--numTestCasesPerPersona <number>` | Number of test cases per persona                           | 3                    |
| `--provider <provider>`             | Provider to use for generating test cases                  | default grader       |
| `--no-cache`                        | Do not read or write results to disk cache                 | false                |

For example, this command will modify your default config file (usually `artefconfig.yaml`) with new test cases:

```sh
artef generate dataset -w
```

This command will generate test cases for a specific config and write them to a file, while following special instructions:

```sh
artef generate dataset -c my_config.yaml -o new_tests.yaml -i 'All test cases for {{location}} must be European cities'
```

## `artef generate assertions`

Generate additional objective/subjective assertions based on existing prompts and assertions.

- This command can be used to generate initial set of assertions, if none exist.
- Will only add non-overlapping, independent assertions
- Generates both python and natural language assertions.

When brainstorming assertions:

- Generates python code for any objective assertions
- Uses a specified natural language assertion type (pi, llm-rubric, or g-eval) for any subjective assertion.

| Option                      | Description                                                     | Default              |
| --------------------------- | --------------------------------------------------------------- | -------------------- |
| `-t, --type <type>`         | The assertion type to use for generated subjective assertions.  | pi                   |
| `-c, --config <path>`       | Path to the configuration file that contains at least 1 prompt. | artefconfig.yaml |
| `-w, --write`               | Write the generated assertions directly to the config file      | false                |
| `-i, --instructions <text>` | Custom instructions for assertion generation                    |                      |
| `-o, --output <path>`       | Path to write the generated assertions                          | stdout               |
| `--numAssertions <number>`  | Number of assertions to generate                                | 5                    |
| `--provider <provider>`     | Provider to use for generating assertions                       | default grader       |
| `--no-cache`                | Do not read or write results to disk cache                      | false                |

For example, this command will modify your default config file (usually `artefconfig.yaml`) with new test cases:

```sh
artef generate assertions -w
```

This command will generate `pi` and `python` assertions for a specific config and write them to a file, while following special instructions:

```sh
artef generate assertions -c my_config.yaml -o new_tests.yaml -i 'I need assertions about pronunciation'
```

## `artef generate redteam`

Alias for [`artef redteam generate`](#artef-redteam-generate).

## `artef redteam init`

Initialize a red teaming project.

| Option        | Description                            | Default |
| ------------- | -------------------------------------- | ------- |
| `[directory]` | Directory to initialize the project in | .       |
| `--no-gui`    | Do not open the browser UI             |         |

Example:

```sh
artef redteam init my_project
```

:::danger
Adversarial testing produces offensive, toxic, and harmful test inputs, and may cause your system to produce harmful outputs.
:::

For more detail, see [red team configuration](/docs/red-team/configuration/).

## `artef redteam setup`

Start browser UI and open to red team setup.

| Option                           | Description                              | Default |
| -------------------------------- | ---------------------------------------- | ------- |
| `[configDirectory]`              | Directory containing configuration files |         |
| `-p, --port <number>`            | Port number for the local server         | 15500   |
| `--filter-description <pattern>` | Deprecated; accepted but ignored         |         |

## `artef redteam run`

Run the complete red teaming process (init, generate, and evaluate).

| Option                                             | Description                                                                      | Default              |
| -------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------- |
| `-c, --config [path]`                              | Path to configuration file                                                       | artefconfig.yaml |
| `-o, --output [path]`                              | Path to output file for generated tests                                          | redteam.yaml         |
| `-d, --description <text>`                         | Custom description/name for this scan run                                        |                      |
| `--tag <key=value>`                                | Set an eval tag. Can be specified multiple times; CLI tags override config tags. |                      |
| `--no-cache`                                       | Do not read or write results to disk cache                                       | false                |
| `-j, --max-concurrency <number>`                   | Maximum number of concurrent API calls                                           |                      |
| `--delay <number>`                                 | Delay in milliseconds between API calls                                          |                      |
| `--remote`                                         | Force remote inference wherever possible                                         | false                |
| `--force`                                          | Force generation even if no changes are detected                                 | false                |
| `--no-progress-bar`                                | Do not show progress bar                                                         |                      |
| `--strict`                                         | Fail if any plugins fail to generate test cases                                  | false                |
| `--filter-prompts <pattern>`                       | Only run tests with prompts whose id or label matches the regex pattern          |                      |
| `--filter-providers, --filter-targets <providers>` | Only run tests with these providers (regex match)                                |                      |
| `-t, --target <id>`                                | Cloud provider target ID to run the scan on                                      |                      |

Use `--tag` to attach CI/CD context to the evaluation result without changing the
scan template or generated `redteam.yaml`. CLI tags override matching tags from the
configuration and are included when the eval is shared.

```sh
artef redteam run --tag ci.run-id=$CI_RUN_ID --tag git.sha=$GIT_COMMIT
```

## `artef redteam discover`

Runs the [Target Discovery Agent](/docs/red-team/discovery) against your application.

:::info

Only a configuration file or target can be specified

:::

| Option                | Description                                          | Default |
| --------------------- | ---------------------------------------------------- | ------- |
| `-c, --config <path>` | Path to `artefconfig.yaml` configuration file.   |         |
| `-t, --target <id>`   | UUID of a target defined in artef Cloud to scan. |         |

## `artef redteam generate`

Generate adversarial test cases to challenge your prompts and models.

| Option                           | Description                                                          | Default              |
| -------------------------------- | -------------------------------------------------------------------- | -------------------- |
| `-c, --config <path>`            | Path to configuration file                                           | artefconfig.yaml |
| `-o, --output <path>`            | Path to write the generated test cases                               | redteam.yaml         |
| `-d, --description <text>`       | Custom description/name for the generated tests                      |                      |
| `-w, --write`                    | Write the generated test cases directly to the config file           | false                |
| `-t, --target <id>`              | Cloud provider target ID to run the scan on                          |                      |
| `--purpose <purpose>`            | High-level description of the system's purpose                       | Inferred from config |
| `--provider <provider>`          | Provider to use for generating adversarial tests                     |                      |
| `--injectVar <varname>`          | Override the `{{variable}}` that represents user input in the prompt | `prompt`             |
| `--plugins <plugins>`            | Comma-separated list of plugins to use                               | default              |
| `--strategies <strategies>`      | Comma-separated list of strategies to use                            | default              |
| `-n, --num-tests <number>`       | Number of test cases to generate per plugin                          |                      |
| `--language <language>`          | Specify the language for generated tests                             | English              |
| `--no-cache`                     | Do not read or write results to disk cache                           | false                |
| `-j, --max-concurrency <number>` | Maximum number of concurrent API calls                               |                      |
| `--delay <number>`               | Delay in milliseconds between plugin API calls                       |                      |
| `--remote`                       | Force remote inference wherever possible                             | false                |
| `--force`                        | Force generation even if no changes are detected                     | false                |
| `--no-progress-bar`              | Do not show progress bar                                             |                      |
| `--strict`                       | Fail if any plugins fail to generate test cases                      | false                |
| `--burp-escape-json`             | Escape special characters in .burp output for JSON payloads          | false                |

For example, let's suppose we have the following `artefconfig.yaml`:

```yaml
prompts:
  - 'Act as a trip planner and help the user plan their trip'

providers:
  - openai:gpt-5-mini
  - openai:gpt-5
```

This command will generate adversarial test cases and write them to `redteam.yaml`.

```sh
artef redteam generate
```

This command overrides the system purpose and the variable to inject adversarial user input:

```sh
artef redteam generate --purpose 'Travel agent that helps users plan trips' --injectVar 'message'
```

## `artef redteam poison`

Generate poisoned documents for RAG testing.

| Option                    | Description                                       | Default                |
| ------------------------- | ------------------------------------------------- | ---------------------- |
| `documents`               | Documents, directories, or text content to poison |                        |
| `-g, --goal <goal>`       | Goal/intended result of the poisoning             |                        |
| `-o, --output <path>`     | Output YAML file path                             | `poisoned-config.yaml` |
| `-d, --output-dir <path>` | Directory to write individual poisoned documents  | `poisoned-documents`   |

## `artef redteam eval`

Works the same as [`artef eval`](#artef-eval), including repeatable `--tag`
options for run-specific labels, but defaults to loading `redteam.yaml`.

## `artef redteam report`

Start a browser UI and open the red teaming report.

| Option                           | Description                                 | Default |
| -------------------------------- | ------------------------------------------- | ------- |
| `[directory]`                    | Directory containing the red teaming config | .       |
| `-p, --port <number>`            | Port number for the server                  | 15500   |
| `--filter-description <pattern>` | Deprecated; accepted but ignored            |         |

Example:

```sh
artef redteam report -p 8080
```

## `artef redteam plugins`

List all available red team plugins.

| Option       | Description                               |
| ------------ | ----------------------------------------- |
| `--ids-only` | Show only plugin IDs without descriptions |
| `--default`  | Show only the default plugins             |

## Specifying Command Line Options in Config

Many command line options can be specified directly in your `artefconfig.yaml` file using the `commandLineOptions` section. This is convenient for options you frequently use or want to set as defaults for your project.

Example:

```yaml title="artefconfig.yaml"
prompts:
  - Write a funny tweet about {{topic}}
providers:
  - openai:o3-mini
tests:
  - file://test_cases.csv

# Command line options as defaults
commandLineOptions:
  maxConcurrency: 5
  repeat: 2
  delay: 250
  share: false
  cache: true
  write: true
```

With this configuration, you can simply run `artef eval` without specifying these options on the command line. You can still override these settings by providing the corresponding flag when running the command.

## ASCII-only outputs

To disable terminal colors for printed outputs, set `FORCE_COLOR=0` (this is supported by the [chalk](https://github.com/chalk/chalk) library).

For the `eval` command, you may also want to disable the progress bar and table as well, because they use special characters:

```sh
FORCE_COLOR=0 artef eval --no-progress-bar --no-table
```

# Environment variables

These general-purpose environment variables are supported:

| Name                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default                       |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `FORCE_COLOR`                                 | Set to 0 to disable terminal colors for printed outputs                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                               |
| `artef_ASSERTIONS_MAX_CONCURRENCY`        | How many assertions to run at a time                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 3                             |
| `artef_CACHE_ENABLED`                     | Enable LLM request/response caching                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `true`                        |
| `artef_CACHE_PATH`                        | Directory for the disk cache. Defaults to a `cache` directory under `artef_CONFIG_DIR`                                                                                                                                                                                                                                                                                                                                                                                                                       | `~/.artef/cache`          |
| `artef_CACHE_TTL`                         | Cache TTL in seconds                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `1209600`                     |
| `artef_CACHE_TYPE`                        | Cache backend: `disk` or `memory`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `disk`                        |
| `artef_CONFIG_DIR`                        | Directory that stores eval history                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `~/.artef`                |
| `artef_CSRF_ALLOWED_ORIGINS`              | Comma-separated list of trusted origins allowed to make cross-site requests to the artef server (e.g., `https://app.example.com,https://admin.example.com`). Not needed for standard localhost or same-origin setups.                                                                                                                                                                                                                                                                                        |                               |
| `artef_DISABLE_AJV_STRICT_MODE`           | If set, disables AJV strict mode for JSON schema validation                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                               |
| `artef_DISABLE_CONVERSATION_VAR`          | Prevents the `_conversation` variable from being set                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                               |
| `artef_DISABLE_ERROR_LOG`                 | Prevents error logs from being written to a file                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                               |
| `artef_DISABLE_DEBUG_LOG`                 | Prevents debug logs from being written to a file                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                               |
| `artef_DISABLE_JSON_AUTOESCAPE`           | If set, disables smart variable substitution within JSON prompts                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                               |
| `artef_DISABLE_OBJECT_STRINGIFY`          | Disable object stringification in templates. When false (default), objects are stringified to prevent `[object Object]` issues. When true, allows direct property access (e.g., `{{output.property}}`).                                                                                                                                                                                                                                                                                                          | `false`                       |
| `artef_DISABLE_REF_PARSER`                | Prevents JSON schema dereferencing                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                               |
| `artef_DISABLE_REMOTE_GENERATION`         | Disables supported artef-hosted generation fallbacks within its documented scope, including red team target/provider setup helpers that rely on remote generation. This is not a network egress firewall and does not disable explicitly configured providers, graders, telemetry, account/license checks, sharing, Cloud sync, red team target/provider test requests, or red team target/provider setup helpers that do not rely on remote generation. Example: `artef_DISABLE_REMOTE_GENERATION=true` | `false`                       |
| `artef_DISABLE_REDTEAM_REMOTE_GENERATION` | Disables supported artef-hosted red team generation paths, including red team target/provider setup helpers that rely on remote generation, while leaving non-red-team hosted generation, red team target/provider test requests, red team target/provider setup helpers that do not rely on remote generation, sharing, telemetry, account, and Cloud-backed controls unchanged. Example: `artef_DISABLE_REDTEAM_REMOTE_GENERATION=true`                                                                | `false`                       |
| `artef_DISABLE_TEMPLATE_ENV_VARS`         | Disables OS environment variables in templates. When true, only config `env:` variables are available in templates.                                                                                                                                                                                                                                                                                                                                                                                              | `false` (true in self-hosted) |
| `artef_DISABLE_TEMPLATING`                | Disables Nunjucks template processing                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `false`                       |
| `artef_DISABLE_UPDATE`                    | Disables automatic update availability checks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `false`                       |
| `artef_DISABLE_VAR_EXPANSION`             | Prevents Array-type vars from being expanded into multiple test cases                                                                                                                                                                                                                                                                                                                                                                                                                                            |                               |
| `artef_FAILED_TEST_EXIT_CODE`             | Override the exit code when there is at least 1 test case failure or when the pass rate is below artef_PASS_RATE_THRESHOLD                                                                                                                                                                                                                                                                                                                                                                                   | 100                           |
| `artef_LOG_DIR`                           | Directory to write log files (both debug and error logs). Overrides the default `~/.artef/logs` directory.                                                                                                                                                                                                                                                                                                                                                                                                   | `~/.artef/logs`           |
| `artef_PASS_RATE_THRESHOLD`               | Set a minimum pass rate threshold (as a percentage). If not set, defaults to 100% (no failures allowed)                                                                                                                                                                                                                                                                                                                                                                                                          | 100                           |
| `artef_REQUIRE_JSON_PROMPTS`              | By default the chat completion provider will wrap non-JSON messages in a single user message. Setting this envar to true disables that behavior.                                                                                                                                                                                                                                                                                                                                                                 |                               |
| `artef_SHARE_CHUNK_SIZE`                  | Number of results to send in each chunk. This is used to estimate the size of the results and to determine the number of chunks to send.                                                                                                                                                                                                                                                                                                                                                                         |                               |
| `artef_EVAL_TIMEOUT_MS`                   | Timeout in milliseconds for each individual test case/provider API call. When reached, that specific test is marked as an error.                                                                                                                                                                                                                                                                                                                                                                                 |                               |
| `artef_MAX_EVAL_TIME_MS`                  | Maximum total runtime in milliseconds for the entire eval process. When reached, all remaining tests are marked as errors and the eval ends.                                                                                                                                                                                                                                                                                                                                                                     |                               |
| `artef_STRIP_GRADING_RESULT`              | Strip grading results from results to reduce memory usage                                                                                                                                                                                                                                                                                                                                                                                                                                                        | false                         |
| `artef_STRIP_METADATA`                    | Strip metadata from results to reduce memory usage                                                                                                                                                                                                                                                                                                                                                                                                                                                               | false                         |
| `artef_STRIP_PROMPT_TEXT`                 | Strip prompt text from results to reduce memory usage                                                                                                                                                                                                                                                                                                                                                                                                                                                            | false                         |
| `artef_STRIP_RESPONSE_OUTPUT`             | Strip model response outputs from results to reduce memory usage                                                                                                                                                                                                                                                                                                                                                                                                                                                 | false                         |
| `artef_STRIP_TEST_VARS`                   | Strip test variables from results to reduce memory usage                                                                                                                                                                                                                                                                                                                                                                                                                                                         | false                         |
| `artef_OFFICIAL_DOCKER_IMAGE`             | Internal marker for upstream official-image update guidance. Official artef builds set this automatically, and derived images inherit it. The inherited guidance includes the extra rebuild step; set it to `false` in a derived image for tailored custom-image guidance.                                                                                                                                                                                                                                   | `false`                       |
| `artef_RUNNING_IN_DOCKER`                 | Internal marker for container-aware update guidance. The artef Dockerfile sets this automatically. Other custom Dockerfiles that bake artef into an image must set it to `true` to receive rebuild-and-redeploy guidance instead of package-manager commands.                                                                                                                                                                                                                                            | `false`                       |
| `artef_SELF_HOSTED`                       | Enables self-hosted mode. When true, disables OS environment variables in templates (only config `env:` values available), disables telemetry, and modifies other behaviors for controlled environments                                                                                                                                                                                                                                                                                                          | `false`                       |

:::tip
artef will load environment variables from the `.env` in your current working directory.
:::

:::tip
For detailed information on using timeout features, including configuration examples and troubleshooting tips, see [Timeout errors in the troubleshooting guide](/docs/usage/troubleshooting#how-to-triage-stuck-evals).
:::
