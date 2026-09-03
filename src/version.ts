/**
 * Version and build-time constants.
 *
 * This module uses compile-time injection:
 * - At build time (tsdown): Constants are injected via `define` and inlined
 * - In development (npm scripts): Uses npm_package_* environment variables
 * - In browser builds: Falls back to defaults (frontend uses VITE_artef_VERSION)
 */

// Build-time constants injected by tsdown's `define` option.
// In development/test environments, these remain undefined.
//
// Note: __artef_NODE_ENGINE_RANGE__ and __artef_NODE_ENGINE_COMPARATOR_SETS__
// are also injected at build time, but are declared in entrypoint.ts to maintain
// its zero-dependency isolation.
// The entrypoint must check Node version before importing any modules.
declare const __artef_VERSION__: string | undefined;
declare const __artef_POSTHOG_KEY__: string | undefined;

/**
 * Application version from package.json.
 * Injected at build time, or read from npm environment in development.
 */
export const VERSION: string =
  typeof __artef_VERSION__ === 'undefined'
    ? (process.env.npm_package_version ?? '0.0.0-development')
    : __artef_VERSION__;

/**
 * PostHog analytics key.
 * Only populated during production builds via artef_POSTHOG_KEY env var.
 * Empty string in development/test.
 */
export const POSTHOG_KEY: string =
  typeof __artef_POSTHOG_KEY__ === 'undefined' ? '' : __artef_POSTHOG_KEY__;
