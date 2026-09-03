import type { OpenAIEvalsImportResult } from './openaiEvals';

export const IMPORT_SOURCE_OPENAI_EVALS = 'openai-evals-jsonl';
export const IMPORT_SOURCE_artef = 'artef-json';

export type ParsedImportFile =
  | { source: typeof IMPORT_SOURCE_OPENAI_EVALS; evalData: OpenAIEvalsImportResult }
  | { source: typeof IMPORT_SOURCE_artef; evalData: unknown };
