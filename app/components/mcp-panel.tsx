'use client';

import { useMcp } from 'use-mcp/react';
import { useEffect } from 'react';

let availableTools = [];

export const getAvailableTools = () => availableTools;

export function useMcpClient() {
  const {
    state,
    tools,
    callTool,
    error,
    resources,
    readResource,
    getPrompt,
    prompts,
  } = useMcp({
    url: 'http://localhost:3000/mcp',
    clientName: 'MyRemixApp',
    autoReconnect: true,
  });

  useEffect(() => {
    if (state === 'ready') {
      availableTools = [...tools];
      console.log('[MCP] Tools Ready:', tools.map(t => t.name));
    }
  }, [state, tools]);

  return { tools, callTool, error };
}