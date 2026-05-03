import {
  createAnthropicProvider,
  createOpenAIProvider,
  createXoin,
  type Xoin,
} from "@xoin/xoin-js";
import type { LlmProviderId } from "@/lib/llm-provider";

/** Fresh client per request (BYOK / per-request keys are never pooled). */
export function createXoinForChat(provider: LlmProviderId, apiKey: string): Xoin {
  if (provider === "anthropic") {
    return createXoin({
      defaultProvider: "anthropic",
      providers: {
        anthropic: createAnthropicProvider({
          apiKey,
          defaultModel: process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-20241022",
        }),
      },
    });
  }
  return createXoin({
    defaultProvider: "openai",
    providers: {
      openai: createOpenAIProvider({
        apiKey,
        defaultModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      }),
    },
  });
}
