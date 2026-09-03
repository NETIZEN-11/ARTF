import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cloudConfig } from '../../src/globalConfig/cloud';
import logger from '../../src/logger';
import { artefModelProvider } from '../../src/providers/artefModel';
import type { Mock } from 'vitest';

describe('artefModelProvider', () => {
  let mockFetch: Mock;
  let mockCloudConfig: ReturnType<typeof vi.spyOn>;
  const mockLogger = vi.spyOn(logger, 'debug').mockImplementation(function () {});

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
    mockCloudConfig = vi.spyOn(cloudConfig, 'getApiKey').mockReturnValue('test-token');
    mockLogger.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with model name', () => {
    const provider = new artefModelProvider('test-model');
    expect(provider.id()).toBe('artef:model:test-model');
  });

  it('should throw error if model name is not provided', () => {
    expect(() => new artefModelProvider('')).toThrow('Model name is required');
  });

  it('should call API with string prompt', async () => {
    const provider = new artefModelProvider('test-model');
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          result: {
            choices: [{ message: { content: 'test response' } }],
            usage: {
              total_tokens: 10,
              prompt_tokens: 5,
              completion_tokens: 5,
            },
          },
        }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const result = await provider.callApi('test prompt');

    expect(result).toEqual({
      output: 'test response',
      tokenUsage: {
        total: 10,
        prompt: 5,
        completion: 5,
        numRequests: 1,
      },
    });
  });

  it('should handle JSON array messages', async () => {
    const provider = new artefModelProvider('test-model');
    const messages = JSON.stringify([
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi' },
    ]);

    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          result: {
            choices: [{ message: { content: 'test response' } }],
            usage: { total_tokens: 10, prompt_tokens: 5, completion_tokens: 5 },
          },
        }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    await provider.callApi(messages);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining(
          '"messages":[{"role":"user","content":"Hello"},{"role":"assistant","content":"Hi"}]',
        ),
      }),
    );
  });

  it('should throw error if no auth token', async () => {
    mockCloudConfig.mockReturnValue(undefined);
    const provider = new artefModelProvider('test-model');

    await expect(provider.callApi('test')).rejects.toThrow('No artef auth token available');
  });

  it('should handle API errors', async () => {
    const provider = new artefModelProvider('test-model');
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal server error'),
    });

    await expect(provider.callApi('test')).rejects.toThrow('artefModel task API error: 500');
  });

  it('should handle invalid API responses', async () => {
    const provider = new artefModelProvider('test-model');
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await expect(provider.callApi('test')).rejects.toThrow(
      'Invalid response from artefModel task API',
    );
  });

  it('should use config from options', async () => {
    const config = { temperature: 0.7 };
    const provider = new artefModelProvider('test-model', { model: 'test-model', config });

    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          result: {
            choices: [{ message: { content: 'test' } }],
            usage: { total_tokens: 10, prompt_tokens: 5, completion_tokens: 5 },
          },
        }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    await provider.callApi('test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"config":{"temperature":0.7}'),
      }),
    );
  });
});
