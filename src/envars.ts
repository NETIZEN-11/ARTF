import dotenv from 'dotenv';
import { getEnvOverrides } from './envOverrides';

import type { EnvOverrides } from './types/env';

dotenv.config({ quiet: true });

// Define the supported environment variables and their types
type EnvVars = {
  //=========================================================================
  // Core artef configuration
  //=========================================================================
  LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug';
  NODE_ENV?: string;
  npm_execpath?: string;
  npm_lifecycle_script?: string;

  //=========================================================================
  // artef feature flags
  //=========================================================================
  artef_CACHE_ENABLED?: boolean;
  artef_DISABLE_AJV_STRICT_MODE?: boolean;
  /**
   * Disables the path-traversal guard applied to `file://` callback
   * references (e.g. `functionToolCallbacks`). When unset (default), callback
   * paths must resolve inside the config's basePath. Setting this to `true`
   * restores the legacy unguarded behavior — NOT recommended outside of
   * legacy compatibility scenarios.
   */
  artef_DISABLE_CALLBACK_PATH_GUARD?: boolean;
  artef_DISABLE_CONVERSATION_VAR?: boolean;
  /** Disable formula-injection escaping of exported eval/redteam result CSVs. */
  artef_DISABLE_CSV_FORMULA_ESCAPING?: boolean;
  artef_DISABLE_ERROR_LOG?: boolean;
  artef_DISABLE_DEBUG_LOG?: boolean;
  artef_DISABLE_JSON_AUTOESCAPE?: boolean;
  artef_DISABLE_MULTIMEDIA_AS_BASE64?: boolean;
  artef_DISABLE_OBJECT_STRINGIFY?: boolean;
  artef_DISABLE_PDF_AS_TEXT?: boolean;
  artef_DISABLE_REDTEAM_MODERATION?: boolean;
  /**
   * Disable ALL remote generation (superset of artef_DISABLE_REDTEAM_REMOTE_GENERATION).
   * Affects: SimulatedUser, red team features, all artef-hosted inference.
   */
  artef_DISABLE_REMOTE_GENERATION?: boolean;
  /**
   * Disable remote generation for red team features only (subset of artef_DISABLE_REMOTE_GENERATION).
   * Affects: Harmful content generation, red team strategies, red team simulated users.
   * Does NOT affect: Regular (non-redteam) SimulatedUser usage.
   */
  artef_DISABLE_REDTEAM_REMOTE_GENERATION?: boolean;
  artef_DISABLE_REF_PARSER?: boolean;
  artef_DISABLE_SHARE_EMAIL_REQUEST?: boolean;
  artef_DISABLE_SHARE_WARNING?: boolean;
  artef_DISABLE_SHARING?: boolean;
  artef_DISABLE_TELEMETRY?: boolean;
  artef_DISABLE_TEMPLATE_ENV_VARS?: boolean;
  artef_DISABLE_TEMPLATING?: boolean;
  artef_DISABLE_UPDATE?: boolean;
  artef_DISABLE_VAR_EXPANSION?: boolean;
  artef_DISABLE_WAL_MODE?: boolean;
  artef_ENABLE_DATABASE_LOGS?: boolean;
  artef_EVAL_TIMEOUT_MS?: number;
  artef_EXPERIMENTAL?: boolean;
  artef_MAX_EVAL_TIME_MS?: number;
  artef_NO_TESTCASE_ASSERT_WARNING?: boolean;
  artef_PYTHON_DEBUG_ENABLED?: boolean;
  artef_RETRY_5XX?: boolean;
  artef_OFFICIAL_DOCKER_IMAGE?: boolean;
  artef_RUNNING_IN_DOCKER?: boolean;
  artef_SELF_HOSTED?: boolean;
  artef_SHORT_CIRCUIT_TEST_FAILURES?: boolean;
  artef_STRICT_FILES?: boolean;
  artef_STRIP_GRADING_RESULT?: boolean;
  artef_STRIP_METADATA?: boolean;
  artef_STRIP_PROMPT_TEXT?: boolean;
  artef_STRIP_RESPONSE_OUTPUT?: boolean;
  artef_STRIP_TEST_VARS?: boolean;
  artef_TELEMETRY_DEBUG?: boolean;
  artef_TRACING_ENABLED?: boolean;
  artef_ENABLE_UNBLOCKING?: boolean;

  //=========================================================================
  // OpenTelemetry tracing configuration
  //=========================================================================
  /**
   * Enable OpenTelemetry tracing for all LLM provider calls.
   */
  artef_OTEL_ENABLED?: boolean;
  /**
   * Service name to use in OTEL traces. Defaults to 'artef'.
   */
  artef_OTEL_SERVICE_NAME?: string;
  /**
   * OTLP endpoint URL for exporting traces to external backends.
   */
  artef_OTEL_ENDPOINT?: string;
  /**
   * Whether to export traces to the local TraceStore (SQLite). Defaults to true.
   */
  artef_OTEL_LOCAL_EXPORT?: boolean;
  /**
   * Enable OTEL debug logging.
   */
  artef_OTEL_DEBUG?: boolean;
  /**
   * Standard OTEL environment variable for OTLP endpoint.
   */
  OTEL_EXPORTER_OTLP_ENDPOINT?: string;

  //=========================================================================
  // artef configuration options
  //=========================================================================
  artef_ASSERTIONS_MAX_CONCURRENCY?: number;
  artef_AUTHOR?: string;
  artef_CACHE_MAX_FILE_COUNT?: number;
  artef_CACHE_MAX_SIZE?: number;
  artef_CACHE_PATH?: string;
  artef_CACHE_TTL?: number;
  artef_CACHE_TYPE?: 'memory' | 'disk';
  artef_CLOUD_API_URL?: string;
  artef_CLOUD_AUTH_HEADER?: string;
  artef_CONFIG_DIR?: string;
  artef_CSV_DELIMITER?: string;
  artef_CSV_STRICT?: boolean;
  artef_DELAY_MS?: number;
  artef_FAILED_TEST_EXIT_CODE?: number;
  artef_INLINE_MEDIA?: boolean;
  artef_INSECURE_SSL?: boolean | string;
  artef_JAILBREAK_TEMPERATURE?: string;
  artef_LOG_DIR?: string;
  artef_LOG_TO_STDERR?: boolean;
  artef_MEDIA_PATH?: string;
  artef_MAX_HARMFUL_TESTS_PER_REQUEST?: number;
  artef_NUM_JAILBREAK_ITERATIONS?: string;
  artef_PASS_RATE_THRESHOLD?: number;
  artef_PROMPT_SEPARATOR?: string;
  artef_PYTHON?: string;
  artef_RUBY?: string;
  artef_REMOTE_API_BASE_URL?: string;
  artef_REMOTE_APP_BASE_URL?: string;
  artef_REMOTE_GENERATION_URL?: string;
  artef_REQUEST_BACKOFF_MS?: number;
  artef_REQUIRE_JSON_PROMPTS?: boolean;
  artef_SHARING_APP_BASE_URL?: string;
  artef_SHARE_CHUNK_SIZE?: number;
  artef_SHARE_INLINE_BLOBS?: boolean;
  artef_UNALIGNED_INFERENCE_ENDPOINT?: string;
  artef_CA_CERT_PATH?: string;
  artef_PFX_CERT_PATH?: string;
  artef_PFX_PASSWORD?: string;
  artef_JKS_CERT_PATH?: string;
  artef_JKS_PASSWORD?: string;
  artef_JKS_ALIAS?: string;

  //=========================================================================
  // Server security
  //=========================================================================
  /**
   * Comma-separated list of trusted origins allowed to make cross-site
   * mutating requests to the artef server.
   * Example: "https://app.example.com,https://admin.example.com"
   */
  artef_CSRF_ALLOWED_ORIGINS?: string;

  //=========================================================================
  // HTTP proxy settings
  //=========================================================================
  ALL_PROXY?: string;
  all_proxy?: string;
  HTTP_PROXY?: string;
  http_proxy?: string;
  HTTPS_PROXY?: string;
  https_proxy?: string;
  NO_PROXY?: string;
  no_proxy?: string;

  //=========================================================================
  // System and network settings
  //=========================================================================
  API_HOST?: string;
  API_PORT?: string | number;
  DISPLAY?: string;
  IS_TESTING?: string | boolean;
  JEST_WORKER_ID?: string;
  NODE_EXTRA_CA_CERTS?: string;
  NODE_TLS_REJECT_UNAUTHORIZED?: string;
  REQUEST_TIMEOUT_MS?: number;
  RESULT_HISTORY_LENGTH?: number;
  WEBHOOK_TIMEOUT?: number;

  //=========================================================================
  // MCP (Model Context Protocol) settings
  //=========================================================================
  /**
   * Default timeout in milliseconds for MCP tool calls.
   * This overrides the MCP SDK's default 60-second timeout.
   * Can be overridden per-provider via config.mcp.timeout.
   */
  MCP_REQUEST_TIMEOUT_MS?: number;
  /**
   * Enable debug logging for MCP connections.
   * Can be overridden per-provider via config.mcp.debug.
   */
  MCP_DEBUG?: boolean;
  /**
   * Enable verbose output for MCP connections.
   * Can be overridden per-provider via config.mcp.verbose.
   */
  MCP_VERBOSE?: boolean;

  // Posthog
  artef_POSTHOG_KEY?: string;
  artef_POSTHOG_HOST?: string;

  //=========================================================================
  // UI configuration
  //=========================================================================
  VITE_PUBLIC_BASENAME?: string;
  VITE_PUBLIC_artef_REMOTE_API_BASE_URL?: string;

  //=========================================================================
  // Continuous Integration
  //=========================================================================
  APPVEYOR?: boolean;
  BITBUCKET_COMMIT?: boolean;
  BUDDY?: boolean;
  BUILDKITE?: boolean;
  CI?: boolean;
  CIRCLECI?: boolean;
  CODEBUILD_BUILD_ID?: boolean;
  GITHUB_ACTIONS?: boolean;
  GITLAB_CI?: boolean;
  JENKINS?: boolean;
  TEAMCITY_VERSION?: boolean;
  TF_BUILD?: boolean;
  TRAVIS?: boolean;

  //=========================================================================
  // Provider-specific settings
  //=========================================================================
  // Abliteration
  ABLIT_API_BASE_URL?: string;
  ABLIT_KEY?: string;

  // AI21
  AI21_API_BASE_URL?: string;
  AI21_API_KEY?: string;

  AIML_API_KEY?: string;

  NOVITA_API_KEY?: string;

  // Anthropic
  ANTHROPIC_API_KEY?: string;
  // Extra headers the Anthropic SDK attaches to every request
  // (newline-separated `Name: value` lines).
  ANTHROPIC_CUSTOM_HEADERS?: string;
  ANTHROPIC_MAX_TOKENS?: number;
  ANTHROPIC_STOP?: string;
  ANTHROPIC_TEMPERATURE?: number;

  // Atlas Cloud
  ATLASCLOUD_API_KEY?: string;

  // AWS Bedrock
  AWS_BEARER_TOKEN_BEDROCK?: string;
  AWS_BEDROCK_FREQUENCY_PENALTY?: string;
  AWS_BEDROCK_MAX_GEN_LEN?: number;
  AWS_BEDROCK_MAX_NEW_TOKENS?: number;
  AWS_BEDROCK_MAX_RETRIES?: string;
  AWS_BEDROCK_MAX_TOKENS?: string;
  AWS_BEDROCK_PRESENCE_PENALTY?: string;
  AWS_BEDROCK_REGION?: string;
  AWS_BEDROCK_STOP?: string;
  AWS_BEDROCK_TEMPERATURE?: number;
  AWS_BEDROCK_TOP_P?: string;

  // AWS Bedrock Agents
  AWS_BEDROCK_AGENT_ID?: string;
  AWS_BEDROCK_AGENT_ALIAS_ID?: string;

  CEREBRAS_API_KEY?: string;

  // Azure OpenAI auth params
  AZURE_AUTHORITY_HOST?: string;
  AZURE_CLIENT_ID?: string;
  AZURE_CLIENT_SECRET?: string;
  AZURE_DEPLOYMENT_NAME?: string;
  AZURE_EMBEDDING_DEPLOYMENT_NAME?: string;
  AZURE_OPENAI_DEPLOYMENT_NAME?: string;
  AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME?: string;
  AZURE_TENANT_ID?: string;
  AZURE_TOKEN_SCOPE?: string;

  // Azure Content Safety params
  AZURE_CONTENT_SAFETY_API_KEY?: string;
  AZURE_CONTENT_SAFETY_API_VERSION?: string;
  AZURE_CONTENT_SAFETY_ENDPOINT?: string;

  // Cohere
  COHERE_CLIENT_NAME?: string;
  COHERE_K?: string;
  COHERE_MAX_TOKENS?: string;
  COHERE_P?: string;
  COHERE_TEMPERATURE?: string;

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_KEY?: string;

  // CometAPI
  COMETAPI_KEY?: string;

  // CDP
  CDP_DOMAIN?: string;

  // ElevenLabs
  ELEVENLABS_API_KEY?: string;

  // FAL
  FAL_KEY?: string;

  // GitHub
  GITHUB_TOKEN?: string;

  // Groq
  GROQ_API_KEY?: string;

  // Helicone
  HELICONE_API_KEY?: string;

  // Hugging Face
  /** @deprecated Use HF_TOKEN instead */
  HF_API_TOKEN?: string;
  HF_TOKEN?: string;

  // Hyperbolic
  HYPERBOLIC_API_KEY?: string;

  // Langfuse
  LANGFUSE_HOST?: string;
  LANGFUSE_PUBLIC_KEY?: string;
  LANGFUSE_SECRET_KEY?: string;

  // LLaMa
  LLAMA_BASE_URL?: string;

  // Llama API
  LLAMA_API_KEY?: string;

  // Local AI
  LOCALAI_BASE_URL?: string;
  LOCALAI_TEMPERATURE?: number;

  // Meta Model API (Muse); MODEL_API_KEY is Meta's official env var
  MODEL_API_KEY?: string;

  // Mistral
  MISTRAL_MAX_TOKENS?: string;
  MISTRAL_TEMPERATURE?: string;
  MISTRAL_TOP_K?: string;
  MISTRAL_TOP_P?: string;

  // MiniMax
  MINIMAX_API_KEY?: string;

  // Moonshot AI (Kimi)
  MOONSHOT_API_KEY?: string;

  // n8n
  N8N_API_KEY?: string;

  // Nscale
  NSCALE_SERVICE_TOKEN?: string;
  NSCALE_API_KEY?: string;

  // NVIDIA NIM (hosted inference)
  NVIDIA_API_BASE_URL?: string;
  NVIDIA_API_KEY?: string;

  // Ollama
  OLLAMA_API_KEY?: string;
  OLLAMA_BASE_URL?: string;

  // OpenAI
  OPENAI_API_KEY?: string;
  OPENAI_BEST_OF?: number;
  OPENAI_FREQUENCY_PENALTY?: number;
  OPENAI_MAX_COMPLETION_TOKENS?: number;
  OPENAI_MAX_TOKENS?: number;
  OPENAI_PRESENCE_PENALTY?: number;
  OPENAI_STOP?: string;
  OPENAI_TEMPERATURE?: number;
  OPENAI_TOP_P?: number;

  // OpenAI Codex SDK
  CODEX_API_KEY?: string;

  // ClawdBot legacy OpenClaw compatibility
  CLAWDBOT_GATEWAY_PASSWORD?: string;
  CLAWDBOT_GATEWAY_TOKEN?: string;
  CLAWDBOT_GATEWAY_URL?: string;

  // OpenClaw
  OPENCLAW_CONFIG_PATH?: string;
  OPENCLAW_GATEWAY_PASSWORD?: string;
  OPENCLAW_GATEWAY_PORT?: number | string;
  OPENCLAW_GATEWAY_TOKEN?: string;
  OPENCLAW_GATEWAY_URL?: string;

  // OpenRouter
  OPENROUTER_API_KEY?: string;

  // OrcaRouter
  ORCAROUTER_API_KEY?: string;

  // Portkey
  PORTKEY_API_BASE_URL?: string;
  PORTKEY_API_KEY?: string;

  // Replicate
  REPLICATE_MAX_LENGTH?: number;
  REPLICATE_MAX_NEW_TOKENS?: number;
  REPLICATE_REPETITION_PENALTY?: number;
  REPLICATE_SEED?: number;
  REPLICATE_STOP_SEQUENCES?: string;
  REPLICATE_SYSTEM_PROMPT?: string;
  REPLICATE_TEMPERATURE?: number;
  REPLICATE_TOP_K?: number;
  REPLICATE_TOP_P?: number;

  // SharePoint
  SHAREPOINT_BASE_URL?: string;
  SHAREPOINT_CERT_PATH?: string;
  SHAREPOINT_CLIENT_ID?: string;
  SHAREPOINT_TENANT_ID?: string;

  // Slack
  SLACK_BOT_TOKEN?: string;

  // Snowflake
  SNOWFLAKE_ACCOUNT_IDENTIFIER?: string;
  SNOWFLAKE_API_KEY?: string;

  // Together AI
  TOGETHER_API_KEY?: string;

  // TrueFoundry
  TRUEFOUNDRY_API_KEY?: string;

  // Vertex AI
  VERTEX_API_VERSION?: string;

  // Voyage AI
  VOYAGE_API_BASE_URL?: string;
  VOYAGE_API_KEY?: string;

  // Watson X
  WATSONX_AI_APIKEY?: string;
  WATSONX_AI_AUTH_TYPE?: string;
  WATSONX_AI_BEARER_TOKEN?: string;
  WATSONX_AI_PROJECT_ID?: string;

  // Pi Labs
  WITHPI_API_KEY?: string;

  // xAI
  XAI_API_KEY?: string;

  // QuiverAI
  QUIVERAI_API_KEY?: string;
} & EnvOverrides;

// Allow string access to any key for environment variables not explicitly listed
export type EnvVarKey = keyof EnvVars;

/**
 * Get an environment variable.
 * @param key The name of the environment variable.
 * @param defaultValue Optional default value if the environment variable is not set.
 * @returns The value of the environment variable, or the default value if provided.
 */
export function getEnvString(key: EnvVarKey): string | undefined;
export function getEnvString(key: EnvVarKey, defaultValue: string): string;
export function getEnvString(key: EnvVarKey, defaultValue?: string): string | undefined {
  const envOverrides = getEnvOverrides();
  if (envOverrides) {
    const envValue = envOverrides[key as string];
    if (envValue !== undefined) {
      return String(envValue);
    }
  }

  // Fallback to process.env
  const value = process.env[key as string];
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

/**
 * Get a boolean environment variable.
 * @param key The name of the environment variable.
 * @param defaultValue Optional default value if the environment variable is not set.
 * @returns The boolean value of the environment variable, or the default value if provided.
 */
export function getEnvBool(key: EnvVarKey, defaultValue?: boolean): boolean {
  const value = getEnvString(key) || defaultValue;
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'yup', 'yeppers'].includes(value.toLowerCase());
  }
  return Boolean(defaultValue);
}

/**
 * Get an integer environment variable.
 * @param key The name of the environment variable.
 * @param defaultValue Optional default value if the environment variable is not set.
 * @returns The integer value of the environment variable, or the default value if provided.
 */
export function getEnvInt(key: EnvVarKey): number | undefined;
export function getEnvInt(key: EnvVarKey, defaultValue: number): number;
export function getEnvInt(key: EnvVarKey, defaultValue?: number): number | undefined {
  const str = getEnvString(key);
  if (str === undefined || str === '') {
    return defaultValue;
  }
  const parsedValue = Number.parseInt(str, 10);
  if (!Number.isNaN(parsedValue)) {
    return parsedValue;
  }
  return defaultValue;
}

/**
 * Get a float environment variable.
 * @param key The name of the environment variable.
 * @param defaultValue Optional default value if the environment variable is not set.
 * @returns The float value of the environment variable, or the default value if provided.
 */
export function getEnvFloat(key: EnvVarKey): number | undefined;
export function getEnvFloat(key: EnvVarKey, defaultValue: number): number;
export function getEnvFloat(key: EnvVarKey, defaultValue?: number): number | undefined {
  const str = getEnvString(key);
  if (str === undefined || str === '') {
    return defaultValue;
  }
  const parsedValue = Number.parseFloat(str);
  if (!Number.isNaN(parsedValue)) {
    return parsedValue;
  }
  return defaultValue;
}

/**
 * Get the timeout in milliseconds for each individual test case/provider API call.
 * When this timeout is reached, that specific test is marked as an error.
 * @param defaultValue Optional default value if the environment variable is not set. Defaults to 0 (no timeout).
 * @returns The timeout value in milliseconds, or the default value if not set.
 */
export function getEvalTimeoutMs(defaultValue: number = 0): number {
  return getEnvInt('artef_EVAL_TIMEOUT_MS', defaultValue);
}

/**
 * Get the maximum total runtime in milliseconds for the entire evaluation process.
 * When this timeout is reached, all remaining tests are marked as errors and the evaluation ends.
 * @param defaultValue Optional default value if the environment variable is not set. Defaults to 0 (no limit).
 * @returns The max duration in milliseconds, or the default value if not set.
 */
export function getMaxEvalTimeMs(defaultValue: number = 0): number {
  return getEnvInt('artef_MAX_EVAL_TIME_MS', defaultValue);
}

/**
 * Check if the application is running in a CI environment.
 * @returns True if running in a CI environment, false otherwise.
 */
export function isCI() {
  return (
    getEnvBool('CI') ||
    getEnvBool('GITHUB_ACTIONS') ||
    getEnvBool('TRAVIS') ||
    getEnvBool('CIRCLECI') ||
    getEnvBool('JENKINS') ||
    getEnvBool('GITLAB_CI') ||
    getEnvBool('APPVEYOR') ||
    getEnvBool('CODEBUILD_BUILD_ID') ||
    getEnvBool('TF_BUILD') ||
    getEnvBool('BITBUCKET_COMMIT') ||
    getEnvBool('BUDDY') ||
    getEnvBool('BUILDKITE') ||
    getEnvBool('TEAMCITY_VERSION')
  );
}

/**
 * Check if the application is running in a non-interactive environment.
 * This includes CI environments, cron jobs, SSH scripts without TTY, etc.
 * @returns True if running in a non-interactive environment, false otherwise.
 */
export function isNonInteractive() {
  return isCI() || !process.stdin.isTTY || !process.stdout.isTTY;
}
