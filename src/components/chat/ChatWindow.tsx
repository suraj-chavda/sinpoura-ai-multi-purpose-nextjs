"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import type { ChatMessageDTO } from "@/features/chat/types";
import type { ChatStarter } from "@/lib/chat-starters";
import { deriveChatParticipantInitials } from "@/lib/user-initials";
import { cn } from "@/lib/utils";
import { ChatAssistantProcessing } from "./ChatAssistantProcessing";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatMessage } from "./ChatMessage";
import { UserAvatarMark } from "./ChatParticipantMarks";

type Props = {
  messages: ChatMessageDTO[];
  loading?: boolean;
  /** Optimistic user text while the chat API is processing */
  pendingUserContent?: string | null;
  assistantProcessing?: boolean;
  emptyHint?: string;
  /** Center prompts when there are no messages */
  starters?: ChatStarter[];
  onStarterSelect?: (query: string) => void;
  startersBusy?: boolean;
  emptyVariant?: "fresh" | "idle";
  chatParticipantProfile?: { name: string | null; email: string | null } | null;
};

export function ChatWindow({
  messages,
  loading,
  pendingUserContent,
  assistantProcessing,
  emptyHint,
  starters,
  onStarterSelect,
  startersBusy,
  emptyVariant = "fresh",
  chatParticipantProfile = null,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const userInitials = React.useMemo(
    () =>
      deriveChatParticipantInitials(chatParticipantProfile?.name, chatParticipantProfile?.email),
    [chatParticipantProfile?.name, chatParticipantProfile?.email],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, pendingUserContent, assistantProcessing]);

  const showStarters =
    !loading &&
    messages.length === 0 &&
    !pendingUserContent &&
    starters &&
    starters.length > 0 &&
    typeof onStarterSelect === "function";

  return (
    <div className="chat-main-texture-mobile-only relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent">
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-5 sm:px-5 sm:pb-4 sm:pt-5 md:px-6 md:py-4">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col gap-3 pb-4 max-md:pb-5 md:pb-3">
          {loading ? (
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex w-full justify-end gap-2">
                <div className="h-14 w-[min(100%,18rem)] animate-pulse rounded-2xl bg-muted/90" />
                <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted/90" />
              </div>
              <div className="flex w-full justify-start gap-2">
                <div className="size-8 shrink-0 animate-pulse rounded-xl bg-muted/90" />
                <div className="h-24 w-[min(100%,85%)] animate-pulse rounded-2xl bg-muted/90" />
              </div>
              <div className="flex w-full justify-end gap-2">
                <div className="h-12 w-[min(100%,14rem)] animate-pulse rounded-2xl bg-muted/90" />
                <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted/90" />
              </div>
            </div>
          ) : showStarters ? (
            <ChatEmptyState
              variant={emptyVariant}
              starters={starters}
              onSelectStarter={onStarterSelect}
              busy={startersBusy}
            />
          ) : messages.length === 0 && !pendingUserContent ? (
            <p className={cn("py-12 text-center text-sm leading-relaxed text-muted-foreground")}>
              {emptyHint ?? "No messages yet."}
            </p>
          ) : (
            <>
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} userInitials={userInitials} />
              ))}
              {pendingUserContent ? (
                <div className="flex w-full items-start justify-end gap-2">
                  <div className="flex min-w-0 flex-col items-end gap-1">
                    <div className="max-w-[min(100%,42rem)] rounded-2xl bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-md shadow-primary/15 ring-1 ring-transparent">
                      <p className="whitespace-pre-wrap">{pendingUserContent}</p>
                    </div>
                    <span className="px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Sending…
                    </span>
                  </div>
                  <UserAvatarMark initials={userInitials} />
                </div>
              ) : null}
              {assistantProcessing ? <ChatAssistantProcessing /> : null}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
