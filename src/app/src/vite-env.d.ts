/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_artef_REMOTE_API_BASE_URL: string;
  readonly VITE_artef_VERSION: string;
  readonly VITE_PUBLIC_BASENAME: string;
  readonly VITE_artef_DISABLE_TELEMETRY: string;
  readonly VITE_POSTHOG_KEY: string;
  readonly VITE_POSTHOG_HOST: string;
  readonly VITE_artef_LAUNCHER?: string;
  readonly VITE_IS_HOSTED?: string;
  readonly VITE_artef_NO_CHAT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
