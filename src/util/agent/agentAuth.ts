/**
 * Shared auth credential resolution for agent clients.
 *
 * Common waterfall: CLI arg → artef_API_KEY env var → cloud config stored key.
 * Agent-specific auth (e.g., OIDC, fork PR) wraps this function and adds extra strategies.
 */

import logger from '../../logger';

import type { SocketAuthCredentials } from '../../types/codeScan';

// Import artef's cloud config for auth (using ESM dynamic import)
let cloudConfig: { getApiKey(): string | undefined } | undefined;
try {
  const cloudModule = await import('../../globalConfig/cloud');
  cloudConfig = cloudModule.cloudConfig;
} catch (error: unknown) {
  // Only swallow MODULE_NOT_FOUND — other errors indicate real problems
  if (error instanceof Error && 'code' in error && (error as any).code === 'MODULE_NOT_FOUND') {
    // artef auth not available - that's OK, will fall back to other methods
  } else {
    logger.debug(`Unexpected error loading cloud config: ${error}`);
  }
}

/**
 * Resolve base authentication credentials using waterfall approach:
 * 1. API key from argument (CLI --api-key or config file)
 * 2. artef_API_KEY environment variable
 * 3. API key from artef auth (cloudConfig)
 *
 * @param opts - Optional overrides
 * @returns Resolved auth credentials (may be empty if no auth found)
 */
export function resolveBaseAuthCredentials(opts?: { apiKey?: string }): SocketAuthCredentials {
  // 1. API key from argument
  if (opts?.apiKey) {
    logger.debug('Using API key from CLI/config');
    return { apiKey: opts.apiKey };
  }

  // 2. API key from environment variable
  const envApiKey = process.env.artef_API_KEY;
  if (envApiKey) {
    logger.debug('Using API key from artef_API_KEY env var');
    return { apiKey: envApiKey };
  }

  // 3. API key from artef auth
  if (cloudConfig) {
    const storedApiKey = cloudConfig.getApiKey();
    if (storedApiKey) {
      logger.debug('Using API key from artef auth');
      return { apiKey: storedApiKey };
    }
  }

  // No auth found at this level
  return {};
}
