"use client";

import { KeyRound, MessageSquarePlus } from "lucide-react";
import { ChatBreadcrumb } from "@/components/layout/ChatBreadcrumb";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { cn } from "@/lib/utils";

type Props = {
  activeTitle: string | null;
  activeId: string | null;
  onNewChat: () => void;
  onOpenModelSettings: () => void;
  className?: string;
};

export function ChatWorkspaceTopBar({
  activeTitle,
  activeId,
  onNewChat,
  onOpenModelSettings,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative z-[1] flex h-14 min-h-14 min-w-0 flex-1 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4 md:px-5",
        className,
      )}
    >
      <div className="min-w-0 flex-1 overflow-hidden pr-1">
        <ChatBreadcrumb activeTitle={activeTitle} activeId={activeId} />
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onOpenModelSettings}
          aria-label="Model and API keys"
          title="Model & API keys"
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground ring-1 ring-border/40 transition-colors hover:bg-white/15 hover:text-primary sm:size-9 sm:rounded-xl dark:ring-white/10 dark:hover:bg-white/[0.06]",
          )}
        >
          <KeyRound className="size-4 shrink-0" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onNewChat}
          aria-label="New chat"
          title="New chat"
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground ring-1 ring-border/40 transition-colors hover:bg-white/15 hover:text-primary sm:size-9 sm:rounded-xl dark:ring-white/10 dark:hover:bg-white/[0.06]",
          )}
        >
          <MessageSquarePlus className="size-4 shrink-0" aria-hidden />
        </button>
        <ModeToggle className="hidden shrink-0 sm:inline-flex" />
      </div>
    </div>
  );
}
