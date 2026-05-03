"use client";

import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  createConversation,
  deleteConversation,
  listConversations,
  listMessages,
  sendChatMessage,
} from "./service";
import { useChatStore } from "./store";

export function useChatBootstrap() {
  const status = useSession().status;
  const setConversations = useChatStore((s) => s.setConversations);
  const setListLoading = useChatStore((s) => s.setListLoading);
  const setError = useChatStore((s) => s.setError);
  const resetChat = useChatStore((s) => s.resetChat);

  useEffect(() => {
    if (status === "unauthenticated") {
      resetChat();
      return;
    }
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      setListLoading(true);
      setError(null);
      try {
        const rows = await listConversations();
        if (!cancelled) setConversations(rows);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load chats");
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, resetChat, setConversations, setError, setListLoading]);
}

export function useActiveConversationLoader() {
  const activeId = useChatStore((s) => s.activeConversationId);
  const setMessages = useChatStore((s) => s.setMessages);
  const setMessagesLoading = useChatStore((s) => s.setMessagesLoading);
  const setError = useChatStore((s) => s.setError);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setMessagesLoading(true);
      setError(null);
      try {
        const rows = await listMessages(activeId);
        if (!cancelled) setMessages(rows);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load messages");
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId, setMessages, setMessagesLoading, setError]);
}

export function useChatActions() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const setActiveConversationId = useChatStore((s) => s.setActiveConversationId);
  const prependConversation = useChatStore((s) => s.prependConversation);
  const setConversations = useChatStore((s) => s.setConversations);
  const setMessages = useChatStore((s) => s.setMessages);
  const setSending = useChatStore((s) => s.setSending);
  const setError = useChatStore((s) => s.setError);

  const startNewChat = useCallback(async () => {
    setError(null);
    const { id } = await createConversation("New chat");
    const now = new Date().toISOString();
    prependConversation({ id, title: "New chat", updatedAt: now });
    setActiveConversationId(id);
    setMessages([]);
  }, [prependConversation, setActiveConversationId, setError, setMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setError(null);
      setSending(true);
      try {
        const res = await sendChatMessage({
          conversationId: activeConversationId,
          text: trimmed,
        });
        const convs = await listConversations();
        setConversations(convs);
        setActiveConversationId(res.conversationId);
        const rows = await listMessages(res.conversationId);
        setMessages(rows);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Send failed");
      } finally {
        setSending(false);
      }
    },
    [activeConversationId, setActiveConversationId, setConversations, setError, setMessages, setSending],
  );

  const removeConversation = useCallback(
    async (id: string) => {
      setError(null);
      await deleteConversation(id);
      const next = useChatStore.getState().conversations.filter((c) => c.id !== id);
      setConversations(next);
      if (useChatStore.getState().activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
    },
    [setActiveConversationId, setConversations, setError, setMessages],
  );

  return { startNewChat, sendMessage, removeConversation, setActiveConversationId };
}
