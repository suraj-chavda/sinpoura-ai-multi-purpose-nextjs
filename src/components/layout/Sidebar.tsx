"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, MessageSquare, MessageSquarePlus, Search, Trash2, X } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { useChatStore } from "@/features/chat/store";
import { cn } from "@/lib/utils";

type Props = {
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  /** Logo / home: clear open thread and strip ?c= from the URL */
  onResetWorkspace?: () => void;
  className?: string;
  onMobileClose?: () => void;
};

function userInitials(email: string | undefined | null, name: string | undefined | null) {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0];
    const b = parts[1]?.[0];
    return ((a ?? "") + (b ?? a ?? "")).toUpperCase().slice(0, 2);
  }
  const local = email?.split("@")?.[0]?.trim();
  if (local && local.length > 0) return local.slice(0, 2).toUpperCase();
  return "?";
}

export function Sidebar({
  onNewChat,
  onSelect,
  onDelete,
  onResetWorkspace,
  className,
  onMobileClose,
}: Props) {
  const { data } = useSession();
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const loading = useChatStore((s) => s.isListLoading);

  const drawer = !!onMobileClose;
  const user = data?.user;

  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredConversations = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col overflow-hidden bg-sidebar text-sidebar-foreground",
        drawer ? "h-full w-full" : "w-[15.5rem] sm:w-[16.75rem]",
        !drawer &&
          "rounded-2xl border border-sidebar-border bg-sidebar/95 shadow-xl shadow-black/[0.07] ring-1 ring-border/55 backdrop-blur-md dark:shadow-black/40 dark:ring-white/[0.07]",
        drawer && "rounded-none border-0 shadow-none ring-0",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex h-14 shrink-0 items-center gap-2 overflow-hidden border-b border-border/90 px-3 backdrop-blur-md",
          "bg-gradient-to-br from-sidebar-primary/[0.14] via-background/92 to-sidebar-accent/35 dark:from-sidebar-primary/25 dark:via-background/88 dark:to-sidebar-accent/25",
          drawer && "pr-2",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_120%_at_100%_-10%,var(--sidebar-primary)_0%,transparent_58%)] opacity-[0.22] dark:opacity-[0.28]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/35 to-transparent" />

        <Link
          href="/chat"
          onClick={(e) => {
            if (!onResetWorkspace) return;
            e.preventDefault();
            onResetWorkspace();
          }}
          className="relative flex min-h-9 min-w-0 flex-1 items-center gap-2.5 rounded-xl px-1 py-1 text-foreground outline-none ring-sidebar-ring transition-[background,box-shadow] hover:bg-white/15 focus-visible:ring-2 dark:hover:bg-white/[0.06]"
        >
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/85 shadow-sm ring-1 ring-border/55 dark:bg-background/35 dark:ring-white/10">
            <Image src="/logo.svg" alt="" width={24} height={24} className="size-6 shrink-0" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-heading text-[15px] font-medium tracking-tight text-foreground">{APP_NAME}</span>
            <span className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Workspace
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={onNewChat}
          className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground ring-1 ring-border/40 transition-colors hover:bg-accent hover:text-primary dark:ring-white/10"
          aria-label="New chat"
          title="New chat"
        >
          <MessageSquarePlus className="size-4 shrink-0" aria-hidden />
        </button>

        {drawer ? (
          <button
            type="button"
            onClick={onMobileClose}
            className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground ring-1 ring-border/40 transition-colors hover:bg-accent hover:text-accent-foreground dark:ring-white/10"
            aria-label="Close sidebar"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="shrink-0 border-b border-border/60 px-2 py-2.5">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/80" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threads…"
            autoComplete="off"
            className="w-full rounded-lg border border-sidebar-border/70 bg-background/70 py-2 pl-8 pr-2 text-xs text-foreground outline-none placeholder:text-muted-foreground/90 focus-visible:border-sidebar-primary/45 focus-visible:ring-2 focus-visible:ring-sidebar-primary/20 dark:bg-background/35"
          />
        </label>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-2 pb-2 pt-2">
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain",
            conversations.length === 0 && !loading ? "flex flex-col" : "",
          )}
        >
          {loading ? (
            <div className="flex flex-col gap-1 px-0.5 py-0.5">
              <div className="h-9 animate-pulse rounded-lg bg-sidebar-accent/50" />
              <div className="h-9 animate-pulse rounded-lg bg-sidebar-accent/50" />
              <div className="h-9 animate-pulse rounded-lg bg-sidebar-accent/50" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex min-h-0 flex-1 flex-col px-0.5 pb-1 pt-1">
              <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-dashed border-sidebar-border/90 bg-gradient-to-b from-sidebar-accent/25 via-sidebar-accent/15 to-sidebar-accent/30 px-4 py-10 text-center shadow-inner shadow-black/[0.03] dark:shadow-black/25">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,var(--sidebar-primary)_0%,transparent_62%)] opacity-[0.14] dark:opacity-[0.2]"
                />
                <div className="relative flex max-w-[13rem] flex-col items-center gap-1">
                  <p className="text-sm font-medium leading-snug text-sidebar-foreground">Start your first thread</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Capture ideas, drafts, and research — everything stays in your workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNewChat}
                  className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-sidebar-primary px-4 py-2.5 text-xs font-medium text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25 ring-1 ring-white/15 transition-[transform,opacity] hover:opacity-95 active:scale-[0.99]"
                >
                  <MessageSquarePlus className="size-3.5" aria-hidden />
                  Start a chat
                </button>
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="mx-1 rounded-xl border border-dashed border-sidebar-border/90 bg-sidebar-accent/15 px-3 py-8 text-center">
              <p className="text-sm font-medium text-sidebar-foreground">No matches</p>
              <p className="mt-1 text-xs text-muted-foreground">Try another keyword.</p>
              <button
                type="button"
                className="mt-4 text-xs font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            <ul className="flex list-none flex-col gap-0.5 pb-1" aria-label="Conversations">
              {filteredConversations.map((c) => (
                <li key={c.id}>
                  <div
                    className={cn(
                      "group relative flex min-h-9 items-center gap-0 rounded-lg border transition-[background-color,border-color,box-shadow]",
                      activeId === c.id
                        ? "border-sidebar-primary/35 bg-sidebar-primary/[0.12] shadow-[inset_0_0_0_1px_oklch(1_0_0_/0.04)] dark:bg-sidebar-primary/[0.14]"
                        : "border-transparent bg-transparent hover:border-sidebar-border/55 hover:bg-sidebar-accent/40",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2 py-2 pl-2 pr-1 text-left outline-none ring-sidebar-ring focus-visible:ring-2",
                        activeId === c.id ? "text-sidebar-accent-foreground" : "text-sidebar-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-md ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
                          activeId === c.id
                            ? "bg-sidebar-primary/20 text-sidebar-primary"
                            : "bg-sidebar-accent/50 text-muted-foreground group-hover:bg-sidebar-accent group-hover:text-foreground",
                        )}
                      >
                        <MessageSquare className="size-3.5 shrink-0" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium leading-none tracking-tight">
                        {c.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${c.title}`}
                      title="Delete chat"
                      className={cn(
                        "mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[opacity,background-color,color]",
                        "opacity-55 hover:bg-destructive/15 hover:text-destructive",
                        "max-md:opacity-55 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(c.id);
                      }}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {user ? (
        <div className="relative mt-auto shrink-0 overflow-hidden border-t border-border/90 px-3 pb-3 pt-3 backdrop-blur-md">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-sidebar-accent/45 via-background/90 to-sidebar-primary/[0.2] dark:from-sidebar-accent/30 dark:via-background/85 dark:to-sidebar-primary/28"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_110%_85%_at_15%_115%,var(--sidebar-primary)_0%,transparent_52%)] opacity-[0.35] dark:opacity-[0.42]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/45 to-transparent"
          />

          <div className="relative flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/55 px-2.5 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-sidebar-primary/20 backdrop-blur-md dark:border-white/[0.08] dark:bg-background/35 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:ring-sidebar-primary/35">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(145deg,var(--sidebar-primary),oklch(0.42_0.22_285))] text-[10px] font-medium tracking-tight text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/35 ring-2 ring-background/80 dark:ring-background/50"
              aria-hidden
            >
              {userInitials(user.email, user.name)}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate font-heading text-[13px] font-medium tracking-tight text-foreground">{user.name ?? "Account"}</p>
              <p className="mt-0.5 truncate text-[10px] font-medium leading-snug text-muted-foreground/95 dark:text-muted-foreground">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground ring-1 ring-border/45 transition-colors hover:bg-destructive/15 hover:text-destructive dark:ring-white/10"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-3.5 shrink-0" aria-hidden />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative mt-auto shrink-0 overflow-hidden border-t border-border/90 px-3 pb-3 pt-3 backdrop-blur-md">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-sidebar-accent/35 via-background/92 to-sidebar-primary/[0.14] opacity-90 dark:from-sidebar-accent/22 dark:via-background/88 dark:to-sidebar-primary/22"
          />
          <div className="relative h-10 animate-pulse rounded-xl bg-background/40 ring-1 ring-sidebar-primary/15 dark:bg-background/25" />
        </div>
      )}
    </aside>
  );
}
