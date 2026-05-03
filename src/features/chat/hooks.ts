"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChatApiError,
  createConversation,
  deleteConversation,
  listConversations,
  listMessages,
  sendChatMessage,
} from "./service";
import { useChatStore } from "./store";

/** Keeps `/chat?c=` in sync with the store and restores the open thread after reload. */
export function useChatRouteSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActiveConversationId = useChatStore((s) => s.setActiveConversationId);
  const isListLoading = useChatStore((s) => s.isListLoading);

  useEffect(() => {
    if (pathname !== "/chat" || isListLoading) return;
    const q = searchParams.get("c");
    if (!q) return;
    const ok = conversations.some((c) => c.id === q);
    if (!ok) {
      router.replace("/chat", { scroll: false });
      return;
    }
    if (activeId === null) setActiveConversationId(q);
  }, [pathname, isListLoading, conversations, searchParams, activeId, router, setActiveConversationId]);

  useEffect(() => {
    if (pathname !== "/chat" || isListLoading) return;
    const q = searchParams.get("c");
    if (activeId && q !== activeId) {
      router.replace(`/chat?c=${encodeURIComponent(activeId)}`, { scroll: false });
    }
    if (!activeId && q) {
      router.replace("/chat", { scroll: false });
    }
  }, [pathname, activeId, isListLoading, searchParams, router]);
}

export function useChatBootstrap() {
  const status = useSession().status;
  const setConversations = useChatStore((s) => s.setConversations);
  const setListLoading = useChatStore((s) => s.setListLoading);
  const setError = useChatStore((s) => s.setError);
  const setChatErrorCode = useChatStore((s) => s.setChatErrorCode);
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
      setChatErrorCode(null);
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
  }, [status, resetChat, setChatErrorCode, setConversations, setError, setListLoading]);
}

export function useActiveConversationLoader() {
  const router = useRouter();
  const pathname = usePathname();
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActiveConversationId = useChatStore((s) => s.setActiveConversationId);
  const setMessages = useChatStore((s) => s.setMessages);
  const setMessagesLoading = useChatStore((s) => s.setMessagesLoading);
  const setError = useChatStore((s) => s.setError);
  const setChatErrorCode = useChatStore((s) => s.setChatErrorCode);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setMessagesLoading(true);
      setError(null);
      setChatErrorCode(null);
      try {
        const rows = await listMessages(activeId);
        if (cancelled) return;
        const { messages: cur, isSending, activeConversationId: loadingFor } = useChatStore.getState();
        if (loadingFor !== activeId) return;
        // Avoid stale empty snapshots racing ahead of sendMessage's POST + listMessages (first message / new thread).
        if (rows.length === 0 && cur.length > 0) return;
        if (rows.length === 0 && isSending) return;
        setMessages(rows);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load messages";
        if (!cancelled && msg === "Not found") {
          setActiveConversationId(null);
          setMessages([]);
          if (pathname === "/chat") router.replace("/chat", { scroll: false });
          setError("That conversation is no longer available.");
        } else if (!cancelled) {
          setError(msg);
        }
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    activeId,
    pathname,
    router,
    setActiveConversationId,
    setChatErrorCode,
    setMessages,
    setMessagesLoading,
    setError,
  ]);
}

export function useChatActions() {
  const sendMutexRef = useRef(false);
  const router = useRouter();
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const setActiveConversationId = useChatStore((s) => s.setActiveConversationId);
  const prependConversation = useChatStore((s) => s.prependConversation);
  const setConversations = useChatStore((s) => s.setConversations);
  const setMessages = useChatStore((s) => s.setMessages);
  const setSending = useChatStore((s) => s.setSending);
  const setPendingOutbound = useChatStore((s) => s.setPendingOutbound);
  const setError = useChatStore((s) => s.setError);
  const setChatErrorCode = useChatStore((s) => s.setChatErrorCode);

  const pushConversationRoute = useCallback(
    (id: string | null) => {
      if (id) router.replace(`/chat?c=${encodeURIComponent(id)}`, { scroll: false });
      else router.replace("/chat", { scroll: false });
    },
    [router],
  );

  const selectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      pushConversationRoute(id);
    },
    [pushConversationRoute, setActiveConversationId],
  );

  const startNewChat = useCallback(async () => {
    setError(null);
    setChatErrorCode(null);
    const { id } = await createConversation("New chat");
    const now = new Date().toISOString();
    prependConversation({ id, title: "New chat", updatedAt: now });
    setActiveConversationId(id);
    setMessages([]);
    pushConversationRoute(id);
  }, [
    prependConversation,
    pushConversationRoute,
    setActiveConversationId,
    setChatErrorCode,
    setError,
    setMessages,
  ]);

  const sendMessage = useCallback(
    async (text: string, opts?: { conversationId?: string | null }) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (sendMutexRef.current) return;
      sendMutexRef.current = true;
      let conversationId = opts?.conversationId ?? activeConversationId;
      setError(null);
      setChatErrorCode(null);
      setSending(true);
      const startedAt = new Date().toISOString();
      setPendingOutbound({ userContent: trimmed, startedAt });
      let convsPayload: Awaited<ReturnType<typeof listConversations>> | undefined;
      try {
        if (!conversationId) {
          await startNewChat();
          conversationId = useChatStore.getState().activeConversationId;
          if (!conversationId) {
            const msg = "Could not start a chat. Try New chat in the sidebar.";
            setError(msg);
            throw new Error(msg);
          }
        }
        const res = await sendChatMessage({
          conversationId,
          text: trimmed,
        });
        setActiveConversationId(res.conversationId);
        pushConversationRoute(res.conversationId);
        const rows = await listMessages(res.conversationId);
        /** One atomic write so React never renders server messages + pending bubble together (duplicate query UI). */
        useChatStore.setState({ messages: rows, pendingOutbound: null });
        convsPayload = await listConversations();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Send failed";
        setError(msg);
        setChatErrorCode(e instanceof ChatApiError ? e.code ?? null : null);
        throw e instanceof Error ? e : new Error(msg);
      } finally {
        setSending(false);
        setPendingOutbound(null);
        sendMutexRef.current = false;
      }
      if (convsPayload) setConversations(convsPayload);
    },
    [
      activeConversationId,
      pushConversationRoute,
      setActiveConversationId,
      setConversations,
      setError,
      setMessages,
      setSending,
      setPendingOutbound,
      setChatErrorCode,
      startNewChat,
    ],
  );

  const removeConversation = useCallback(
    async (id: string) => {
      setError(null);
      setChatErrorCode(null);
      await deleteConversation(id);
      const next = useChatStore.getState().conversations.filter((c) => c.id !== id);
      setConversations(next);
      if (useChatStore.getState().activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
        pushConversationRoute(null);
      }
    },
    [pushConversationRoute, setActiveConversationId, setChatErrorCode, setConversations, setError, setMessages],
  );

  return { startNewChat, sendMessage, removeConversation, selectConversation, setActiveConversationId };
}
