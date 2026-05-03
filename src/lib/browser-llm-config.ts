import type { LlmProviderId } from "@/lib/llm-provider";

export type { LlmProviderId };

const STORAGE_KEY = "sinpoura_llm_v1";

export type BrowserLlmConfigV1 = {
  v: 1;
  activeProvider: LlmProviderId;
  keys: Partial<Record<LlmProviderId, string>>;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function readBrowserLlmConfig(): BrowserLlmConfigV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw?.trim()) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    if (parsed.v !== 1) return null;
    const ap = parsed.activeProvider;
    if (ap !== "openai" && ap !== "anthropic") return null;
    const keysIn = parsed.keys;
    const keys: Partial<Record<LlmProviderId, string>> = {};
    if (isRecord(keysIn)) {
      if (typeof keysIn.openai === "string") keys.openai = keysIn.openai;
      if (typeof keysIn.anthropic === "string") keys.anthropic = keysIn.anthropic;
    }
    return { v: 1, activeProvider: ap, keys };
  } catch {
    return null;
  }
}

export function writeBrowserLlmConfig(cfg: BrowserLlmConfigV1): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function clearBrowserLlmConfig(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Active provider key — trimmed — or null if missing. */
export function getActiveBrowserApiKey(): { provider: LlmProviderId; apiKey: string } | null {
  const cfg = readBrowserLlmConfig();
  if (!cfg) return null;
  const k = cfg.keys[cfg.activeProvider]?.trim();
  if (!k) return null;
  return { provider: cfg.activeProvider, apiKey: k };
}

export function clientHasUsableLlmKey(): boolean {
  return getActiveBrowserApiKey() !== null;
}

/** Payload for `/api/chat`: omit entirely when relying on server env keys only. */
export function buildChatLlmPayload(): { provider: LlmProviderId; apiKey?: string } | undefined {
  const cfg = readBrowserLlmConfig();
  if (!cfg) return undefined;
  const apiKey = cfg.keys[cfg.activeProvider]?.trim();
  if (apiKey) return { provider: cfg.activeProvider, apiKey };
  return { provider: cfg.activeProvider };
}
