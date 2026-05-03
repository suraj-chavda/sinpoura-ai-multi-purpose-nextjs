import type { LlmProviderId } from "@/lib/llm-provider";

export type ResolvedChatLlm = { provider: LlmProviderId; apiKey: string; source: "env" | "client" };

function envOpenAi() {
  return process.env.OPENAI_API_KEY?.trim() ?? "";
}

function envAnthropic() {
  return process.env.ANTHROPIC_API_KEY?.trim() ?? "";
}

function inferProviderWhenNoHint(): LlmProviderId | null {
  if (envOpenAi()) return "openai";
  if (envAnthropic()) return "anthropic";
  return null;
}

/**
 * Prefer server env keys when set; otherwise accept per-request client keys (browser BYOK).
 * Never persists client keys.
 */
export function resolveChatLlm(body: {
  provider?: LlmProviderId;
  apiKey?: string;
}): ResolvedChatLlm | null {
  const provider = body.provider ?? inferProviderWhenNoHint() ?? "openai";

  if (provider === "openai") {
    const env = envOpenAi();
    if (env) return { provider: "openai", apiKey: env, source: "env" };
    const k = body.apiKey?.trim();
    if (k) return { provider: "openai", apiKey: k, source: "client" };
    return null;
  }

  const env = envAnthropic();
  if (env) return { provider: "anthropic", apiKey: env, source: "env" };
  const k = body.apiKey?.trim();
  if (k) return { provider: "anthropic", apiKey: k, source: "client" };
  return null;
}
