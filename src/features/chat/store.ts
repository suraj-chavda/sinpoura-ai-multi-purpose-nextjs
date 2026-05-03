import { create } from "zustand";
import type { ChatMessageDTO, ConversationDTO } from "./types";

type ChatState = {
  conversations: ConversationDTO[];
  activeConversationId: string | null;
  messages: ChatMessageDTO[];
  isListLoading: boolean;
  isMessagesLoading: boolean;
  isSending: boolean;
  error: string | null;
};

type ChatActions = {
  setConversations: (rows: ConversationDTO[]) => void;
  setActiveConversationId: (id: string | null) => void;
  setMessages: (rows: ChatMessageDTO[]) => void;
  prependConversation: (row: ConversationDTO) => void;
  patchConversationTitle: (id: string, title: string) => void;
  setListLoading: (v: boolean) => void;
  setMessagesLoading: (v: boolean) => void;
  setSending: (v: boolean) => void;
  setError: (msg: string | null) => void;
  resetChat: () => void;
};

const initial: ChatState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  isListLoading: false,
  isMessagesLoading: false,
  isSending: false,
  error: null,
};

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  ...initial,
  setConversations: (conversations) => set({ conversations }),
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
  setMessages: (messages) => set({ messages }),
  prependConversation: (row) =>
    set((s) => ({ conversations: [row, ...s.conversations.filter((c) => c.id !== row.id)] })),
  patchConversationTitle: (id, title) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, title } : c)),
    })),
  setListLoading: (isListLoading) => set({ isListLoading }),
  setMessagesLoading: (isMessagesLoading) => set({ isMessagesLoading }),
  setSending: (isSending) => set({ isSending }),
  setError: (error) => set({ error }),
  resetChat: () => set(initial),
}));
