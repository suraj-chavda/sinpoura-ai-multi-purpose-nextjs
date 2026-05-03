import { buildChatLlmPayload } from "@/lib/browser-llm-config";
import { API } from "@/lib/constants";
import { parseJson } from "@/lib/fetcher";
import type { ChatMessageDTO, ConversationDTO } from "./types";

export async function listConversations(): Promise<ConversationDTO[]> {
  const res = await fetch(API.conversations, { cache: "no-store" });
  return parseJson<ConversationDTO[]>(res);
}

export async function createConversation(title?: string): Promise<{ id: string }> {
  const res = await fetch(API.conversations, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return parseJson<{ id: string }>(res);
}

export async function listMessages(conversationId: string): Promise<ChatMessageDTO[]> {
  const res = await fetch(`${API.conversations}/${conversationId}`, { cache: "no-store" });
  return parseJson<ChatMessageDTO[]>(res);
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const res = await fetch(`${API.conversations}/${conversationId}`, { method: "DELETE" });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = (await res.json()) as { error?: string };
      if (err?.error) message = err.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
}

export type ChatRequest = { conversationId?: string | null; text: string };

export type ChatResponse = {
  conversationId: string;
  userMessage: ChatMessageDTO;
  assistantMessage: ChatMessageDTO;
};

export class ChatApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
    this.code = code;
  }
}

export async function sendChatMessage(body: ChatRequest): Promise<ChatResponse> {
  const llm = buildChatLlmPayload();
  const res = await fetch(API.chat, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, ...(llm ? { llm } : {}) }),
  });
  if (!res.ok) {
    let message = res.statusText;
    let code: string | undefined;
    try {
      const err = (await res.json()) as { error?: string; code?: string };
      if (err?.error) message = err.error;
      if (typeof err?.code === "string") code = err.code;
    } catch {
      /* ignore */
    }
    throw new ChatApiError(message, res.status, code);
  }
  return res.json() as Promise<ChatResponse>;
}
