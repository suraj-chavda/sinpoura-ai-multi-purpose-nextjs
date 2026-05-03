"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWorkspaceTopBar } from "@/components/layout/ChatWorkspaceTopBar";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import {
  useActiveConversationLoader,
  useChatActions,
  useChatBootstrap,
  useChatRouteSync,
} from "@/features/chat/hooks";
import { useChatStore } from "@/features/chat/store";
import { API } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CHAT_STARTER_PROMPTS } from "@/lib/chat-starters";
import { clientHasUsableLlmKey } from "@/lib/browser-llm-config";
import { ChatInput } from "./ChatInput";
import { LlmApiKeyDialog } from "./LlmApiKeyDialog";
import { ChatWindow } from "./ChatWindow";

export function ChatScreen() {
  useChatBootstrap();
  useChatRouteSync();
  useActiveConversationLoader();
  const { startNewChat, sendMessage, removeConversation, selectConversation } = useChatActions();
  const { status, data: session } = useSession();
  const router = useRouter();

  const { collapsed, toggle } = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [envFlags, setEnvFlags] = React.useState<{ envOpenAi: boolean; envAnthropic: boolean } | null>(null);
  const [localConfigRev, setLocalConfigRev] = React.useState(0);
  const [gateDismissed, setGateDismissed] = React.useState(false);
  const [settingsDialogRequested, setSettingsDialogRequested] = React.useState(false);

  const messages = useChatStore((s) => s.messages);
  const conversations = useChatStore((s) => s.conversations);
  const isMessagesLoading = useChatStore((s) => s.isMessagesLoading);
  const isSending = useChatStore((s) => s.isSending);
  const pendingOutbound = useChatStore((s) => s.pendingOutbound);
  const error = useChatStore((s) => s.error);
  const chatErrorCode = useChatStore((s) => s.chatErrorCode);
  const setError = useChatStore((s) => s.setError);
  const setChatErrorCode = useChatStore((s) => s.setChatErrorCode);
  const activeId = useChatStore((s) => s.activeConversationId);
  const inputDisabled = isSending || (conversations.length > 0 && !activeId);

  const refreshLlmAvailability = React.useCallback(async () => {
    const r = await fetch(API.llmConfig, { cache: "no-store" });
    if (!r.ok) {
      setEnvFlags({ envOpenAi: false, envAnthropic: false });
      return;
    }
    const d = (await r.json()) as { envOpenAi?: boolean; envAnthropic?: boolean };
    setEnvFlags({
      envOpenAi: Boolean(d.envOpenAi),
      envAnthropic: Boolean(d.envAnthropic),
    });
  }, []);

  React.useEffect(() => {
    if (status !== "authenticated") return;
    void refreshLlmAvailability();
  }, [refreshLlmAvailability, status]);

  React.useEffect(() => {
    if (chatErrorCode === "MISSING_LLM_KEY") setGateDismissed(false);
  }, [chatErrorCode]);

  const needsUserKey = React.useMemo(() => {
    if (!envFlags) return null;
    if (envFlags.envOpenAi || envFlags.envAnthropic) return false;
    void localConfigRev;
    return !clientHasUsableLlmKey();
  }, [envFlags, localConfigRev]);

  const autoPrompt = needsUserKey === true && !gateDismissed;
  const showLlmDialog =
    settingsDialogRequested || chatErrorCode === "MISSING_LLM_KEY" || autoPrompt;

  const [composerSeed, setComposerSeed] = React.useState<{ text: string; nonce: number } | null>(null);
  const handleComposerSeedConsumed = React.useCallback(() => setComposerSeed(null), []);

  const handleStarterSelect = React.useCallback(
    (query: string) => {
      if (isSending) return;
      setComposerSeed({ text: query, nonce: Date.now() });
    },
    [isSending],
  );

  function handleSelectConversation(id: string) {
    selectConversation(id);
    setMobileOpen(false);
  }

  const handleResetWorkspace = React.useCallback(() => {
    useChatStore.getState().setActiveConversationId(null);
    router.replace("/chat", { scroll: false });
  }, [router]);

  const activeTitle = activeId ? conversations.find((c) => c.id === activeId)?.title ?? null : null;
  /** Avoid mirroring the pending bubble + freshly-renamed thread title in the breadcrumb at once. */
  const workspaceConversationTitle =
    pendingOutbound?.userContent && activeId ? "Sending…" : activeTitle;

  /** Avoid showing optimistic bubble when server rows already include the same user line (loader / ordering races). */
  const pendingBubble = React.useMemo(() => {
    const raw = pendingOutbound?.userContent ?? null;
    if (!raw) return null;
    const last = messages[messages.length - 1];
    if (last?.role === "user" && last.content === raw) return null;
    return raw;
  }, [pendingOutbound, messages]);

  const outboundInflight = Boolean(pendingOutbound?.userContent);
  const showAssistantProcessing = isSending && outboundInflight;
  const showStarters =
    !isMessagesLoading && messages.length === 0 && !outboundInflight;
  const emptyVariant = activeId ? ("fresh" as const) : ("idle" as const);

  const chatParticipantProfile = React.useMemo(
    () =>
      status === "authenticated" && session?.user
        ? { name: session.user.name ?? null, email: session.user.email ?? null }
        : null,
    [status, session?.user],
  );

  return (
    <div
      className={cn(
        "app-shell-gradient flex min-h-0 flex-col overflow-hidden bg-background",
        /* Phone / small tablet: lock to dynamic viewport so flex children shrink and the composer stays on-screen */
        "h-dvh max-h-dvh w-full max-w-[100vw]",
        "md:h-auto md:max-h-none md:min-h-dvh md:w-auto md:max-w-none md:overflow-visible md:flex-row md:items-stretch md:gap-3 md:p-3",
      )}
    >
      {/* Desktop sidebar — width animates; single floating toggle stays on the seam */}
      <div className="relative hidden shrink-0 md:block md:h-[calc(100dvh-1.5rem)]">
        <div
          className={cn(
            "overflow-hidden rounded-2xl will-change-[width] motion-reduce:transition-none",
            "motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]",
            collapsed ? "w-0 shadow-none ring-0" : "w-[15.5rem] sm:w-[16.75rem]",
          )}
          aria-hidden={collapsed}
        >
          <div
            className={cn(
              "h-[calc(100dvh-1.5rem)] w-[15.5rem] sm:w-[16.75rem] motion-reduce:transition-none",
              "motion-safe:transition-[opacity,filter] motion-safe:duration-200 motion-safe:ease-out",
              collapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            <Sidebar
              onNewChat={() => void startNewChat()}
              onSelect={handleSelectConversation}
              onDelete={(id) => void removeConversation(id)}
              onResetWorkspace={handleResetWorkspace}
              className="h-full min-h-0"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Show sidebar" : "Hide sidebar"}
          className={cn(
            "absolute top-1/2 z-40 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full md:flex",
            "border border-border/90 bg-background/95 text-foreground shadow-lg shadow-black/[0.08] ring-[3px] ring-background backdrop-blur-sm",
            "motion-safe:transition-[left,transform,box-shadow,background-color,color] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none",
            "hover:bg-accent hover:text-accent-foreground hover:shadow-xl hover:shadow-black/12 active:scale-[0.97]",
            "dark:bg-card/95 dark:shadow-black/45 dark:ring-background",
            collapsed ? "left-0 -translate-x-1/2" : "left-full -translate-x-1/2",
          )}
        >
          {collapsed ? <ChevronRight className="size-4" aria-hidden /> : <ChevronLeft className="size-4" aria-hidden />}
        </button>
      </div>

      {/* Main column — framed panel on md+ so borders match the floating sidebar */}
      <div
        className={cn(
          "chat-panel-frame flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          "md:max-h-[calc(100dvh-1.5rem)] md:rounded-2xl md:border md:border-border md:bg-background md:shadow-xl md:shadow-black/[0.06] md:ring-1 md:ring-border/50 dark:md:shadow-black/35 dark:md:ring-white/[0.06]",
        )}
      >
        <div
          className={cn(
            "relative z-[1] flex min-w-0 shrink-0 items-stretch overflow-hidden border-b border-border/90 backdrop-blur-md",
            "bg-gradient-to-br from-sidebar-primary/[0.14] via-background/92 to-sidebar-accent/35 dark:from-sidebar-primary/25 dark:via-background/88 dark:to-sidebar-accent/25",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_120%_at_100%_-10%,var(--sidebar-primary)_0%,transparent_58%)] opacity-[0.22] dark:opacity-[0.28]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sidebar-primary/35 to-transparent"
          />

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="relative z-[1] inline-flex h-14 w-12 shrink-0 items-center justify-center border-r border-border/70 px-3 text-foreground transition-colors hover:bg-white/12 md:hidden dark:hover:bg-white/[0.06]"
            aria-label="Open conversations"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <ChatWorkspaceTopBar
            activeTitle={workspaceConversationTitle}
            activeId={activeId}
            onNewChat={() => void startNewChat()}
            onOpenModelSettings={() => {
              setGateDismissed(false);
              setSettingsDialogRequested(true);
            }}
          />
        </div>

        <main className="relative z-[1] flex min-h-0 flex-1 flex-col bg-transparent">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center px-4 sm:px-5 md:px-6"
            aria-hidden
          >
            <div className="chat-panel-bottom-glow relative w-full max-w-3xl">
              <div className="chat-panel-bottom-glow-fill" />
              <div className="chat-panel-bottom-glow-line" />
            </div>
          </div>
          {error ? (
            <div
              className="sticky top-0 z-20 shrink-0 border-b border-destructive/45 bg-destructive/12 px-4 py-3 text-sm leading-snug text-destructive shadow-sm backdrop-blur-sm supports-backdrop-filter:bg-destructive/10 sm:px-5 md:px-6"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          ) : null}
          <ChatWindow
            messages={messages}
            loading={!!activeId && isMessagesLoading && !pendingBubble && !outboundInflight}
            pendingUserContent={pendingBubble}
            assistantProcessing={showAssistantProcessing}
            emptyHint={
              activeId
                ? "Say something to begin."
                : "Choose a conversation from the sidebar or start a new chat."
            }
            starters={showStarters ? CHAT_STARTER_PROMPTS : undefined}
            onStarterSelect={(q) => void handleStarterSelect(q)}
            startersBusy={isSending}
            emptyVariant={emptyVariant}
            chatParticipantProfile={chatParticipantProfile}
          />
          <div className="relative z-[2] shrink-0 border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 max-md:border-t md:border-transparent md:bg-transparent md:backdrop-blur-none supports-[backdrop-filter]:md:bg-transparent">
            <ChatInput
              disabled={inputDisabled}
              sending={isSending}
              sendError={error}
              onClearSendError={() => {
                setError(null);
                setChatErrorCode(null);
              }}
              onSend={(t) => sendMessage(t)}
              composerSeed={composerSeed}
              onComposerSeedConsumed={handleComposerSeedConsumed}
            />
          </div>
        </main>
      </div>

      <LlmApiKeyDialog
        open={showLlmDialog}
        onDismiss={({ programmatic }) => {
          setSettingsDialogRequested(false);
          if (!programmatic && (needsUserKey === true || chatErrorCode === "MISSING_LLM_KEY")) {
            setGateDismissed(true);
          }
        }}
        onAfterSave={async () => {
          setChatErrorCode(null);
          setGateDismissed(false);
          setSettingsDialogRequested(false);
          setLocalConfigRev((n) => n + 1);
          await refreshLlmAvailability();
        }}
      />

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] md:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-[min(17rem,90vw)] pl-2 pt-2 pb-2 md:hidden">
            <Sidebar
              onNewChat={() => void startNewChat()}
              onSelect={handleSelectConversation}
              onDelete={(id) => void removeConversation(id)}
              onResetWorkspace={handleResetWorkspace}
              onMobileClose={() => setMobileOpen(false)}
              className="h-full max-h-[calc(100dvh-1rem)] rounded-2xl border border-sidebar-border shadow-2xl ring-1 ring-border/50"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
