import { loadDefaultConfig } from '../../util/config/default';
import { initializeToolRegistry, toolRegistry } from './lib/toolRegistry';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Initialize the tool registry on module load
initializeToolRegistry();

/**
 * Register MCP resources with the server
 */
export function registerResources(server: McpServer) {
  // Resources with proper namespacing
  server.resource('artef-config', 'artef://config/default', async () => {
    try {
      const { defaultConfig } = await loadDefaultConfig();
      return {
        contents: [
          {
            uri: 'artef://config/default',
            text: JSON.stringify(defaultConfig, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: 'artef://config/default',
            text: JSON.stringify(
              {
                error: `Failed to load default config: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
  });

  server.resource('artef-docs', 'artef://docs/tools', async () => {
    // Auto-generate documentation from the tool registry
    const toolDocs = toolRegistry.generateDocs();

    return {
      contents: [
        {
          uri: 'artef://docs/tools',
          text: JSON.stringify(toolDocs, null, 2),
        },
      ],
    };
  });
}
