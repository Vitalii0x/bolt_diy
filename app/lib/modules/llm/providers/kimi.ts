import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai'; // assuming Kimi is OpenAI-compatible


export default class KimiAIProvider extends BaseProvider {
  name = 'KimiAI';
  getApiKeyLink = 'https://platform.moonshot.ai/console/api-keys'; // example link to their docs

  config = {
    apiTokenKey: 'KIMI_API_KEY',
  };

  staticModels: ModelInfo[] = [
    { name: 'kimi-k2-0711-preview', label: 'Kimi K2 (18k)', provider: 'KimiAI', maxTokenAllowed: 18000 },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    // Kimi API may not support model listing yet. Return staticModels.
    return this.staticModels;
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '', // update if Kimi requires custom base URL
      defaultApiTokenKey: 'KIMI_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const kimi = createOpenAI({
      apiKey,
      baseURL: 'https://api.moonshot.ai/v1', // Kimi's endpoint (custom)
      // tools: mcpClient.getRegisteredTools(),
      // callTool: mcpClient.callTool,
    });

    return kimi(model);
  }
}
