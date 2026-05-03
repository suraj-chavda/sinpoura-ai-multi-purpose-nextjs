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

export async function sendChatMessage(body: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(API.chat, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<ChatResponse>(res);
}
