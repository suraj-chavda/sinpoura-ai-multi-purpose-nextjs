"use client";

import * as React from "react";
import { GuestTopBar } from "@/components/layout/GuestTopBar";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Applied to the scrollable main column (e.g. center auth forms). */
  mainClassName?: string;
  /**
   * When false, `main` does not scroll—the shell stays fixed to the viewport below the top bar.
   * Use with split layouts that scroll an inner pane only (e.g. auth form column).
   */
  mainScroll?: boolean;
  /** Violet wash behind content; off for dense auth screens so it cannot overlap footer copy. */
  showBottomGlow?: boolean;
};

/**
 * Signed-out / marketing layout aligned with the chat workspace:
 * app-shell backdrop, framed panel, gradient header strip, subtle transcript texture on small screens.
 */
export function GuestWorkspaceShell({
  children,
  mainClassName,
  mainScroll = true,
  showBottomGlow = true,
}: Props) {
  return (
    <div
      className={cn(
        "app-shell-gradient flex min-h-0 flex-col overflow-hidden bg-background",
        "h-dvh max-h-dvh w-full max-w-[100vw]",
        mainScroll ? "md:h-auto md:max-h-none md:min-h-dvh md:p-3" : "md:h-dvh md:max-h-dvh md:min-h-0 md:p-3",
      )}
    >
      <div
        className={cn(
          "chat-panel-frame flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          mainScroll
            ? "md:max-h-[calc(100dvh-1.5rem)] md:rounded-2xl md:border md:border-border md:bg-background md:shadow-xl md:shadow-black/[0.06] md:ring-1 md:ring-border/50 dark:md:shadow-black/35 dark:md:ring-white/[0.06]"
            : "md:h-full md:max-h-full md:min-h-0 md:rounded-2xl md:border md:border-border md:bg-background md:shadow-xl md:shadow-black/[0.06] md:ring-1 md:ring-border/50 dark:md:shadow-black/35 dark:md:ring-white/[0.06]",
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
          <GuestTopBar />
        </div>

        <main
          className={cn(
            "relative z-[1] flex min-h-0 flex-1 flex-col overflow-x-hidden bg-transparent chat-main-texture-mobile-only",
            mainScroll ? "overflow-y-auto overscroll-contain" : "overflow-y-hidden",
            mainClassName,
          )}
        >
          {showBottomGlow ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center px-4 sm:px-5 md:px-6"
              aria-hidden
            >
              <div className="chat-panel-bottom-glow relative w-full max-w-3xl">
                <div className="chat-panel-bottom-glow-fill" />
                <div className="chat-panel-bottom-glow-line" />
              </div>
            </div>
          ) : null}
          <div
            className={cn(
              "relative z-[1] flex w-full flex-col",
              mainScroll ? "min-h-full" : "min-h-0 flex-1",
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
