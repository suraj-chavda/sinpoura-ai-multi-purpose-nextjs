"use client";

import { useEffect, useRef } from "react";
import type { ChatMessageDTO } from "@/features/chat/types";
import { ChatMessage } from "./ChatMessage";

type Props = {
  messages: ChatMessageDTO[];
  loading?: boolean;
  emptyHint?: string;
};

export function ChatWindow({ messages, loading, emptyHint }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-zinc-500">Loading messages…</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-zinc-500">{emptyHint ?? "Choose a chat or start a new one."}</p>
          ) : (
            messages.map((m) => <ChatMessage key={m.id} message={m} />)
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
