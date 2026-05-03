"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useActiveConversationLoader, useChatActions, useChatBootstrap } from "@/features/chat/hooks";
import { useChatStore } from "@/features/chat/store";
import { ChatInput } from "./ChatInput";
import { ChatWindow } from "./ChatWindow";

export function ChatScreen() {
  useChatBootstrap();
  useActiveConversationLoader();
  const { startNewChat, sendMessage, removeConversation, setActiveConversationId } = useChatActions();

  const messages = useChatStore((s) => s.messages);
  const conversations = useChatStore((s) => s.conversations);
  const isMessagesLoading = useChatStore((s) => s.isMessagesLoading);
  const isSending = useChatStore((s) => s.isSending);
  const error = useChatStore((s) => s.error);
  const activeId = useChatStore((s) => s.activeConversationId);
  const inputDisabled = isSending || (conversations.length > 0 && !activeId);

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100 dark:bg-zinc-950">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <Sidebar
          onNewChat={() => void startNewChat()}
          onSelect={setActiveConversationId}
          onDelete={(id) => void removeConversation(id)}
        />
        <main className="flex min-h-0 flex-1 flex-col bg-white dark:bg-zinc-950">
          {error ? (
            <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          ) : null}
          <ChatWindow
            messages={messages}
            loading={!!activeId && isMessagesLoading}
            emptyHint={activeId ? "Say something to begin." : "Select a chat from the sidebar or create a new one."}
          />
          <ChatInput disabled={inputDisabled} onSend={(t) => void sendMessage(t)} />
        </main>
      </div>
    </div>
  );
}
