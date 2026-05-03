"use client";

import { useChatStore } from "@/features/chat/store";

type Props = {
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export function Sidebar({ onNewChat, onSelect, onDelete }: Props) {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const loading = useChatStore((s) => s.isListLoading);

  return (
    <aside className="flex w-full flex-col border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40 md:h-full md:max-w-[16rem] md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-2 p-3">
        <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">Chats</span>
        <button
          type="button"
          onClick={onNewChat}
          className="rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-50 transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New
        </button>
      </div>
      <div className="flex max-h-44 flex-col gap-0.5 overflow-y-auto px-2 pb-3 md:max-h-none md:flex-1">
        {loading ? (
          <p className="px-2 py-2 text-sm text-zinc-500">Loading…</p>
        ) : conversations.length === 0 ? (
          <p className="px-2 py-2 text-sm text-zinc-500">No chats yet</p>
        ) : (
          conversations.map((c) => (
            <div key={c.id} className="group flex items-stretch gap-1">
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={`min-w-0 flex-1 rounded-lg px-2 py-2 text-left text-sm transition ${
                  activeId === c.id
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-700 hover:bg-white/70 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                }`}
              >
                <span className="line-clamp-2">{c.title}</span>
              </button>
              <button
                type="button"
                aria-label="Delete chat"
                className="shrink-0 rounded-lg px-2 text-xs text-zinc-400 opacity-70 transition hover:bg-red-500/10 hover:text-red-600 group-hover:opacity-100 dark:hover:text-red-400"
                onClick={() => onDelete(c.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
